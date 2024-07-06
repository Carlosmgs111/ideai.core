import config from "../../config";
import amqp from "amqplib";
import { Mapfy } from "../../utils";

const { rabbitMQUrlDev, rabbitMQUrlProd } = config;
const rabbitMQUrl = rabbitMQUrlDev || rabbitMQUrlProd;

// console.log(
//   !rabbitMQUrlDev ? "MQ PRODUCTION".bgGreen : "MQ DEVELOPMENT".bgYellow
// );

const TYPE = "direct";

export class TaskMessageService {
  connection: any = null;
  channel: any = null;
  consumers: any = {};

  constructor() {
    (async () => {
      try {
        this.connection = await this.connectToRabbitMQ();
        this.channel = await this.getChannel();
      } catch (e) {
        console.error("Unable to connect");
      }
    })();
  }

  async connectToRabbitMQ() {
    if (this.connection) {
      return this.connection;
    }
    try {
      this.connection = await amqp.connect(rabbitMQUrl);
      this.connection.on("close", () => {
        // this.channel.close();
        this.channel = null;
        this.connection = null;
      });
      return this.connection;
    } catch (error) {
      console.error("Error al conectar a RabbitMQ: ", error);
      throw error;
    }
  }

  getChannel = async () => {
    if (this.channel) {
      return this.channel;
    } else {
      await new Promise((resolve: any) => {
        setTimeout(resolve, 5000);
      });
      try {
        const channel = await this.connection.createChannel();
        this.channel = channel;
        return channel;
      } catch (e: any) {
        console.log(e.message.red);
      }
    }
  };

  assertExchange = async (exchangeName: any, type: any = TYPE) => {
    const formatedExchangeName = `${config.appName}_${exchangeName}/type=${type}`;
    const _channel = await this.getChannel();
    // TODO must be added a connection retry policy
    try {
      const { exchange } = await _channel.assertExchange(
        formatedExchangeName,
        type,
        {
          durable: false,
          exclusive: false,
        }
      );
      return exchange;
    } catch (e) {
      console.log({ e });
    } finally {
      return null;
    }
  };

  publish = async (
    payload: any,
    receiverFunc: any = undefined,
    conf: any = { type: TYPE }
  ) => {
    const { type }: any = conf;
    const [exchangeName, _payload] = Mapfy(payload).entries().next().value;
    const [queueName, message] = Mapfy(_payload).entries().next().value;
    const formatedExchangeName = `${config.appName}_${exchangeName}/type=${type}`;
    const formatedQueueName = `${config.appName}_${queueName}`;
    await this.assertExchange(exchangeName);

    this.getChannel()
      .then((_channel: any) => {
        _channel.publish(
          formatedExchangeName,
          formatedQueueName,
          Buffer.from(JSON.stringify(message))
        );
      })
      .catch((e: any) => console.log(e.message.bgRed));

    return this;
  };

  subscribe = async (payload: any, type: any = TYPE): Promise<any> => {
    const [exchangeName, _payload] = Mapfy(payload).entries().next().value;
    const [queueName, cb] = Mapfy(_payload).entries().next().value;
    const formatedQueueName = `${config.appName}_${queueName}`;

    const formatedExchangeName = `${config.appName}_${exchangeName}/type=${type}`;
    try {
      await this.assertExchange(exchangeName);
      if (!Mapfy(this.consumers).has(formatedQueueName)) {
        const _channel = await this.getChannel();
        const { queue } = await _channel.assertQueue(formatedQueueName, {
          exclusive: false,
        });
        await _channel
          .bindQueue(queue, formatedExchangeName, formatedQueueName)
          .catch((e: any) => console.log({ e: e.message }));

        const consumerTag = await _channel.consume(queue, (message: any) => {
          const { content, replyTo, correlationId } = message;
          // console.log({ replyTo, correlationId });
          if (message !== null) {
            const decoded = JSON.parse(content.toString());
            if (Array.isArray(decoded))
              cb(...decoded)
                .then((_result: any) => {
                  // console.log({ _result });
                  if (correlationId && replyTo) {
                    _channel.sendToQueue(
                      replyTo,
                      Buffer.from(_result.toString),
                      {
                        correlationId,
                      }
                    );
                  }
                })
                .catch((err: any) => console.log({ err }));
            else
              cb(decoded).then((_result: any) => {
                console.log({ _result });
              });
            _channel.ack(message);
          }
        });
        this.consumers[formatedQueueName] = consumerTag;
      }
    } catch (e) {
      console.error("Unable to subscribes");
    }
    return this;
  };

  isOnline = () => this.channel && this.connection;

  addEvent = (cb: any) => {};

  close = async () => {
    await this.channel.close();
    await this.connection.close();
    return;
  };
}

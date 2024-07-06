import { Server, Socket } from "socket.io";
import { connect } from "socket.io-client";
import { Mapfy, UnMapfy, mapToList } from "../../utils";
import config from "../../config";
import { createServer } from "http";

export class SocketService {
  server: Server | null = null;
  sockets: any = {};
  clients: any = {};
  events: any = {};
  onDisconnectEvents: any = () => {};

  constructor() {}

  setServer = (app: any) => {
    const server = createServer(app);
    this.server = new Server(server, {
      path: "/ws",
      cors: {
        origin: "*",
        allowedHeaders: ["Authorization", "Content-Type"],
      },
    });
    this.server.on("connection", (socket: Socket) => {
      const {
        handshake: {
          query: { id },
        },
      }: any = socket;
      console.log("Cliente conectado");
      this.sockets[id] = socket;
      this.setEvents(socket);
      socket.on("disconnect", () => {
        console.log("Socket disconnected!");
        const newSockets = Mapfy(this.sockets);
        newSockets.delete(socket.id);
        this.sockets = UnMapfy(newSockets);
        this.onDisconnectEvents(socket);
      });
      socket.on("connect_error", (error: any) => {
        console.error("Error de conexión:", error.context.statusText);
      });
    });
    server.listen(config.serverPort);
  };

  addClient = (client: any) => {
    const clientEntries = Mapfy(client).entries();
    const [alias, address]: any = clientEntries.next().value;
    const [_, path = ""]: any = clientEntries.next().value || [,];
    const maxTries = 10;
    let eTries: number = 0;
    let dTries: number = 0;
    const opts = { path };

    this.clients[alias] = connect(address, opts);
    this.clients[alias].on("connect", () => {
      console.log("Conexión establecida con el servidor.");
    });
    this.clients[alias].on("disconnect", () => {
      if (++dTries > maxTries) {
        this.clients[alias].disconnect();
        console.log("Finalizado intentos de conexion".bgYellow);
      }
      console.log("Conexión perdida con el servidor.");
    });
    this.clients[alias].on("message", (message: any) => {
      console.log(`Mensaje recibido del servidor: ${message.payload}`);
    });
    this.clients[alias].on("connect_error", (error: any) => {
      if (++eTries > maxTries) {
        this.clients[alias].disconnect();
        console.log("Finalizando intentos de conexion".bgYellow);
      }
      console.error("Error de conexión:", error.context.statusText);
    });
    return this;
  };

  addEvent = (event: any) => {
    const [eventName, eventCallback] = mapToList(event, false)[0];
    this.events[eventName] = eventCallback;
  };

  sendMessage = (payload: any, receiverFunc: any) => {
    const [client, sendTo, params, receiverFunctionName] =
      this.extractRemoteHandlersSpecs(payload, receiverFunc);
    if (Mapfy(this.clients).size && this.clients[client]) {
      this.clients[client].emit(sendTo, { [receiverFunctionName]: params });
      if (receiverFunc) {
        return this.receiveMessage({
          [client]: receiverFunc,
        });
      }
    }
    return this;
  };

  receiveMessage = (_payload: any) => {
    let [client, receiveIn, callback] =
      this.extractRemoteHandlersSpecs(_payload);
    return new Promise((resolve, reject) => {
      this.clients[client].on(receiveIn, (data: any) => {
        let proccesedData = null;
        const { payload, error } = data;
        if (payload) proccesedData = payload;
        resolve(callback(proccesedData));
        if (error) reject(error);
      });
    });
  };

  broadCast = (event: any, data: any) => {
    mapToList(this.sockets).map((socket: any, id: any) => {
      socket.emit(event, data);
    });
  };

  extractRemoteHandlersSpecs = (object: any, receiverFunc: any = null) => {
    let specs = <Array<any>>[];

    const [client, _payload] = Mapfy(object).entries().next().value;
    const [sendTo, paramsOrCallback] = Mapfy(_payload).entries().next().value;
    specs = [client, sendTo, paramsOrCallback];
    if (typeof receiverFunc === "string") specs = [...specs, receiverFunc];
    else if (receiverFunc) {
      specs = [...specs, this.extractFunctionSpecs(receiverFunc)[0]];
    }

    return specs;
  };

  extractFunctionSpecs = (object: any) => {
    let [functionName, callback] = ["function_not_provided", ([]) => {}];
    if (object instanceof Function) {
      [functionName, callback] = [object.name, object];
    } else if (callback instanceof Object) {
      [functionName, callback] = Mapfy(object).entries().next().value;
    }
    return [functionName, callback];
  };

  private setEvents = (socket: any) => {
    Mapfy(this.events).forEach((cb: any, name: any) => {
      socket.addListener(name, (payload: any) => {
        const [response, data] = Mapfy(payload).entries().next().value;
        if (Array.isArray(data))
          cb(...data)
            .then((result: any) => {
              if (response) socket.emit(response, result);
              return result;
            })
            .catch((e: any) => {
              console.log(`Error in callback: ${e.message}`.bgRed);
              return e;
            })
            .finally(() => console.log("Solved!".bgGreen));
        else
          cb(data)
            .then((result: any) => {
              if (response) socket.emit(response, result);
              return result;
            })
            .catch((e: any) =>
              console.log(`Error in callback: ${e.message}`.red)
            )
            .finally(() => console.log("Solved!".green));
      });
    });
  };

  addOnDisconnectEvent = (event: any) => (this.onDisconnectEvents = event);

  close = async () => {
    const { server } = this;
    const clients = Mapfy(this.clients);
    const sockets = Mapfy(this.sockets);

    clients.forEach((client: any) => {
      client.close();
    });
    if (!server) return;
    await server.disconnectSockets();
    await server.close();
  };
}

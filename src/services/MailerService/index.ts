import nodemailer from "nodemailer";
import config from "../../config";

export class MailerService {
  transporter: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.mailerEmailAddress,
        pass: config.mailerEmailAppPassword,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
  }

  // TODO Añadir validacion de cada destinatario
  sendMail = async ({
    from = config.mailerEmailAddress,
    to,
    subject,
    text = "",
    html = `<b>${text}</b>`,
  }: any) => {
    const info = await this.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log(`
Mensaje enviado: ${info.messageId}.
Preview URL: ${nodemailer.getTestMessageUrl(info)}.
Aceptado: ${info.response.toLowerCase().includes("ok")}.
    `);

    return info.response.toLowerCase().includes("ok");
  };
}

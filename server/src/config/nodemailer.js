import nodemailer from "nodemailer";
import "dotenv/config";
import { __dirname } from "../path.js";
import logger from "../utils/loggers.js";

 let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_DIRECTION,
    pass: process.env.EMAIL_PASSWORD,
    authMethod: "LOGIN",
  },
});

const sendRecoveryEmail = async (email, recoveryLink) => {
    const mailOptions = {
      from: "TestCoder keyapi22@gmail.com",
      to: email,
      subject: "Buenas Noches",
      html: `
          <div>
              <h1>Recuperar contraseña</h1>
              <p>Para recuperar tu contraseña haz click en: <a href="${recoveryLink}">Recuperar contraseña</a> <p/>
          </div>
      `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      logger.info(`Email enviado a ${email}`);
      return true;
    } catch (error) {
      logger.error(`Error al enviar email: ${error}`);
      return false;
    }
  };



const mailController = { sendRecoveryEmail };
export default mailController;

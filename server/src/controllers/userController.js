import logger from "../utils/loggers.js";
import cartModel from "../models/cart.model.js";

import userModel from "../models/users.model.js";
import EErrors from "../services/errors/enums.js";
import crypto from 'crypto'
import mailController from "../config/nodemailer.js";
import { validatePassword, createHash } from "../utils/bcrypt.js";

const postUser = async(req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: 'Usuario ya existente' })
        }
        return res.status(200).send({ mensaje: 'Usuario creado' })
    } catch (error) {
        res.status(500).send({ mensaje: `Error al crear usuario ${error}` })
    }
}

const recoveryLinks = {}

const passwordRecovery  = async (req, res) => {
    const {email} = req.body

    try{
        const user = await userModel.find({email})
        if(!user) {
            logger.error(`${email}: No hallado}`)
            return res.status(400).send({error: `Usuario no hallado`})
        }

        const token = crypto.randomBytes(20).toString('hex')
        recoveryLinks[token] = {email, timeStamp: Date.now()}

        const recoveryLink = `http://localhost:8080/api/users/reset-password/${token}`

        mailController.sendRecoveryEmail(email, recoveryLink)

        res.status(200).send({resultado : 'OK', message: `Email enviado correctamente, ${token}, ${email}`})
    } catch (error) {
        res.status(500).send({error: `Error al enviar email de recuperacion: ${error}`})
    }
}

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    console.log('Token recibido:', token);

    try {
        const linkData = recoveryLinks[token];
        console.log('Datos del enlace:', linkData);

        if (!linkData) {
            logger.error(`Token no encontrado: ${token}`);
            return res.status(400).send({ error: `Token no encontrado: ${token}` });
        }

        const now = Date.now();
        const tokenTimestamp = linkData.timestamp;
        const tokenAge = now - tokenTimestamp;

        if (tokenAge > 3600000) {
            logger.error(`Token expirado: ${token}`);
            return res.status(400).send({ error: `Token expirado: ${token}` });
        }

        const { email } = linkData || {};

        try {
            const user = await userModel.findOne({ email });

            if (!user) {
                logger.error(`Usuario no encontrado: ${email}`);
                return res.status(400).send({ error: `Usuario no encontrado: ${email}` });
            }

            const isSamePassword = validatePassword(newPassword, user.password);

            if (isSamePassword) {
                logger.error(`La nueva contraseña no puede ser igual a la anterior`);
                return res.status(400).send({ error: `La nueva contraseña no puede ser igual a la anterior` });
            }

            user.password = createHash(newPassword);
            await user.save();

            delete recoveryLinks[token];
            logger.info(`Password actualizado correctamente para el usuario ${email}`);
            return res.status(200).send({ resultado: 'OK', message: 'Password actualizado correctamente' });

        } catch (error) {
            logger.error(`Error al modificar contraseña: ${error}`);
            return res.status(500).send({ error: `Error al modificar contraseña: ${error}` });
        }

    } catch (error) {
        logger.error(`Error al actualizar password: ${error}`);
        return res.status(500).send({ error: `Error al actualizar password: ${error}` });
    }
};


 const validateUserData = (req, res, next) => {
    const { first_name, last_name, email } = req.body;
    try {
        if (!last_name || !first_name || !email) {
            CustomError.createError({
                name: "User creation error",
                cause: generateUserErrorInfo({ first_name, last_name, email }),
                message: "One or more properties were incomplete or not valid.",
                code: EErrors.INVALID_USER_ERROR
            });
        }
        next();
    } catch (error) {
        console.error("Caught an error during validation:", error);
        next(error);
    }
 }
const userController = {
    postUser,
    validateUserData,
    passwordRecovery,
    resetPassword
}

export default userController
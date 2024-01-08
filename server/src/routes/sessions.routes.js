import { Router } from "express";
import passport from "passport";
import "dotenv/config";
import { authorization, passportError } from "../utils/messageErrors.js";
import sessionController from "../controllers/sesionController.js";

const routerSession = Router();

routerSession.post("/register", (req, res, next) => {
  passport.authenticate("register", (err, user) => {
    if (err) {
      const statusCode = err.status || 500;
      return res
        .status(statusCode)
        .json({ success: false, message: err.message });
    }

    /* req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/mainDashboard");
    }); */
  })(req, res, next);
});

routerSession.post("/login", (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      // Aquí puedes acceder al mensaje de error específico desde el objeto info
      const errorMessage = info.message || "Credenciales incorrectas";
      return res.status(401).json({ success: false, message: errorMessage });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      // Resto del código para manejar el inicio de sesión exitoso
      res.status(200).json({ success: true, payload: user });
    });
  })(req, res, next);
});
routerSession.get(
  "/current",
  passportError("jwt"),
  authorization(["user"]),
  sessionController.getCurrentSession
);
routerSession.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  sessionController.getGithubCreateUser
);
routerSession.get(
  "/githubSessions",
  passport.authenticate("github"),
  sessionController.getGithubSessions
);
routerSession.get("/logout", sessionController.logout);

export default routerSession;

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

routerSession.post(
  "/login",
  passport.authenticate("login"),
  sessionController.login
);
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

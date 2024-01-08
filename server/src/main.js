import "dotenv/config";
import express from "express";
import { __dirname } from "./path.js";
import { Server } from "socket.io";
import path from "path";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from 'express-session'
import cookieParser from "cookie-parser";
import passport from 'passport';
import initializePassport from './config/passport.js';
import router from "./routes/index.routes.js";
import errorHandler from "./middlewares/errors/errorHandler.js";
import logger from "./utils/loggers.js";
import cors from 'cors'


const PORT = 8080;
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

//Server
const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

const io = new Server(server);

//Moongose
mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("BDD conectada");
  })
  .catch((error) =>
    console.log("Error en conexion con MongoDB Atlas: ", error)
  );


//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true
      },
      ttl: 600 
  }),
}));
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


//Conexion socket.io

io.on("connection", (socket) => {
  logger.info('Conexión con Socket.io');

  socket.on("load", async () => {
    const products = await productManager.getProducts();
    socket.emit("products", products);
  });

  socket.on("newProduct", async (product) => {
    await productManager.addProduct(product);
    const products = await productManager.getProducts();
    socket.emit("products", products);
  });
});

app.use('/', router)

app.get("*", (req, res) => {
  res.status(404).send("Error 404");
});

app.use(errorHandler)
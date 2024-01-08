import { Router } from "express";
import ticketController from "../controllers/ticketController.js";

const routerTicket = Router()

routerTicket.get('/', ticketController.getTickets)
routerTicket.get('/create', ticketController.createTicket)

export default routerTicket
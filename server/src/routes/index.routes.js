import { Router } from "express";
import cartRouter from "./cart.routes.js";
import productRouter from "./product.routes.js";
import routerSession from "./sessions.routes.js";
import routerUser from "./users.routes.js";
import routerTicket from "./ticket.routes.js";

const router = Router()

router.use('/api/products', productRouter)
router.use('/api/carts', cartRouter)
router.use('/api/users', routerUser)
router.use('/api/session', routerSession)
router.use('/api/tickets', routerTicket)
/* router.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs)) */

export default router
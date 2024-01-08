import { Router } from "express";
import cartsController from "../controllers/cartController.js";
import { authorization, passportError } from "../utils/messageErrors.js";
import passport from "passport";

const cartRouter = Router();

cartRouter.get("/", cartsController.getCarts);
cartRouter.get("/:cid", cartsController.getCart);
cartRouter.post('/purchase/:cid', passportError('jwt'), authorization(['user']), cartsController.purchaseCart);
cartRouter.post("/", cartsController.postCart);
cartRouter.post("/:cid/products/:pid", cartsController.postProductIntoCart);
cartRouter.put("/:cid", cartsController.putProductsToCart);
cartRouter.put("/:cid/products/:pid", cartsController.putQuantity);
cartRouter.delete("/:cid/delete", cartsController.deleteCart);
cartRouter.delete("/:cid/products/:pid", cartsController.deleteProductFromCart);
cartRouter.delete("/:cid/clear", cartsController.clearCart);

export default cartRouter;

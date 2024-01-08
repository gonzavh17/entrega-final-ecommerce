import { Router } from "express";
import { passportError, authorization } from "../utils/messageErrors.js";
import productsController from "../controllers/productsController.js";


const productRouter = Router();

productRouter.get("/", productsController.getProducts);

productRouter.get("/:pid", productsController.getProduct);

productRouter.post("/", productsController.validateProductData, passportError('jwt'), authorization('user'), productsController.postProduct);

productRouter.put("/:pid", productsController.putProduct);

productRouter.delete("/", productsController.deleteProduct);

export default productRouter;

import cartModel from "../models/cart.model.js";
import productModel from "../models/products.model.js";
import ticketController from "./ticketController.js";
import userModel from "../models/users.model.js";

const getCarts = async (req, res) => {
  const { limit } = req.query;

  try {
    const carts = await cartModel.find().limit(limit);
    res.status(200).send({ resultado: "OK", message: carts });
  } catch (error) {
    res.status(400).send({ error: `Error al consultar carrito ${error}` });
  }
};

const getCart = async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartModel.findById(cid);
    if (cart) res.status(200).send({ resultado: "OK", message: cart });
    else res.status(404).send({ resultado: "Not Found", message: cart });
  } catch (error) {
    res.status(400).send({ error: `Error al consultar productos ${error}` });
  }
};

const postCart = async (req, res) => {
  try {
    const createCart = await cartModel.create({
      products: [],
    });

    res
      .status(200)
      .send({ result: "OK", message: `Carrito creado ${createCart}` });
  } catch (error) {
    res.status(400).send({ error: `Error al crear el carrito ${error}` });
  }
};

const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  const email = req.user.user.email;
  try {
    const cart = await cartModel.findById(cid);
    const products = await productModel.find();

    if (!cart) {
      return res.status(404).send({ resultado: "Not Found", message: cart });
    }

    let totalAmount = 0;
    const purchaseItems = [];

    for (const item of cart.products) {
      const product = products.find(
        (prod) => prod._id == item.id_prod.toString()
      );

      if (!product) {
        console.log(`Product not found for id ${item.id_prod}`);
        continue; // Ir al siguiente producto en el carrito
      }

      if (product.stock < item.quantity) {
        console.log(`Not enough stock for product: ${product.title}`);
        continue; // Ir al siguiente producto en el carrito
      }

      let price = product.price;
      let quantity = item.quantity;

      if (userModel.role === "premium") {
        totalAmount += price * quantity * 0.8;
      } else {
        totalAmount += price * quantity;
      }

      product.stock -= quantity;
      await product.save();
      purchaseItems.push(product.title);
    }

    if (purchaseItems.length === 0) {
      // No se agregaron productos al carrito
      return res.status(400).send({ error: "Carrito vacio" });
    }

    const generatedTicket = await ticketController.createTicket(
      {
        body: {
          amount: totalAmount,
          email: email,
        },
      },
      res
    );

    await cartModel.findByIdAndUpdate(cid, { products: [] });

    res.status(201).send({
      response: "Compra exitosa",
      amount: totalAmount,
      items: purchaseItems,
      ticket: generatedTicket,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: `Error al consultar carrito: ${error}` });
  }
};

const postProductIntoCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const searchCart = await cartModel.findById(cid);

    if (!searchCart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const existingProduct = searchCart.products.find(
      (product) => product.id_prod.toString() === pid
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      searchCart.products.push({ id_prod: pid, quantity: 1 });
    }

    const productInDatabase = await productModel.findById(pid);
    
    if (!productInDatabase) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    if (productInDatabase.stock < 1) {
      return res
        .status(400)
        .send({ error: "No hay suficiente stock para este producto" });
    }

    productInDatabase.stock -= 1;
    await productInDatabase.save();

    const updatedCart = await searchCart.save();

    res.status(200).send({
      result: "OK",
      message: "Producto agregado exitosamente",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(400).send({ error: `Error al añadir producto: ${error.message}` });
  }
};

const putQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const searchCart = await cartModel.findById(cid);

    if (searchCart) {
      const productIndex = searchCart.products.findIndex(
        (product) => product.id_prod.toString() === pid
      );

      if (productIndex !== -1) {
        searchCart.products[productIndex].quantity = quantity;

        const updatedCart = await searchCart.save();

        res.status(200).send({
          result: "OK",
          message: "Cantidad del producto",
          cart: updatedCart,
        });
      } else {
        res.status(404).send({ error: "Producto no encontrado en el carrito" });
      }
    } else {
      res.status(404).send({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res
      .status(400)
      .send({ error: `Error al actualizar producto del carrito: ${error}` });
  }
};

const putProductsToCart = async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  try {
    const searchCart = await cartModel.findById(cid);

    if (searchCart) {
      searchCart.products = products;

      const updatedCart = await searchCart.save();

      res
        .status(200)
        .send({ result: "OK", message: "Cart updated", cart: updatedCart });
    } else {
      res.status(404).send({ error: "Cart Nout Found" });
    }
  } catch (error) {
    res.status(400).send({ error: `Error updating the cart: ${error}` });
  }
};

const deleteCart = async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartModel.findByIdAndDelete(cid);
    if (cart) res.status(200).send({ resultado: "OK", message: cart });
    else res.status(400).send({ resultado: "Not Found", message: cart });
  } catch (error) {
    res.status(400).send({ error: `Error al eliminar carritos: ${error}` });
  }
};

const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const searchCart = await cartModel.findById(cid);

    if (searchCart) {
      const existingProductIndex = searchCart.products.findIndex(
        (product) => product.id_prod.toString() === pid
      );

      if (existingProductIndex !== -1) {
        searchCart.products.splice(existingProductIndex, 1);
        await searchCart.save();

        res.status(200).send({
          result: "OK",
          message: "Producto eliminado exitosamente",
          cart: searchCart,
        });
      } else {
        res.status(404).send({
          resultado: "Producto no hallado",
          message: searchCart,
        });
      }
    } else {
      res.status(404).send({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(400).send({ error: `Error al eliminar producto: ${error}` });
  }
};

const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const updateCart = await cartModel.findByIdAndUpdate(
      cid,
      { $set: { products: [] } },
      { new: true }
    );

    if (!updateCart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(updateCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const cartsController = {
  getCarts,
  getCart,
  purchaseCart,
  postCart,
  putProductsToCart,
  postProductIntoCart,
  putQuantity,
  deleteCart,
  deleteProductFromCart,
  clearCart
};

export default cartsController;

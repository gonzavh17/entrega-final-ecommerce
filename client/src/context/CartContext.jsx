import { createContext, useState, useEffect, useContext } from "react";
import { removeProduct, clearCartRequest, postProductIntoCart } from "../api/auth";
import { useAuth } from "./UserContext";

export const CartContext = createContext({
  cart: {
    products: [],
    totalQuantity: 0,
    totalPrice: 0,
  },
/*   user: null,
  addProduct: () => {},
  deleteProduct: () => {},
  clearCart: () => {}, */
});

export const CartProvider = ({ children }) => {
  const initialCartState = { products: [] };
  const [cart, setCart] = useState(initialCartState);
  const { user } = useAuth();

  const addProduct = (updateCart) => {
    if (updateCart && updateCart.cart && updateCart.cart.products) {
      setCart(updateCart.cart);
    } else if (updateCart && updateCart.products) {
      setCart(updateCart);
    } else if (updateCart) {
      setCart({ products: updateCart, totalQuantity: 0, totalPrice: 0 });
    } else {
      setCart(initialCartState);
    }
  };

  const deleteProduct = async (product_id) => {
    if (user && user.cart && product_id) {
      try {
        const res = await removeProduct(product_id, user.cart.id);

        setCart((prevCart) => {
          const updatedCart = { ...prevCart };
          updatedCart.products = prevCart.products.filter(
            (item) => item.id_prod._id !== product_id
          );

          return updatedCart;
        });
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.error("Error: Usuario o ID del producto es undefined");
    }
  };

  const clearCart = async () => {
    if (user && user.cart) {
      try {
        const res = await clearCartRequest(user.cart.id);
        setCart(initialCartState);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("ID de usuario o carrito no encontrado");
    }
  };

  const isInCart = (productId) => {
    return cart.products.some((item) => item.id_prod._id === productId);
  };

  const totalQuantity = cart && cart.products ? cart.products.reduce(
    (total, item) => total + item.quantity,
    0
  ) : 0;

  const totalPrice = cart && cart.products ? cart.products.reduce(
    (total, item) => {
      if (item.id_prod && typeof item.id_prod === "object") {
        return total + item.id_prod.price * item.quantity;
      } else {
        console.error("id_prod no es un objeto:", item);
        return total;
      }
    },
    0
  ) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        user,
        addProduct,
        deleteProduct,
        clearCart,
        isInCart,
        totalQuantity,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

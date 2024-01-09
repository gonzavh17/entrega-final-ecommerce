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
        setCart({ products: [updateCart], totalQuantity: 0, totalPrice: 0 });
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
            (product) => product.id_prod._id !== product_id
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
    if (user && user.cart && cart._id) {
      try {
        // Actualizamos el estado del carrito después de limpiarlo
        await clearCartRequest(cart._id);
        setCart(initialCartState);
      } catch (error) {
        console.error("Error al limpiar el carrito:", error);
      }
    } else {
      console.log("Cart id",cart._id)
      console.log("User cart", user.cart)
      console.log("ID de usuario o carrito no encontrado");
    }
  };
  
  const isInCart = (productId) => {
    return cart.products.some((product) => product.id_prod._id === productId);
  };

  const totalQuantity = cart && cart.products ? cart.products.reduce(
    (total, product) => total + product.quantity,
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

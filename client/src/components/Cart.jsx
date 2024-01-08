import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { getProducts } from "../api/auth";

const Cart = () => {
  const { cart, removeProduct, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  const handleRemoveProduct = (productId) => {
    removeProduct(productId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProducts({});
        const data = await res.data;
        setProducts(data.message.docs);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Shopping Cart</h2>
      {products.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          {cart.products.map((product) => (
            <div key={product.id_prod._id}>
              <p>{product.id_prod.title}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Price: {product.id_prod.price * product.quantity}</p>
              <button onClick={() => handleRemoveProduct(product.id_prod._id)}>
                Remove
              </button>
            </div>
          ))}
          <p>Total Quantity: {cart.totalQuantity}</p>
          <p>Total Price: {cart.totalPrice}</p>
          <button onClick={handleClearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
};

export default Cart;


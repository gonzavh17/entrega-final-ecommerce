import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsById, postProductIntoCart } from "../api/auth";
import { CartContext } from "../context/CartContext";
import ItemCount from "./ItemCount";
import { useAuth } from "../context/UserContext";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantityAdded, setQuantityAdded] = useState(0);

  const { cart, addProduct } = useContext(CartContext);

  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductsById(productId);
        const data = res.data;
        setProduct(data.message);
        console.log("Respuesta completa del servidor:", res);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleOnAdd = async (quantity) => {
    setQuantityAdded(quantity);


    if (product) {
      const productToAdd = {
        _id: product._id,
        title: product.title,
        price: product.price,
        thumbnails: product.thumbnails,
        quantity,
      };

      console.log("Producto:", productToAdd._id);
      console.log("ID del carrito", user.cart);
      try {
        const res = await postProductIntoCart(user.cart, product._id);
        const updateCart = res.data;

        console.log("Carrito actualizado:", updateCart);
        console.log("Productos en el carrito:", updateCart);

        // Utiliza la función addProduct del contexto del carrito
        addProduct(updateCart);
      } catch (error) {
        console.log("Error al agregar producto: ", error);
      }
    }
  };

  const showCheckoutButton = quantityAdded > 0;

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {product && (
            <>
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock}</p>
            </>
          )}
        </>
      )}
      <ItemCount stock={product ? product.stock : 0} initial={1} onAddToCart={handleOnAdd} />
    </div>
  );
};

export default ProductDetail;

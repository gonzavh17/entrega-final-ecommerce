import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { getProducts, clearCartRequest } from "../api/auth";
import Swal from 'sweetalert2';
import { purchaseCart, deleteProductFromCart } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeProduct, clearCart, totalPrice, totalQuantity } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate()

  const handleClearCart = async () => {
    const result = await Swal.fire({
        title: '¿Estas seguro que deseas eliminar los productos?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4A4848',
        iconColor: '#BD95B7',
        cancelButtonColor: '#BD95B7',
        confirmButtonText: 'Limpiar',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        try {
            await clearCart();

            await Swal.fire({
                title: 'Productos eliminados exitosamente',
                icon: 'success',
                confirmButtonColor: '#4A4848',
                iconColor: '#BD95B7',
            });
        } catch (error) {
            console.error("Error al limpiar el carrito:", error);
        }
    }
  };

  const handleCheckout = async () => {
    if (cart.products.length === 0) {
        await purchaseCart();
        await Swal.fire({
            title: 'Carrito vacío',
            text: 'No se puede procesar el pago porque el carrito está vacío',
            icon: 'error',
            confirmButtonColor: '#4A4848',
            iconColor: '#BD95B7',
        });
    } else {
      const result = await Swal.fire({
        title: '¿Deseas comprar el carrito?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#4A4848',
        iconColor: '#BD95B7',
        cancelButtonColor: '#BD95B7',
        confirmButtonText: 'Comprar',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      console.log('compra exitosa')
      navigate('/orderConfirmation')
      clearCart()
    }
    }
};

const handleRemoveProduct = async (product_id) => {
  console.log("itemId:", product_id);

  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el producto del carrito',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4A4848',
    iconColor: '#BD95B7',
    cancelButtonColor: '#BD95B7',
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      // Intenta eliminar el producto del carrito
      await deleteProductFromCart(cart._id, product_id);

      // Actualiza el estado local después de la eliminación exitosa
      setCart((prevCart) => {
        const updatedProducts = prevCart.products.filter(
          (product) => product.id_prod._id !== product_id
        );

        return { ...prevCart, products: updatedProducts };
      });

      // Muestra un mensaje de éxito
      await Swal.fire({
        title: 'Eliminado',
        text: 'El producto ha sido eliminado del carrito',
        icon: 'success',
        confirmButtonColor: '#4A4848',
        iconColor: '#BD95B7',
      });
    } catch (error) {
      console.error('Error al eliminar el producto:', error);

      // Muestra un mensaje de error si falla la eliminación
      await Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al eliminar el producto del carrito',
        icon: 'error',
        confirmButtonColor: '#4A4848',
        iconColor: '#BD95B7',
      });
    }
  }
};



/* const handleRemoveProduct = async (product_id) => {
  try {
    console.log("productId:", product_id);
    console.log("cart ID:", cart._id);

    // Elimina el producto del carrito
    await deleteProductFromCart(cart._id, product_id);

    // Actualiza el estado del carrito en el componente después de la eliminación
    setCart((prevCart) => {
      const updatedProducts = prevCart.products.filter(
        (product) => product.id_prod._id !== product_id
      );
      console.log('Updated cart:', { ...prevCart, products: updatedProducts });
      return { ...prevCart, products: updatedProducts };
    });

    console.log('After deletion - cart:', cart);
  } catch (error) {
    console.error('Error removing product:', error);
    // Manejar errores si es necesario
  }
};
 */
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

/*   useEffect(() => {
    console.log('Cart state updated:', cart);
  }, [cart]); */

  return (
    <div>
      <h2>Shopping Cart</h2>
      {products.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          {cart.products.map((cartProduct) => {
            const productFromCart = cartProduct.id_prod;
            const productFromDB = products.find(product => product._id === productFromCart);

            if (productFromDB) {
              return (
                <div key={productFromCart}>
                  <p>{productFromDB.title}</p>
                  <p>Quantity: {cartProduct.quantity}</p>
                  <p>Price: {productFromDB.price * cartProduct.quantity}</p>
                  <button onClick={() => handleRemoveProduct(productFromCart)}>
                    Remove
                  </button>
                </div>
              );
            } else {
              return (
                <div key={productFromCart}>
                  <p>Product not found</p>
                </div>
              );
            }
          })}

          {/* Calcular el totalPrice fuera del bucle */}
          <p>Total Quantity: {totalQuantity}</p>
          <p>Total Price: {
            cart.products.reduce(
              (total, cartProduct) => {
                const productFromDB = products.find(product => product._id === cartProduct.id_prod);
                return total + (productFromDB ? productFromDB.price * cartProduct.quantity : 0);
              },
              0
            )
          }</p>

          <button onClick={handleClearCart}>Clear Cart</button>
          <button onClick={handleCheckout}>Buy</button>
        </>
      )}
    </div>
  );
};

export default Cart;

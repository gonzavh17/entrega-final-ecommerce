import React, { useState } from "react";

export default function ItemCount({ stock, initial, onAddToCart }) {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    if (count < stock) {
      setCount(count + 1);
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  return (
    <div>
      <p>Unidades: {count}</p>
      <button onClick={handleDecrement}>-</button>
      <button onClick={() => onAddToCart(count)} disabled={!stock}>
        Agregar al carrito
      </button>
      <button onClick={handleIncrement}>+</button>
    </div>
  );
}

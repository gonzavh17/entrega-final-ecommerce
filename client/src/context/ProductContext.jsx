import { createContext } from "react";

export const CartContext = createContext()

export const CartProvider = () => {
    return (
        <CartContext.Provider>
            {children}
        </CartContext.Provider>
    )
}
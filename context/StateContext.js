import React, { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  const onAdd = (product, size, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id && item.size === size
    );

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id && cartProduct.size === size) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
        }
        return cartProduct;
      });

      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...product, size, quantity }]);
    }

    toast.success(`${quantity} ${product.name} (${size}) added to the cart.`);
  };

  const onRemove = (productId, size) => {
    const foundProduct = cartItems.find(
      (item) => item._id === productId && item.size === size
    );
    const newCartItems = cartItems.filter(
      (item) => !(item._id === productId && item.size === size)
    );

    if (foundProduct) {
      setTotalPrice(
        (prevTotalPrice) =>
          prevTotalPrice - foundProduct.price * foundProduct.quantity
      );
      setTotalQuantities(
        (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
      );
      setCartItems(newCartItems);
    }
  };

  const toggleCartItemQuantity = (productId, size, value) => {
    const foundProductIndex = cartItems.findIndex(
      (item) => item._id === productId && item.size === size
    );

    if (foundProductIndex > -1) {
      const updatedCartItems = [...cartItems];
      const product = updatedCartItems[foundProductIndex];

      if (value === "inc") {
        product.quantity += 1;
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
      } else if (value === "dec") {
        if (product.quantity > 1) {
          product.quantity -= 1;
          setTotalPrice((prevTotalPrice) => prevTotalPrice - product.price);
          setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
        }
      }

      setCartItems(updatedCartItems);
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;

      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);

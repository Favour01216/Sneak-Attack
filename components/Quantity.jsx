// Quantity.jsx
import React from "react";
import "./Quantity.css"; // Import the CSS for styling

const Quantity = ({ quantity, increment, decrement }) => {
  return (
    <div className="quantity-container">
      <button className="quantity-button minus" onClick={decrement}>
        -
      </button>
      <span className="quantity-number">{quantity}</span>
      <button className="quantity-button plus" onClick={increment}>
        +
      </button>
    </div>
  );
};

export default Quantity;

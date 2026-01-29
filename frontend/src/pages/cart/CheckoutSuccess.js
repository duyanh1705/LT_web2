import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutSuccessPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrderDetails = JSON.parse(localStorage.getItem("orderDetails"));
    if (storedOrderDetails) {
      setOrderDetails(storedOrderDetails);
    }
  }, []);

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h2>Order Placed Successfully!</h2>
      <p>Thank you for your purchase. Your order has been placed successfully.</p>
      {orderDetails && (
        <div>
          <h4>Order Summary</h4>
          <ul className="list-group">
            {orderDetails.cart.map((item) => (
              <li key={item.productId} className="list-group-item d-flex justify-content-between align-items-center">
                {item.productName} x {item.quantity}
                <span>{item.specialPrice * item.quantity} VND</span>
              </li>
            ))}
          </ul>
          <h5 className="mt-3">Total: {orderDetails.total} VND</h5>
          <h4>Shipping Information</h4>
          <p>Name: {orderDetails.shippingInfo.name}</p>
          <p>Address: {orderDetails.shippingInfo.address}</p>
          <p>City: {orderDetails.shippingInfo.city}</p>
          <p>Postal Code: {orderDetails.shippingInfo.postalCode}</p>
          <p>Country: {orderDetails.shippingInfo.country}</p>
        </div>
      )}
      <button className="btn btn-primary mt-3" onClick={handleContinueShopping}>
        Continue Shopping
      </button>
    </div>
  );
};

export default CheckoutSuccessPage;
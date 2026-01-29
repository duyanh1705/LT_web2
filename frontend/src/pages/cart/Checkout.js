import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const navigate = useNavigate();

  const getItemPrice = (item) => {
    return Number(item.specialPrice || item.price || 0);
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (Array.isArray(storedCart)) {
      setCart(storedCart);

      const sum = storedCart.reduce((acc, item) => {
        return acc + getItemPrice(item) * item.quantity;
      }, 0);

      setTotal(sum);
    }
  }, []);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save order details to localStorage
    const orderDetails = {
      cart,
      total,
      shippingInfo,
      paymentInfo,
      orderDate: new Date().toISOString(),
    };
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    // Clear the cart
    localStorage.removeItem("cart");
    setCart([]);
    // Navigate to the success page
    navigate("/checkoutsuccess");
  };

  return (
    <div className="container mt-4">
      <h2>Checkout</h2>
      <div className="row">
        <div className="col-md-8">
          <h4>Shipping Information</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={shippingInfo.name}
                onChange={handleShippingChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                required
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={shippingInfo.city}
                onChange={handleShippingChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                className="form-control"
                name="postalCode"
                value={shippingInfo.postalCode}
                onChange={handleShippingChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                className="form-control"
                name="country"
                value={shippingInfo.country}
                onChange={handleShippingChange}
                required
              />
            </div>
            <h4>Payment Information</h4>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                className="form-control"
                name="cardNumber"
                value={paymentInfo.cardNumber}
                onChange={handlePaymentChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                className="form-control"
                name="expiryDate"
                value={paymentInfo.expiryDate}
                onChange={handlePaymentChange}
                required
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                className="form-control"
                name="cvv"
                value={paymentInfo.cvv}
                onChange={handlePaymentChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Place Order
            </button>
          </form>
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <ul className="list-group">
            {cart.map((item) => (
              <li
                key={item.productId}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {item.productName} x {item.quantity}
                <span>
                  {getItemPrice(item) * item.quantity} VND
                </span>
              </li>
            ))}
          </ul>
          <h5 className="mt-3">Total: {total} VND</h5>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = ({ cart: initialCart = [], setCart }) => {
  const [cart, setLocalCart] = useState(initialCart);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!Array.isArray(storedCart)) {
      setLocalCart([]);
    } else {
      setLocalCart(storedCart);
    }
  }, []);

  useEffect(() => {
    if (!Array.isArray(cart)) return; // Nếu cart không phải là mảng, không thực hiện tính toán
    const sum = cart.reduce((acc, item) => acc + item.specialPrice * item.quantity, 0);
    setTotal(sum);
  }, [cart]);

  const updateQuantity = (productId, quantity) => {
    if (!Array.isArray(cart)) return;
    let newCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity: quantity } : item
    );
    setLocalCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    if (setCart) setCart(newCart);
  };

  const removeItem = (productId) => {
    if (!Array.isArray(cart)) return;
    let newCart = cart.filter((item) => item.productId !== productId);
    setLocalCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    if (setCart) setCart(newCart);
  };

  return (
    <div className="container mt-4">
      <h2>Giỏ hàng của bạn</h2>
      {!Array.isArray(cart) || cart.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.productId}>
                <td>
<img 
    src={item.image ? item.image.replace('http://localhost:8080/images/', 'http://localhost:8080/api/images/') : ''} 
    alt={item.productName} 
    // Giữ nguyên style hoặc className cũ của trang Cart tại đây
    style={{ width: "80px", height: "auto" }} 
/>

                  {item.productName}
                </td>
                <td>{item.specialPrice} VND</td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                  <span className="mx-2">{item.quantity}</span>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </td>
                <td>{item.specialPrice * item.quantity} VND</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => removeItem(item.productId)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h4>Tổng tiền: {total} VND</h4>
      <button className="btn btn-primary" onClick={() => navigate("/checkout")}>Thanh toán</button>
    </div>
  );
};

export default CartPage;
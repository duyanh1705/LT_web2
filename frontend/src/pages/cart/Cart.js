import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_USER_CART, PUT_CART_UPDATE, DELETE_CART_PRODUCT } from "../../api/apiService";

const CartPage = ({ cart: initialCart = [], setCart }) => {
  const [cart, setLocalCart] = useState(initialCart);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedCartId = localStorage.getItem("cartId");

    if (storedEmail && storedCartId) {
      GET_USER_CART(storedEmail, storedCartId)
        .then((cartDto) => {
          if (cartDto?.products && Array.isArray(cartDto.products)) {
            setLocalCart(cartDto.products);
            if (setCart) setCart(cartDto.products);
            localStorage.setItem("cart", JSON.stringify(cartDto.products));
          } else {
            setLocalCart([]);
          }
        })
        .catch((error) => {
          console.warn("Could not load backend cart, falling back to local cart:", error);
          const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
          setLocalCart(Array.isArray(storedCart) ? storedCart : []);
        });
    } else {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setLocalCart(Array.isArray(storedCart) ? storedCart : []);
    }
  }, []);

  useEffect(() => {
    if (!Array.isArray(cart)) return; // Nếu cart không phải là mảng, không thực hiện tính toán
    const sum = cart.reduce((acc, item) => acc + item.specialPrice * item.quantity, 0);
    setTotal(sum);
  }, [cart]);

  const updateQuantity = async (productId, quantity) => {
    if (!Array.isArray(cart)) return;
    if (quantity < 1) return;

    const storedCartId = localStorage.getItem("cartId");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedEmail && storedCartId) {
      try {
        await PUT_CART_UPDATE(storedCartId, productId, quantity);
        const updatedCart = cart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        setLocalCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        if (setCart) setCart(updatedCart);
        return;
      } catch (error) {
        console.warn("Failed to update backend cart quantity, falling back:", error);
      }
    }

    let newCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity: quantity } : item
    );
    setLocalCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    if (setCart) setCart(newCart);
  };

  const removeItem = async (productId) => {
    if (!Array.isArray(cart)) return;
    const storedCartId = localStorage.getItem("cartId");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedEmail && storedCartId) {
      try {
        await DELETE_CART_PRODUCT(storedCartId, productId);
        const updatedCart = cart.filter((item) => item.productId !== productId);
        setLocalCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        if (setCart) setCart(updatedCart);
        return;
      } catch (error) {
        console.warn("Failed to delete item from backend cart, falling back:", error);
      }
    }

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
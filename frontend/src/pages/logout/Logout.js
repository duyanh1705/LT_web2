import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmLogout) {
      // Clear user session data
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("cartId");
      localStorage.removeItem("cart");
      localStorage.removeItem("favorite");
      // Add any other items you want to clear from localStorage

      // Navigate to the login page
      navigate("/login");
    } else {
      // Navigate back to the previous page or home page
      navigate(-1); // This will navigate back to the previous page
    }
  }, [navigate]);

  return (
    <div className="container mt-4">
      <h2>Logging out...</h2>
    </div>
  );
};

export default LogoutPage;
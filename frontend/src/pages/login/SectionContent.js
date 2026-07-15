import React, { useState } from "react";
import { LOGIN, GET_USER_BY_EMAIL } from "../../api/apiService";
import { useNavigate } from "react-router-dom";

const SectionContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

const body = {
  username: email, // Đáp ứng cho Spring Security bộ lọc xác thực ban đầu
  email: email,    // Đáp ứng cho hàm logic Custom UserDetailsService tìm kiếm theo Email của bạn
  password: password,
};

    try {
      const response = await LOGIN(body);

      if (response && response.data) {
        const token = response.data["jwt-token"];

        if (token) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("userEmail", email);

          await GET_USER_BY_EMAIL(email)
            .then((userData) => {
              if (userData?.cart?.cartId) {
                localStorage.setItem("cartId", userData.cart.cartId);
              }
              localStorage.setItem(
                "user",
                JSON.stringify({
                  username: email,
                  email: email,
                  cartId: userData?.cart?.cartId || null,
                })
              );
            })
            .catch((error) => {
              console.warn("Could not fetch user cart after login:", error);
              localStorage.setItem(
                "user",
                JSON.stringify({
                  username: email,
                  email: email,
                })
              );
            });

          window.alert("Login successful!");
          navigate("/Home");
        } else {
          window.alert("Token not found in response");
        }
      }

    } catch (error) {
      window.alert("Login failed: " + error.message);
    }
  };

  return (
    <section className="section-content padding-y" style={{ minHeight: "84vh" }}>
      {/* ========================= COMPONENT LOGIN ======================== */}
      <div className="card mx-auto" style={{ maxWidth: "380px", marginTop: "100px" }}>
        <div className="card-body">
          <h4 className="card-title mb-4">Sign in</h4>
          <form onSubmit={handleSubmit}>
            {/* Facebook and Google sign-in buttons */}
            <a href="#" className="btn btn-info btn-block mb-2">
              <i className="fab fa-facebook-f"></i>&nbsp; Sign in with Facebook
            </a>
            <a href="#" className="btn btn-danger btn-block mb-4">
              <i className="fab fa-google"></i>&nbsp; Sign in with Google
            </a>
            <div className="form-group">
              <input
                name="email"
                className="form-control"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                name="password"
                className="form-control"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <a href="#" className="float-right">
                Forgot password?
              </a>
              <label className="float-left custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" />
                <div className="custom-control-label"> Remember </div>
              </label>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <p className="text-center mt-4">
        Don't have an account? <a href="#">Sign up</a>
      </p>
      <br />
      <br />
      {/* ========================= COMPONENT LOGIN END ======================== */}
    </section>
  );
};

export default SectionContent;

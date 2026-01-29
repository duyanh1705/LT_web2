import React, { useState } from "react";
import { REGISTER } from "../../api/apiService";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    addressLine1: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    roleName: "USER",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    REGISTER(data, navigate);
  };

  return (
    <section className="section-content padding-y">
      <div
        className="card mx-auto"
        style={{ maxWidth: "520px", marginTop: "40px" }}
      >
        <article className="card-body">
          <header className="mb-4">
            <h4 className="card-title">Sign up</h4>
          </header>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="col form-group">
                <label>First name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col form-group">
                <label>Last name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                className="form-control"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <small className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Create password</label>
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label>Repeat password</label>
                <input
                  className="form-control"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                Register
              </button>
            </div>
          </form>
        </article>
      </div>
      <p className="text-center mt-4">
        Have an account? <a href="#">Log In</a>
      </p>
      <br />
      <br />
    </section>
  );
};

export default Register;

import React, { useEffect, useState } from 'react';
import { GET_ALL } from "../api/apiService";
import us from "../assets/images/icons/flags/US.png";
import { Dropdown } from 'bootstrap';
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.svg";

function Header() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  useEffect(() => {
    const params = {
      pageNumber: 0,
      pageSize: 5,
      sortBy: "categoryId",
      sortOrder: "asc",
    };

    GET_ALL("categories", params)
      .then((response) => {
        setCategories(response.content);
      })
      .catch((error) => {
        console.error("Failed to fetch categories:", error); // Handle any errors
      });
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("cartId");
    localStorage.removeItem("cart");
    setUser(null);
    navigate("/Home");

  };


  useEffect(() => {
    const dropdownElement = document.getElementById('navbarDropdown');
    if (dropdownElement) {
      new Dropdown(dropdownElement);
    }
  }, []);
  return (
    <header className="section-header">
      <nav className="navbar d-none d-md-flex p-md-0 navbar-expand-sm navbar-light border-bottom">

      </nav>


      <section className="header-main border-bottom">
        <div className="container">
          <div className="row align-items-center">


            <div className="col-4 col-sm-4 col-md-3 col-lg-2">
              <Link to="/Home" className="brand-wrap">
                <img className="logo img-fluid" src={logo} alt="Logo" />
              </Link>
            </div>


            <div className="col-lg-8 col-md-6">
              <form onSubmit={handleSearchSubmit} className="search-header">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                  <select
                    className="custom-select border-left"
                    name="category_name"
                  >
                    <option value="">Tất cả loại</option>
                    {categories.length > 0 &&
                      categories.map((category) => (
                        <option
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.categoryName}
                        </option>
                      ))}
                  </select>
                  <button type="submit" className="btn btn-primary">
                    Tìm kiếm
                  </button>
                </div>
              </form>
            </div>


            <div className="col-lg-1 col-md-1">
              <div className="d-flex justify-content-end">
                {/* <a className="nav-link" href="#"><i className="fa fa-shopping-cart"></i></a> */}
                <Link className="nav-link" to="/cart">
                  <i className="fa fa-shopping-cart"></i>
                </Link>
                <Link className="nav-link" to="/favorite">
                  <i className="fa fa-heart"></i>
                </Link>
              </div>


            </div>
          </div>
        </div>
      </section>

      <nav className="navbar navbar-main navbar-expand pl-0">
        <ul className="navbar-nav flex-wrap">
          <li className="nav-item">
            <Link className="nav-link" to="/Home">Trang chủ</Link>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Danh sách sản phẩm
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              {categories.length > 0 &&
                categories.map((row) => (
                  <li key={row.categoryId}>
                    <a
                      className="dropdown-item"
                      href={`/ListingGrid?categoryId=${row.categoryId}`}
                    >
                      {row.categoryName}
                    </a>
                  </li>
                ))}
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="/ListingGrid">
                  Tất cả sản phẩm
                </a>
              </li>
            </ul>
          </li>
          {!user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/Register">Đăng ký</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Login">Đăng nhập</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <span className="nav-link">
                  👋 Xin chào, <b>{user?.email || user?.username}</b>
                </span>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  style={{ textDecoration: "none" }}
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </li>
            </>
          )}


        </ul>
      </nav>
    </header>
  );
}

export default Header;

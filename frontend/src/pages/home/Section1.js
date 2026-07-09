import React, { useEffect, useState } from "react";
import { GET_ALL } from "../../api/apiService";
import startsActive from "../../assets/images/icons/stars-active.svg";
import startsDisable from "../../assets/images/icons/starts-disable.svg";
import { Link } from "react-router-dom";

const cardTextStyle = {
  maxWidth: "80%",
};

const Section1 = ({ categoryName, categoryId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categoryId) {
      console.error("Category ID is undefined");
      return;
    }

    console.log("Fetching products for categoryId:", categoryId); // Debugging line

    const params = {
      pageNumber: 0,
      pageSize: 5,
      sortBy: "productId",
      sortOrder: "asc",
    };

    GET_ALL(`categories/${categoryId}/products`, params)
      .then((response) => {
        console.log("response", response.content);
        setProducts(response.content); // Set the products state
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error); // Handle errors
      });
  }, [categoryId]);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!Array.isArray(cart)) {
      cart = [];
    }
    const index = cart.findIndex((item) => item.productId === product.productId);

    if (index !== -1) {
      cart[index].quantity += 1; // Nếu sản phẩm đã có trong giỏ, tăng số lượng
    } else {
      cart.push({ ...product, quantity: 1 }); // Thêm sản phẩm mới
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng!");
  };

  const addToFavorites = (product) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!Array.isArray(favorites)) {
      favorites = [];
    }
    const index = favorites.findIndex((item) => item.productId === product.productId);

    if (index === -1) {
      favorites.push(product); // Thêm sản phẩm mới vào danh sách yêu thích
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Đã thêm vào danh sách yêu thích!");
    } else {
      alert("Sản phẩm đã có trong danh sách yêu thích!");
    }
  };

  return (
    <section className="padding-bottom">
      <header className="section-heading mb-4">
        <h3 className="title-section">{categoryName}</h3>
      </header>
      <div className="row">
        {products.length > 0 &&
          products.map((row) => {
            return (
              <div className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4" key={row.id}>
                <div className="card card-product-grid h-100">
                  <Link
                    to={`/Detail?productId=${row.productId}`}
                    className="img-wrap"
                  >
<img
  src={
    row.image && row.image.startsWith("http")
      ? row.image.replace('http://localhost:8080/images/', 'http://localhost:8080/api/images/')
      : `http://localhost:8080/api/images/${row.image}`
  }
  alt={row.productName}
  className="img-fluid"
/>

                  </Link>
                  <figcaption className="info-wrap p-3">
                    <ul className="rating-stars mb-1 list-inline">
                      <li className="stars-active list-inline-item">
                        <img src={startsActive} alt="active stars" />
                      </li>
                      <li className="list-inline-item">
                        <img src={startsDisable} alt="disabled stars" />
                      </li>
                    </ul>
                    <Link to={`/Detail?productId=${row.id}`} className="title d-block text-truncate">
                      {row.productName}
                    </Link>
                    <div className="d-flex align-items-center">
                      <div className="price h5 text-muted mr-3">
                        <del>{row.price} VND</del>
                      </div>
                      <div className="price h5 text-primary">
                        {row.specialPrice} VND
                      </div>
                    </div>

                    {/* Các nút thao tác */}
                    <div className="d-grid mt-3">
                      <a href="#" className="btn btn-outline-primary mb-2">
                        <i className="fa fa-eye"></i> Xem chi tiết
                      </a>

                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-warning text-white flex-fill me-2 fw-bold"
                          onClick={() => addToCart(row)}
                        >
                          <i className="fa fa-shopping-cart"></i> Thêm vào giỏ
                        </button>
                        <button
                          className="btn btn-outline-danger flex-fill"
                          onClick={() => addToFavorites(row)}
                        >
                          <i className="fa fa-heart"></i> Yêu thích
                        </button>

                      </div>
                    </div>
                  </figcaption>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default Section1;
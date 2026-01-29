import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchProducts } from "../../api/apiService"; // Assume you've defined this
const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";

  useEffect(() => {
    setLoading(true);
    searchProducts(searchQuery)
      .then((response) => {
        setProducts(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch search results:", error);
        setLoading(false);
      });
  }, [searchQuery]);
  const handleProductClick = (productId) => {
    navigate(`/Detail?productId=${productId}`);
  };
  return (
    <section className="section-content padding-y">
      <div className="container">
        <h2>Kết quả tìm kiếm cho: "{searchQuery}"</h2>
        {loading && <p>Loading...</p>}
        {!loading && products.length === 0 && (
          <p>No products found for "{searchQuery}".</p>
        )}
       <div className="row">
  {!loading && products.length > 0 && products.map((row) => (
    <div className="col-md-3 col-sm-6 mb-4" key={row.productId}onClick={() => handleProductClick(row.productId)}
                  style={{ cursor: "pointer" }}>
      <figure className="card card-product-grid">
        <div className="img-wrap position-relative">
          <span className="badge badge-danger position-absolute top-0 start-0 m-2">MỚI</span>
          <img
            src={row.image}
            alt={row.productName}
            className="img-fluid"
          />
        </div>
        <figcaption className="info-wrap p-3">
          <a href="#" className="title mb-2 d-block text-truncate">{row.productName}</a>
          <div className="price-wrap d-flex align-items-center justify-content-between">
  <del className="price text-muted text-decoration-line-through mr-2 ">{row.price} VND</del>
  <span className="price text-primary">{row.specialPrice} VND</span>
</div>
          
          <hr />
          <p className="mb-3">
            <span className="tag">
              <i className="fa fa-check text-success"></i> Đã xác minh
            </span>
          </p>
          
          <a href="#" className="btn btn-outline-primary btn-block">
            Xem chi tiết
          </a>
        </figcaption>
      </figure>
    </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default SearchResults;

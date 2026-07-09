import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { GET_ALL, GET_ID } from '../../api/apiService';
import { Logout } from '@mui/icons-material';

const ProductListingGrid = () => {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page")) || 1;
  const categoryId = queryParams.get("categoryId");

  const numItems = 4;

  const handlePageChange = (page) => {
    if (categoryId && categoryId !== "null") {
      navigate(`/ListingGrid?page=${page}&categoryId=${categoryId}`);
    } else {
      navigate(`/ListingGrid?page=${page}`);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <Link
            className="page-link"
            to={
              categoryId && categoryId !== "null"
                ? `?page=${i}&categoryId=${categoryId}`
                : `?page=${i}`
            }
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Link>
        </li>
      );
    }
    return pageNumbers;
  };
  useEffect(() => {
    setLoading(true);
    const params = {
      pageNumber: currentPage,
      pageSize: numItems,
      sortBy: "productId",
      sortOrder: "asc",
    };
    if (categoryId !== null) {
      GET_ALL(`categories/${categoryId}/products`, params)
        .then((response) => {
          console.log("API Response:", response);
          setProducts(response.content);
          setTotalPages(response.totalPages);
          setTotalElements(response.totalElements);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch products:", error);
          setLoading(false);
        });

      GET_ID("categories", categoryId)
        .then((item) => setCategories(item))
        .catch((error) => {
          console.error("Failed to fetch category:", error);
        });
    } else {
      GET_ALL("products", params)
        .then((response) => {
          setProducts(response.content);
          setTotalPages(response.totalPages);
          setTotalElements(response.totalElements);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch products:", error);
          setLoading(false);
        });
      setCategories({ categoryName: "Tất cả sản phẩm" });
    }
  }, [categoryId, currentPage]);

  const handleProductClick = (productId) => {
    navigate(`/Detail?productId=${productId}`);
  };
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
    <section className="section-content padding-y">
      <div className="container">
        <div className="card mb-3">
          <div className="card-body">
            {/* Breadcrumb navigation */}
            <div className="row">
              <div className="col-md-2">Bạn đang ở đây:</div>
              <div className="col-md-8">
                <nav className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Trang chủ</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#">{categories?.categoryName}</a>
                  </li>

                </nav>
              </div>
            </div>
            <hr />
            {/* Filters section */}
            {/* <div className="row">
                            <div className="col-md-2">Lọc theo</div>
                            <div className="col-md-10">
                               
                            </div>
                        </div>
                        <hr /> */}
            {/* Search result header */}
            <header className="mb-3">
              <div className="form-inline">
                <strong className="mr-md-auto">Kết quả tìm kiếm: </strong>
                <select className="mr-2 form-control">
                  <option>Sản phẩm mới nhất</option>
                  <option>Đang thịnh hành</option>
                  <option>Phổ biến nhất</option>
                  <option>Rẻ nhất</option>
                </select>
                <div className="btn-group">
                  <a href="#" className="btn btn-light active">
                    <i className="fa fa-bars"></i>
                  </a>
                  <a href="#" className="btn btn-light">
                    <i className="fa fa-th"></i>
                  </a>
                </div>
              </div>
            </header>
            {/* Product grid
                        
                        <div className="row">
  {!loading && products.length > 0 && products.map((row) => (
    <div className="col-md-3 col-sm-6 mb-4" key={row.productId}onClick={() => handleProductClick(row.productId)}
                  style={{ cursor: "pointer" }}>
      <figure className="card card-product-grid">
        <div className="img-wrap position-relative">
          <span className="badge badge-danger position-absolute top-0 start-0 m-2">MỚI</span>
          <img
            src={`http://localhost:8080/api/public/products/image/${row.image}`}
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
  {loading && <p>Loading...</p>}
</div> */}

            <div className="row">
              {!loading && products.length > 0 && products.map((row) => (
                <div className="col-md-3 col-sm-6 mb-4" key={row.productId}>
                  <figure className="card card-product-grid shadow-sm border rounded-3 overflow-hidden">
                    {/* Ảnh sản phẩm */}
                    <div
                      className="img-wrap position-relative p-2"
                      onClick={() => handleProductClick(row.productId)}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="badge badge-danger position-absolute top-0 start-0 m-2 px-2 py-1">
                        MỚI
                      </span>
                      <img
                        src={row.image ? row.image.replace('http://localhost:8080/images/', 'http://localhost:8080/api/images/') : ''}
                        alt={row.productName}
                        className="img-fluid rounded"
                      />
                    </div>

                    {/* Thông tin sản phẩm */}
                    <figcaption className="info-wrap p-3 text-center">
                      <h6 className="title text-truncate mb-2">{row.productName}</h6>
                      <div className="price-wrap d-flex align-items-center justify-content-center mb-2">
                        <del className="price text-muted me-2">{row.price} VND</del>
                        <span className="price text-danger fw-bold">{row.specialPrice} VND</span>
                      </div>

                      <p className="mb-2">
                        <span className="tag">
                          <i className="fa fa-check-circle text-success"></i> Đã xác minh
                        </span>
                      </p>

                      {/* Các nút thao tác */}
                      <div className="d-grid">
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
                  </figure>
                </div>
              ))}
              {loading && <p>Loading...</p>}
            </div>



            {/* Pagination */}
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                  >
                    Trang trước
                  </button>
                </li>
                {renderPageNumbers()}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    Trang sau
                  </button>
                </li>
              </ul>
            </nav>
            <div className="box text-center">
              <p>Bạn đã tìm thấy điều bạn đang tìm kiếm chứ?</p>
              <a href="#" className="btn btn-light">Có</a>
              <a href="#" className="btn btn-light" style={{ marginLeft: "10px" }}>Không</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListingGrid;

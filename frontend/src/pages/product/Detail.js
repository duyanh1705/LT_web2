import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GET_ID, POST_ADD } from "../../api/apiService"; // Import your GET_ID function for API calls
import { useNavigate } from "react-router-dom";
const Detail = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId"); // Extract productId from URL
  const [product, setProduct] = useState(null); // State to store product details
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  useEffect(() => {
    if (productId) {
      GET_ID("products", productId) // Fetch product details by ID
        .then((response) => {
          setProduct(response); // Set product details in state
        })
        .catch((error) => {
          console.error("Failed to fetch product details:", error); // Handle errors
        });
    }
  }, [productId]);
  const navigate = useNavigate();
  const addToCart = () => {
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItem = cart.find(
        (item) => item.productId === product.productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          productId: product.productId,
          productName: product.productName,
          price: product.price,
          specialPrice: product.specialPrice,
          image: product.image,
          quantity: quantity,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      // 👉 chuyển sang trang giỏ hàng
      navigate("/cart");

    } catch (error) {
      console.error(error);
      alert("Thêm vào giỏ hàng thất bại!");
    }
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

  if (!product) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <section className="section-content bg-white padding-y">
      <div className="container">
        <div className="row">
          <aside className="col-md-6">
            <div className="card">
              <article className="gallery-wrap">
                <div className="img-big-wrap">
                  <div>
                    <a href="#">
<img 
    src={product?.image ? product.image.replace('http://localhost:8080/images/', 'http://localhost:8080/api/images/') : ''} 
    alt={product?.productName} 
    className="img-fluid" // Giữ nguyên class CSS cũ của trang Detail nếu có
/>
                    </a>
                  </div>
                </div>
                <div className="thumbs-wrap">
                  {/* Render thumbnails if available */}
                  {product.images &&
                    product.images.map((img, index) => (
                      <a key={index} href="#" className="item-thumb">
                        <img
                          src={`http://localhost:8080/images/${img}`}
                          alt={`Thumbnail ${index + 1}`}
                        />
                      </a>
                    ))}
                </div>
              </article>
            </div>
          </aside>
          <main className="col-md-6">
            <article className="product-info-aside">
              <h2 className="title mt-3">{product.productName}</h2>
              <div className="rating-wrap my-3">
                <ul className="rating-stars">
                  <li style={{ width: "80%" }} className="stars-active">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </li>
                  <li>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </li>
                </ul>
                <small className="label-rating text-muted">
                  {product.reviews || 0} reviews
                </small>
                <small className="label-rating text-success">
                  <i className="fa fa-clipboard-check"></i>{" "}
                  {product.orders || 0} orders
                </small>
              </div>
              <div className="mb-3">
                <var className="price h5 mr-3">{product.specialPrice} VND</var>
                <del className="text-muted ">
                  {product.price} VND
                </del>
              </div>
              <p>{product.description}</p>

              <div className="form-row mt-4">
                <div className="col-md-8">
                  <div className="input-group mb-3 input-spinner">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <button
                          className="btn btn-light"
                          type="button"
                          id="button-minus"
                          onClick={handleDecrease}
                        >
                          −
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control text-center"
                        value={quantity}
                        readOnly
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-light"
                          type="button"
                          id="button-plus"
                          onClick={handleIncrease}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <button className="btn btn-primary" onClick={addToCart}>
                      <i className="fas fa-shopping-cart"></i>{" "}
                      <span className="text">Thêm vào giỏ hàng</span>
                    </button>

                    <button
                      className="btn btn-outline-danger ml-2"
                      onClick={() => addToFavorites(product)}
                    >
                      <i className="fa fa-heart"></i> Yêu thích
                    </button>
                  </div>
                </div>
                <div className="col-md-4"></div>
              </div>
            </article>
          </main>
        </div>
      </div>
    </section>
  );
};

export default Detail;
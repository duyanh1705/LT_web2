import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (Array.isArray(storedFavorites)) {
      setFavorites(storedFavorites);
    }
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/Detail?productId=${productId}`);
  };

  const removeFromFavorites = (productId) => {
    const updatedFavorites = favorites.filter(product => product.productId !== productId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="container mt-4">
      <h2>Your Favorite Products</h2>
      {favorites.length === 0 ? (
        <p>You have no favorite products.</p>
      ) : (
        <div className="row">
          {favorites.map((product) => (
            <div className="col-md-3 col-sm-6 mb-4" key={product.productId} style={{ cursor: "pointer" }}>
              <figure className="card card-product-grid">
                <div className="img-wrap position-relative" onClick={() => handleProductClick(product.productId)}>
<img 
    src={product.image ? product.image.replace('http://localhost:8080/images/', 'http://localhost:8080/api/images/') : ''} 
    alt={product.productName} 
    className="img-fluid"
/>
                </div>
                <figcaption className="info-wrap p-3">
                  <a href="#" className="title mb-2 d-block text-truncate">{product.productName}</a>
                  <div className="price-wrap d-flex align-items-center justify-content-between">
                    <del className="price text-muted text-decoration-line-through mr-2">{product.price} VND</del>
                    <span className="price text-primary">{product.specialPrice} VND</span>
                  </div>
                  <button 
                    className="btn btn-outline-danger mt-2" 
                    onClick={() => removeFromFavorites(product.productId)}
                  >
                    Remove
                  </button>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
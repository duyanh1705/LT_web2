import React, { useEffect, useState } from "react";
import { GET_ALL } from "../../api/apiService";
import startsActive from "../../assets/images/icons/stars-active.svg";
import startsDisable from "../../assets/images/icons/starts-disable.svg";
// import { CardText } from "react-bootstrap";
import { Link } from "react-router-dom";const Items = (category) => {
  const { categoryName, categoryId } = category;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const params = {
      pageNumber: 0,
      pageSize: 5,
      sortBy: 'productId',
      sortOrder: 'asc',
    };

    GET_ALL(`categories/${categoryId}/products`, params)
      .then(response => {
        console.log("response", response.content);
        setProducts(response.content); // Set the products state
      })
      .catch(error => {
        console.error('Failed to fetch products:', error); // Handle errors
      });
  }, [categoryId]);
    return (
        // <section className="padding-bottom-sm">
        //   <header className="section-heading heading-line">
        //     <h4 className="title-section text-uppercase">Recommended items</h4>
        //   </header>
    
        //   <div className="row row-sm">
        //     <div className="col-xl-2 col-lg-3 col-md-4 col-6">
        //       <div className="card card-sm card-product-grid">
        //         <a href="#" className="img-wrap">
        //           <img src={require('../../assets/images/items/9.jpg')} alt="Product 1" />
        //         </a>
        //         <figcaption className="info-wrap">
        //           <a href="#" className="title">Just another product name</a>
        //           <div className="price mt-1">$179.00</div>
        //         </figcaption>
        //       </div>
        //     </div>
        //     <div className="col-xl-2 col-lg-3 col-md-4 col-6">
        //       <div className="card card-sm card-product-grid">
        //         <a href="#" className="img-wrap">
        //           <img src={require('../../assets/images/items/9.jpg')} alt="Product 2" />
        //         </a>
        //         <figcaption className="info-wrap">
        //           <a href="#" className="title">Some item name here</a>
        //           <div className="price mt-1">$280.00</div>
        //         </figcaption>
        //       </div>
        //     </div>
        //     <div className="col-xl-2 col-lg-3 col-md-4 col-6">
        //       <div className="card card-sm card-product-grid">
        //         <a href="#" className="img-wrap">
        //           <img src={require('../../assets/images/items/9.jpg')} alt="Product 3" />
        //         </a>
        //         <figcaption className="info-wrap">
        //           <a href="#" className="title">Great product name here</a>
        //           <div className="price mt-1">$56.00</div>
        //         </figcaption>
        //       </div>
        //     </div>
        //     <div className="col-xl-2 col-lg-3 col-md-4 col-6">
        //       <div className="card card-sm card-product-grid">
        //         <a href="#" className="img-wrap">
        //           <img src={require('../../assets/images/items/9.jpg')} alt="Product 4" />
        //         </a>
        //         <figcaption className="info-wrap">
        //           <a href="#" className="title">Just another product name</a>
        //           <div className="price mt-1">$179.00</div>
        //         </figcaption>
        //       </div>
        //     </div>
        //     <div className="col-xl-2 col-lg-3 col-md-4 col-6">
        //       <div className="card card-sm card-product-grid">
        //         <a href="#" className="img-wrap">
        //           <img src={require('../../assets/images/items/9.jpg')} alt="Product 5" />
        //         </a>
        //         <figcaption className="info-wrap">
        //           <a href="#" className="title">Just another product name</a>
        //           <div className="price mt-1">$179.00</div>
        //         </figcaption>
        //       </div>
        //     </div>
        //     <div className="col-xl-2 col-lg-3 col-md-4 col-6">
        //       <div className="card card-sm card-product-grid">
        //         <a href="#" className="img-wrap">
        //           <img src={require('../../assets/images/items/9.jpg')} alt="Product 6" />
        //         </a>
        //         <figcaption className="info-wrap">
        //           <a href="#" className="title">Some item name here</a>
        //           <div className="price mt-1">$280.00</div>
        //         </figcaption>
        //       </div>
        //     </div>
        //     <div className="col-xl-2 col-lg-3 col-md-4 col-6">
        //       <div className="card card-sm card-product-grid">
        //         <a href="#" className="img-wrap">
        //           <img src={require('../../assets/images/items/9.jpg')} alt="Product 7" />
        //         </a>
        //         <figcaption className="info-wrap">
        //           <a href="#" className="title">Great product name here</a>
        //           <div className="price mt-1">$56.00</div>
        //         </figcaption>
        //       </div>
        //     </div>
        //     <div className="col-xl-2 col-lg-3 col-md-4 col-6">
        //       <div className="card card-sm card-product-grid">
        //         <a href="#" className="img-wrap">
        //           <img src={require('../../assets/images/items/9.jpg')} alt="Product 9" />
        //         </a>
        //         <figcaption className="info-wrap">
        //           <a href="#" className="title">Just another product name</a>
        //           <div className="price mt-1">$179.00</div>
        //         </figcaption>
        //       </div>
        //     </div>
        //     <div className="col-xl-2 col-lg-3 col-md-4 col-6">
        //       <div className="card card-sm card-product-grid">
        //         <a href="#" className="img-wrap">
        //           <img src={require('../../assets/images/items/9.jpg')} alt="Product 4" />
        //         </a>
        //         <figcaption className="info-wrap">
        //           <a href="#" className="title">Just another product name</a>
        //           <div className="price mt-1">$179.00</div>
        //         </figcaption>
        //       </div>
        //     </div>
        //     <div className="col-xl-2 col-lg-3 col-md-4 col-6">
        //       <div className="card card-sm card-product-grid">
        //         <a href="#" className="img-wrap">
        //           <img src={require('../../assets/images/items/9.jpg')}alt="Product 5" />
        //         </a>
        //         <figcaption className="info-wrap">
        //           <a href="#" className="title">Just another product name</a>
        //           <div className="price mt-1">$179.00</div>
        //         </figcaption>
        //       </div>
        //     </div>
        //     <div className="col-xl-2 col-lg-3 col-md-4 col-6">
        //       <div className="card card-sm card-product-grid">
        //         <a href="#" className="img-wrap">
        //           <img src={require('../../assets/images/items/9.jpg')} alt="Product 6" />
        //         </a>
        //         <figcaption className="info-wrap">
        //           <a href="#" className="title">Some item name here</a>
        //           <div className="price mt-1">$280.00</div>
        //         </figcaption>
        //       </div>
        //     </div>
        //     <div className="col-xl-2 col-lg-3 col-md-4 col-6">
        //       <div className="card card-sm card-product-grid">
        //         <a href="#" className="img-wrap">
        //           <img src={require('../../assets/images/items/9.jpg')} alt="Product 7" />
        //         </a>
        //         <figcaption className="info-wrap">
        //           <a href="#" className="title">Great product name here</a>
        //           <div className="price mt-1">$56.00</div>
        //         </figcaption>
        //       </div>
        //     </div>
        //   </div>
        // </section>
        <section className="padding-bottom">
      <header className="section-heading mb-4">
        <h3 className="title-section">{categoryName}</h3>
      </header>
      <div className="row">
        {products.length > 0 && 
          products.map((row) => (
            <div className="col-xl-3 col-lg-3 col-md-4 col-6" key={row.id}>
              <div className="card card-product-grid">
                <Link to={`/Detail?productId=${row.id}`} className="img-wrap">
                  <img src={`http://localhost:8080/api/public/products/image/${row.image}`} alt="" />
                </Link>
                <figcaption className="info-wrap">
                  {/* <ul className="rating-stars mb-1">
                    <li style={{ cardTextStyle }} className="stars-active">
                      <img src={startsActive} alt="" />
                    </li>
                    <li>
                      <img src={startsDisable} alt="" />
                    </li>
                  </ul> */}
                  <div>
                    <Link to={`/Detail?productId=${row.id}`} className="title">
                      {row.productName}
                    </Link>
                  </div>
                  <div className="price h5 mt-2">${row.price}</div>
                </figcaption>
              </div>
            </div>
          ))
        }
      </div>
    </section>
      );
    };
    
    export default Items;
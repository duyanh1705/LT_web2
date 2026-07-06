import React, { useState, useEffect } from 'react';
import { GET_ALL } from '../../api/apiService';
const Slider = () => {
   
    const [categories, setCategories] = useState([]);

  useEffect(() => {
    const params = {
      pageNumber: 0,
      pageSize: 5,
      sortBy: 'categoryId',
      sortOrder: 'asc',
    };

    GET_ALL('categories', params)
      .then(response => {
        setCategories(response.content);
      })
      .catch(error => {
        console.error('Failed to fetch categories:', error);
      });
  }, []);
    return (
        <section className="section-main padding-y">
            <main className="card">
                <div className="card-body">
                    <div className="row">
                                
                <aside className="col-lg-2 col-md-5">
                    <nav className="nav flex-column nav-pills">
                    <h6 className="bg-blue text-center text-white mb-0 p-2">DANH MỤC </h6>
                <ul className="menu-category list-unstyled ">
                {categories.length > 0 && categories.map((row) => (
                    <li key={row.categoryId}>
                    <a className="nav-link border-bottom" href={`/ListingGrid?categoryId=${row.categoryId}`}>
                        {row.categoryName}
                    </a>
                    </li>
                ))}
                </ul>
            </nav>
            </aside>

                        <div className="col-md-9 col-xl-7 col-lg-7">

                            {/* ================== COMPONENT SLIDER BOOTSTRAP ==================  */}
                            <div id="carousel1_indicator" className="slider-home-banner carousel slide" data-ride="carousel">
                                <ol className="carousel-indicators">
                                    <li data-target="#carousel1_indicator" data-slide-to="0" className="active"></li>
                                    <li data-target="#carousel1_indicator" data-slide-to="1"></li>
                                    <li data-target="#carousel1_indicator" data-slide-to="2"></li>
                                </ol>
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <img src={require("../../assets/images/banners/Slider1.webp")} alt="First slide" />
                                    </div>
                                    <div className="carousel-item">
                                        <img src={require("../../assets/images/banners/Slider2.jpg")} alt="Second slide" />
                                    </div>
                                    <div className="carousel-item">
                                        <img src={require("../../assets/images/banners/Slider3.webp")} alt="Third slide" />
                                    </div>
                                    <div className="carousel-item">
                                        <img src={require("../../assets/images/banners/Slider4.jpg")} alt="Third slide" />
                                    </div>
                                    <div className="carousel-item">
                                        <img src={require("../../assets/images/banners/Slider5.jpg")} alt="Third slide" />
                                    </div>
                                </div>
                                <a className="carousel-control-prev" href="#carousel1_indicator" role="button" data-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Previous</span>
                                </a>
                                <a className="carousel-control-next" href="#carousel1_indicator" role="button" data-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </div> 
                            {/* ================== COMPONENT SLIDER BOOTSTRAP end.// ==================  */}

                        </div> {/* col.// */}
                       
                          <div className="col-md d-none d-lg-block flex-grow-1">
                          <aside className="special-home-right">
  <h6 className="bg-blue text-center text-white mb-0 p-2">DANH MỤC PHỔ BIẾN</h6>
  
  {categories.length > 0 && categories.slice(0, 3).map((row) => (
    <div key={row.categoryId} className="card-banner border-bottom">
      <div className="d-flex align-items-center justify-content-between py-2" style={{width: '80%'}}>
        <h6 className="card-title mb-0">{row.categoryName}</h6>
        <a href={`/ListingGrid?categoryId=${row.categoryId}`} className="btn btn-secondary btn-sm"> Xem chi tiết </a>
      </div> 
    </div>
  ))}

</aside>

    </div>
                    </div> {/* row.// */}

                </div> {/* card-body.// */}
            </main> {/* card.// */}

        </section>
    );
}

export default Slider;

import React from 'react';
const Service = () => {
    return (
        <section className="padding-bottom">
          <header className="section-heading heading-line">
            <h4 className="title-section text-uppercase">Trade services</h4>
          </header>
    
          <div className="row">
            <div className="col-md-3 col-sm-6">
              <article className="card card-post">
                <img src={require("../../assets/images/items/12.jpg")} className="card-img-top" alt="Trade Assurance" />
                <div className="card-body">
                  <h6 className="title">Trade Assurance</h6>
                  <p className="small text-uppercase text-muted">Order protection</p>
                </div>
              </article>
            </div>
            <div className="col-md-3 col-sm-6">
              <article className="card card-post">
                <img src={require("../../assets/images/items/12.jpg")} className="card-img-top" alt="Pay anytime" />
                <div className="card-body">
                  <h6 className="title">Pay anytime</h6>
                  <p className="small text-uppercase text-muted">Finance solution</p>
                </div>
              </article>
            </div>
            <div className="col-md-3 col-sm-6">
              <article className="card card-post">
                <img src={require("../../assets/images/items/12.jpg")} className="card-img-top" alt="Inspection solution" />
                <div className="card-body">
                  <h6 className="title">Inspection solution</h6>
                  <p className="small text-uppercase text-muted">Easy Inspection</p>
                </div>
              </article>
            </div>
            <div className="col-md-3 col-sm-6">
              <article className="card card-post">
                <img src={require("../../assets/images/items/12.jpg")}className="card-img-top" alt="Ocean and Air Shipping" />
                <div className="card-body">
                  <h6 className="title">Ocean and Air Shipping</h6>
                  <p className="small text-uppercase text-muted">Logistic services</p>
                </div>
              </article>
            </div>
          </div>
        </section>
      );
    };
    
    export default Service;
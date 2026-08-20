import React from 'react';
import './HeroSection.css'; // Custom CSS file

const HeroSection = () => {
  return (
    <div className="hero-background">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between py-5 px-3">
        <div className="hero-text text-start text-white">
          <h1 className="fw-bold display-4">
            <span style={{ color: '#d7ff57' }}>Frontend</span> Developer.
          </h1>
          <p className="lead mt-3 text-light">
            I like to craft solid and scalable frontend products with great user experiences.
          </p>
          <p className="mt-4 fw-light small text-white-50">
            Highly skilled at progressive enhancement, design systems & UI Engineering.
            <br />
            Over a decade of experience building products for clients across several countries.
          </p>
        </div>
        <div className="text-center mt-4 mt-md-0">
          <img
            src={process.env.PUBLIC_URL + '/profile.jpg'} // Replace with your photo path
            alt="Vivek Sagarwal"
            className="hero-photo rounded-circle"
            style={{ width: '220px', height: '220px', objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

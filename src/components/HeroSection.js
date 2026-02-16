import React from 'react';
import { Link } from 'react-router-dom';
function HeroSection() {
  return (
    <section style={{
      padding: '40px',
      backgroundColor: '#007bff',
      color: 'white',
      borderRadius: '8px',
      marginBottom: '30px'
    }}>
      <h2>Find Trusted Professionals Near You</h2>
      <p>Electricians, tutors, plumbers, CCTV technicians, and more — in your city, district, or village.</p>
      
       <Link to="/post-job">
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "white",
              color: "blue",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Post a Job
          </button>
        </Link>
      
    </section>
  );
}

export default HeroSection;

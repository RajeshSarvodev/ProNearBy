// src/pages/Home.js
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <>
      {/* Main Content */}
      <div className="page-container">
        {/* Hero / Welcome */}
        <section className="hero-section">
          <h2>Welcome to ProNearBy</h2>
          <p>Find the best professionals near you</p>
        </section>

        {/* Search placeholder */}
        <div className="search-bar">
          {/* Placeholder for SearchBar */}
        </div>

        {/* Categories */}
        <h2>Popular Professions</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <img src={cat.imageUrl} alt={cat.title} />
              <p>{cat.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        className="footer"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
        }}
      >
        &copy; {new Date().getFullYear()} ProNearBy. All rights reserved |{" "}
        <Link to="/contact">Contact Us</Link>
        <Link to="/admin-categories" style={{ display: "inline-block" }}>
          <button className="admin-btn">Admin</button>
        </Link>
      </footer>
    </>
  );
}

export default Home;
// src/pages/FindProfessionals.js

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
// import Navbar from "../components/Navbar"; // Removed Navbar import

import services from "../data/services";

function FindProfessionals() {
  const [professionals, setProfessionals] = useState([]);
  const [filteredPros, setFilteredPros] = useState([]);
  const [city, setCity] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all professionals on page load
  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "professionals"));
        const pros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProfessionals(pros);
        setFilteredPros(pros);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch professionals.");
      }
      setLoading(false);
    };

    fetchProfessionals();
  }, []);

  const handleSearch = () => {
    setError("");
    let results = [...professionals];

    if (city) {
      results = results.filter(
        pro =>
          pro.location?.city &&
          pro.location.city.toLowerCase() === city.trim().toLowerCase()
      );
    }

    if (serviceType) {
      results = results.filter(
        pro => pro.professionType && pro.professionType === serviceType
      );
    }

    if (pincode) {
      results = results.filter(
        pro => pro.location?.pincode && pro.location.pincode.toString() === pincode
      );
    }

    setFilteredPros(results);
  };

  return (
    <>
      {/* Navbar removed */}
      <div className="auth-page" style={{ marginTop: "20px" }}>
        <div className="auth-card" style={{ maxWidth: "800px" }}>
          <h2>Find Professionals</h2>
          <p className="subtitle">Search for professionals in your area.</p>

          {/* Search Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
              <option value="">Select Service</option>
              {services.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          {loading && <p>Loading professionals...</p>}
          {error && <p className="error-box">{error}</p>}

          {/* Display Professionals */}
          {filteredPros.length > 0 ? (
            <div>
              <h3>Professionals Found:</h3>
              <ul>
                {filteredPros.map((pro) => (
                  <li key={pro.id} style={{ marginBottom: "10px" }}>
                    <strong>{pro.firstName} {pro.lastName}</strong> - {pro.professionType} ({pro.professionSpec})<br />
                    Location: {pro.location?.area || ""}, {pro.location?.city}, {pro.location?.state} - {pro.location?.pincode}<br />
                    Experience: {pro.experience?.years} years {pro.experience?.months} months
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No professionals found. Try adjusting your search criteria.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default FindProfessionals;
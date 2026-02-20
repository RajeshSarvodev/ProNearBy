// src/pages/FindProfessionals.js
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import services from "../data/services";

function FindProfessionals() {
  const [professionals, setProfessionals] = useState([]);
  const [filteredPros, setFilteredPros] = useState([]);
  const [city, setCity] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      setError("");
      try {
        const q = query(collection(db, "professionals"), where("approved", "==", true));
        const snapshot = await getDocs(q);
        const pros = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          companyName: doc.data().companyName || "N/A",
        }));
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
    let results = [...professionals];
    if (city.trim()) results = results.filter(p => p.location?.city?.toLowerCase().includes(city.trim().toLowerCase()));
    if (serviceType) results = results.filter(p => p.professionType?.toLowerCase() === serviceType.toLowerCase());
    if (pincode.trim()) results = results.filter(p => p.location?.pincode?.toString() === pincode.trim());
    setFilteredPros(results);
  };

  const handleKeyPress = (e) => { if (e.key === "Enter") { e.preventDefault(); handleSearch(); } };

  return (
    <div className="auth-page" style={{ marginTop: "20px" }}>
      <div className="auth-card" style={{ maxWidth: "900px" }}>
        <h2>Find Professionals</h2>
        <p className="subtitle">Search verified professionals available in your area.</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "15px" }}>
          <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={handleKeyPress} />
          <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
            <option value="">Select Service</option>
            {services.map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>
          <input type="number" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} onKeyDown={handleKeyPress} />
          <button type="button" onClick={handleSearch}>Search</button>
        </div>

        {loading && <p>Loading professionals...</p>}
        {error && <p className="error-box">{error}</p>}
        {!loading && filteredPros.length === 0 && <p>No professionals found. Try adjusting your search.</p>}

        {filteredPros.length > 0 && (
          <div>
            <h3>Professionals Found:</h3>
            <ul style={{ paddingLeft: "15px" }}>
              {filteredPros.map((pro) => (
                <li key={pro.id} style={{ marginBottom: "12px" }}>
                  <strong>{pro.firstName} {pro.lastName}</strong> – {pro.professionType} ({pro.professionSpec})
                  <br />
                  Company: {pro.companyName}
                  <br />
                  Location: {[pro.location?.area, pro.location?.city, pro.location?.state].filter(Boolean).join(", ")} – {pro.location?.pincode}
                  <br />
                  Experience: {pro.experience?.years} years {pro.experience?.months} months
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindProfessionals;

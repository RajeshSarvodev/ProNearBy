// src/pages/RegisterProfessional.js

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import services from "../data/services"; // import your services list

function RegisterProfessional() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [professionType, setProfessionType] = useState("");
  const [professionSpec, setProfessionSpec] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [area, setArea] = useState("");
  const [street, setStreet] = useState("");
  const [plotNo, setPlotNo] = useState("");
  const [pincode, setPincode] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [experienceMonths, setExperienceMonths] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to get latitude and longitude from Google Maps API
  const getCoordinates = async () => {
    const fullAddress = `${street ? street + ', ' : ''}${area ? area + ', ' : ''}${city}, ${state}, ${pincode}`;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=YOUR_API_KEY`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].geometry.location; // {lat, lng}
      } else {
        return null;
      }
    } catch (err) {
      console.error("Error fetching coordinates:", err);
      return null;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    if (
      !firstName || !lastName || !gender || !professionType || !professionSpec ||
      !city || !state || !pincode || !experienceYears || !experienceMonths
    ) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    // Get coordinates for the professional
    const coordinates = await getCoordinates();
    if (!coordinates) {
      setError("Unable to determine location. Please check your address, city, and pincode.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "professionals"), {
        firstName,
        lastName,
        gender,
        professionType,
        professionSpec,
        location: {
          city,
          state,
          area,
          street,
          plotNo,
          pincode,
          lat: coordinates.lat,
          lng: coordinates.lng,
        },
        experience: { years: experienceYears, months: experienceMonths },
        createdAt: serverTimestamp(),
      });

      setSuccess("Registration successful!");
      setFirstName(""); setLastName(""); setGender(""); setProfessionType(""); setProfessionSpec("");
      setCity(""); setState(""); setArea(""); setStreet(""); setPlotNo(""); setPincode("");
      setExperienceYears(""); setExperienceMonths("");
    } catch (err) {
      console.error(err);
      setError("Failed to register. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Register as a Professional</h2>
        <p className="subtitle">Enter your professional details to register.</p>

        {error && <p className="error-box">{error}</p>}
        {success && <p className="success-box">{success}</p>}

        <form onSubmit={handleRegister}>
          {/* Name */}
          <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />

          <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
            {/* Gender */}
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {/* Type of Profession */}
            <select value={professionType} onChange={(e) => setProfessionType(e.target.value)} required>
              <option value="">Select Profession</option>
              {services.map((service, index) => <option key={index} value={service}>{service}</option>)}
            </select>
          </div>

          {/* Profession Specification */}
          <input type="text" placeholder="Profession Specification" value={professionSpec} onChange={(e) => setProfessionSpec(e.target.value)} required />

          {/* Location */}
          <input type="text" placeholder="Street Address" value={street} onChange={(e) => setStreet(e.target.value)} />
          <input type="text" placeholder="Area Name" value={area} onChange={(e) => setArea(e.target.value)} />
          <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
          <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
          <input type="text" placeholder="Plot/House No." value={plotNo} onChange={(e) => setPlotNo(e.target.value)} />
          <input type="number" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} required />

          {/* Experience */}
          <input type="number" placeholder="Years of Experience" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} required />
          <input type="number" placeholder="Months of Experience" value={experienceMonths} onChange={(e) => setExperienceMonths(e.target.value)} required />

          <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterProfessional;

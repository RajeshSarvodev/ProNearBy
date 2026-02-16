// src/pages/PostJob.js
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function PostJob() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [pincode, setPincode] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const services = [
    "Plumber",
    "Electrician",
    "Carpenter",
    "Painter",
    "Cleaner",
    "Driver",
    "IT Support",
    "CCTV Technician",
    "Tutor",
    "Driving schools",
    "Building and Constrution Works",
    
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await addDoc(collection(db, "jobs"), {
      jobTitle,
      serviceType,
      address,
      city,
      area,
      pincode,
      description,
      contactName,
      contactPhone,
      contactEmail,
      createdAt: serverTimestamp(),
    });
    alert("Job posted successfully!");
    // reset form
    setJobTitle("");
    setServiceType("");
    setAddress("");
    setCity("");
    setArea("");
    setPincode("");
    setDescription("");
    setContactName("");
    setContactPhone("");
    setContactEmail("");
    setLoading(false);
    // go to jobs list
    navigate("/jobs");
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Post a Job</h2>
        <input
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
        />
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          required
        >
          <option value="">Select Service</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          placeholder="Full Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            placeholder="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />
          <input
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
          />
        </div>
        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Contact Info */}
        <h3>Contact Details</h3>
        <input
          placeholder="Your Name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          required
        />
        <input
          placeholder="Phone Number"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          required
        />
        <input
          placeholder="Email Address"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
        />

        <button disabled={loading}>{loading ? "Posting..." : "Post Job"}</button>
      </form>
    </div>
  );
}

export default PostJob;
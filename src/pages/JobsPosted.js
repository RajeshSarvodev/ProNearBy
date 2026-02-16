// src/pages/JobsPosted.js
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function JobsPosted() {
  const [jobs, setJobs] = useState([]);
  const [filterType, setFilterType] = useState("All");

  const services = [
    "All",
    "Plumber",
    "Electrician",
    "Carpenter",
    "Painter",
    "Cleaner",
    "Driver",
    "IT Support",
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, "jobs"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobs(data);
    };
    fetchJobs();
  }, []);

  const filteredJobs =
    filterType === "All"
      ? jobs
      : jobs.filter((job) => job.serviceType === filterType);

  return (
    <div className="page-container">
      <h2>Posted Jobs</h2>
      <div style={{ marginBottom: "20px" }}>
        <label>Filter by Profession: </label>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          {services.map((srv) => (
            <option key={srv} value={srv}>{srv}</option>
          ))}
        </select>
      </div>
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <div key={job.id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px" }}>
            <h3>{job.jobTitle} ({job.serviceType})</h3>
            <p><b>Address:</b> {job.address}, {job.area}, {job.city} - {job.pincode}</p>
            <p><b>Description:</b> {job.description}</p>
            <p><b>Contact:</b> {job.contactName} | {job.contactPhone} | {job.contactEmail}</p>
          </div>
        ))
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
}

export default JobsPosted;
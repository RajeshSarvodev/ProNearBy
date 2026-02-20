// src/pages/ApproveProfession.js
import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

function ApproveProfession() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProfessionals = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "professionals"));
      const pros = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProfessionals(pros);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const handleApprove = async (id) => {
    await updateDoc(doc(db, "professionals", id), { approved: true });
    fetchProfessionals();
  };

  const handleDeny = async (id) => {
    await deleteDoc(doc(db, "professionals", id));
    fetchProfessionals();
  };

  const handleUpdate = async (id, field, value) => {
    await updateDoc(doc(db, "professionals", id), { [field]: value });
    fetchProfessionals();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this professional?")) return;
    await deleteDoc(doc(db, "professionals", id));
    fetchProfessionals();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Professionals</h1>
      {loading && <p>Loading...</p>}
      {professionals.length === 0 && <p>No professionals found.</p>}

      {professionals.map(pro => (
        <div key={pro.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <strong>ID:</strong> {pro.id}<br />
          <input
            type="text"
            value={pro.firstName}
            onChange={(e) => handleUpdate(pro.id, "firstName", e.target.value)}
            placeholder="First Name"
          />
          <input
            type="text"
            value={pro.lastName}
            onChange={(e) => handleUpdate(pro.id, "lastName", e.target.value)}
            placeholder="Last Name"
          />
          <br />
          Profession:
          <input
            type="text"
            value={pro.professionType}
            onChange={(e) => handleUpdate(pro.id, "professionType", e.target.value)}
            placeholder="Profession"
          />
          <input
            type="text"
            value={pro.professionSpec}
            onChange={(e) => handleUpdate(pro.id, "professionSpec", e.target.value)}
            placeholder="Specialization"
          />
          <br />
          Company:
          <input
            type="text"
            value={pro.companyName || ""}
            onChange={(e) => handleUpdate(pro.id, "companyName", e.target.value)}
            placeholder="Company Name"
          />
          <br />
          Location: {pro.location?.city}, {pro.location?.state} – {pro.location?.pincode}
          <br />
          Approved: {pro.approved ? "Yes" : "No"}
          <br />

          {!pro.approved && (
            <>
              <button onClick={() => handleApprove(pro.id)} style={{ marginRight: "5px", backgroundColor: "green", color: "white" }}>Approve</button>
              <button onClick={() => handleDeny(pro.id)} style={{ backgroundColor: "red", color: "white" }}>Deny</button>
            </>
          )}
          {pro.approved && (
            <button onClick={() => handleDelete(pro.id)} style={{ backgroundColor: "red", color: "white" }}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default ApproveProfession;

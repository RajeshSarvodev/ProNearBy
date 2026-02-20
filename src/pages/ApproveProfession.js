import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

function ApproveProfession() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all professionals
  const fetchProfessionals = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "professionals"));
      const pros = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setProfessionals(pros);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  // Handle local input change (NO firestore update here)
  const handleChange = (id, field, value) => {
    setProfessionals((prev) =>
      prev.map((pro) =>
        pro.id === id ? { ...pro, [field]: value } : pro
      )
    );
  };

  // Save changes to Firestore
  const handleSave = async (id, proData) => {
    try {
      await updateDoc(doc(db, "professionals", id), {
        firstName: proData.firstName,
        lastName: proData.lastName,
        professionType: proData.professionType,
        professionSpec: proData.professionSpec,
        companyName: proData.companyName || "",
      });
      alert("Updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  const handleApprove = async (id) => {
    await updateDoc(doc(db, "professionals", id), { approved: true });
    fetchProfessionals();
  };

  const handleDeny = async (id) => {
    if (!window.confirm("Are you sure you want to deny?")) return;
    await deleteDoc(doc(db, "professionals", id));
    fetchProfessionals();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    await deleteDoc(doc(db, "professionals", id));
    fetchProfessionals();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Professionals</h1>

      {loading && <p>Loading...</p>}
      {professionals.length === 0 && !loading && (
        <p>No professionals found.</p>
      )}

      {professionals.map((pro) => (
        <div
          key={pro.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <input
            type="text"
            value={pro.firstName || ""}
            onChange={(e) =>
              handleChange(pro.id, "firstName", e.target.value)
            }
            placeholder="First Name"
          />

          <input
            type="text"
            value={pro.lastName || ""}
            onChange={(e) =>
              handleChange(pro.id, "lastName", e.target.value)
            }
            placeholder="Last Name"
          />

          <br />

          <input
            type="text"
            value={pro.professionType || ""}
            onChange={(e) =>
              handleChange(pro.id, "professionType", e.target.value)
            }
            placeholder="Profession"
          />

          <input
            type="text"
            value={pro.professionSpec || ""}
            onChange={(e) =>
              handleChange(pro.id, "professionSpec", e.target.value)
            }
            placeholder="Specialization"
          />

          <br />

          <input
            type="text"
            value={pro.companyName || ""}
            onChange={(e) =>
              handleChange(pro.id, "companyName", e.target.value)
            }
            placeholder="Company Name"
          />

          <p>
            Location: {pro.location?.city}, {pro.location?.state} –{" "}
            {pro.location?.pincode}
          </p>

          <p>
            Status:{" "}
            <strong>
              {pro.approved ? "Approved ✅" : "Pending ⏳"}
            </strong>
          </p>

          {/* ACTION BUTTONS */}

          {!pro.approved && (
            <>
              <button
                onClick={() => handleApprove(pro.id)}
                style={{ marginRight: "5px", background: "green", color: "white" }}
              >
                Approve
              </button>

              <button
                onClick={() => handleDeny(pro.id)}
                style={{ background: "red", color: "white" }}
              >
                Deny
              </button>
            </>
          )}

          {pro.approved && (
            <button
              onClick={() => handleDelete(pro.id)}
              style={{ background: "red", color: "white" }}
            >
              Delete
            </button>
          )}

          <button
            onClick={() => handleSave(pro.id, pro)}
            style={{ marginLeft: "10px" }}
          >
            Save Changes
          </button>
        </div>
      ))}
    </div>
  );
}

export default ApproveProfession;
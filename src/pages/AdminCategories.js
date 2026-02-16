// src/pages/AdminCategories.js
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { db, auth, storage } from "../firebase";
import { signOut } from "firebase/auth";

function AdminCategories() {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, "categories"));
    setCategories(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Enter a title");
    if (!imageFile) return alert("Select an image");
    const storageRef = ref(storage, `categories/${Date.now()}-${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(storageRef);
    await addDoc(collection(db, "categories"), { title, imageUrl });
    setTitle("");
    setImageFile(null);
    fetchCategories();
  };

  // Delete Category
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "categories", id));
    fetchCategories();
  };

  // Update Category Title
  const handleUpdateTitle = async (id, newTitle) => {
    if (!newTitle.trim()) return;
    await updateDoc(doc(db, "categories", id), { title: newTitle });
    fetchCategories();
  };

  // Sign Out
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  // Back navigation
  const handleBack = () => {
    window.history.back();
  };

  return (
    <>
      {/* Header with Logo & Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>
          <a href="/" style={{ textDecoration: "none", color: "#333" }}>ProNearBy</a>
        </h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleBack} style={{ padding: "8px 16px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Back</button>
          <a
            href="/view-messages"
            style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white", borderRadius: "4px", textDecoration: "none" }}
          >
            View User Messages
          </a>
          <button onClick={handleLogout} style={{ padding: "6px 12px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", fontSize: "14px", cursor: "pointer" }}>Logout</button>
        </div>
      </div>

      {/* Add Category Form */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Add Profession</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Profession Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", flex: "1 1 200px" }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
            style={{ flex: "1 1 200px" }}
          />
          <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Add Profession</button>
        </form>
      </section>

      {/* List Existing Categories */}
      <section>
        <h2>Existing Professions</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {categories.length === 0 ? (
            <p>No categories added yet.</p>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} style={{ width: "250px", border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                <img src={cat.imageUrl} alt={cat.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                <div style={{ padding: "10px" }}>
                  {/* Editable title */}
                  <input
                    type="text"
                    defaultValue={cat.title}
                    onBlur={(e) => handleUpdateTitle(cat.id, e.target.value)}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(cat.id)}
                    style={{ marginTop: "10px", padding: "6px 12px", backgroundColor: "red", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}

export default AdminCategories;
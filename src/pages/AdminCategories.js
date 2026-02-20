// src/pages/AdminCategories.js
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

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
  const handleDeleteCategory = async (id) => {
    await deleteDoc(doc(db, "categories", id));
    fetchCategories();
  };

  // Update Category Title
  const handleUpdateTitle = async (id, newTitle) => {
    if (!newTitle.trim()) return;
    await updateDoc(doc(db, "categories", id), { title: newTitle });
    fetchCategories();
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>ProNearBy Admin</h1>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/view-messages")}>View User Messages</button>
        <button onClick={() => navigate("/approve-profession")}>Approve Professionals</button>
        <button onClick={handleLogout} style={{ backgroundColor: "red", color: "white" }}>Logout</button>
      </div>

      {/* Add Category */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Add Profession Category</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Profession Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
          />
          <button type="submit">Add Category</button>
        </form>
      </section>

      {/* Existing Categories */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Existing Categories</h2>
        {categories.length === 0 ? (
          <p>No categories yet.</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
              <img src={cat.imageUrl} alt={cat.title} style={{ width: "150px", height: "100px", objectFit: "cover" }} />
              <input
                type="text"
                defaultValue={cat.title}
                onBlur={(e) => handleUpdateTitle(cat.id, e.target.value)}
              />
              <button onClick={() => handleDeleteCategory(cat.id)} style={{ marginLeft: "10px" }}>Delete</button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default AdminCategories;

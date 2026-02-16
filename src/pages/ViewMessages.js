import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function ViewMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const snapshot = await getDocs(collection(db, "contactMessages"));
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort newest first
      setMessages(msgs.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch messages");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteDoc(doc(db, "contactMessages", id));
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete message");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/home");
  };

  if (loading) return <p>Loading messages...</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "50px auto", padding: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <button onClick={() => navigate("/admin-categories")}>Back to Admin Dashboard</button>
        <button onClick={handleLogout} style={{ backgroundColor: "red", color: "white" }}>Logout</button>
      </div>

      <h2>User Messages</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {messages.length === 0 ? <p>No messages yet.</p> : (
        messages.map(msg => (
          <div key={msg.id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "15px", borderRadius: "6px" }}>
            <p><strong>Name:</strong> {msg.name}</p>
            <p><strong>Email:</strong> {msg.email}</p>
            <p><strong>Message:</strong> {msg.message}</p>
            <p><small>Received at: {msg.createdAt?.toDate().toLocaleString() || "N/A"}</small></p>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={() => handleDelete(msg.id)} style={{ backgroundColor: "red", color: "white" }}>Delete</button>
              <a href={`mailto:${msg.email}?subject=Re:%20Your%20message%20to%20ProNearBy&body=Hi%20${msg.name},%0D%0A%0D%0A`}>
                <button style={{ backgroundColor: "#007bff", color: "white" }}>Reply via Email</button>
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewMessages;

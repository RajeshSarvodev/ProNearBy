import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase";

// Optional: For email reply functionality, you can use EmailJS or similar.
// For simplicity, here we use mailto: for quick replies.

function ViewMessages() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [replyTexts, setReplyTexts] = useState({}); // Store reply text per message

  // Fetch messages
  const fetchMessages = async () => {
    const snapshot = await getDocs(collection(db, "messages"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Delete message
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteDoc(doc(db, "messages", id));
      fetchMessages();
    }
  };

  // Mark as read
  const markAsRead = async (id, currentStatus) => {
    if (currentStatus === "read") return;
    await updateDoc(doc(db, "messages", id), { status: "read" });
    fetchMessages();
  };

  // Handle reply input change
  const handleReplyChange = (id, value) => {
    setReplyTexts(prev => ({ ...prev, [id]: value }));
  };

  // Send email reply (using mailto: for demonstration)
  const handleSendReply = (email, name, replyText, messageId) => {
    if (!replyText || replyText.trim() === "") {
      alert("Please type a reply message");
      return;
    }

    // Using mailto: (you can replace this with EmailJS or backend email API)
    const subject = encodeURIComponent("Reply to your message");
    const body = encodeURIComponent(
      `Hello ${name},\n\n${replyText}\n\nBest regards,\nAdmin`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

    // Optionally, save the reply in Firestore or mark message as replied
    // For now, clear the reply box after sending
    setReplyTexts(prev => ({ ...prev, [messageId]: "" }));
  };

  // Filter messages
  const filteredMessages = messages.filter(msg =>
    msg.name?.toLowerCase().includes(search.toLowerCase()) ||
    msg.email?.toLowerCase().includes(search.toLowerCase()) ||
    msg.message?.toLowerCase().includes(search.toLowerCase())
  );

  // Export CSV
  const exportCSV = () => {
    const csvHeader = "Name,Email,Contact No,Message,Date\n";
    const csvRows = messages.map(m =>
      `"${m.name}","${m.email}","${m.contactno}","${m.message}","${new Date(m.timestamp?.seconds * 1000).toLocaleString()}"`
    );
    const csv = csvHeader + csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "messages.csv";
    a.click();
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        style={{
          padding: "8px 16px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          marginBottom: "20px"
        }}
      >
        Back
      </button>

      <h2>User Messages</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email or message..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          width: "100%",
          marginBottom: "10px",
          borderRadius: "4px",
          border: "1px solid #ccc"
        }}
      />

      {/* Export Button */}
      <button
        onClick={exportCSV}
        style={{
          padding: "8px 12px",
          marginBottom: "15px",
          background: "#333",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginRight: "10px"
        }}
      >
        Export Messages
      </button>

      {/* Messages Table */}
      {filteredMessages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Contact No</th>
              <th style={th}>Message</th>
              <th style={th}>Date</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map((msg) => (
              <tr
                key={msg.id}
                onClick={() => markAsRead(msg.id, msg.status)}
                style={{
                  background: msg.status === "unread" ? "#f5f5f5" : "white",
                  fontWeight: msg.status === "unread" ? "bold" : "normal",
                  cursor: "pointer"
                }}
              >
                <td style={td}>{msg.name}</td>
                <td style={td}>{msg.email}</td>
                <td style={td}>{msg.contactno}</td>
                <td style={td}>{msg.message}</td>
                <td style={td}>{new Date(msg.timestamp?.seconds * 1000).toLocaleString()}</td>
                <td style={td}>{msg.status || "unread"}</td>
                <td style={td} onClick={(e) => e.stopPropagation()}>
                  {/* Reply Section */}
                  <div style={{ marginBottom: "8px" }}>
                    <textarea
                      placeholder="Type reply..."
                      rows={3}
                      style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
                      value={replyTexts[msg.id] || ""}
                      onChange={(e) => handleReplyChange(msg.id, e.target.value)}
                    />
                    <button
                      onClick={() => handleSendReply(msg.email, msg.name, replyTexts[msg.id], msg.id)}
                      style={{
                        marginTop: "4px",
                        padding: "4px 8px",
                        background: "blue",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Send Reply
                    </button>
                  </div>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(msg.id)}
                    style={{
                      padding: "4px 8px",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Styles
const th = {
  border: "1px solid #ccc",
  padding: "8px",
  background: "#eee"
};

const td = {
  border: "1px solid #ccc",
  padding: "8px"
};

export default ViewMessages;
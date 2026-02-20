import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      // Email must be verified
      if (!user.emailVerified) {
        await signOut(auth);
        setError("Please verify your admin email first.");
        return;
      }

      // Hard-coded admin check
      if (user.email !== "admin@pronearby.com") {
        await signOut(auth);
        setError("Access denied. Not an admin.");
        return;
      }

      navigate("/admin-categories");
    } catch (err) {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div style={box}>
      <h2>Admin Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="email"
        placeholder="Admin Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={input}
      />

      <input
        type="password"
        placeholder="Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={input}
      />

      <button onClick={handleLogin} style={btn}>
        Login
      </button>
    </div>
  );
}

const box = {
  maxWidth: "400px",
  margin: "60px auto",
  padding: "25px",
  border: "1px solid #ccc",
  borderRadius: "8px"
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px"
};

const btn = {
  width: "100%",
  padding: "10px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  cursor: "pointer"
};

export default AdminLogin;

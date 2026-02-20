import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const ADMIN_EMAILS = ["admin@pronearby.com", "rjindian9@gmail.com"];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Admin shortcut: bypass Firestore role check
      if (ADMIN_EMAILS.includes(user.email)) {
        navigate("/admin-dashboard");
        return;
      }

      // Check email verification for normal users
      if (!user.emailVerified) {
        await signOut(auth);
        setError("Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      // Fetch role from Firestore
      const snap = await getDoc(doc(db, "users", user.uid));
      const role = snap.exists() ? snap.data().role : "user";

      if (role === "professional") {
        navigate("/jobs-posted");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>

        {error && <p className="error-box">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Don't have an account? <Link to="/register">Register Here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

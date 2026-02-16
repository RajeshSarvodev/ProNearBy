import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        setError("Please verify your email before logging in.");
        setLoading(false);
        return;
      }
      navigate("/home");
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError("Invalid email or password.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    const emailPrompt = prompt("Enter your email to reset password:");
    if (emailPrompt) {
      import("../firebase").then(({ auth }) => {
        import("firebase/auth").then(({ sendPasswordResetEmail }) => {
          sendPasswordResetEmail(auth, emailPrompt)
            .then(() => {
              alert("Reset link sent! Check your email.");
            })
            .catch(() => {
              alert("Failed to send reset email. Check the email and try again.");
            });
        });
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <p className="error-box">{error}</p>}
        {message && <p className="success-box">{message}</p>}

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
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password Button */}
        <div className="forgot-container">
          <button className="forgot-btn" onClick={handleForgotPassword}>
            Forgot Password?
          </button>
        </div>

        {/* Register Link */}
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Don't have an account? <Link to="/register">Register Here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // 🔴 Basic validation
    if (
      !firstName ||
      !lastName ||
      !mobile ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      setLoading(true);

      // Check if email already exists
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setError("Email already exists. Please login.");
        setLoading(false);
        return;
      }

      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send verification email
      await sendEmailVerification(userCredential.user);

      // Admin emails
      const adminEmails = ["admin@pronearby.com", "rjindian9@gmail.com"];
      const role = adminEmails.includes(email) ? "admin" : "user";

      // Save profile to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName,
        lastName,
        phone: `${countryCode}${mobile}`,
        email,
        role,
        createdAt: serverTimestamp(),
      });

      alert(
        "Account created successfully! Please verify your email before logging in."
      );

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message.replace("Firebase:", "").trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleRegister}>
        <h2>Create Account</h2>
        <p className="subtitle">Join ProNearBy</p>

        {error && <div className="error-box">{error}</div>}

        {/* Name */}
        <div className="row">
          <input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="row">
          <input
            className="country"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          />
          <input
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="password-box">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? "🙈" : "👁️"}
          </span>
        </div>

        <button disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;

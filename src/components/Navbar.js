// src/components/Navbar.js
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Navbar() {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [role, setRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // for mobile toggle

  const ADMIN_EMAILS = ["admin@pronearby.com", "rjindian9@gmail.com"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const snap = await getDoc(doc(db, "users", currentUser.uid));
          if (snap.exists()) {
            setFirstName(snap.data().firstName || "");
            setRole(snap.data().role || "user");
          }
        } catch (err) {
          console.error("Navbar Firestore error:", err);
        }
      } else {
        setFirstName("");
        setRole("");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            ProNearBy
          </Link>
        </h1>

        {/* Hamburger icon for mobile */}
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          &#9776;
        </div>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/find-professionals" onClick={() => setMenuOpen(false)}>Find Professionals</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link to="/post-job" onClick={() => setMenuOpen(false)}>Post Job</Link>
          <Link to="/jobs" onClick={() => setMenuOpen(false)}>Jobs Posted</Link>
          <Link to="/register-professional" onClick={() => setMenuOpen(false)}>Register as Professional</Link>

          {!user ? (
            <>
              <Link to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          ) : (
            <>
              <span style={{ color: "white", fontWeight: 600 }}>
                Hi {firstName || user.email}
              </span>
              {ADMIN_EMAILS.includes(user.email) && user.emailVerified && (
                <Link to="/admin-dashboard" className="btn-admin" onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

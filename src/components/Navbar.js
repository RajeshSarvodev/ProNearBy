import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (err) {
      console.error(err);
      alert("Error logging out.");
    }
  };

  return (
    <nav className="navbar">
      
      <h1 style={{ margin: 0 }}>
  <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>ProNearBy</Link>
</h1>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/post-job">Post Job</Link>
        <Link to="/find-professionals">Find Professionals</Link>
        {/* Add the Jobs link */}
        <Link to="/jobs">Jobs Posted</Link>
        <Link to="/contact">Contact</Link>
        {/* Always show Register as Professional */}
        <Link to="/register-professional" className="btn-register-professional">Register as Professional</Link>

        {!user ? (
          <>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </>
        ) : (
          <>
            <span style={{ color: "white", fontWeight: "600", marginRight: "10px" }}>
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#ffd700",
                border: "none",
                padding: "6px 14px",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function ProtectedRoute({ children }) {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (checking) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Checking authentication...
      </p>
    );
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but NOT verified
  if (!user.emailVerified) {
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in + verified
  return children;
}

export default ProtectedRoute;

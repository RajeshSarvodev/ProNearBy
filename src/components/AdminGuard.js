// src/components/AdminGuard.js
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

function AdminGuard({ children }) {
  const [status, setStatus] = useState("checking"); 
  // checking | allowed | denied

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // ❌ Not logged in
      if (!user) {
        setStatus("denied");
        return;
      }

      // ❌ Email not verified
      if (!user.emailVerified) {
        setStatus("denied");
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (!snap.exists()) {
          setStatus("denied");
          return;
        }

        const role = snap.data().role;

        // ✅ Only admins allowed
        if (role === "admin") {
          setStatus("allowed");
        } else {
          setStatus("denied");
        }
      } catch (err) {
        console.error("AdminGuard error:", err);
        setStatus("denied");
      }
    });

    return () => unsubscribe();
  }, []);

  if (status === "checking") {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Checking admin access...
      </p>
    );
  }

  if (status === "denied") {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default AdminGuard;

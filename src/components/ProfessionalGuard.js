// src/components/ProfessionalGuard.js
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";

function ProfessionalGuard({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const checkProfessional = async () => {
      const user = auth.currentUser;
      if (!user) {
        setAllowed(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && snap.data().role === "professional") {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    };

    checkProfessional();
  }, []);

  if (allowed === null) return <p>Checking access...</p>;
  if (!allowed) return <Navigate to="/login" />;

  return children;
}

export default ProfessionalGuard;

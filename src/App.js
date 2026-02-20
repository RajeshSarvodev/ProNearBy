// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import FindProfessionals from "./pages/FindProfessionals";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

import PostJob from "./pages/PostJob";
import RegisterProfessional from "./pages/RegisterProfessional";
import JobsPosted from "./pages/JobsPosted";

import AdminCategories from "./pages/AdminCategories";
import AdminProfessionals from "./pages/AdminProfessionals";
import ViewMessages from "./pages/ViewMessages";
import ApproveProfession from "./pages/ApproveProfession"; // ✅ new page

import "./App.css";

// Hard-coded admin emails
const ADMIN_EMAILS = [
  "admin@pronearby.com",
  "rjindian9@gmail.com",
];

function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  if (!authReady) return <div style={{ padding: 30 }}>Loading...</div>;

  const isLoggedIn = !!user;
  const isVerified = user?.emailVerified;
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/find-professionals" element={<FindProfessionals />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* VERIFIED USERS ONLY */}
        <Route
          path="/post-job"
          element={isLoggedIn && isVerified ? <PostJob /> : <Navigate to="/login" />}
        />
        <Route
          path="/register-professional"
          element={isLoggedIn && isVerified ? <RegisterProfessional /> : <Navigate to="/login" />}
        />
        <Route
          path="/jobs-posted"
          element={isLoggedIn && isVerified ? <JobsPosted /> : <Navigate to="/login" />}
        />

        {/* ADMIN ONLY */}
        <Route
          path="/admin-categories"
          element={isAdmin ? <AdminCategories /> : <Navigate to="/" />}
        />
        <Route
          path="/admin-professionals"
          element={isAdmin ? <AdminProfessionals /> : <Navigate to="/" />}
        />
        <Route
          path="/view-messages"
          element={isAdmin ? <ViewMessages /> : <Navigate to="/" />}
        />

        {/* NEW PAGE: Approve Professionals */}
        <Route
          path="/approve-profession"
          element={isAdmin ? <ApproveProfession /> : <Navigate to="/" />}
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

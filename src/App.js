// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import PostJob from "./pages/PostJob";
import FindProfessionals from "./pages/FindProfessionals";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobsPosted from "./pages/JobsPosted";
import AdminCategories from "./pages/AdminCategories";
import Contact from "./pages/Contact";
import ResetPassword from "./pages/ResetPassword";
import RegisterProfessional from "./pages/RegisterProfessional";
import ViewMessages from "./pages/ViewMessages";
import AdminLogin from "./pages/AdminLogin";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />

      <div className="home-container">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/find-professionals" element={<FindProfessionals />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* USER PROTECTED ROUTES */}
          <Route
            path="/post-job"
            element={
              <ProtectedRoute>
                <PostJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobsPosted />
              </ProtectedRoute>
            }
          />

          <Route
            path="/register-professional"
            element={
              <ProtectedRoute>
                <RegisterProfessional />
              </ProtectedRoute>
            }
          />

          {/* ADMIN PROTECTED ROUTES */}
          <Route
            path="/admin-categories"
            element={
              <ProtectedRoute>
                <AdminCategories />
              </ProtectedRoute>
            }
          />

          <Route
            path="/view-messages"
            element={
              <ProtectedRoute>
                <ViewMessages />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

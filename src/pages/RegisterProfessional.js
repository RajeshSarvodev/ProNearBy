import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import services from "../data/services";

function RegisterProfessional() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    professionType: "",
    professionSpec: "",
    companyName: "", // ✅ Added
    city: "",
    state: "",
    area: "",
    street: "",
    plotNo: "",
    pincode: "",
    experienceYears: "",
    experienceMonths: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const requiredFields = [
      "firstName",
      "lastName",
      "gender",
      "professionType",
      "professionSpec",
      "city",
      "state",
      "pincode",
      "experienceYears",
      "experienceMonths",
    ];

    for (let field of requiredFields) {
      if (!form[field]) {
        setError("Please fill all required fields.");
        return;
      }
    }

    setLoading(true);

    try {
      const searchKeywords = [
        form.firstName,
        form.lastName,
        form.professionType,
        form.professionSpec,
        form.city,
        form.state,
      ].map((v) => v.toLowerCase());

      await addDoc(collection(db, "professionals"), {
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
        professionType: form.professionType,
        professionSpec: form.professionSpec,
        companyName: form.companyName, // ✅ Saved to Firestore
        location: {
          street: form.street,
          area: form.area,
          city: form.city,
          state: form.state,
          plotNo: form.plotNo,
          pincode: form.pincode,
        },
        experience: {
          years: Number(form.experienceYears),
          months: Number(form.experienceMonths),
        },
        approved: false, // 🔒 admin approval required
        searchKeywords,
        createdAt: serverTimestamp(),
      });

      setSuccess(
        "Registration successful ! Your profile will appear after admin approval with 24 Hrs."
      );

      setForm({
        firstName: "",
        lastName: "",
        gender: "",
        professionType: "",
        professionSpec: "",
        companyName: "",
        city: "",
        state: "",
        area: "",
        street: "",
        plotNo: "",
        pincode: "",
        experienceYears: "",
        experienceMonths: "",
      });
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Professional Registration</h2>
        <p className="subtitle">
          Register your professional profile to appear in search results.
        </p>

        {error && <p className="error-box">{error}</p>}
        {success && <p className="success-box">{success}</p>}

        <form onSubmit={handleRegister}>
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
          />

          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <select
            name="professionType"
            value={form.professionType}
            onChange={handleChange}
          >
            <option value="">Select Profession</option>
            {services.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            name="professionSpec"
            placeholder="Specialization (e.g. Heart Surgeon, AC Repair)"
            value={form.professionSpec}
            onChange={handleChange}
          />

          <input
            name="companyName" // ✅ Fixed input
            placeholder="Company Name / NA if not available"
            value={form.companyName}
            onChange={handleChange}
          />

          <input
            name="street"
            placeholder="Street"
            value={form.street}
            onChange={handleChange}
          />
          <input
            name="area"
            placeholder="Area"
            value={form.area}
            onChange={handleChange}
          />
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />
          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
          />
          <input
            name="plotNo"
            placeholder="House / Plot No"
            value={form.plotNo}
            onChange={handleChange}
          />
          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
          />

          <input
            name="experienceYears"
            type="number"
            placeholder="Experience (Years)"
            value={form.experienceYears}
            onChange={handleChange}
          />
          <input
            name="experienceMonths"
            type="number"
            placeholder="Experience (Months)"
            value={form.experienceMonths}
            onChange={handleChange}
          />

          <button disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterProfessional;

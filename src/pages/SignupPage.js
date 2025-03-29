import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useToast } from "../context/ToastContext";
import axios from "axios";
import "../styles.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User detected, redirecting to dashboard...");
        navigate("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return showError("Passwords do not match.");
    }

    setLoading(true);

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      console.log("User created:", user.uid);

      // Update Firebase Profile
      await updateProfile(user, { displayName: formData.name });

      console.log("Registering user with backend:", {
        uid: user.uid,
        name: formData.name,
        email: user.email,
      });

      // Register user in the backend
      await axios.post(
        "http://localhost:5050/api/auth/register",
        {
          uid: user.uid,
          name: formData.name,
          email: user.email,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      showSuccess("Account created successfully!");

      // Wait for Firebase Auth state to update before redirecting
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          console.log("Auth state updated, navigating to dashboard...");
          navigate("/dashboard");
        }
      });

    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      showError(error.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form card">
        <h2>Create Account</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <p className="info">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
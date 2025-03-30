import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import TeamPage from "./pages/TeamPanel";
import FormBuilderPage from "./pages/FormBuilderPage";
import FormResponsesPage from "./pages/FormResponsesPage";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { getCookie, setCookie } from "./utils/cookies";
import FillForm from "./pages/FillForm";
import ViewResponses from "./pages/ViewResponses";
import axios from "./api/axios";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(getCookie("theme") || "light");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("User detected:", firebaseUser);
        
        await new Promise(resolve => setTimeout(resolve, 1000)); 
  
        try {
          const response = await axios.post("/api/auth/me", {
            email: firebaseUser.email,
          });
          setUser(response.data);
          localStorage.setItem("userEmail", firebaseUser.email);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.warn("User not found in the database. Redirecting...");
            setUser(null);
          } else {
            console.error("Error fetching user data:", error);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setCookie("theme", newTheme, 365);
  };

  if (loading) return <Loader />;

  return (
    <ThemeProvider value={{ theme, toggleTheme }}>
      <ToastProvider>
        <Router>
          <Navbar user={user} />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={!user ? <LoginPage /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/signup"
              element={!user ? <SignupPage /> : <Navigate to="/dashboard" />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/team/:teamId" element={<TeamPage />} />
            <Route path="/form-builder/:teamId" element={<FormBuilderPage />} />
            <Route
              path="/form-responses/:formId"
              element={<FormResponsesPage />}
            />
            <Route path="/fill-form/:formId" element={<FillForm />} />

            <Route path="/view-responses/:formId" element={<ViewResponses />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <ToastContainer />
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

const PrivateRoute = ({ children, user }) => {
  if (!user) {
    console.log("Redirecting to login...");
    return <Navigate to="/login" />;
  }

  return children;
};

export default App;

// frontend/src/pages/LandingPage.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdArrowDownward } from 'react-icons/md';
import '../styles.css';

const LandingPage = () => {
  useEffect(() => {
    document.title = 'TeamFlow - Collaborative Team Management';
  }, []);

  return (
    <div className="landing-page">
      <header className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Manage Your Team with Ease</h1>
          <p>Effortlessly create teams, build custom forms, and track progress</p>
          <div className="cta-buttons">
            <Link to="/signup" className="primary-btn">
              Get Started
            </Link>
            <Link to="/login" className="secondary-btn">
              Login
            </Link>
          </div>
        </motion.div>
        <motion.div 
          className="scroll-down"
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <MdArrowDownward size={32} />
        </motion.div>
      </header>

      <section className="features-section">
        <div className="feature-card">
          <h3>Dynamic Forms</h3>
          <p>Create custom forms with multiple input types</p>
        </div>
        <div className="feature-card">
          <h3>Team Management</h3>
          <p>Invite members and manage permissions</p>
        </div>
        <div className="feature-card">
          <h3>Progress Tracking</h3>
          <p>Monitor team progress through form responses</p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2024 TeamFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
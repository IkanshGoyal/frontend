// frontend/src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import '../styles.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className="home-link">
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
// frontend/src/components/Loader.jsx
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <motion.div 
      className="loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      Loading...
    </motion.div>
  );
};

export default Loader;
// context/ToastContext.jsx
import { createContext, useContext } from 'react';
import { toast } from 'react-toastify';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const showSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
      throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
  };
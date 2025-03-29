import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useToast } from "../context/ToastContext";
import { FaTrash, FaEye, FaPen } from "react-icons/fa";


const Forms = ({ teamId, email }) => {
  const [forms, setForms] = useState([]);
  const { showError, showSuccess } = useToast();


  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get(`/api/forms/${teamId}`);
      setForms(response.data.forms);
    } catch (error) {
      showError("Failed to load forms");
    }
  };

  const deleteForm = async (formId) => {
    try {
      await axios.delete(`/api/forms/${formId}/delete`);
      showSuccess("Form deleted successfully");
      setForms(forms.filter((form) => form._id !== formId));
    } catch (error) {
      showError("Failed to delete form");
    }
  };

  const handleFillForm = (formId) => {
    window.location.href = `/fill-form/${formId}`;
  };

  const handleViewResponses = (formId) => {
    window.location.href = `/view-responses/${formId}`;
  };

  return (
    <div className="forms-container">
      <h2 className="forms-title">Forms</h2>
      <div className="forms-list">
        {forms.length === 0 ? (
          <p>No forms available</p>
        ) : (
          forms.map((form) => (
            <div key={form._id} className="form-card">
              <span className="form-title">{form.title}</span>
              <div className="form-actions">
                <FaPen className="icon" onClick={() => handleFillForm(form._id)} />
                {form.email === email && (
                  <>
                    <FaEye className="icon" onClick={() => handleViewResponses(form._id)} />
                    <FaTrash className="icon delete" onClick={() => deleteForm(form._id)} />
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Forms;

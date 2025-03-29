import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { useToast } from "../context/ToastContext";

const FillForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const { showError, showSuccess } = useToast();
  const [user, setUser] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchForm();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) return;

        const response = await axios.post("/api/auth/me", { email });
        localStorage.setItem("userId", response.data._id); 
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserId();
  }, []);

  const fetchForm = async () => {
    try {
      const response = await axios.get(`/api/forms/fetch/${formId}`);
      setForm(response.data.forms[0]);
    } catch (error) {
      showError("Error fetching form");
    }
  };

  const handleChange = (fieldId, value) => {
    setAnswers({ ...answers, [fieldId]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/responses/submit", {
        form: formId,
        user: userId,
        answers: Object.keys(answers).map((key) => ({
          fieldId: key,
          response: answers[key],
        })),
      });
      showSuccess("Form submitted successfully!");
    } catch (error) {
      showError("Failed to submit form");
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <h2>{form.title}</h2>
      {form.fields.map((field) => (
        <div key={field._id} className="field-container">
          <label>{field.label}</label>
          {field.type === "text" || field.type === "date" ? (
            <input
              type={field.type}
              onChange={(e) => handleChange(field._id, e.target.value)}
            />
          ) : (
            field.options.map((option, index) => (
              <div key={index}>
                <input
                  type={field.type}
                  name={field._id}
                  value={option}
                  onChange={(e) => handleChange(field._id, e.target.value)}
                />
                <label>{option}</label>
              </div>
            ))
          )}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default FillForm;
// frontend/src/pages/FormResponsesPage.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { MdDownload } from 'react-icons/md';
import { useToast } from '../context/ToastContext';
import '../styles.css';

const FormResponsesPage = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const { showError } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formResponse, responsesResponse] = await Promise.all([
          axios.get(`/forms/${formId}`),
          axios.get(`/forms/${formId}/responses`)
        ]);
        setForm(formResponse.data);
        setResponses(responsesResponse.data);
      } catch (error) {
        showError('Failed to load responses');
      }
    };
    fetchData();
  }, [formId, showError]);

  return (
    <div className="responses-page">
      <h1>{form?.title} Responses</h1>
      <button className="export-btn">
        <MdDownload /> Export Data
      </button>
      <div className="responses-grid">
        {responses.map(response => (
          <div key={response._id} className="response-card">
            <p>User: {response.user.name}</p>
            <p>Submitted: {new Date(response.submittedAt).toLocaleString()}</p>
            <div className="response-data">
              {Object.entries(response.data).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {value.toString()}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormResponsesPage;
// pages/FormBuilderPage.jsx
import { useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md'; 
import axios from '../api/axios';
import { useToast } from '../context/ToastContext';
import '../styles.css';

const FormBuilderPage = () => {
  const { teamId } = useParams();
  const [formFields, setFormFields] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleAddField = (type) => {
    setFormFields([...formFields, {
      type,
      label: '',
      required: false,
      options: []
    }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/forms', {
        title: formTitle,
        teamId,
        schema: formFields
      });
      showSuccess('Form created successfully');
      navigate(`/team/${teamId}`);
    } catch (error) {
      showError('Failed to create form');
    }
  };

  return (
    <div className="form-builder-container">
      <h1>Create Form</h1>
      <div className="form-header">
        <input 
          type="text"
          placeholder="Form title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="form-title-input"
        />
        <div className="field-buttons">
          <button onClick={() => handleAddField('text')}>
            Text Field
          </button>
          <button onClick={() => handleAddField('checkbox')}>
            Checkbox
          </button>
          <button onClick={() => handleAddField('radio')}>
            Radio
          </button>
          <button onClick={() => handleAddField('select')}>
            Dropdown
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-preview">
        {formFields.map((field, index) => (
          <div key={index} className="form-field">
            <input 
              type="text"
              placeholder="Field label"
              value={field.label}
              onChange={(e) => {
                const newFields = [...formFields];
                newFields[index].label = e.target.value;
                setFormFields(newFields);
              }}
            />
            {field.type === 'select' && (
              <div className="options-container">
                {field.options.map((option, i) => (
                  <div key={i} className="option-item">
                    <input 
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...field.options];
                        newOptions[i] = e.target.value;
                        const newFields = [...formFields];
                        newFields[index].options = newOptions;
                        setFormFields(newFields);
                      }}
                    />
                    <MdDelete 
                      onClick={() => {
                        const newOptions = field.options.filter((_, idx) => idx !== i);
                        const newFields = [...formFields];
                        newFields[index].options = newOptions;
                        setFormFields(newFields);
                      }}
                    />
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={() => {
                    const newFields = [...formFields];
                    newFields[index].options.push('');
                    setFormFields(newFields);
                  }}
                >
                  Add Option
                </button>
              </div>
            )}
          </div>
        ))}
        <button type="submit" className="submit-btn">
          Save Form
        </button>
      </form>
    </div>
  );
};

export default FormBuilderPage;
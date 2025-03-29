import { useState } from "react";
import axios from "../api/axios";
import { useToast } from "../context/ToastContext";

const NewForm = ({ teamId, email }) => {
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState([]);
  const { showError, showSuccess } = useToast();

  const addField = () => {
    setFields([...fields, { label: "", type: "text", options: [] }]);
  };

  const updateField = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    if (key === "type" && ["radio", "checkbox", "select"].includes(value)) {
      updatedFields[index].options = [""];
    }
    setFields(updatedFields);
  };

  const updateOption = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setFields(updatedFields);
  };

  const addOption = (fieldIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options.push("");
    setFields(updatedFields);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || fields.length === 0) {
      showError("Title and at least one field are required");
      return;
    }
    try {
      await axios.post("/api/forms/create", { teamId, title, email, fields });
      showSuccess("Form created successfully!");
      setTitle("");
      setFields([]);
    } catch (error) {
      showError("Failed to create form");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create New Form</h2>
      <input
        type="text"
        className="input-field"
        placeholder="Form Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {fields.map((field, index) => (
        <div key={index} className="field-container">
          <input
            type="text"
            className="input-field"
            placeholder="Field Label"
            value={field.label}
            onChange={(e) => updateField(index, "label", e.target.value)}
          />
          <select
            className="select-field"
            value={field.type}
            onChange={(e) => updateField(index, "type", e.target.value)}
          >
            <option value="text">Text</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
            <option value="select">Select</option>
            <option value="date">Date</option>
          </select>
          {["radio", "checkbox", "select"].includes(field.type) && (
            <div className="options-container">
              {field.options.map((option, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  className="input-field option-field"
                  placeholder="Option"
                  value={option}
                  onChange={(e) => updateOption(index, optIndex, e.target.value)}
                />
              ))}
              <button className="add-option-btn" onClick={() => addOption(index)}>
                Add Option
              </button>
            </div>
          )}
          <button className="remove-field-btn" onClick={() => removeField(index)}>
            Remove Field
          </button>
        </div>
      ))}
      <button className="add-field-btn" onClick={addField}>
        Add Field
      </button>
      <button className="submit-btn" onClick={handleSubmit}>
        Create Form
      </button>
    </div>
  );
};

export default NewForm;
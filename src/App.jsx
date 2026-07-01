import uiConfig from "./config/uiConfig.json";
import { useState } from "react";
import FieldCard from "./components/FieldCard";

const ManualForm = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    uiConfig.fields.forEach((field) => {
      if (!formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    console.log("SUBMITTED:", formData);
  };

  return (
    <div>
      <h2>Manual Form</h2>

      <h3>Plant Info</h3>
      <p>
        <b>Code:</b> {uiConfig.metadata.plant_code}
      </p>
      <p>
        <b>Name:</b> {uiConfig.metadata.plant_name}
      </p>

      {uiConfig.fields.map((field) => (
        <FieldCard
          key={field.name}
          label={field.label}
          type={field.type}
          value={formData[field.name] || ""}
          error={errors[field.name]}
          onChange={(e) =>
            setFormData({
              ...formData,
              [field.name]: e.target.value,
            })
          }
        />
      ))}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ManualForm;

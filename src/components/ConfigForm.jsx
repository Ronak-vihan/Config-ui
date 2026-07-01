import uiConfig from "../config/uiConfig.json";
import { useEffect, useState } from "react";
import FieldCard from "./FieldCard";
import { createRole, getRoles, deleteRole, updateRole } from "../api/roleApi";

const ConfigForm = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);

  const [editId, setEditId] = useState(null);

  // load roles
  useEffect(() => {
    getRoles().then(setRoles);
  }, []);

  // validation
  const validate = () => {
    let newErrors = {};

    uiConfig.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit (create or update)
  const handleSubmit = () => {
    if (!validate()) return;

    if (editId) {
      updateRole(editId, formData).then(() => {
        getRoles().then(setRoles);
      });
      setEditId(null);
    } else {
      createRole(formData).then(() => {
        getRoles().then(setRoles);
      });
    }

    setFormData({});
    setErrors({});
  };

  // delete
  const handleDelete = (id) => {
    deleteRole(id).then(() => {
      getRoles().then(setRoles);
    });
  };

  // edit
  const handleEdit = (role) => {
    setFormData(role);
    setEditId(role.id);
  };

  const isFormValid = uiConfig.fields.every((field) => formData[field.name]);

  return (
    <div>
      <h2>Role Module (Full CRUD)</h2>

      {/* FORM */}
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

      <button onClick={handleSubmit} disabled={!isFormValid}>
        {editId ? "Update" : "Submit"}
      </button>

      {/* LIST */}
      <h3 style={{ marginTop: "20px" }}>Roles List</h3>

      {roles.map((role) => (
        <div
          key={role.id}
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "8px",
          }}
        >
          <span>
            {role.roleName} - {role.status}
          </span>

          <button onClick={() => handleEdit(role)}>Edit</button>

          <button onClick={() => handleDelete(role.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ConfigForm;

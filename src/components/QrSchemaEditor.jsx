import React, { useState } from "react";
import { Box, Paper, Stack } from "@mui/material";
import CustomTextField from "./CustomTextField";
import AddButton from "./AddButton";
import DeleteIconButton from "./DeleteIconButton";
import { inferValueType } from "../utils/inferValueType";

export default function QrSchemaEditor({ qrSchema, onChange }) {
  const [draftNames, setDraftNames] = useState({});
  const [valueDrafts, setValueDrafts] = useState({});
  const [errors, setErrors] = useState({});

  const clearDraft = (index) => {
    setDraftNames((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const clearValueDraft = (index) => {
    setValueDrafts((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const renameKey = (currentKey, newKey) => {
    const updated = {};
    Object.entries(qrSchema).forEach(([key, value]) => {
      updated[key === currentKey ? newKey : key] = value;
    });
    onChange(updated);
  };

  const validateName = (currentKey, newName) => {
    const trimmed = newName.trim();
    if (trimmed === "") return "Item Type cannot be empty";
    const duplicate =
      trimmed !== currentKey &&
      Object.prototype.hasOwnProperty.call(qrSchema, trimmed);
    if (duplicate) return "Item Type already exists";
    return "";
  };

  const handleNameChange = (index, currentKey, value) => {
    setDraftNames((prev) => ({ ...prev, [index]: value }));
    const error = validateName(currentKey, value);
    setErrors((prev) => ({ ...prev, [index]: error }));
    if (error) return;
    renameKey(currentKey, value.trim());
    clearDraft(index);
  };

  const handleNameBlur = (index, currentKey) => {
    const draft = draftNames[index];
    if (draft === undefined) return;
    const error = validateName(currentKey, draft);
    if (error) {
      clearDraft(index);
      setErrors((prev) => ({ ...prev, [index]: error }));
      return;
    }
    renameKey(currentKey, draft.trim());
    clearDraft(index);
    setErrors((prev) => ({ ...prev, [index]: "" }));
  };

  const handleValueChange = (index, key, typedValue) => {
    setValueDrafts((prev) => ({ ...prev, [index]: typedValue }));
    onChange({ ...qrSchema, [key]: inferValueType(typedValue) });
  };

  const handleValueBlur = (index) => {
    clearValueDraft(index);
  };

  const addSchema = () => {
    const newKey = `item_type_${Object.keys(qrSchema).length + 1}`;
    onChange({ ...qrSchema, [newKey]: "" });
    setDraftNames({});
    setValueDrafts({});
    setErrors({});
  };

  const deleteSchema = (key) => {
    const updated = { ...qrSchema };
    delete updated[key];
    onChange(updated);
    setDraftNames({});
    setValueDrafts({});
    setErrors({});
  };

  return (
    <Box>
      {Object.entries(qrSchema).map(([key, value], index) => (
        <Paper
          key={index}
          variant="outlined"
          sx={{ p: 2, mb: 2, borderColor: "#2c313c", bgcolor: "#1a1d24" }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <CustomTextField
              label="Item Type"
              value={draftNames[index] ?? key}
              error={Boolean(errors[index])}
              helperText={errors[index]}
              onChange={(e) => handleNameChange(index, key, e.target.value)}
              onBlur={() => handleNameBlur(index, key)}
            />
            <DeleteIconButton
              onClick={() => deleteSchema(key)}
              ariaLabel={`Delete ${key}`}
            />
          </Stack>

          <CustomTextField
            label="QR Nomenclature"
            value={valueDrafts[index] ?? String(value ?? "")}
            helperText="Semicolon-separated fields, e.g. plant_id;invoice_number;item_code;timestamp"
            onChange={(e) => handleValueChange(index, key, e.target.value)}
            onBlur={() => handleValueBlur(index)}
          />
        </Paper>
      ))}

      <AddButton label="Add Item Type" onClick={addSchema} />
    </Box>
  );
}

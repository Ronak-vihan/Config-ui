import React, { useState } from "react";
import { Box, Stack, Chip } from "@mui/material";
import CustomTextField from "./CustomTextField";
import AddButton from "./AddButton";
import GroupLabel from "./GroupLabel";

export default function StringListEditor({
  label,
  items,
  onChange,
  placeholder = "Add item",
  gridLayout = false,
}) {
  const [draft, setDraft] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const commitDraft = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    if (editingIndex !== null) {
      const duplicate = items.some(
        (item, i) => i !== editingIndex && item === trimmed,
      );
      if (duplicate) return;
      onChange(items.map((item, i) => (i === editingIndex ? trimmed : item)));
      setEditingIndex(null);
    } else {
      if (items.includes(trimmed)) return;
      onChange([...items, trimmed]);
    }
    setDraft("");
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setDraft("");
    }
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setDraft(items[index]);
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      {label && <GroupLabel>{label}</GroupLabel>}

      <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ mb: 1.5 }}>
        <CustomTextField
          label={editingIndex !== null ? "Edit item" : "Add item"}
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitDraft();
            }
          }}
        />

        <AddButton
          compact
          label={editingIndex !== null ? "Save" : "Add Item"}
          onClick={commitDraft}
        />
      </Stack>

      {items.length > 0 && (
        <Box
          sx={
            gridLayout
              ? {
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: 1,
                }
              : { display: "flex", flexWrap: "wrap", gap: 1 }
          }
        >
          {items.map((item, index) => (
            <Chip
              key={`${item}-${index}`}
              label={item}
              onClick={() => startEdit(index)}
              onDelete={() => removeItem(index)}
              sx={{
                bgcolor: index === editingIndex ? "#232838" : "#1a1d24",
                color: "#fff",
                border: "1px solid #2c313c",
                cursor: "pointer",
                justifyContent: "space-between",
                borderRadius: "6px",
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

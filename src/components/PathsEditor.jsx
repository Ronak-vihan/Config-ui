import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import CustomTextField from "./CustomTextField";
import AddButton from "./AddButton";
import DeleteIconButton from "./DeleteIconButton";
import GroupLabel from "./GroupLabel";

export default function PathsEditor({ items, onChange }) {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const trimmed = draft.trim();
    if (!trimmed || items.includes(trimmed)) return;
    onChange([...items, trimmed]);
    setDraft("");
  };

  const updateItem = (index, value) => {
    onChange(items.map((item, i) => (i === index ? value : item)));
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      <GroupLabel>PATHS</GroupLabel>

      <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ mb: 1.5 }}>
        <CustomTextField
          label="Add path"
          placeholder="e.g. warehouse-management/dashboard/..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <AddButton compact label="Add Item" onClick={addItem} />
      </Stack>

      <Stack spacing={1.25}>
        {items.map((item, index) => (
          <Stack key={index} direction="row" spacing={1} alignItems="center">
            <CustomTextField
              label={`Path ${index + 1}`}
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
            />
            <DeleteIconButton
              onClick={() => removeItem(index)}
              ariaLabel={`Delete path ${index + 1}`}
            />
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

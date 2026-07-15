import React from "react";
import { Box, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import CustomTextField from "./CustomTextField";

// One generic field component, renders ANY field described in the
// `schema` array (schema-driven architecture — see ConfigBuilder.jsx).
//
// Placeholder vs helper text is data-driven, not hardcoded per section:
// - If field.placeholder is set, it shows inside the input (used by Basics).
// - If field.help is set instead, it shows as helper text below the input
//   (still used by APIs & Stores). A field only needs one or the other.
export default function FormField({ field, value, onChange }) {
  if (field.type === "checkbox") {
    return (
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(value)}
              onChange={(e) => onChange(field.path, e.target.checked)}
            />
          }
          label={field.label}
        />
        {field.help && (
          <FormHelperText sx={{ ml: 4, mt: -0.5 }}>{field.help}</FormHelperText>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2.5 }}>
      <CustomTextField
        label={field.label}
        value={value ?? ""}
        placeholder={field.placeholder}
        helperText={field.help}
        onChange={(e) => onChange(field.path, e.target.value)}
      />
    </Box>
  );
}

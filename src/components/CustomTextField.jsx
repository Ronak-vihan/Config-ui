import React from "react";
import { TextField } from "@mui/material";

// Every TextField in the app (Basics, APIs & Stores, QR Schema, etc.)
// goes through this component. Change font size, spacing, or any other
// TextField styling here ONCE instead of hunting through every section.
export default function CustomTextField({ sx, ...props }) {
  return (
    <TextField
      fullWidth
      size="small"
      sx={{
        "& .MuiInputLabel-root": { fontSize: 11 },
        "& .MuiInputBase-input": { fontSize: 12 },
        "& .MuiFormHelperText-root": {
          fontSize: 9,
          marginTop: "3px",
          lineHeight: 1.2,
        },
        ...sx,
      }}
      {...props}
    />
  );
}

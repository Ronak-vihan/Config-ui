import React from "react";
import { Box, Grid, MenuItem } from "@mui/material";
import CustomTextField from "./CustomTextField";
import { CREATION_MODE_FIELDS } from "../constants/creationModes";

export default function CreationModesEditor({ values, onChange }) {
  return (
    <Box>
      <Grid container spacing={2}>
        {CREATION_MODE_FIELDS.map((field) => (
          <Grid item xs={12} sm={6} key={field.key}>
            <CustomTextField
              select
              label={field.label}
              value={values?.[field.key] ?? field.default}
              onChange={(e) => onChange(field.key, e.target.value)}
            >
              {field.options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

import React from "react";
import { Box, Grid, MenuItem } from "@mui/material";
import CustomTextField from "./CustomTextField";

export default function CreationModesEditor({ values, onChange }) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            select
            label="RM Creation Mode"
            value={values?.rm_creation_mode ?? "manual"}
            onChange={(e) => onChange("rm_creation_mode", e.target.value)}
          >
            <MenuItem value="manual">manual</MenuItem>
            <MenuItem value="sap">sap</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            select
            label="SFG Creation Mode"
            value={values?.sfg_creation_mode ?? "manual"}
            onChange={(e) => onChange("sfg_creation_mode", e.target.value)}
          >
            <MenuItem value="manual">manual</MenuItem>
            <MenuItem value="sap">sap</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            select
            label="FG Creation Mode"
            value={values?.fg_creation_mode ?? "manual"}
            onChange={(e) => onChange("fg_creation_mode", e.target.value)}
          >
            <MenuItem value="manual">manual</MenuItem>
            <MenuItem value="sap">sap</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            select
            label="Separator"
            value={values?.separator ?? ","}
            onChange={(e) => onChange("separator", e.target.value)}
          >
            <MenuItem value=",">, (comma)</MenuItem>
            <MenuItem value=";">; (semicolon)</MenuItem>
            <MenuItem value="no">no</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </Box>
  );
}

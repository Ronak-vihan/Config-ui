import React from "react";
import { Typography } from "@mui/material";

export default function GroupLabel({ children }) {
  return (
    <Typography
      sx={{
        fontSize: 11,
        letterSpacing: "0.06em",
        color: "#aeb4c0",
        fontWeight: 700,
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
}

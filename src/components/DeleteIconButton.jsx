import React from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Reusable delete icon button. Pass `ariaLabel` for accessibility,
// e.g. ariaLabel={`Delete ${itemName}`}.
export default function DeleteIconButton({ onClick, ariaLabel }) {
  return (
    <IconButton
      onClick={onClick}
      aria-label={ariaLabel}
      sx={{
        color: "#e08585",
        position: "relative",
        top: "-3px",
      }}
    >
      <DeleteIcon />
    </IconButton>
  );
}

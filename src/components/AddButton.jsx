import React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function AddButton({
  label,
  onClick,
  size = "small",
  compact = false,
}) {
  return (
    <Button
      variant="outlined"
      size={size}
      startIcon={<AddIcon fontSize="small" />}
      onClick={onClick}
      sx={
        compact
          ? {
              height: 30,
              minHeight: 30,
              px: 1.5,
              py: 0,
              position: "relative",
              top: "2px",
              borderRadius: 1,
              fontSize: "10px",
              fontWeight: 500,
              textTransform: "uppercase",
              whiteSpace: "nowrap",

              "& .MuiButton-startIcon": {
                marginRight: "4px",
                marginLeft: "-2px",
              },

              "& .MuiSvgIcon-root": {
                fontSize: 14,
              },
            }
          : {}
      }
    >
      {label}
    </Button>
  );
}

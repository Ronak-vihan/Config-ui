import React, { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import CustomTextField from "./CustomTextField";
import AddButton from "./AddButton";
import DeleteIconButton from "./DeleteIconButton";
import GroupLabel from "./GroupLabel";
import StringListEditor from "./StringListEditor";
import PathsEditor from "./PathsEditor";

const checkboxLabelSx = {
  flexShrink: 0,
  whiteSpace: "nowrap",
  m: 0,
  "& .MuiFormControlLabel-label": { fontSize: 7 },
};
const checkboxInputSx = { p: 0.4, "& .MuiSvgIcon-root": { fontSize: 11 } };

export default function SubmenuEditor({ value, onChange }) {
  const [columnErrors, setColumnErrors] = useState({});

  const columns = value.column || [];
  const paths = value.paths || [];

  const update = (patch) => onChange({ ...value, ...patch });

  const validateColumnName = (index, val, list) => {
    const trimmed = val.trim();
    let error = "";
    if (trimmed === "") {
      error = "Column name cannot be empty";
    } else {
      const duplicate = list.some(
        (c, i) => i !== index && c.column_name === trimmed,
      );
      if (duplicate) error = "Column name already exists";
    }
    setColumnErrors((prev) => ({ ...prev, [index]: error }));
    return error;
  };

  const updateColumn = (index, field, val) => {
    const nextColumns = columns.map((col, i) =>
      i === index ? { ...col, [field]: val } : col,
    );
    if (field === "column_name") validateColumnName(index, val, nextColumns);
    update({ column: nextColumns });
  };

  const addColumn = () => {
    update({
      column: [
        ...columns,
        {
          column_name: `column_${columns.length + 1}`,
          label: "",
          is_mandate: false,
          unique_contraint: false,
          enabled: true,
          for_display: true,
          for_input: true,
        },
      ],
    });
  };

  const deleteColumn = (index) => {
    update({ column: columns.filter((_, i) => i !== index) });
    setColumnErrors((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          sx={{
            "& .MuiFormControlLabel-label": { fontSize: 13, fontWeight: 500 },
          }}
          control={
            <Checkbox
              size="small"
              sx={{ p: 0.5, "& .MuiSvgIcon-root": { fontSize: 18 } }}
              checked={Boolean(value.enable)}
              onChange={(e) => update({ enable: e.target.checked })}
            />
          }
          label={`Enable ${value.name || "Section"}`}
        />
      </Box>

      <Box sx={{ mb: 2.5 }}>
        <CustomTextField
          label="Menu Name"
          value={value.name ?? ""}
          placeholder="e.g. Inventory"
          onChange={(e) => update({ name: e.target.value })}
        />
      </Box>

      <StringListEditor
        label="SELECTED LIST"
        items={value.actions?.selectedList || []}
        onChange={(next) =>
          update({ actions: { ...value.actions, selectedList: next } })
        }
      />

      <StringListEditor
        label="DISABLED LIST"
        items={value.actions?.disabledList || []}
        onChange={(next) =>
          update({ actions: { ...value.actions, disabledList: next } })
        }
      />

      <Divider sx={{ borderColor: "#262b35", mb: 2.5 }} />

      <PathsEditor items={paths} onChange={(next) => update({ paths: next })} />

      <Divider sx={{ borderColor: "#262b35", mb: 2.5 }} />

      <GroupLabel>COLUMNS</GroupLabel>

      {columns.map((col, index) => (
        <Paper
          key={index}
          variant="outlined"
          sx={{ p: 2, mb: 2, borderColor: "#2c313c", bgcolor: "#1a1d24" }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <CustomTextField
              label="Column Name"
              value={col.column_name ?? ""}
              error={Boolean(columnErrors[index])}
              helperText={columnErrors[index]}
              onChange={(e) =>
                updateColumn(index, "column_name", e.target.value)
              }
            />
            <Box sx={{ mt: -0.75 }}>
              <DeleteIconButton
                onClick={() => deleteColumn(index)}
                ariaLabel={`Delete column ${col.column_name}`}
              />
            </Box>
          </Stack>

          <Box sx={{ mb: 1.5 }}>
            <CustomTextField
              label="Label"
              value={col.label ?? ""}
              onChange={(e) => updateColumn(index, "label", e.target.value)}
            />
          </Box>

          <Box>
            <Stack
              direction="row"
              flexWrap="wrap"
              columnGap={2}
              rowGap={1}
              sx={{
                width: "100%",
                alignItems: "center",
              }}
            >
              <FormControlLabel
                sx={checkboxLabelSx}
                control={
                  <Checkbox
                    size="small"
                    sx={checkboxInputSx}
                    checked={Boolean(col.is_mandate)}
                    onChange={(e) =>
                      updateColumn(index, "is_mandate", e.target.checked)
                    }
                  />
                }
                label="Mandatory"
              />

              <FormControlLabel
                sx={checkboxLabelSx}
                control={
                  <Checkbox
                    size="small"
                    sx={checkboxInputSx}
                    checked={Boolean(col.unique_contraint)}
                    onChange={(e) =>
                      updateColumn(index, "unique_contraint", e.target.checked)
                    }
                  />
                }
                label="Unique"
              />

              <FormControlLabel
                sx={checkboxLabelSx}
                control={
                  <Checkbox
                    size="small"
                    sx={checkboxInputSx}
                    checked={Boolean(col.enabled)}
                    onChange={(e) =>
                      updateColumn(index, "enabled", e.target.checked)
                    }
                  />
                }
                label="Enabled"
              />

              <FormControlLabel
                sx={checkboxLabelSx}
                control={
                  <Checkbox
                    size="small"
                    sx={checkboxInputSx}
                    checked={Boolean(col.for_display)}
                    onChange={(e) =>
                      updateColumn(index, "for_display", e.target.checked)
                    }
                  />
                }
                label="For Display"
              />

              <FormControlLabel
                sx={checkboxLabelSx}
                control={
                  <Checkbox
                    size="small"
                    sx={checkboxInputSx}
                    checked={Boolean(col.for_input)}
                    onChange={(e) =>
                      updateColumn(index, "for_input", e.target.checked)
                    }
                  />
                }
                label="For Input"
              />
            </Stack>
          </Box>
        </Paper>
      ))}

      <AddButton label="Add Item" onClick={addColumn} />
    </Box>
  );
}

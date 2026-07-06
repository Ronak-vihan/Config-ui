import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  TextField,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Typography,
  Button,
  Stack,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";

// ---- Dark theme so MUI text/labels/inputs show up properly ----
// (MUI's default theme is LIGHT — dark text meant for a white
// background. Since our panels are dark, we tell MUI to use its
// "dark" palette instead, which flips text to light colors.)
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0f1115", paper: "#15181e" },
    warning: { main: "#e8963f" },
  },
});

/**
 * ---------------------------------------------------------------
 * THE CORE IDEA (same as before, just re-stated)
 * ---------------------------------------------------------------
 * 1. schema = one array describing every field (label, path, type, section)
 * 2. FormField = one component that renders ANY field from that schema
 * 3. getByPath / setByPath = read/write the config object by dotted path
 * 4. The live JSON panel is just JSON.stringify(config) — it IS the state
 *
 * Only change in this version: the pieces are now MUI components
 * (TextField, Checkbox, Tabs, Paper, Button) instead of plain HTML.
 * The schema and logic underneath are untouched.
 * ---------------------------------------------------------------
 */

// ---- 1. Starting config ----
const initialConfig = {
  menu: "Warehouse Dashboard",
  metadata: {
    plant_code: "PJH",
    plant_name: "Panasonic Jhajjhar Haryana",
  },
  features: {
    verifyGRNSync: true,
    enableQRScan: false,
    enableAutoRefresh: true,
  },
  qr_schema: {
    rm: "plant_id;invoice_number;item_code;timestamp",
    fg: "plant_id;invoice_number;item_code;timestamp",
    ffg: "plant_id;invoice_number;item_code;timestamp",
  },
  apis: {
    baseUrl: "https://api.example.com",
    storeEndpoint: "/v1/stores",
  },
};

// ---- Reusable list of fields that can go into any QR string ----
// Used by every "multiCheckbox" field in the QR Schema section.
const QR_FIELD_OPTIONS = [
  "plant_id",
  "invoice_number",
  "item_code",
  "timestamp",
];

// ---- 2. Schema: only place you describe fields ----
const schema = [
  // --- Basics ---
  {
    section: "Basics",
    path: "menu",
    label: "Dashboard Menu Name",
    help: "Top-level menu identity.",
  },
  {
    section: "Basics",
    path: "metadata.plant_code",
    label: "Plant Code",
    help: "Short code, e.g. PJH.",
  },
  {
    section: "Basics",
    path: "metadata.plant_name",
    label: "Plant Name",
    help: "Full plant name.",
  },

  // --- Enabled Features (checkboxes) ---
  {
    section: "Enabled Features",
    path: "features.verifyGRNSync",
    label: "Verify GRN Sync",
    help: "Validate GRN sync before saving.",
    type: "checkbox",
  },
  {
    section: "Enabled Features",
    path: "features.enableQRScan",
    label: "Enable QR Scan",
    help: "Allow scanning QR codes.",
    type: "checkbox",
  },
  {
    section: "Enabled Features",
    path: "features.enableAutoRefresh",
    label: "Enable Auto Refresh",
    help: "Auto refresh dashboard data.",
    type: "checkbox",
  },

  // --- QR Schema ---
  // type: "multiCheckbox" -> shows field.options as checkboxes, stores the
  // selected ones as a single "a;b;c" string (separator can be overridden
  // via field.separator, defaults to ";").
  {
    section: "QR Schema",
    path: "qr_schema.rm",
    label: "RM (Raw Material)",
    help: "Fields included in the Raw Material QR code.",
    type: "multiCheckbox",
    options: QR_FIELD_OPTIONS,
  },
  {
    section: "QR Schema",
    path: "qr_schema.fg",
    label: "FG (Finished Goods)",
    help: "Fields included in the Finished Goods QR code.",
    type: "multiCheckbox",
    options: QR_FIELD_OPTIONS,
  },
  {
    section: "QR Schema",
    path: "qr_schema.ffg",
    label: "FFG (Final Finished Goods)",
    help: "Fields included in the Final Finished Goods QR code.",
    type: "multiCheckbox",
    options: QR_FIELD_OPTIONS,
  },

  // --- APIs & Stores ---
  {
    section: "APIs & Stores",
    path: "apis.baseUrl",
    label: "Base API URL",
    help: "Root URL for all API calls.",
  },
  {
    section: "APIs & Stores",
    path: "apis.storeEndpoint",
    label: "Store Endpoint",
    help: "Path appended for store data.",
  },
];

// ---- 3. Generic get/set by dotted path ----
function getByPath(obj, path) {
  return path
    .split(".")
    .reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function setByPath(obj, path, value) {
  const keys = path.split(".");
  const next = JSON.parse(JSON.stringify(obj));
  let cursor = next;
  for (let i = 0; i < keys.length - 1; i++) cursor = cursor[keys[i]];
  cursor[keys[keys.length - 1]] = value;
  return next;
}

// ---- Helpers for "multiCheckbox" fields: string <-> array ----
// Stored value is always a single string like "plant_id;item_code".
function stringToList(str, separator = ";") {
  if (!str) return [];
  return str.split(separator).filter(Boolean);
}

function listToString(list, separator = ";") {
  return list.join(separator);
}

// ---- 4. One generic field, now using MUI components ----
function FormField({ field, value, onChange }) {
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

  if (field.type === "multiCheckbox") {
    const separator = field.separator || ";";
    const selected = stringToList(value, separator);

    const toggleOption = (option) => {
      const next = selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option];
      onChange(field.path, listToString(next, separator));
    };

    return (
      <Box sx={{ mb: 2.5 }}>
        <Typography
          sx={{ fontSize: 12.5, color: "#c9cdd6", fontWeight: 600, mb: 0.5 }}
        >
          {field.label}
        </Typography>
        <Stack direction="row" flexWrap="wrap">
          {field.options.map((option) => (
            <FormControlLabel
              key={option}
              sx={{ width: "48%", mr: 0 }}
              control={
                <Checkbox
                  size="small"
                  checked={selected.includes(option)}
                  onChange={() => toggleOption(option)}
                />
              }
              label={option}
            />
          ))}
        </Stack>
        {field.help && <FormHelperText>{field.help}</FormHelperText>}
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2.5 }}>
      <TextField
        fullWidth
        size="small"
        label={field.label}
        value={value ?? ""}
        onChange={(e) => onChange(field.path, e.target.value)}
        helperText={field.help}
      />
    </Box>
  );
}

export default function ConfigBuilder() {
  const [config, setConfig] = useState(initialConfig);
  const [activeSection, setActiveSection] = useState("Basics");
  const [copied, setCopied] = useState(false);

  const handleChange = (path, value) => {
    setConfig((prev) => setByPath(prev, path, value));
  };

  const sections = [...new Set(schema.map((f) => f.section))];
  const fieldsForSection = schema.filter((f) => f.section === activeSection);
  const jsonString = JSON.stringify(config, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard can fail in sandboxed iframes; ignore
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "#0f1115", minHeight: "100%", p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            maxWidth: 1100,
            mx: "auto",
            display: "grid",
            gridTemplateColumns: "180px 1fr 1fr",
            bgcolor: "#15181e",
            border: "1px solid #262b35",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* ---- left nav: MUI Tabs, vertical ---- */}
          <Box sx={{ bgcolor: "#12141a", borderRight: "1px solid #262b35" }}>
            <Typography
              sx={{
                fontSize: 11,
                letterSpacing: "0.08em",
                color: "#f0a44e",
                fontWeight: 700,
                px: 2,
                pt: 2,
                pb: 1,
              }}
            >
              CONFIG BUILDER
            </Typography>
            <Tabs
              orientation="vertical"
              value={activeSection}
              onChange={(e, val) => setActiveSection(val)}
              TabIndicatorProps={{
                style: { left: 0, backgroundColor: "#e8963f", width: 3 },
              }}
              sx={{
                "& .MuiTab-root": {
                  alignItems: "flex-start",
                  textTransform: "none",
                  color: "#aeb4c0",
                  fontSize: 13.5,
                  minHeight: 40,
                },
                "& .Mui-selected": {
                  color: "#fff !important",
                  fontWeight: 600,
                },
              }}
            >
              {sections.map((s) => (
                <Tab key={s} value={s} label={s} />
              ))}
            </Tabs>
          </Box>

          {/* ---- middle: generated form ---- */}
          <Box sx={{ p: 3, borderRight: "1px solid #262b35" }}>
            <Typography
              sx={{ fontSize: 15, fontWeight: 700, mb: 2, color: "#fff" }}
            >
              {activeSection}
            </Typography>
            {fieldsForSection.map((field) => (
              <FormField
                key={field.path}
                field={field}
                value={getByPath(config, field.path)}
                onChange={handleChange}
              />
            ))}
          </Box>

          {/* ---- right: live JSON ---- */}
          <Box sx={{ p: 3, bgcolor: "#0d0f13" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Typography
                sx={{
                  fontSize: 11.5,
                  letterSpacing: "0.06em",
                  color: "#7fd88f",
                  fontWeight: 700,
                }}
              >
                LIVE JSON OUTPUT
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ContentCopyIcon fontSize="small" />}
                  onClick={handleCopy}
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="warning"
                  startIcon={<DownloadIcon fontSize="small" />}
                  onClick={handleDownload}
                >
                  Download
                </Button>
              </Stack>
            </Stack>
            <Box
              component="pre"
              sx={{
                m: 0,
                fontFamily: "'JetBrains Mono', Menlo, monospace",
                fontSize: 12.5,
                lineHeight: 1.6,
                color: "#9de3a5",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: 420,
                overflowY: "auto",
              }}
            >
              {jsonString}
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

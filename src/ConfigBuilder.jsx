import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";

import { SECTIONS } from "./constants/sections";
import AppTabs from "./components/AppTabs";
import FormField from "./components/FormField";
import QrSchemaEditor from "./components/QrSchemaEditor";
import SubmenuEditor from "./components/SubmenuEditor";
import StringListEditor from "./components/StringListEditor";
import CreationModesEditor from "./components/CreationModesEditor";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0f1115", paper: "#15181e" },
    warning: { main: "#e8963f" },
  },
});

const slugify = (str) =>
  str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const initialConfig = {
  menu: "Warehouse Dashboard",

  metadata: {
    plant_code: "PJH",
    plant_name: "Panasonic Jhajjhar Haryana",
  },

  qr_schema: {
    rm: "plant_id;invoice_number;item_code;timestamp",
    sfg: "plant_id;production_no;item_code;timestamp",
    fg: "plant_id;production_no;item_code;timestamp",
  },
  rm_creation_mode: "manual",
  sfg_creation_mode: "manual",
  fg_creation_mode: "manual",
  separator: ",",
  separatorOptions: [",", ";", "no"],

  allowedApis: [
    "vendor",
    "item",
    "gateentry",
    "generate_goods_receipt_note",
    "productionorder",
    "subcontract",
    "issueMaterial",
    "returnMaterial",
    "rejectionstore",
    "rejectionstore/accept",
    "rejectionstore/scrap",
    "fgproduced",
    "fgmaterialconsumed",
    "issueFG",
    "fgdelivery",
    "fgQCdetails",
    "moveorder",
    "postmoveorder",
    "movematerialSFG",
    "issueSFG",
    "fginvoice",
  ],

  submenus: [
    {
      id: "inventory",
      name: "Inventory",
      enable: true,
      actions: { selectedList: [], disabledList: [] },
      column: [
        {
          column_name: "item_code",
          label: "Item Code",
          is_mandate: true,
          unique_contraint: false,
          enabled: true,
          for_display: true,
          for_input: true,
        },
      ],
      paths: [],
    },
  ],
};

const schema = [
  {
    section: "Basics",
    path: "menu",
    label: "Dashboard Menu Name",
    placeholder: "e.g. Warehouse Dashboard",
  },
  {
    section: "Basics",
    path: "metadata.plant_code",
    label: "Plant Code",
    placeholder: "e.g. PJH",
  },
  {
    section: "Basics",
    path: "metadata.plant_name",
    label: "Plant Name",
    placeholder: "e.g. Panasonic Jhajjhar Haryana",
  },
];

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

export default function ConfigBuilder() {
  const [config, setConfig] = useState(initialConfig);
  const [activeSection, setActiveSection] = useState("Basics");
  const [copied, setCopied] = useState(false);
  const [submenuErrors, setSubmenuErrors] = useState({});

  const [jsonDraft, setJsonDraft] = useState(() =>
    JSON.stringify(initialConfig, null, 2),
  );
  const [jsonError, setJsonError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleChange = (path, value) => {
    setConfig((prev) => setByPath(prev, path, value));
  };

  const updateSubmenu = (index, nextValue) => {
    setConfig((prev) => {
      const current = prev.submenus[index];
      const updated = { ...nextValue };

      if (nextValue.name !== current.name) {
        const trimmed = (nextValue.name || "").trim();

        if (trimmed === "") {
          setSubmenuErrors((errs) => ({
            ...errs,
            [index]: "Submenu name cannot be empty",
          }));
          updated.id = "";
        } else {
          const slug = slugify(trimmed);
          const duplicate = prev.submenus.some(
            (sm, i) => i !== index && sm.id === slug,
          );

          if (duplicate) {
            setSubmenuErrors((errs) => ({
              ...errs,
              [index]: "Submenu name already exists",
            }));
            updated.id = "";
          } else {
            setSubmenuErrors((errs) => ({ ...errs, [index]: "" }));
            updated.id = slug;
          }
        }
      }

      return {
        ...prev,
        submenus: prev.submenus.map((sm, i) => (i === index ? updated : sm)),
      };
    });
  };

  const addSubmenu = (name) => {
    const trimmed = name.trim();
    const newSubmenu = {
      id: slugify(trimmed),
      name: trimmed,
      enable: true,
      actions: { selectedList: [], disabledList: [] },
      column: [
        {
          column_name: "column_1",
          label: "",
          is_mandate: false,
          unique_contraint: false,
          enabled: true,
          for_display: true,
          for_input: true,
        },
      ],
      paths: [],
    };
    setConfig((prev) => ({
      ...prev,
      submenus: [...prev.submenus, newSubmenu],
    }));
    setActiveSection(config.submenus.length);
  };

  const removeSubmenu = (index) => {
    setConfig((prev) => {
      const nextSubmenus = prev.submenus.filter((_, i) => i !== index);

      if (activeSection === index) {
        if (nextSubmenus.length === 0) {
          setActiveSection("Basics");
        } else if (index - 1 >= 0) {
          setActiveSection(index - 1);
        } else {
          setActiveSection(0);
        }
      } else if (typeof activeSection === "number" && activeSection > index) {
        setActiveSection(activeSection - 1);
      }

      return { ...prev, submenus: nextSubmenus };
    });

    setSubmenuErrors((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };
  const sections = SECTIONS;
  const fieldsForSection = schema.filter((f) => f.section === activeSection);
  const jsonString = JSON.stringify(config, null, 2);

  useEffect(() => {
    const latest = JSON.stringify(config, null, 2);
    if (latest !== jsonDraft) setJsonDraft(latest);
  }, [config]);

  const handleJsonDraftChange = (e) => {
    const text = e.target.value;
    setJsonDraft(text);
    try {
      const parsed = JSON.parse(text);
      if (
        parsed === null ||
        Array.isArray(parsed) ||
        typeof parsed !== "object"
      )
        throw new Error();
      setConfig(parsed);
      setJsonError(null);
    } catch {
      setJsonError("Invalid JSON — fix the syntax to apply changes.");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
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

  const activeSubmenu =
    typeof activeSection === "number"
      ? config.submenus[activeSection]
      : undefined;

  const renderMiddle = () => {
    if (activeSection === "QR Schema") {
      return (
        <QrSchemaEditor
          qrSchema={config.qr_schema}
          onChange={(next) => handleChange("qr_schema", next)}
        />
      );
    }
    if (activeSection === "Creation Modes") {
      return (
        <CreationModesEditor
          values={{
            rm_creation_mode: config.rm_creation_mode,
            sfg_creation_mode: config.sfg_creation_mode,
            fg_creation_mode: config.fg_creation_mode,
            separator: config.separator,
          }}
          onChange={(field, value) => handleChange(field, value)}
        />
      );
    }
    if (activeSection === "Allowed APIs") {
      return (
        <StringListEditor
          items={config.allowedApis || []}
          onChange={(next) => handleChange("allowedApis", next)}
          placeholder="e.g. vendor, item, gateentry"
          gridLayout
        />
      );
    }

    if (activeSubmenu) {
      return (
        <SubmenuEditor
          value={activeSubmenu}
          onChange={(next) => updateSubmenu(activeSection, next)}
          nameError={submenuErrors[activeSection]}
        />
      );
    }

    return fieldsForSection.map((field) => (
      <FormField
        key={field.path}
        field={field}
        value={getByPath(config, field.path)}
        onChange={handleChange}
      />
    ));
  };

  const activeLabel = activeSubmenu
    ? activeSubmenu.name || "New Submenu"
    : activeSection;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{ bgcolor: "#0f1115", minHeight: "100%", p: { xs: 1.5, sm: 3 } }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 1100,
            mx: "auto",
            height: "85vh",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "180px 1fr 1fr" },
            gridTemplateRows: { xs: "auto 1fr 1fr", md: "1fr" },
            bgcolor: "#15181e",
            border: "1px solid #262b35",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              bgcolor: "#12141a",
              borderRight: { xs: "none", md: "1px solid #262b35" },
              borderBottom: { xs: "1px solid #262b35", md: "none" },
              overflow: "hidden",
            }}
          >
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
            <AppTabs
              sections={sections}
              activeSection={activeSection}
              onChange={setActiveSection}
              isMobile={isMobile}
              submenus={config.submenus}
              onSelectSubmenu={setActiveSection}
              onAddSubmenu={addSubmenu}
              onRemoveSubmenu={removeSubmenu}
            />
          </Box>

          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              borderRight: { xs: "none", md: "1px solid #262b35" },
              borderBottom: { xs: "1px solid #262b35", md: "none" },
              minWidth: 0,
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Typography
              sx={{ fontSize: 15, fontWeight: 700, mb: 2, color: "#fff" }}
            >
              {activeLabel}
            </Typography>
            {renderMiddle()}
          </Box>

          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              bgcolor: "#0d0f13",
              minWidth: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
                rowGap: 1,
                columnGap: 3,
                flexShrink: 0,
              }}
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
            </Box>

            {jsonError && (
              <Typography
                sx={{ fontSize: 11, color: "#e08585", mb: 1, flexShrink: 0 }}
              >
                {jsonError}
              </Typography>
            )}

            <Box
              component="textarea"
              spellCheck={false}
              value={jsonDraft}
              onChange={handleJsonDraftChange}
              sx={{
                flex: 1,
                width: "100%",
                minHeight: 0,
                m: 0,
                p: 0,
                border: "none",
                outline: "none",
                resize: "none",
                bgcolor: "transparent",
                fontFamily: "'JetBrains Mono', Menlo, monospace",
                fontSize: 12.5,
                lineHeight: 1.6,
                color: "#9de3a5",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                overflowY: "auto",
                overflowX: "hidden",
                boxSizing: "border-box",
              }}
            />
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

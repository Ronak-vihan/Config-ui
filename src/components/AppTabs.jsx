import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  ListItemText,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { SUBMENU_TEXT } from "../constants/submenuConstants";
export default function AppTabs({
  sections,
  activeSection,
  onChange,
  isMobile,
  submenus = [],
  onSelectSubmenu,
  onAddSubmenu,
  onRemoveSubmenu,
}) {
  const [submenuExpanded, setSubmenuExpanded] = useState(false);
  const [isAddingSubmenu, setIsAddingSubmenu] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftError, setDraftError] = useState("");

  const hasSubmenuSection = sections.includes("Submenu");
  const flatSections = sections.filter((s) => s !== "Submenu");

  const startAdding = () => {
    setIsAddingSubmenu(true);
    setDraftName("");
    setDraftError("");
  };

  const cancelAdding = () => {
    setIsAddingSubmenu(false);
    setDraftName("");
    setDraftError("");
  };

  const commitAdding = () => {
    const trimmed = draftName.trim();
    if (!trimmed) {
      cancelAdding();
      return;
    }
    const duplicate = submenus.some(
      (sm) => (sm.name || "").trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicate) {
      setDraftError(SUBMENU_TEXT.duplicateError);
      return;
    }
    onAddSubmenu(trimmed);
    cancelAdding();
  };

  return (
    <Box>
      <Tabs
        orientation={isMobile ? "horizontal" : "vertical"}
        value={flatSections.includes(activeSection) ? activeSection : false}
        onChange={(e, val) => {
          if (val !== false) onChange(val);
        }}
        variant="scrollable"
        scrollButtons={isMobile ? "auto" : false}
        allowScrollButtonsMobile
        TabIndicatorProps={{
          style: isMobile
            ? { backgroundColor: "#e8963f", height: 3 }
            : { left: 0, backgroundColor: "#e8963f", width: 3 },
        }}
        sx={{
          minHeight: 40,
          "& .MuiTab-root": {
            alignItems: isMobile ? "center" : "flex-start",
            textTransform: "none",
            color: "#aeb4c0",
            fontSize: 13.5,
            minHeight: 40,
            px: 2,
          },
          "& .Mui-selected": { color: "#fff !important", fontWeight: 600 },
        }}
      >
        {flatSections.map((s) => (
          <Tab key={s} value={s} label={s} sx={{ pl: 2 }} />
        ))}
      </Tabs>

      {hasSubmenuSection && (
        <Accordion
          expanded={submenuExpanded}
          onChange={() => setSubmenuExpanded((prev) => !prev)}
          disableGutters
          square
          sx={{
            bgcolor: "transparent",
            boxShadow: "none",
            "&:before": { display: "none" },
            mt: 1,
          }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon sx={{ color: "#f0a44e", fontSize: 18 }} />
            }
            sx={{
              minHeight: 28,
              px: 1.5,
              "& .MuiAccordionSummary-content": {
                margin: 0,
              },
            }}
          >
            <Box
              sx={{
                fontSize: 11,
                letterSpacing: "0.06em",
                fontWeight: 700,
                color: "#f0a44e",
              }}
            >
              SUBMENU
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            <List disablePadding>
              {submenus.map((sm, index) => (
                <ListItemButton
                  key={index}
                  selected={activeSection === index}
                  onClick={() => onSelectSubmenu(index)}
                  sx={{
                    pl: 2,
                    py: 0,
                    minHeight: 28,
                    color: activeSection === index ? "#fff" : "#aeb4c0",
                    fontWeight: 400,
                    borderLeft:
                      activeSection === index
                        ? "2px solid #e8963f"
                        : "3px solid transparent",
                  }}
                >
                  <ListItemText
                    primary={sm.name || SUBMENU_TEXT.defaultName}
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "10px",
                        fontWeight: 400,
                      },
                    }}
                  />
                  {sm.id !== "inventory" && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSubmenu(index);
                      }}
                      sx={{
                        p: 0,
                        ml: 1.5,
                        color: "#e08585",
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 11 }} />
                    </IconButton>
                  )}
                </ListItemButton>
              ))}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  px: 2,
                  py: 1,
                }}
              >
                {isAddingSubmenu ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <TextField
                      autoFocus
                      size="small"
                      variant="outlined"
                      placeholder={SUBMENU_TEXT.namePlaceholder}
                      value={draftName}
                      error={Boolean(draftError)}
                      helperText={draftError}
                      onChange={(e) => {
                        setDraftName(e.target.value);
                        if (draftError) setDraftError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          commitAdding();
                        } else if (e.key === "Escape") {
                          cancelAdding();
                        }
                      }}
                      fullWidth
                      sx={{
                        flex: 1,
                        minWidth: 0,

                        "& .MuiOutlinedInput-root": {
                          height: 28,
                        },

                        "& .MuiInputBase-input": {
                          fontSize: "10px",
                          px: 1,
                          py: 0,
                        },

                        "& .MuiInputBase-input::placeholder": {
                          fontSize: "10px",
                          opacity: 0.7,
                        },

                        "& .MuiFormHelperText-root": {
                          fontSize: 9,
                          m: 0,
                        },
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={cancelAdding}
                      sx={{
                        p: 0.3,
                        ml: 1,
                        flexShrink: 0,
                        color: "#e08585",
                        transform: "translateX(3px)",
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon sx={{ fontSize: 12 }} />}
                    onClick={startAdding}
                    sx={{
                      width: 120,
                      height: 28,
                      fontSize: "10px",
                      justifyContent: "flex-start",
                      px: 1,
                      borderWidth: "0.8px",

                      "&:hover": {
                        borderWidth: "0.8px",
                      },

                      "& .MuiButton-startIcon": {
                        marginRight: "6px",
                      },
                    }}
                  >
                    {SUBMENU_TEXT.addButtonLabel}
                  </Button>
                )}
              </Box>
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}

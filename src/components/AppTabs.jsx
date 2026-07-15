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
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

export default function AppTabs({
  sections,
  activeSection,
  onChange,
  isMobile,
  submenus = [],
  onSelectSubmenu,
  availableToAdd = [],
  onAddSubmenu,
  onRemoveSubmenu,
}) {
  const [submenuExpanded, setSubmenuExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const hasSubmenuSection = sections.includes("Submenu");
  const flatSections = sections.filter((s) => s !== "Submenu");

  const openAddMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const closeAddMenu = () => setAnchorEl(null);

  const handleAdd = (preset) => {
    onAddSubmenu(preset);
    closeAddMenu();
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
              {submenus.map((sm) => (
                <ListItemButton
                  key={sm.id}
                  selected={activeSection === sm.id}
                  onClick={() => onSelectSubmenu(sm.id)}
                  sx={{
                    pl: 2,
                    py: 0,
                    minHeight: 28,
                    color: activeSection === sm.id ? "#fff" : "#aeb4c0",
                    fontWeight: 400,
                    borderLeft:
                      activeSection === sm.id
                        ? "2px solid #e8963f"
                        : "3px solid transparent",
                  }}
                >
                  <ListItemText
                    primary={sm.name}
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
                        onRemoveSubmenu(sm.id);
                      }}
                      sx={{
                        p: 0.2,
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
                  pl: 2,
                  py: 1,
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon sx={{ fontSize: 12 }} />}
                  onClick={openAddMenu}
                  disabled={availableToAdd.length === 0}
                  sx={{
                    fontSize: 5,
                    py: 0,
                    px: 0,
                    borderWidth: "0.8px",

                    "&:hover": {
                      borderWidth: "0.8px",
                    },

                    "& .MuiButton-startIcon": {
                      marginRight: "1px",
                    },

                    "& .MuiSvgIcon-root": {
                      fontSize: "10px",
                    },
                  }}
                >
                  Add Submenu
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={closeAddMenu}
                >
                  {availableToAdd.map((preset) => (
                    <MenuItem key={preset.id} onClick={() => handleAdd(preset)}>
                      {preset.name}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}

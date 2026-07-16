// Field config for CreationModesEditor. Each entry maps to one
// CustomTextField select in the 2x2 grid. `key` is the config field
// name (matches JSON: rm_creation_mode, sfg_creation_mode,
// fg_creation_mode, separator), `label` is the field label, `options`
// is the list of { value, label } shown as MenuItems.
export const CREATION_MODE_FIELDS = [
  {
    key: "rm_creation_mode",
    label: "RM Creation Mode",
    default: "manual",
    options: [
      { value: "manual", label: "manual" },
      { value: "sap", label: "sap" },
    ],
  },
  {
    key: "sfg_creation_mode",
    label: "SFG Creation Mode",
    default: "manual",
    options: [
      { value: "manual", label: "manual" },
      { value: "sap", label: "sap" },
    ],
  },
  {
    key: "fg_creation_mode",
    label: "FG Creation Mode",
    default: "manual",
    options: [
      { value: "manual", label: "manual" },
      { value: "sap", label: "sap" },
    ],
  },
  {
    key: "separator",
    label: "Separator",
    default: ",",
    options: [
      { value: ",", label: ", (comma)" },
      { value: ";", label: "; (semicolon)" },
      { value: "no", label: "no" },
    ],
  },
];

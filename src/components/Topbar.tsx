import * as React from "react";
import { DevicesProvider, WithEditor } from "@grapesjs/react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { cx } from "./common.ts";
import TopbarButtons from "./TopbarButtons.tsx";
import Profile from "./Profile.tsx";
const templates = [
  { name: 'Template 1', value: 'Template1' },
  { name: 'Template 2', value: 'Template2' }
];

export default function Topbar({
  setSidebarState,
  selectedTemplate,
  onTemplateChange,
}: {
  setSidebarState: any;
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}) {


  return (
    <div className="flex items-center  bg-[#EAF6FF] fixed m-6 w-[95%] p-2 text-center z-50 rounded-xl">
      <img src="/CAI logo.png" alt="logo" className="h-8 w-8 ml-4 mr-8" />

      <FormControl variant="outlined" className="ml-auto">
        <Select
          value={selectedTemplate}
          onChange={(e) => onTemplateChange(e.target.value)}
          className="border border-black text-black"
          sx={{
            color: "black",
            "& .MuiSelect-icon": {
              color: "black",
            },
            "& .MuiOutlinedInput-root": {
              paddingTop: "4px",
              paddingBottom: "4px",
            },
            "& .MuiSelect-select": {
              paddingTop: "4px",
              paddingBottom: "4px",
            },
          }}
          inputProps={{
            sx: {
              padding: "4px 14px",
            },
          }}
        >
          {templates.map((template) => (
            <MenuItem
              key={template.value}
              value={template.value}
              className="text-black bg-white"
              sx={{
                backgroundColor: "white",
                "&.Mui-selected": {
                  backgroundColor: "#d1eaff", // Change this to your desired selected color
                  "&:hover": {
                    backgroundColor: "#b8daff", // Change this to your desired hover color for selected item
                  },
                },
                "&:hover": {
                  backgroundColor: "#f0f0f0", // Change this to your desired hover color
                },
                color: "black",
              }}
            >
              {template.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      

      <div className="flex flex-grow items-center justify-center text-[#053663] text-center">
        Editing/ {selectedTemplate}
      </div>
      <WithEditor>
        <TopbarButtons
          className="ml-4 px-2"
          // @ts-ignore
          setSidebarState={setSidebarState}
        />
        <Profile></Profile>

      </WithEditor>
    </div>
  );
}

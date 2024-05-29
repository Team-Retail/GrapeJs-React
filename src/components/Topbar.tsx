import * as React from "react";
import { DevicesProvider, WithEditor } from "@grapesjs/react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { cx } from "./common.ts";
import TopbarButtons from "./TopbarButtons.tsx";

export default function Topbar({ setSidebarState }: { setSidebarState: any }) {
  return (
    <div className="flex items-center p-1 bg-[#EAF6FF] fixed m-6 w-[95%] p-2 text-center z-50 rounded-xl">
      <img src="/CAI logo.png" alt="logo" className="h-8 w-8 ml-4 mr-8" />
      <DevicesProvider>
        {({ selected, select, devices }) => (
          <FormControl size="small">
            <Select
              className="border-[#053663] border rounded-[14px] focus:outline-none px-2"
              sx={{
                color: "#053663", // Change text color
                "& .MuiSelect-icon": {
                  color: "#053663", // Change arrow color
                },
                fontSize: "0.875rem",
              }}
              value={selected}
              onChange={(ev) => select(ev.target.value)}
            >
              {devices.map((device) => {
                console.log(device);
                return (
                  <MenuItem
                    className="text-[#053663]"
                    value={device.id}
                    key={device.id}
                  >
                    {device.getName()}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      </DevicesProvider>
      <div className="flex flex-grow items-center justify-center text-[#053663] text-center">
        Editing/ Template 1
      </div>
      <WithEditor>
        <TopbarButtons
          className="ml-auto px-2"
          // @ts-ignore
          setSidebarState={setSidebarState}
        />
      </WithEditor>
    </div>
  );
}

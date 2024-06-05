import { useEditor } from "@grapesjs/react";
import {
  mdiArrowULeftTop,
  mdiArrowURightTop,
  mdiBrush,
  mdiCloudUpload,
  mdiCog,
  mdiLayers,
  mdiLoading
} from "@mdi/js";
import Icon from "@mdi/react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "axios";
import QRCode from "qrcode.react";
import * as React from "react";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/base.ts";
import { User } from "../utils/types.ts";
import { cx } from "./common.ts";

import publish from "../assets/publish.png";
import upload from "../assets/upload.svg";
import CustomModal from "./CustomModal.tsx";
import CustomAssetManagerPdf from "./CustomAssetManagerPdf.tsx";
import { listObjects } from "../utils/helpers.ts";




interface TopbarButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  setSidebarState: (state: string) => void;
}
interface CommandButton {
  id: string;
  iconPath: string;
  options?: Record<string, any>;
  disabled?: () => boolean;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};


export default function TopbarButtons({
  className,
  setSidebarState,
}: TopbarButtonsProps) {
  const editor = useEditor();
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);
  const { UndoManager, Commands } = editor;
  const [isLoading, setisLoading] = useState(false);
  const [coded, setCoded] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [openUpload, setOpenUpload] = useState(false)

  useEffect(() => {
    const cmdEvent = "run stop";
    const onCommand = (id: string) => {
      cmdButtons.find((btn) => btn.id === id);
    };
    editor.on(cmdEvent, onCommand);

    return () => {
      editor.off(cmdEvent, onCommand);
    };
  }, []);

  const handleUpload = async () => {
    const htmlContent = editor.getHtml();
    const cssContent = editor.getCss();
    setisLoading(true);

    try {
      const completeHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
          ${cssContent}
          </style>
          <title>GrapesJS Template</title>
        </head>
        ${htmlContent}
      </html>
    `;



      const blob = new Blob([completeHtml], { type: 'text/html' });
      const user: User = JSON.parse(localStorage.getItem('userDetails'))
      const usernameFolder = user.companyName + "_" + user.email


      const formData = new FormData();
      formData.append('file', blob, `template-{${user._id}}.html`);
      formData.append('fieldName', usernameFolder);
      formData.append('userId', user._id);


      const ress = await axios.post(BASE_URL + "/api/auth/uploadHtml", formData);
      console.log(ress)
      if (ress.status === 200) {
        setCoded(ress.data.code)
        setUrl(ress.data.url)
        setOpen(true);
      }


    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    } finally {
      setisLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        editor.Assets.add({ src: dataUrl });
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const cmdButtons: CommandButton[] = [

    {
      id: "core:undo",
      iconPath: mdiArrowULeftTop,
      disabled: () => !UndoManager.hasUndo(),
    },
    {
      id: "core:redo",
      iconPath: mdiArrowURightTop,
      disabled: () => !UndoManager.hasRedo(),
    },

    {
      id: "core:brush",
      iconPath: mdiBrush,
    },
    {
      id: "core:settings",
      iconPath: mdiCog,
    },

    {
      id: "core:upload",
      iconPath: mdiCloudUpload,
      disabled: () => isLoading,
    },
    {
      id: "core:publish",
      iconPath: isLoading ? mdiLoading : publish,
      disabled: () => isLoading,
    },
  ];

  const handleButtonClick = (id: string, options: Record<string, any>) => {
    setActiveTab(id);
    const tabIds = [
      "core:brush",
      "core:settings",
      "core:layers",
      "core:grid",
      "core:text",
    ];
    if (tabIds.includes(id)) {
      // setActiveTab(id);
      setSidebarState(id);
    } else {
      Commands.isActive(id) ? Commands.stop(id) : Commands.run(id, options);
    }
  };


  

  // Add the custom upload command to GrapesJS
  useEffect(() => {
    editor.Commands.add("core:publish", {
      run: (handleUpload),
    });
    editor.Commands.add("core:upload", {
      run: () => setOpenUpload(true)
    });
    editor.Commands.add("core:image", {
      run: () => {
        // const inputElement = document.getElementById(
        //   "imageUploadInput",
        // ) as HTMLInputElement;
        // inputElement?.click();

        // alert("hello")
      },
    });
  }, [editor]);

  return (
    <div className={cx("flex flex-row gap-3", className)}>
      <input
        type="file"
        id="imageUploadInput"
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImageUpload}
      />
      <CustomModal
        open={openUpload}
        title={"Upload"}


        close={() => setOpenUpload(false)}
      ><CustomAssetManagerPdf

        /></CustomModal>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="w-full flex flex-col gap-6 !pt-8 rounded-lg">
          <h1 className="text-black text-4xl font-semibold text-center">Scan Qr</h1>
          <QRCode value={coded} className="!w-60  !h-60 mx-auto" />
          <p className="text-center tracking-widest p-2 text-black text-4xl font-mono rounded-lg w-fit mx-auto font-bold">
            {coded}
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 w-fit mx-auto p-3 text-white rounded-lg"
          >
            Preview
          </a>
        </Box>
      </Modal>
      <div className="flex flex-row gap-2">
        {cmdButtons.map(({ id, iconPath, disabled, options = {} }) => (
          <button
            key={id}
            type="button"
            className={cx(

              id !== "core:publish" && "rounded text-[#000000B8] p-2",

              id !== "core:upload" && "rounded text-[#000000B8] p-2 ",

              id === "core:publish" &&
              "flex flex-row items-center rounded p-2 px-3 bg-[#1D85E6] hover:!bg-blue-700  text-white",

              activeTab === id && "text-[#1D85E6] bg-[#D1EAFF]",

              id === "core:upload" &&
              "flex flex-row items-center rounded p-2 px-3 bg-white transition-colors duration-300 hover:!bg-gray-300 text-white",
              activeTab === id && "textblack bg-[#D1EAFF]",

              disabled?.() && "opacity-50",
            )}
            onClick={() => handleButtonClick(id, options)}
            disabled={disabled?.()}
          >
            <Icon
              path={iconPath}
              size={1}
              className={cx(
                id === "core:publish" && isLoading && "animate-spin",
                id === "core:upload" && "hidden",
                id === "core:publish" && "hidden",
              )}
            />
            {id === "core:upload" && (
              <img src={upload} alt="" />
            )}
            {id === "core:publish" && (
              <img src={publish} alt="" />
            )}
            {id === "core:publish" && (
              <p className="text-white text-sm pl-1">Publish</p>
            )}
            {id === "core:upload" && (
              <p className="text-gray-700 font-manrope font-semibold text-sm pl-1">Upload</p>
            )}
          </button>
        ))}
      </div>
      {
        showAlert && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg z-50">
            Image has been added
          </div>
        )
      }
    </div >
  );
}

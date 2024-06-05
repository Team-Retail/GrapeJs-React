import { AssetsResultProps, useEditor } from "@grapesjs/react";
import { mdiClose, mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import type { Asset } from "grapesjs";
import { BTN_CLS } from "./common.ts";
import axios from "axios";
import { BASE_URL } from "../utils/base.ts";
const saveJsonApiUrl = "http://54.227.212.214:5000/upload";
const savePdfApiUrl = "http://54.227.212.214:5000/upload_pdf";
import { mdiCloudUploadOutline } from '@mdi/js';
import { listObjects } from "../utils/helpers.ts";
import { useEffect, useMemo, useState } from "react";
import PdfAccordian from "./PdfAccordian.tsx";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


export default function CustomAssetManagerPdf({close}) {
  const [assets, setAssets] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const editor = useEditor();
  const [isLoading, setIsLoading] = useState(false)






  const remove = (asset: Asset) => {
    editor.Assets.remove(asset);
  };

  const parseUrl = (url: string) => {
    const path = new URL(url).pathname;
    return path.substring(1, path.lastIndexOf('/'));
  };



  const addAsset = async (event: React.ChangeEvent<HTMLInputElement>) => {
    

    const files = event.target.files;
    const user = JSON.parse(localStorage.getItem("userDetails"));
    if (files && files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('s3_id', user._id + ":" + file.name);

      let apiUrl;
      const fileType = file.type;

      // Check if the file is an image or a PDF
      if (fileType.startsWith('image/')) {
        apiUrl = saveJsonApiUrl;
      } else if (fileType === 'application/pdf') {
        apiUrl = savePdfApiUrl;
      } else {
        console.error('Unsupported file type. Only images and PDFs are allowed.');
        return;
      }

      try {
        setIsLoading(true)
        const response = await axios.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const fileUrl = response.data.url;
        setSnackbarMessage("Uploaded. Successfully...");
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

      
        console.log(fileUrl)
        
        editor.Assets.add({ src: fileUrl });
        setAssets(editor.Assets.getAll().models)
        close()
      } catch (error) {
        console.error('Error uploading file:', error);
      }
      finally{
        setIsLoading(false)
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };



  return (
    <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-scroll scrollbar-thin bg-white">
      {/* TODO: global snackbar component with a context provider */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        {/* @ts-ignore */}
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className="relative group bg-white rounded overflow-hidden border-dashed border-2 border-gray-300 min-h-[200px] flex flex-col gap-3 items-center justify-center">
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={addAsset}
          accept="image/*,application/pdf"
          disabled={isLoading}
        />
        <Icon path={isLoading ? mdiLoading:mdiCloudUploadOutline} size={1} className={isLoading&&"animate-spin"} />
        <div className="flex flex-col text-center">
          <p className="font-manrope">Click to upload an image or PDF</p>
          <p className="font-manrope text-gray-500 text-xs">JPEG, PNG and PDF formats, up to 50MB, or PDF</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 flex-wrap">

      </div>
    </div>
  );
}

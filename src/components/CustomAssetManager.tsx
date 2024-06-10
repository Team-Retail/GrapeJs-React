import { AssetsResultProps, useEditor } from "@grapesjs/react";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import type { Asset } from "grapesjs";
import { BTN_CLS } from "./common.ts";
import axios from "axios";
import { BASE_URL } from "../utils/base.ts";
const saveJsonApiUrl = BASE_URL + "/api/auth/upload";
import { mdiCloudUploadOutline } from '@mdi/js';
import { useMemo, useState } from "react";
import UploadedImageAssets from "./UploadedImageAssets.tsx";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export type CustomAssetManagerProps = Pick<
  AssetsResultProps,
  "assets" | "close" | "select"
>;

export default function CustomAssetManager({
  assets,
  select,
}: CustomAssetManagerProps) {
  const [count, setCount] = useState(0)
  const [value, setValue] = useState(0);

  const editor = useEditor();

  const remove = (asset: Asset) => {
    editor.Assets.remove(asset);
  };

  const addAsset = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const saveJsonApiUrl = BASE_URL +"/api/auth/upload";
    const user = JSON.parse(localStorage.getItem("userDetails"));
    if (files && files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fieldName', user.companyName + "/" + user._id+"/images");
      // formData.append('s3_id', user._id);


      try {
        const response = await axios.post(saveJsonApiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const imageUrl = response.data.url;
        editor.Assets.add({ src: imageUrl });
        setCount(count + 1);  
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
  const isImage = (src) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const ext = src.split('.').pop().toLowerCase();
    return imageExtensions.includes(ext);
  };

  const imgAssets = useMemo(() => {
    return assets.filter(a => {
      const src = a.get('src');
      return  isImage(src);
    });
  }, [count,assets]);
  const otherAssets = useMemo(() => {
    return assets.filter(a => {
      const src = a.get('src');
      return  !isImage(src);
    });
  }, [count,assets]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div className=" flex flex-col gap-4 max-h-[60vh] overflow-y-scroll scrollbar-thin bg-white  ">
      <div className="relative group bg-white rounded overflow-hidden border-dashed border-2 border-gray-300 min-h-[200px] flex flex-col gap-3 items-center justify-center">
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={addAsset}
          accept="image/*"
        />
        <Icon path={mdiCloudUploadOutline} size={1} />
        <div className="flex flex-col  text-center ">
          <p className="font-manrope ">Click to upload an image</p>
          <p className="font-manrope text-gray-500 text-xs"> JPEG, PNG formats, up to 50MB</p>
        </div>

      </div>


      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab
            label="Images"
            {...a11yProps(0)}
            sx={{
              background: value === 0 ? 'linear-gradient(to right, #1D85E6, #81C0F7)' : '#6C6C6C',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          />
          <Tab
            label="Components"
            {...a11yProps(1)}
            sx={{
              background: value === 1 ? 'linear-gradient(to right, #1D85E6, #81C0F7)' : '#6C6C6C',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          />
        </Tabs>
      </Box>


      {value === 0 ? (
        <UploadedImageAssets assets={imgAssets} select={select} close={close} />

      ) : (
        <div className='flex flex-col gap-3 py-4'>
         
        </div>
      )}
      

    </div>
  );
}

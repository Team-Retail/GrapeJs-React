import { AssetsResultProps, useEditor } from "@grapesjs/react";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import type { Asset } from "grapesjs";
import { BTN_CLS } from "./common.ts";
import axios from "axios";
import { BASE_URL } from "../utils/base.ts";
const saveJsonApiUrl = BASE_URL + "/api/auth/upload";
import { mdiCloudUploadOutline } from '@mdi/js';
import { useMemo } from "react";

export type CustomAssetManagerProps = Pick<
  AssetsResultProps,
  "assets" | "close" | "select"
>;

export default function CustomAssetManager({
  assets,
  select,
}: CustomAssetManagerProps) {
  const editor = useEditor();

  const remove = (asset: Asset) => {
    editor.Assets.remove(asset);
  };

  const addAsset = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const saveJsonApiUrl = "http://54.227.212.214:5000/upload";
    const user = JSON.parse(localStorage.getItem("userDetails"));
    if (files && files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      // formData.append('fieldName', user.companyName + "_" + user.email);
      formData.append('s3_id', user._id);


      try {
        const response = await axios.post(saveJsonApiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const imageUrl = response.data.url;
        editor.Assets.add({ src: imageUrl });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
  const imgAssets = useMemo(() => {
    return assets.filter(a => !a.get('src').includes("ai-processed-pdf"))
  }, [assets])

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
      <div className="flex items-center justify-center gap-4 flex-wrap">

        {imgAssets.map((asset) => (
          <div
            key={asset.getSrc()}
            className="relative group rounded w-fit overflow-hidden"
          >
            <img className="w-48 h-48" src={asset.getSrc()} />
            <div className="flex flex-col items-center justify-end absolute top-0 left-0 w-full h-full p-5 bg-zinc-700/75 group-hover:opacity-100 opacity-0 transition-opacity">
              <button
                type="button"
                className={BTN_CLS}
                onClick={() => select(asset, true)}
              >
                Select
              </button>
              <button
                type="button"
                className="absolute top-2 right-2"
                onClick={() => remove(asset)}
              >
                <Icon size={1} path={mdiClose} />
              </button>
            </div>
          </div>
        ))}
   
      </div>

    </div>
  );
}

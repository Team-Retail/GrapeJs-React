import { AssetsResultProps, useEditor } from "@grapesjs/react";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import type { Asset } from "grapesjs";
import { BTN_CLS } from "./common.ts";

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

  const addAsset = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        editor.Assets.add({ src: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2 pr-2">
      <div className="relative group rounded overflow-hidden border-dashed border-2 border-gray-300 flex items-center justify-center">
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={addAsset}
          accept="image/*"
        />
        <div className="text-center">
          <p>Click to upload an image</p>
        </div>
      </div>
      {assets.map((asset) => (
        <div
          key={asset.getSrc()}
          className="relative group rounded overflow-hidden"
        >
          <img className="display-block" src={asset.getSrc()} />
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
  );
}

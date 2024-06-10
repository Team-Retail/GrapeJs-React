import { AssetsResultProps, useEditor } from '@grapesjs/react';
import Icon from "@mdi/react";
import { Asset } from 'grapesjs';

import { mdiClose } from '@mdi/js';
import { BTN_CLS } from './common';

type Props = Pick<
  AssetsResultProps,
  "assets" | "close" | "select"
>
const UploadedImageAssets = ({assets,select}: Props) => {
  const editor = useEditor();

  const remove = (asset: Asset) => {
    editor.Assets.remove(asset);
  };
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">

      {assets.map((asset) => (
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
  )
}

export default UploadedImageAssets
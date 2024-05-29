import * as React from "react";
import GjsEditor, {
  AssetsProvider,
  Canvas,
  ModalProvider,
} from "@grapesjs/react";
import type { Editor, EditorConfig } from "grapesjs";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MAIN_BORDER_COLOR } from "../components/common.ts";
import CustomModal from "../components/CustomModal.tsx";
import CustomAssetManager from "../components/CustomAssetManager.tsx";
import Topbar from "../components/Topbar.tsx";
import RightSidebar from "../components/RightSidebar.tsx";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const gjsOptions: EditorConfig = {
  height: "100vh",
  storageManager: {
    type: 'local',
    options: {
      local: { key: `gjsProject` }
    }
  },

  undoManager: { trackSelection: false },
  selectorManager: { componentFirst: true },
  
};

// const obj: any = {
//   "assets": [
//     {
//       "type": "image",
//       "src": "https://via.placeholder.com/350x250/78c5d6/fff",
//       "unitDim": "px",
//       "height": 0,
//       "width": 0
//     },
//     {
//       "type": "image",
//       "src": "https://via.placeholder.com/350x250/459ba8/fff",
//       "unitDim": "px",
//       "height": 0,
//       "width": 0
//     },
//     {
//       "type": "image",
//       "src": "https://via.placeholder.com/350x250/79c267/fff",
//       "unitDim": "px",
//       "height": 0,
//       "width": 0
//     },
//     {
//       "type": "image",
//       "src": "https://via.placeholder.com/350x250/c5d647/fff",
//       "unitDim": "px",
//       "height": 0,
//       "width": 0
//     },
//     {
//       "type": "image",
//       "src": "https://via.placeholder.com/350x250/f28c33/fff",
//       "unitDim": "px",
//       "height": 0,
//       "width": 0
//     }
//   ],
//   "styles": [
//     {
//       "selectors": [
//         "#islg"
//       ],
//       "style": {
//         "float": "right"
//       }
//     }
//   ],
//   "pages": [
//     {
//       "name": "Home page",
//       "frames": [
//         {
//           "component": {
//             "type": "wrapper",
//             "stylable": [
//               "background",
//               "background-color",
//               "background-image",
//               "background-repeat",
//               "background-attachment",
//               "background-position",
//               "background-size"
//             ],
//             "components": [
//               {
//                 "tagName": "h1",
//                 "type": "text",
//                 "attributes": {
//                   "id": "islg"
//                 },
//                 "components": [
//                   {
//                     "type": "textnode",
//                     "content": "Hello there!!"
//                   }
//                 ]
//               }
//             ]
//           },
//           "id": "vsyLHAOecDtqvwGe"
//         }
//       ],
//       "id": "I2iY6oHbcSsP2ZqR"
//     }
//   ]
// }

export default function GrapeJSPage() {
  const onEditor = (editor) => {
    console.log("Editor loaded");
    window.editor = editor;
  };

  return (
    <ThemeProvider theme={theme}>
      <GjsEditor
        className="gjs-custom-editor text-white bg-slate-900"
        grapesjs="https://unpkg.com/grapesjs"
        grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
        options={gjsOptions}
        plugins={[
          {
            id: "gjs-blocks-basic",
            src: "https://unpkg.com/grapesjs-blocks-basic",
          },
        ]}
        onEditor={onEditor}
      >
        <div className={`flex h-full border-t ${MAIN_BORDER_COLOR}`}>
          <div className="gjs-column-m flex flex-col flex-grow">
            <Topbar className="min-h-[48px]" />
            <Canvas className="flex-grow gjs-custom-editor-canvas" />
          </div>
          <RightSidebar
            className={`gjs-column-r w-[300px] border-l ${MAIN_BORDER_COLOR}`}
          />
        </div>
        <ModalProvider>
          {({ open, title, content, close }) => (
            <CustomModal
              open={open}
              title={title}
              children={content}
              close={close}
            />
          )}
        </ModalProvider>
        <AssetsProvider>
          {({ assets, select, close, Container }) => (
            <Container>
              <CustomAssetManager
                assets={assets}
                select={select}
                close={close}
              />
            </Container>
          )}
        </AssetsProvider>
      </GjsEditor>
    </ThemeProvider>
  );
}

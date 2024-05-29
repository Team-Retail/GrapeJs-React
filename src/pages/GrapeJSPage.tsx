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
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const gjsOptions = {
  height: "100vh",
  storageManager: {
    type: 'local',
    options: {
      local: { key: `gjsProject` }
    }
  },
  undoManager: { trackSelection: false },
  selectorManager: { componentFirst: true },
  styleManager: {
    sectors: [{
      name: 'General',
      open: false,
      buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
    }, {
      name: 'Dimension',
      open: false,
      buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
    }, {
      name: 'Typography',
      open: false,
      buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-shadow'],
      properties: [
        { name: 'Font', property: 'font-family' },
        { name: 'Weight', property: 'font-weight' },
        { name: 'Font color', property: 'color' },
        {
          property: 'font-size',
          type: 'select',
          defaults: '32px',
          options: [
            { value: '12px', name: '12px' },
            { value: '14px', name: '14px' },
            // Add more font size options here
          ]
        }
      ],
    }, {
      name: 'Decorations',
      open: false,
      buildProps: ['opacity', 'border-radius', 'border', 'box-shadow', 'background'],
    }, {
      name: 'Extra',
      open: false,
      buildProps: ['transition', 'perspective', 'transform'],
    }]
  }
};

const tailwindClasses = [
  'p-1', 'p-2', 'p-3', 'p-4', 'p-5',
  'm-1', 'm-2', 'm-3', 'm-4', 'm-5',
  'text-xs', 'text-sm', 'text-lg', 'text-xl', 'text-2xl',
  // Add more Tailwind CSS classes as needed
];

const editorPlugins = (editor) => {
  // Load Tailwind classes into style manager
  const styleManager = editor.StyleManager;
  tailwindClasses.forEach(cls => {
    styleManager.addProperty('Extra', {
      name: cls,
      property: cls,
      type: 'class', // Use 'class' type for Tailwind classes
    });
  });

  // Extend CSS property units
  editor.StyleManager.getSectors().forEach(sector => {
    sector.getProperties().forEach(property => {
      property.set({
        units: ['px', 'rem', 'em', '%', 'vw', 'vh'],
      });
    });
  });
};


export default function GrapeJSPage() {
  const onEditor = (editor) => {
    console.log("Editor loaded");
    window.editor = editor;
    editorPlugins(editor);
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

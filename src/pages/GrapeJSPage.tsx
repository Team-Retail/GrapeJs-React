import * as React from 'react';
import GjsEditor, {
  AssetsProvider,
  Canvas,
  ModalProvider,
} from '@grapesjs/react';
import type { Editor, EditorConfig } from 'grapesjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MAIN_BORDER_COLOR } from '../components/common.ts';
import CustomModal from '../components/CustomModal.tsx';
import CustomAssetManager from '../components/CustomAssetManager.tsx';
import Topbar from '../components/Topbar.tsx';
import RightSidebar from '../components/RightSidebar.tsx';
import '../style.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const sessionStoragePlugin = (editor: Editor) => {
  editor.Storage.add('session', {
    async load(options = {}) {
      console.log("loading...", options);
      const data = sessionStorage.getItem(options.key);
      return data ? JSON.parse(data) : {};
    },
    async store(data, options = {}) {
      console.log("storing...", data, options);
      sessionStorage.setItem(options.key, JSON.stringify(data));
    }
  });
  editor.Storage.load=(options)=>{
    console.log("loading...", options);
    const data = sessionStorage.getItem(options.key);
    return data ? JSON.parse(data) : {};
  
  }
};

const gjsOptions: EditorConfig = {
  height: '100vh',
  storageManager: {
    type: 'session',
    options: {
      session: { key: 'myKey' }
    }
  },
  undoManager: { trackSelection: false },
  selectorManager: { componentFirst: true },
  projectData: {
    assets: [
      'https://via.placeholder.com/350x250/78c5d6/fff',
      'https://via.placeholder.com/350x250/459ba8/fff',
      'https://via.placeholder.com/350x250/79c267/fff',
      'https://via.placeholder.com/350x250/c5d647/fff',
      'https://via.placeholder.com/350x250/f28c33/fff',
    ],
    pages: [
      {
        name: 'Home page',
        component: `<h1>GrapesJS React Custom UI</h1>`,
      },
    ],
  },
};

export default function GrapeJSPage() {
  const onEditor = (editor: Editor) => {
    (window as any).editor = editor;
    editor.on('storage:start:load', () => console.log('start:load'));
    editor.on('storage:load', (e) => console.log('loaded', e));
    editor.on('storage:start:store', () => console.log('start:store'));
    editor.on('storage:store', (e) => console.log('stored', e));
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
            id: 'gjs-blocks-basic',
            src: 'https://unpkg.com/grapesjs-blocks-basic',
          },
          sessionStoragePlugin
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

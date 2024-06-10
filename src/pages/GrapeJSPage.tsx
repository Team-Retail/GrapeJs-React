import GjsEditor, {
  AssetsProvider,
  Canvas,
  ModalProvider,
} from "@grapesjs/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from 'axios';
import * as React from "react";
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS
import CustomAssetManager from "../components/CustomAssetManager.tsx";
import CustomModal from "../components/CustomModal.tsx";
import SidebarContent from "../components/SidebarContent.tsx";
import Topbar from "../components/Topbar.tsx";
import { MAIN_BORDER_COLOR } from "../components/common.ts";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Template1, Template2 } from "../utils/template.ts";
import { BASE_URL } from "../utils/base.ts";
import { useNavigate } from "react-router-dom";
// import 'slick-carousel/slick/slick.min.js';

const theme = createTheme({
  palette: {
    mode: "light",
  },
});




const saveJsonApiUrl = BASE_URL + "/api/auth/save-json";
const getJsonApiUrl = BASE_URL + "/api/auth/get-json/";

// Function to save data to remote server
// @ts-ignore

const saveData = async (data) => {
  console.log("save data called")
  // @ts-ignore

  const userId = JSON.parse(localStorage.getItem("userDetails"))._id;

  try {
    const response = await axios.post(saveJsonApiUrl, {
      userId,
      JSONString: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

// Function to load data from remote server
const loadData = async () => {
  try {
    // @ts-ignore

    const userId = JSON.parse(localStorage.getItem("userDetails"))._id;

    const response = await axios.get(getJsonApiUrl + userId);
    // if(response.status===201){

    // }
    return JSON.parse(response.data.JSONString);
    // return Template1
  } catch (error) {
    console.error("Error loading data:", error);
  }
};


const gjsOptions = {
  height: "100vh",
  storageManager: {
    type: 'remote',
  },
  undoManager: { trackSelection: false },
  selectorManager: { componentFirst: true ,
  },
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
        {
          name: 'Font Family',
          property: 'font-family',
          type: 'select',
          defaults: 'Arial, Helvetica, sans-serif',
          options: [
            { value: 'Arial, Helvetica, sans-serif', name: 'Arial' },
            { value: '"Times New Roman", Times, serif', name: 'Times New Roman' },
            { value: 'Georgia, serif', name: 'Georgia' },
            { value: 'Courier, monospace', name: 'Courier' },
            { value: 'Verdana, Geneva, sans-serif', name: 'Verdana' },
            // Add more font families as needed
          ],
        },
        {
          name: 'Font Weight',
          property: 'font-weight',
          type: 'select',
          defaults: '400',
          options: [
            { value: '100', name: 'Thin' },
            { value: '200', name: 'Extra Light' },
            { value: '300', name: 'Light' },
            { value: '400', name: 'Normal' },
            { value: '500', name: 'Medium' },
            { value: '600', name: 'Semi Bold' },
            { value: '700', name: 'Bold' },
            { value: '800', name: 'Extra Bold' },
            { value: '900', name: 'Black' },
          ],
        },
        {
          name: 'Font Size',
          property: 'font-size',
          type: 'select',
          defaults: '16px',
          options: [
            { value: '10px', name: '10px' },
            { value: '12px', name: '12px' },
            { value: '14px', name: '14px' },
            { value: '16px', name: '16px' },
            { value: '18px', name: '18px' },
            { value: '20px', name: '20px' },
            { value: '24px', name: '24px' },
            { value: '28px', name: '28px' },
            { value: '32px', name: '32px' },
            { value: '36px', name: '36px' },
            // Add more font sizes as needed
          ],
          units: ['px', 'em', 'rem', '%', 'vw', 'vh'],
        },
        {
          name: 'Font Color',
          property: 'color',
          type: 'color',
          defaults: '#000000',
        },
        {
          name: 'Line Height',
          property: 'line-height',
          type: 'select',
          defaults: '1.5',
          options: [
            { value: '1', name: '1' },
            { value: '1.2', name: '1.2' },
            { value: '1.5', name: '1.5' },
            { value: '2', name: '2' },
            // Add more line height options as needed
          ],
          units: ['px', 'em', 'rem', '%'],
        },
        {
          name: 'Letter Spacing',
          property: 'letter-spacing',
          type: 'select',
          defaults: '0px',
          options: [
            { value: '0px', name: '0px' },
            { value: '0.5px', name: '0.5px' },
            { value: '1px', name: '1px' },
            { value: '1.5px', name: '1.5px' },
            { value: '2px', name: '2px' },
            // Add more letter spacing options as needed
          ],
          units: ['px', 'em', 'rem'],
        },
        {
          name: 'Text Shadow',
          property: 'text-shadow',
          type: 'text-shadow',
          defaults: '0px 0px 0px #000000',
        },
      ]

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

// @ts-ignore

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
  // @ts-ignore

  editor.StyleManager.getSectors().forEach(sector => {
    // @ts-ignore

    sector.getProperties().forEach(property => {
      property.set({
        units: ['px', 'rem', 'em', '%', 'vw', 'vh'],
      });
    });
  });

  editor.BlockManager.add('carousel', {
    label: 'Carousel',
    content: `
      <div class="carousel">
        <div><img src="https://via.placeholder.com/300" /></div>
        <div><img src="https://via.placeholder.com/300" /></div>
        <div><img src="https://via.placeholder.com/300" /></div>
        <div><img src="https://via.placeholder.com/300" /></div>
      </div>
      <style>
        .carousel {
          display: flex;
          overflow: hidden;
        }
        .carousel div {
          flex: 1;
        }
      </style>
      <script>
       
      </script>
    `,
    category: 'Basic',
  });

  // Custom save action
};

export default function GrapeJSPage() {
  const [activeTab, setActiveTab] = React.useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('Template1');
  const navigate = useNavigate()
  React.useEffect(() => {
    userFunc()

  }, [])

  const userFunc = () => {
    const user = JSON.parse(localStorage.getItem("userDetails"))
    console.log("user", user)
    if (!user) {
      navigate("/")
    }
    // @ts-ignore
    if (!user?.hasSocial) {
      navigate("/company")

    }
  }

  const onEditor = async (editor) => {
    console.log("Editor loaded");
    // @ts-ignore
    window.editor = editor;
    editorPlugins(editor);

    editor.Storage.add('remote', {
      async load() {
        const initialData = await loadData();
        return initialData;
      },
      async store(data) {
        console.log(data)
        return await saveData(data);
      },
    });

    // Load initial data
    const initialData = await loadData();
    editor.loadProjectData(initialData);
  };

  const handleTemplateChange = async (template) => {
    setSelectedTemplate(template);
    // Reload the editor with the new template
    // @ts-ignore
    const editor = window.editor;
    if (editor) {
      const temp = template === 'Template1' ? Template1 : Template2
      editor.loadProjectData(temp);
      await saveData(temp)
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GjsEditor
        className="gjs-custom-editor text-white  bg-white"
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
        <Topbar
          setSidebarState={setActiveTab}
          selectedTemplate={selectedTemplate}
          onTemplateChange={handleTemplateChange}
        />
        <div className={`flex h-full border-t ${MAIN_BORDER_COLOR}`}>
          <div className="gjs-column-m flex flex-col mt-[18vh] mr-[400px] ml-8 w-full">
            <Canvas className="gjs-custom-editor-canvas w-full scrollbar-none shadow-[0_3px_10px_rgb(0,0,0,0.2)]" />
          </div>
          <SidebarContent activeTab={activeTab} />
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
          {(props) => {
            const { assets, select, close, Container } = props
            // console.log("home",props)
            return (
              <Container className="!bg-white opacity-100">
                <CustomAssetManager
                  assets={assets}
                  select={select}
                  close={close}
                />
              </Container>
            )
          }}
        </AssetsProvider>
      </GjsEditor>
    </ThemeProvider>
  );
}

import GjsEditor, {
  AssetsProvider,
  Canvas,
  ModalProvider,
} from "@grapesjs/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import * as React from "react";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS
import CustomAssetManager from "../components/CustomAssetManager.tsx";
import CustomModal from "../components/CustomModal.tsx";
import SidebarContent from "../components/SidebarContent.tsx";
import Topbar from "../components/Topbar.tsx";
import { MAIN_BORDER_COLOR } from "../components/common.ts";
import { getBaseUrl } from "../utils/base.ts";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const saveJsonApiUrl = getBaseUrl() + "/api/auth/save-json";
const getJsonApiUrl = getBaseUrl() + "/api/auth/get-json/";

// Function to save data to remote server
// @ts-ignore

const saveData = async (data) => {
  console.log("save data called");
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
    type: "remote",
  },

  undoManager: { trackSelection: false },
  selectorManager: { componentFirst: true },
  styleManager: {
    sectors: [
      {
        name: "General",
        open: false,
        buildProps: [
          "float",
          "display",
          "position",
          "top",
          "right",
          "left",
          "bottom",
        ],
      },
      {
        name: "Dimension",
        open: false,
        buildProps: [
          "width",
          "height",
          "max-width",
          "min-height",
          "margin",
          "padding",
        ],
      },
      {
        name: "Typography",
        open: false,
        buildProps: [
          "font-family",
          "font-size",
          "font-weight",
          "letter-spacing",
          "color",
          "line-height",
          "text-shadow",
        ],
        properties: [
          { name: "Font", property: "font-family" },
          { name: "Weight", property: "font-weight" },
          { name: "Font color", property: "color" },
          {
            property: "font-size",
            type: "select",
            defaults: "32px",
            options: [
              { value: "12px", name: "12px" },
              { value: "14px", name: "14px" },
              // Add more font size options here
            ],
          },
        ],
      },
      {
        name: "Decorations",
        open: false,
        buildProps: [
          "opacity",
          "border-radius",
          "border",
          "box-shadow",
          "background",
        ],
      },
      {
        name: "Extra",
        open: false,
        buildProps: ["transition", "perspective", "transform"],
      },
    ],
  },
};

const tailwindClasses = [
  "p-1",
  "p-2",
  "p-3",
  "p-4",
  "p-5",
  "m-1",
  "m-2",
  "m-3",
  "m-4",
  "m-5",
  "text-xs",
  "text-sm",
  "text-lg",
  "text-xl",
  "text-2xl",
  // Add more Tailwind CSS classes as needed
];

// @ts-ignore

const editorPlugins = (editor) => {
  // Load Tailwind classes into style manager
  const styleManager = editor.StyleManager;
  tailwindClasses.forEach((cls) => {
    styleManager.addProperty("Extra", {
      name: cls,
      property: cls,
      type: "class", // Use 'class' type for Tailwind classes
    });
  });

  // Extend CSS property units
  // @ts-ignore

  editor.StyleManager.getSectors().forEach((sector) => {
    // @ts-ignore

    sector.getProperties().forEach((property) => {
      property.set({
        units: ["px", "rem", "em", "%", "vw", "vh"],
      });
    });
  });

  // Add the custom carousel block
  editor.BlockManager.add("carousel-block", {
    label: "Carousel",
    category: "Components",
    content: `
      <div class="custom-carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="https://via.placeholder.com/350x250" alt="...">
          </div>
          <div class="carousel-item">
            <img src="https://via.placeholder.com/350x250" alt="...">
          </div>
          <div class="carousel-item">
            <img src="https://via.placeholder.com/350x250" alt="...">
          </div>
        </div>
        <button class="carousel-control-prev">&lt;</button>
        <button class="carousel-control-next">&gt;</button>
      </div>
      <style>
        .custom-carousel {
          position: relative;
          width: 100%;
          max-width: 750px;
          margin: auto;
          overflow: hidden;
        }
        .carousel-inner {
          display: flex;
          transition: transform 0.5s ease;
        }
        .carousel-item {
          min-width: 100%;
          box-sizing: border-box;
        }
        .carousel-control-prev, .carousel-control-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          cursor: pointer;
          padding: 10px;
        }
        .carousel-control-prev {
          left: 10px;
        }
        .carousel-control-next {
          right: 10px;
        }
      </style>
      <script>
        (function() {
          const carousel = document.querySelector('.custom-carousel');
          if (carousel) {
            const inner = carousel.querySelector('.carousel-inner');
            const prev = carousel.querySelector('.carousel-control-prev');
            const next = carousel.querySelector('.carousel-control-next');
            let index = 0;
            const items = carousel.querySelectorAll('.carousel-item');

            function showItem(idx) {
              inner.style.transform = 'translateX(' + (-idx * 100) + '%)';
              items.forEach((item, i) => {
                item.classList.toggle('active', i === idx);
              });
            }

            prev.addEventListener('click', () => {
              index = (index > 0) ? index - 1 : items.length - 1;
              showItem(index);
            });

            next.addEventListener('click', () => {
              index = (index < items.length - 1) ? index + 1 : 0;
              showItem(index);
            });

            showItem(index);
          }
        })();
      </script>
    `,
    attributes: { class: "fa fa-images" },
  });

  // Re-evaluate scripts
  editor.on("component:add", (component) => {
    const scriptEl = component.view.$el.find("script");
    if (scriptEl.length) {
      scriptEl.remove();
      const newScriptEl = document.createElement("script");
      newScriptEl.innerHTML = scriptEl.html();
      component.view.$el[0].appendChild(newScriptEl);
    }
  });

  // Custom save action
};

export default function GrapeJSPage() {
  // @ts-ignore

  const onEditor = async (editor) => {
    console.log("Editor loaded");
    // @ts-ignore

    window.editor = editor;
    editorPlugins(editor);
    // Load data when the editor initializes
    // const initialData = await loadData();
    // if (initialData) {
    //   editor.setComponents(JSON.parse(initialData));
    // }

    editor.Storage.add("remote", {
      async load() {
        const initialData = await loadData();
        console.log("initialData", initialData);
        return initialData;
      },
      // @ts-ignore

      async store(data) {
        console.log(data);
        return await saveData(data);
      },
    });
  };

  const [activeTab, setActiveTab] = React.useState<string | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <GjsEditor
        className="gjs-custom-editor text-white bg-white"
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
        <Topbar setSidebarState={setActiveTab} />
        <div className={`flex h-full border-t ${MAIN_BORDER_COLOR}`}>
          <div className="gjs-column-m flex flex-col mt-[18vh] mr-[30vw] ml-8 w-full">
            <Canvas className="gjs-custom-editor-canvas w-full shadow-xl" />
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

import {
  BlocksProvider,
  LayersProvider,
  PagesProvider,
  SelectorsProvider,
  StylesProvider,
  TraitsProvider,
} from "@grapesjs/react";
import CustomBlockManager from "./CustomBlockManager.tsx";
import CustomPageManager from "./CustomPageManager.tsx";
import CustomLayerManager from "./CustomLayerManager.tsx";
import CustomSelectorManager from "./CustomSelectorManager.tsx";
import CustomStyleManager from "./CustomStyleManager.tsx";
import CustomTraitManager from "./CustomTraitManager.tsx";

// Define a new component for the sidebar content
function SidebarContent({ activeTab }: { activeTab: string | null }) {
  return (
    <div className="bg-[#DEF1FF] flex flex-col text-[#053663] fixed top-[16vh] right-8 h-[80%] w-[300px] m-4 rounded-xl p-4 z-50 overflow-y-auto flex-grow">
      {/* {activeTab === ("core:brush" || null) && ( */}
      <>
        <SelectorsProvider>
          {(props) => <CustomSelectorManager {...props} />}
        </SelectorsProvider>
        <StylesProvider>
          {(props) => <CustomStyleManager {...props} />}
        </StylesProvider>
      </>
      {/* )} */}
      {activeTab === "core:settings" && (
        <TraitsProvider>
          {(props) => <CustomTraitManager {...props} />}
        </TraitsProvider>
      )}
      {activeTab === "core:layers" && (
        <LayersProvider>
          {(props) => <CustomLayerManager {...props} />}
        </LayersProvider>
      )}
      {activeTab === "core:grid" && (
        <BlocksProvider>
          {(props) => <CustomBlockManager {...props} />}
        </BlocksProvider>
      )}
      {activeTab === "core:text" && (
        <PagesProvider>
          {(props) => <CustomPageManager {...props} />}
        </PagesProvider>
      )}
      {/* {activeTab === null && <div>Select a tab to view content</div>} */}
    </div>
  );
}

export default SidebarContent;

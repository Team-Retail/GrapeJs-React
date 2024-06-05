import {
  AssetsProvider,
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
import SidebarTabComponent from "./SidebarTabComponent.tsx";

// Define a new component for the sidebar content
function SidebarContent({ activeTab }: { activeTab: string | null }) {

  return (
    <div className="bg-slate-50 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] flex flex-col text-[#053663] fixed top-[16vh] right-8 h-[80%] w-[340px] mt-4  rounded-xl p-4 overflow-y-auto flex-grow">
      {/* {activeTab === ("core:brush" || null) && (
       )}  */}

      <AssetsProvider>
        {(props) => (
          <SidebarTabComponent />
        )}

      </AssetsProvider>

      <>
        {/* <SelectorsProvider>
          {(props) => <CustomSelectorManager {...props} />}
        </SelectorsProvider> */}
        <StylesProvider>
          {(props) => <CustomStyleManager {...props} />}
        </StylesProvider>
      </>
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
      {/* {activeTab === "core:grid" && (
      )} */}

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

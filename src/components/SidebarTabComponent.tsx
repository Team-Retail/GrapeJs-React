import React, { useEffect, useMemo, useState } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
  BlocksProvider,
  LayersProvider,
  PagesProvider,
  SelectorsProvider,
  StylesProvider,
  TraitsProvider,
  useEditor,
} from "@grapesjs/react";
import CustomBlockManager from "./CustomBlockManager.tsx";
import { Asset } from 'grapesjs';
import PdfAccordian from './PdfAccordian.tsx';
import { BASE_URL } from '../utils/base.ts';
import axios from 'axios';
const saveEditorJsonApiUrl = BASE_URL+ "/api/auth/save-json";






function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const SidebarTabComponent = () => {
  const editor = useEditor()
  const [value, setValue] = React.useState(0);
  const [assets, setAssets] = useState([])

  const saveData = async () => {
    console.log("save data called")
    // @ts-ignore

    const userId = JSON.parse(localStorage.getItem("userDetails"))._id;

    try {
      const response = await axios.post(saveEditorJsonApiUrl, {
        userId,
        JSONString: JSON.stringify(editor.getProjectData()),
      });
      return response.data;
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };





  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  useEffect(() => {
    setAssets(editor.Assets.getAll())
    editor.on('asset', (args) => {
      console.log(args)
      if (args.event === "update" ){
        console.log(args.model.models)
        setAssets(args.model.models)
        saveData()
      }
      if (args.event === "reset" ){
        console.log("reset",args.model.models)
        setAssets(args.model.models)
      }
    })
    
  

  }, [])
  const pdfAssets = useMemo(() => {
    return assets.filter(a => a.get('src').includes("ai-processed-pdf"))
  }, [assets])
  console.log("assets",assets,pdfAssets)
  return (
    <div className='w-full '>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Add Sections" {...a11yProps(0)} />
          <Tab label="Components" {...a11yProps(1)} />
        </Tabs>
      </Box>

      {value === 0 ? (<BlocksProvider>
        {(props) => <CustomBlockManager {...props} />}
      </BlocksProvider>) : (
        <div className='flex flex-col gap-3 py-4'>
            {
              pdfAssets.map(item => (
                <PdfAccordian key={item.cid} item={item} />
              ))
            }
        </div>
      )}

    </div>
  )
}

export default SidebarTabComponent
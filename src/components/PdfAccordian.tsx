import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import pdficon from "../assets/pdficon.png";

import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import { listObjects } from '../utils/helpers';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useEditor } from "@grapesjs/react";

interface Image {
  key: string;
  url: string;
}

interface PageImages {
  [key: string]: Image[];
}

const PdfAccordion = ({ item }) => {
  const editor = useEditor(); // Get the GrapesJS editor instance
  const [group, setGroup] = useState<PageImages>({});
  const [selectedPage, setSelectedPage] = useState<string | number>('');

  const itemUrl = item.get("src");

  const parseUrl = (url: string) => {
    const path = new URL(url).pathname;
    return path.substring(1, path.lastIndexOf('/'));
  };

  const groupByPage = (images: Image[]): PageImages => {
    const grouped: PageImages = {};

    images.forEach(image => {
      const match = image.key.match(/\/(\d+)\/images\//);
      if (match) {
        const page = match[1];
        if (!grouped[page]) {
          grouped[page] = [];
        }
        grouped[page].push(image);
      }
    });

    return grouped;
  };

  const handleUploadTest = async () => {
    const REGION = import.meta.env.VITE_APP_AWS_REGION; // e.g., "us-west-2"
    const BUCKET_NAME = import.meta.env.VITE_APP_AWS_BUCKET_NAME;
    const folder = itemUrl;

    const parsed = parseUrl(folder);
    const objects = await listObjects(parsed);
    const images = objects.filter(obj => obj.Key.endsWith('.png')).map(obj => ({
      key: obj.Key,
      url: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${obj.Key}`
    }));

    setGroup(groupByPage(images));
    if (Object.keys(group).length > 0) {
      setSelectedPage(Object.keys(group)[0]);
    }
  };

  useEffect(() => {
    handleUploadTest();
  }, []);

  const handlePageChange = (event) => {
    setSelectedPage(event.target.value);
  };

  const handleDragStart = (event, image) => {
    event.dataTransfer.setData('text/plain', image.url);
  };

  return (
    <Accordion className='!bg-[#B5DFFF] !bg-opacity-30'>
      <AccordionSummary
        expandIcon={<Icon path={mdiChevronDown} size={1} />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography className='flex gap-1'>
          <img src={pdficon} alt="" className='w-7 h-7' />
          {itemUrl.split(":")[2].split(".pdf")[0] + ".pdf"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="w-full bg-white p-2 rounded-lg flex flex-col">
          <div className="flex justify-between">
            <h1 className='text-xs text-gray-700 font-manrope font-semibold my-auto'>Image Components</h1>
            <div className="flex gap-1">
              <span className='text-xs font-manrope my-auto text-gray-700 font-semibold'>Page:</span>

            <Select
              value={selectedPage}
              onChange={handlePageChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Select Page' }}
              sx={{
                color: "black",
                "& .MuiSelect-icon": {
                  color: "black",
                },
                "& .MuiOutlinedInput-root": {
                  paddingTop: "4px",
                  paddingBottom: "4px",
                },
                "& .MuiSelect-select": {
                  paddingTop: "4px",
                  paddingBottom: "4px",
                },
              }}
            >
              {Object.keys(group).map(page => (
                <MenuItem key={page} value={page}>
                  {page}
                </MenuItem>
              ))}
            </Select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap max-h-[300px] scrollbar-thin overflow-y-scroll items-center justify-center gap-2">
            {group[selectedPage]?.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`Page ${selectedPage} Image ${index}`}
                className="w-24 h-24 rounded-lg mb-4"
                draggable
                onDragStart={(event) => handleDragStart(event, image)}
              />
            ))}
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default PdfAccordion;

import React, { Suspense, lazy, useEffect, useState } from 'react';
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
const LazyImage = lazy(() => import('./LazyImage'));

import { Skeleton } from '@mui/material';

interface Image {
  key: string;
  url: string;
}

interface PageImages {
  [key: string]: Image[];
}

interface GroupedImages {
  images: PageImages;
  color_palette: PageImages;
  icons: PageImages;
}

const PdfAccordion = ({ item, expanded, onChange }) => {
  const [group, setGroup] = useState<GroupedImages>({ images: {}, icons: {}, color_palette: {} });
  const [selectedPage, setSelectedPage] = useState<string | number>('');
  const [loading, setLoading] = useState(true);

  const itemUrl = item.get("src");

  const parseUrl = (url: string) => {
    const path = new URL(url).pathname;
    return path.substring(1, path.lastIndexOf('/'));
  };

  const groupByPage = (images: Image[]): GroupedImages => {
    const groupedImages: PageImages = {};
    const groupedIcons: PageImages = {};
    const groupedColorPalette: PageImages = {};

    images.forEach(image => {
      const match = image.key.match(/\/(\d+)\/(images|icons|color_palette)\//);
      if (match) {
        const page = match[1];
        const type = match[2];
        if (type === 'images') {
          if (!groupedImages[page]) {
            groupedImages[page] = [];
          }
          groupedImages[page].push(image);
        } else if (type === 'icons') {
          if (!groupedIcons[page]) {
            groupedIcons[page] = [];
          }
          groupedIcons[page].push(image);
        } else if (type === 'color_palette') {
          if (!groupedColorPalette[page]) {
            groupedColorPalette[page] = [];
          }
          groupedColorPalette[page].push(image);
        }
      }
    });

    return { images: groupedImages, icons: groupedIcons, color_palette: groupedColorPalette };
  };

  const handleUploadTest = async () => {
    setLoading(true);
    const REGION = import.meta.env.VITE_APP_AWS_REGION; // e.g., "us-west-2"
    const BUCKET_NAME = import.meta.env.VITE_APP_AWS_BUCKET_NAME;
    const folder = itemUrl;

    const parsed = parseUrl(folder);
    const objects = await listObjects(parsed);
    const images = objects.filter(obj => obj.Key.endsWith('.png')).map(obj => ({
      key: obj.Key,
      url: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${obj.Key}`
    }));

    const groupedData = groupByPage(images);
    setGroup(groupedData);
    if (Object.keys(groupedData.images).length > 0) {
      setSelectedPage(Object.keys(groupedData.images)[0]);
    }
    setLoading(false);
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
    <Accordion expanded={expanded} onChange={onChange} className='!bg-[#B5DFFF] !bg-opacity-30'>
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
          <div className="flex border-b justify-between">
            <h1 className='text-xs text-gray-500 font-manrope font-bold my-auto'>Image Components</h1>
            <div className="flex gap-1 ">
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
                {Object.keys(group.images).map(page => (
                  <MenuItem key={page} value={page}>
                    {page}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          {loading ? (
            <div className="mt-4 flex flex-wrap h-[300px] scrollbar-thin overflow-y-scroll items-center justify-center gap-2">
              {[...Array(8)].map((_, index) => (
                <Skeleton key={index} animation="wave" variant="rounded" width={112} height={112} />
              ))}
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap h-[300px] scrollbar-thin overflow-y-scroll items-center justify-center gap-2">
              {group.images[selectedPage]?.map((image, index) => (
                <SuspenseImage
                  key={image.url}
                  src={image.url}
                  alt={`Page ${selectedPage} Image ${index}`}
                  className="w-28 h-28 rounded-lg mb-4"
                  draggable
                  onDragStart={(event) => handleDragStart(event, image)}
                />
              ))}
            </div>
          )}
          <div className="flex border-b py-2 justify-between">
            <h1 className='text-xs text-gray-500 font-manrope font-bold my-auto'>Icon Components</h1>
          </div>
          {loading ? (
            <div className="mt-4 flex flex-wrap h-[300px] scrollbar-thin overflow-y-scroll items-center justify-center gap-2">
              {[...Array(8)].map((_, index) => (
                <Skeleton key={index} animation="wave" variant="rounded" width={112} height={112} />
              ))}
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap h-[300px] scrollbar-thin overflow-y-scroll items-center justify-center gap-2">
              {group.icons[selectedPage]?.map((image, index) => (
                <SuspenseImage
                  key={image.url}
                  src={image.url}
                  alt={`Page ${selectedPage} Icon ${index}`}
                  className="w-20 h-20 rounded-lg mb-4"
                  draggable
                  onDragStart={(event) => handleDragStart(event, image)}
                />
              ))}
            </div>
          )}
          <div className="flex border-b py-2 justify-between">
            <h1 className='text-xs text-gray-500 font-manrope font-bold my-auto'>Color Palette</h1>
          </div>
          {/* {loading ? (
            <div className="mt-4 flex flex-wrap h-[300px] scrollbar-thin overflow-y-scroll items-center justify-center gap-2">
              {[...Array(8)].map((_, index) => (
                <Skeleton key={index} animation="wave" variant="rounded" width={112} height={112} />
              ))}
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap h-[300px] scrollbar-thin overflow-y-scroll items-center justify-center gap-2">
              <SuspenseImage
                key={group?.color_palette[selectedPage][0]?.url}
                src={group?.color_palette[selectedPage][0]?.url}
                alt={`Page ${selectedPage} Icon `}
                className="w-20 h-20 rounded-lg mb-4"
              />
             
            </div>
          )} */}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default PdfAccordion;

const SuspenseImage = ({ src, alt, ...props }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [src]);

  return (
    <Suspense fallback={<Skeleton animation="wave" variant="rounded" width={112} height={112} {...props} />}>
      <LazyImage
        src={src}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        style={{ display: loading ? 'none' : 'block' }}
        {...props}
      />
    </Suspense>
  );
};

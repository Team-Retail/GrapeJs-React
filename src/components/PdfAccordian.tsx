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
  full_text: PageImages;
}

const PdfAccordion = ({ item, expanded, onChange }) => {
  const [group, setGroup] = useState<GroupedImages>({ images: {}, icons: {}, color_palette: {}, full_text: {} });
  const [selectedPage, setSelectedPage] = useState<string | number>('1');
  const [loading, setLoading] = useState(true);
  const [pageNumbers, setPageNumbers] = useState<Set<string>>(new Set());


  const itemUrl = item.get("src");
  const bool = !itemUrl.includes(".pdf")








  const groupByPage = (images, colorPaletteTexts, fullTexts) => {
    const groupedImages = {};
    const groupedIcons = {};
    const groupedColorPalette = {};
    const groupedFullText = {};
    const pageNumbersSet = new Set<string>();

    images.forEach(image => {
      const match = image.url.match(/\/(ai-processed-pdf|ai-processed-image)\/[^/]+(?:\/(\d+))?\/(images|icons|color_palette|full_text)\//);
      if (match) {
        const type = match[3];
        const page = match[1] === 'ai-processed-image' ? '1' : match[2];
        pageNumbersSet.add(page);
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
        }
      }
    });

    // Add color palette text as parsed hex values
    Object.keys(colorPaletteTexts).forEach(page => {
      pageNumbersSet.add(page);
      const hexValues = colorPaletteTexts[page].trim().split('\n');
      groupedColorPalette[page] = hexValues.map((hex, index) => ({
        key: `${page}/color_palette_${index}.txt`,
        url: hex
      }));
    });

    // Add full text files
    Object.keys(fullTexts).forEach(page => {
      pageNumbersSet.add(page);
      groupedFullText[page] = [{ key: `${page}/full_text.txt`, url: fullTexts[page] }];
    });

    setPageNumbers(pageNumbersSet);

    return { images: groupedImages, icons: groupedIcons, color_palette: groupedColorPalette, full_text: groupedFullText };
  };







  const handleUploadTest = async () => {
    setLoading(true);
    const REGION = import.meta.env.VITE_APP_AWS_REGION;
    const BUCKET_NAME = import.meta.env.VITE_APP_AWS_BUCKET_NAME;
    const folder = itemUrl.split(".amazonaws.com/")[1].replace("grapejs-templates/", "")


    const objects = await listObjects(folder);

    const images = objects.filter(obj => obj.Key.endsWith('.png')).map(obj => ({
      key: obj.Key,
      url: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${obj.Key}`
    }));

    const colorPaletteTextFiles = objects.filter(obj => obj.Key.endsWith('color_palette.txt'));
    const colorPaletteTexts = {};



    for (const file of colorPaletteTextFiles) {
      const response = await fetch(`https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${file.Key}`);
      const text = await response.text();
      "color_palette.txt"
      const temp = file.Key.split("/color_palette.txt")[0].split("/")
      const index = parseInt(temp[temp.length - 1])
      console.log("index:", index, text, itemUrl)
      if (index) {
        if (file.Key.includes("ai-processed-image")) {
          colorPaletteTexts[1] = text;

        }
        else colorPaletteTexts[index] = text;
      }
      // const match = file.Key.match(/ai-processed-image\/[^/]+\/text\/color_palette\.txt$/);
      // if (match) {
      //   const page = match[1] === 'ai-processed-image' ? '1' : match[2];
      //   colorPaletteTexts[page] = text;
      // }
    }

    const fullTextFiles = objects.filter(obj => obj.Key.endsWith('full_text.txt'));
    const fullTexts = {};

    for (const file of fullTextFiles) {
      const response = await fetch(`https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${file.Key}`);
      const text = await response.text();
      // const match = file.Key.match(/ai-processed-image\/[^/]+\/text\/full_text\.txt$/);
      const temp = file.Key.split("/text/full_text.txt")[0].split("/")
      const index = parseInt(temp[temp.length - 1])
      console.log(index, text, itemUrl)
      if (index) {
        if (file.Key.includes("ai-processed-image")) {
          fullTexts[1] = text;

        }
        else fullTexts[index] = text;
      }
      // console.log(match,file.Key)
      // if (match) {
      //   const page = match[1] === 'ai-processed-image' ? '1' : match[2];
      //   fullTexts[page] = text;
      // }
    }


    const groupedData = groupByPage(images, colorPaletteTexts, fullTexts);
    setGroup(groupedData);
    if (Object.keys(groupedData.images).length > 0) {
      setSelectedPage(Object.keys(groupedData.images)[0]);
    }
    setLoading(false);
  };








  useEffect(() => {
    handleUploadTest();
  }, [itemUrl]);



  console.log("group", group, itemUrl)

  const handlePageChange = (event) => {
    setSelectedPage(event.target.value);
  };

  const handleDragStart = (event, image) => {
    event.dataTransfer.setData('text/plain', image.url);
  };


  const getFileName = () => {
    if (!itemUrl) return "file.unknown";
    const splitItemUrl = itemUrl.split(":");

    return splitItemUrl[2].split("-")[0];
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
          {getFileName()}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className="w-full bg-white p-3 rounded-lg flex flex-col">
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
                {[...pageNumbers].map(page => (
                  <MenuItem key={page} value={page}>
                    {page}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          {loading ? (
            <div className="mt-4 flex flex-wrap h-full max-h-[300px] min-h-[200px]scrollbar-thin overflow-y-scroll items-center justify-center gap-2">
              {[...Array(8)].map((_, index) => (
                <Skeleton key={index} animation="wave" variant="rounded" width={112} height={112} />
              ))}
            </div>
          ) : group.images[selectedPage]?.length > 0 ? (
            <div className="mt-4 flex flex-wrap h-full max-h-[300px] min-h-[200px] scrollbar-thin overflow-y-scroll items-start justify-start  gap-2">
              {group.images[selectedPage].map((image, index) => (
                <SuspenseImage
                  key={image.url}
                  src={image.url}
                  alt={`Page ${selectedPage} Image ${index}`}
                  className="w-28 h-28 rounded-lg mb-4 shadow-lg"
                  draggable
                  onDragStart={(event) => handleDragStart(event, image)}
                />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-center text-gray-500 h-[100px] flex justify-center items-center">No images found</p>
          )}
          <div className="flex border-b py-2 justify-between">
            <h1 className='text-xs text-gray-500 font-manrope font-bold my-auto'>Icon Components</h1>
          </div>
          {loading ? (
            <div className="mt-4 flex flex-wrap h-full max-h-[300px] min-h-[200px] scrollbar-thin overflow-y-scroll items-center justify-center gap-2">
              {[...Array(8)].map((_, index) => (
                <Skeleton key={index} animation="wave" variant="rounded" width={112} height={112} />
              ))}
            </div>
          ) : group.icons[selectedPage]?.length > 0 ? (
              <div className="mt-4 flex flex-wrap h-full max-h-[300px] min-h-[200px] scrollbar-thin overflow-y-scroll items-start justify-start gap-2">
              {group.icons[selectedPage].map((image, index) => (
                <SuspenseImage
                  key={image.url}
                  src={image.url}
                  alt={`Page ${selectedPage} Icon ${index}`}
                  className="w-[72px] h-[72px] rounded-lg mb-4 shadow-lg"
                  draggable
                  onDragStart={(event) => handleDragStart(event, image)}
                />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-center text-gray-500 h-[100px] flex justify-center items-center">No icons found</p>
          )}
          <div className="flex border-b py-2 justify-between">
            <h1 className='text-xs text-gray-500 font-manrope font-bold my-auto'>Color Palette</h1>
          </div>
          {loading ? (
            <div className="mt-4 flex flex-wrap h-[50px] scrollbar-thin overflow-y-scroll items-center justify-center gap-2">
              <Skeleton animation="wave" variant="rounded" className='w-full h-5' />
            </div>
          ) : group.color_palette[selectedPage]?.length > 0 ? (
            <div className="mt-4 flex h-auto items-center justify-center gap-2">
              {group.color_palette[selectedPage].map((item, index) => (
                item.url.startsWith('#') ? (
                  <ColorPalette key={index} hexValues={item.url.split('\n')} />
                ) : (
                  <SuspenseImage
                    key={item.url}
                    src={item.url}
                    alt={`Page ${selectedPage} Color Palette ${index}`}
                    className="w-20 h-20 rounded-lg mb-4"
                  />
                )
              ))}
            </div>
          ) : (
            <p className="mt-4 text-center text-gray-500 h-[100px] flex justify-center items-center">No color palette found</p>
          )}
          <div className="flex border-b py-2 justify-between">
            <h1 className='text-xs text-gray-500 font-manrope font-bold my-auto'>Full Text</h1>
          </div>
          {loading ? (
            <div className="mt-4 flex flex-wrap h-[50px] scrollbar-thin overflow-y-scroll items-center justify-center gap-2">
              <Skeleton animation="wave" variant="rounded" className='w-full h-5' />
            </div>
          ) : group.full_text[selectedPage]?.length > 0 && group.full_text[selectedPage][0]?.url?.length>0 ? (
            <div className="mt-4 flex h-auto text-xs items-center justify-center gap-2">
              {group.full_text[selectedPage].map((item, index) => (
                <Typography key={index} className="!text-xs text-gray-700">
                  {item.url} 
                </Typography>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-center text-gray-500 h-[40px] flex justify-center items-center">No  text found</p>
          )}
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

const ColorPalette = ({ hexValues }) => {
  return (
    <div className="w-full flex h-5">
      {hexValues.map((hex, index) => (
        <div
          key={index}
          className={`h-5 border`}
          style={{
            backgroundColor: hex,
            width: `${100 / hexValues.length}%`
          }}
        />
      ))}
    </div>
  );
};

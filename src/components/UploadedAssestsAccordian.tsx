import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import pdficon from "../assets/pdficon.png";
import clipboard from "../assets/clipboard.png";

import Icon from '@mdi/react';
import { mdiChevronDown, mdiLoading,  } from '@mdi/js';
import { listObjects } from '../utils/helpers';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
const LazyImage = lazy(() => import('./LazyImage'));

import { Skeleton } from '@mui/material';
import ColorPalette from './ColorPalette';
import { GroupedImages } from '../utils/types';
import axios from 'axios';
import { BASE_URL, BASE_URL_PYTHON } from '../utils/base';


const UploadedAssestsAccordian = ({ item, expanded, onChange }) => {
  const [group, setGroup] = useState<GroupedImages>({ images: {}, icons: {}, color_palette: {}, full_text: {}, sub_text: {} });
  const [selectedPage, setSelectedPage] = useState<string | number>('1');
  const [loading, setLoading] = useState(true);
  const [pageNumbers, setPageNumbers] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<"completed" | "processing" | "fetching" | "failed">("fetching")
  const [feature, setFeature] = useState<number | null>()
  const url = item.get("src").split("~")

  const itemUrl = url[0];
  const bool = !itemUrl.includes(".pdf")
  const intervalRef = useRef(null);


  const groupByPage = (images, colorPaletteTexts, fullTexts, subText) => {
    const groupedImages = {};
    const groupedIcons = {};
    const groupedColorPalette = {};
    const groupedFullText = {};
    const groupedSubText = {}
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

    Object.keys(subText).forEach(page => {
      pageNumbersSet.add(page);
      groupedSubText[page] = subText[page].map((text, index) => ({
        key: `${page}/text_block_${index}.txt`,
        url: text
      }));
    });



    setPageNumbers(pageNumbersSet);

    return { images: groupedImages, icons: groupedIcons, color_palette: groupedColorPalette, full_text: groupedFullText, sub_text: groupedSubText };
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
      if (index) {
        if (file.Key.includes("ai-processed-image")) {
          colorPaletteTexts[1] = text;

        }
        else colorPaletteTexts[index] = text;
      }

    }

    const fullTextFiles = objects.filter(obj => obj.Key.endsWith('full_text.txt'));
    const fullTexts = {};

    for (const file of fullTextFiles) {
      const response = await fetch(`https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${file.Key}`);
      const text = await response.text();
      // const match = file.Key.match(/ai-processed-image\/[^/]+\/text\/full_text\.txt$/);
      const temp = file.Key.split("/text/full_text.txt")[0].split("/")
      const index = parseInt(temp[temp.length - 1])
      if (index) {
        if (file.Key.includes("ai-processed-image")) {
          fullTexts[1] = text;

        }
        else fullTexts[index] = text;
      }

    }

    const textBlockFiles = objects.filter(obj => obj.Key.match(/text_block_\d+\.txt$/));

    const subTexts = {};

    for (const file of textBlockFiles) {
      const response = await fetch(`https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${file.Key}`);
      const text = await response.text();
      // const match = file.Key.match(/ai-processed-image\/[^/]+\/text\/full_text\.txt$/);
      const temp = file.Key.split("/text/text_block")[0].split("/")
      let index = parseInt(temp[temp.length - 1])
      if (index) {
        if (file.Key.includes("ai-processed-image")) {
          index = 1
        }
        if (!subTexts[index]) {
          subTexts[index] = [];
        }
        subTexts[index].push(text);
      }

    }




    const groupedData = groupByPage(images, colorPaletteTexts, fullTexts, subTexts);
    setGroup(groupedData);
    if (Object.keys(groupedData.images).length > 0) {
      setSelectedPage(Object.keys(groupedData.images)[0]);
    }
    setLoading(false);
  };

  const handleGetStatus = async () => {
    const session = url[1]
    const resp = await axios.get(BASE_URL_PYTHON + "/session_status/" + session)
    if (resp.data.failed === true) {
      setStatus('failed');
      clearInterval(intervalRef.current);
    } else if (resp.data.completed === true) {
      setStatus('completed');
      clearInterval(intervalRef.current);
    } else {
      setStatus('processing');
      setFeature(resp.data.upload_count);
    }
    console.log("status", resp.data);

  }



  useEffect(() => {
     handleGetStatus();
    intervalRef.current = setInterval(async () => {
      await handleGetStatus();
    }, 10000); 
    return () => clearInterval(intervalRef.current); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    if (status === 'completed') {
      handleUploadTest();
    }
  }, [status]);


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


  if(status==="failed") return <></>
  if(status==="processing") return (
    <div className="w-full flex flex-col gap-1 p-2 bg-[#B5DFFF] !bg-opacity-30 rounded-md shadow-md">
      <Typography className='flex gap-1'>
        <img src={pdficon} alt="" className='w-7 h-7' />
        {getFileName()}
      </Typography>
      <div className="flex gap-3 items-center ">
        <Icon path={mdiLoading } size={1} className={ "animate-spin text-blue-500"} />
        <p className='text-xs font-manrope text-gray-500 font-semibol'>

        {feature} Features Extracted
        </p>

      </div>
    </div>
  )

  if(status==="fetching"){
    return(<Skeleton sx={{ bgcolor: "#B5DFFF" }} className='w-full' animation="wave" variant="rounded"  height={60} />)
  }

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
          <>
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
                  <Skeleton sx={{ bgcolor: "#B5DFFF" }} key={index} animation="wave" variant="rounded" width={112} height={112} />
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
          </>


          <>
            <div className="flex border-b py-2 justify-between">
              <h1 className='text-xs text-gray-500 font-manrope font-bold my-auto'>Icon Components</h1>
            </div>
            {loading ? (
              <div className="mt-4 flex flex-wrap h-full max-h-[300px] min-h-[200px] scrollbar-thin overflow-y-scroll items-center justify-center gap-2">
                {[...Array(8)].map((_, index) => (
                  <Skeleton sx={{ bgcolor: "#B5DFFF" }} key={index} animation="wave" variant="rounded" width={112} height={112} />
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
                    
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-center text-gray-500 h-[100px] flex justify-center items-center">No icons found</p>
            )}
          </>


          

         


        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default UploadedAssestsAccordian;

// TODO:reapeated component
const SuspenseImage = ({ src, alt, ...props }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [src]);

  return (
    <Suspense fallback={<Skeleton sx={{ bgcolor: "#eff8ff" }} animation="wave" variant="rounded" width={112} height={112} {...props} />}>
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

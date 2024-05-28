import * as React from 'react';
import { useEditor } from '@grapesjs/react';
import {
  mdiArrowULeftTop,
  mdiArrowURightTop,
  mdiBorderRadius,
  mdiFullscreen,
  mdiXml,
  mdiUpload,
  mdiLoading
} from '@mdi/js';
import Icon from '@mdi/react';
import { useEffect, useState } from 'react';
import { BTN_CLS, MAIN_BORDER_COLOR, cx } from './common.ts';
import AWS from 'aws-sdk';
import CryptoJS from 'crypto-js';
import Box from '@mui/material/Box';

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

;
import Modal from '@mui/material/Modal';
import QRCode from 'qrcode.react';
interface CommandButton {
  id: string;
  iconPath: string;
  options?: Record<string, any>;
  disabled?: () => boolean;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function TopbarButtons({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const editor = useEditor();
  const [, setUpdateCounter] = useState(0);
  const [url, setUrl] = useState("")
  const [open, setOpen] = useState(false)
  const { UndoManager, Commands } = editor;
  const [isLoading, setisLoading] = useState(false)
  const ref = React.useRef<string>()


  useEffect(() => {
    const newHash = CryptoJS.MD5(new Date() + "").toString();
    ref.current = newHash
  }, []);

  useEffect(() => {
    const cmdEvent = 'run stop';
    const updateEvent = 'update';
    const updateCounter = () => setUpdateCounter((value) => value + 1);
    const onCommand = (id: string) => {
      console.log("command id:", id);
      cmdButtons.find((btn) => btn.id === id) && updateCounter();
    };
    editor.on(cmdEvent, onCommand);
    editor.on(updateEvent, updateCounter);

    // editor.select("Mobile portrait")
    // editor.select

    return () => {
      editor.off(cmdEvent, onCommand);
      editor.off(updateEvent, updateCounter);
    };
  }, []);

 const handleUpload = async () => {
  const htmlContent = editor.getHtml();
  const cssContent = editor.getCss();
  setisLoading(true);

  try {
    const completeHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
          ${cssContent}
          </style>
          <title>GrapesJS Template</title>
        </head>
        ${htmlContent}
      </html>
    `;

    console.log(completeHtml);

    // Configure AWS SDK
    const s3Client = new S3Client({
      region: import.meta.env.VITE_APP_AWS_REGION,
      credentials: {
        accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY,
      },
    });

    const bucketName = import.meta.env.VITE_APP_AWS_BUCKET_NAME;
    console.log(ref.current);
    const htmlFilename = `template-${ref.current}.html`;

    // Upload the HTML file
    const resp = await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: htmlFilename,
      Body: completeHtml,
      ContentType: 'text/html',
    }));

    console.log(resp)
    


    const url = `https://${bucketName}.s3.${import.meta.env.VITE_APP_AWS_REGION}.amazonaws.com/${htmlFilename}`;

    // Set the URL in the state variable
    setUrl(url);
    setOpen(true);
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('Failed to upload file.');
  } finally {
    setisLoading(false);
  }
};


  const cmdButtons: CommandButton[] = [
    {
      id: 'core:fullscreen',
      iconPath: mdiFullscreen,
      options: { target: '#root' },
    },
    {
      id: 'core:undo',
      iconPath: mdiArrowULeftTop,
      disabled: () => !UndoManager.hasUndo(),
    },
    {
      id: 'core:redo',
      iconPath: mdiArrowURightTop,
      disabled: () => !UndoManager.hasRedo(),
    },
    {
      id: 'core:upload',
      iconPath: isLoading ? mdiLoading : mdiUpload,
      disabled: () => isLoading
    },
  ];

  // Add the custom upload command to GrapesJS
  useEffect(() => {
    editor.Commands.add('core:upload', {
      run: handleUpload,
    });
  }, [editor]);

  return (
    <div className={cx('flex gap-3', className)}>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="w-full flex flex-col gap-6 !pt-8 rounded-lg">
          <QRCode value={url} className='!w-60  !h-60 mx-auto' />
          <a href={url} target="_blank" rel="noopener noreferrer" className='bg-blue-500 hover:bg-blue-600 w-fit mx-auto p-3 text-white rounded-lg'>Preview</a>
        </Box>
      </Modal>
      {cmdButtons.map(({ id, iconPath, disabled, options = {} }) => (
        <button
          key={id}
          type="button"
          className={cx(
            BTN_CLS,
            MAIN_BORDER_COLOR,
            Commands.isActive(id) && 'text-sky-300',
            disabled?.() && 'opacity-50',

          )}
          onClick={() =>
            Commands.isActive(id)
              ? Commands.stop(id)
              : Commands.run(id, options)
          }
          disabled={disabled?.()}
        >
          <Icon path={iconPath} size={1} className={cx(id === "core:upload" && isLoading && "animate-spin")} />
        </button>
      ))}
    </div>
  );
}

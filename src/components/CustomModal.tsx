import * as React from "react";
import Icon from "@mdi/react";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Modal, { ModalProps } from "@mui/material/Modal";
import { MAIN_BG_COLOR, MAIN_TXT_COLOR, cx } from "./common.ts";
import googleai from "../assets/googleai.png"
import { mdiCloseCircleOutline } from '@mdi/js';


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  border: "2px solid #000",
  boxShadow: 24,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  maxHeight: "90vh",
  p: 2,
};

interface CustomModalProps extends Omit<ModalProps, "title"> {
  title: React.ReactNode;
  close: () => void;
}

export default function CustomModal({
  children,
  title,
  close,
  ...props
}: CustomModalProps) {
  return (
    <Modal onClose={close} {...props}>
      <Fade in={props.open}>
        <Box
          sx={style}
          className={cx(MAIN_BG_COLOR, "rounded-xl !border-none w-full max-w-[500px]")}
        >
          <div className="flex w-full   pb-3">
            <div className="flex w-full justify-between">

              <div className="flex gap-2 items-center text-xl font-semibold font-manrope">
                <img src={googleai} alt="" className="w-10 h-10" />
                <span>
                  {title}
                </span>
              </div>
              <div onClick={close} className="cursor-pointer my-auto">
                <Icon path={mdiCloseCircleOutline} size={1} />

              </div>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">{children}</div>
        </Box>
      </Fade>
    </Modal>
  );
}

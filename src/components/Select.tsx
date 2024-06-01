import React, { useState } from "react";
import frame1 from "../assets/frame1.png";
import frame2 from "../assets/frame2.png";
import frame3 from "../assets/frame3.png";
import axios from "axios";
import { Template1, Template2 } from "../utils/template";
import { useNavigate } from "react-router-dom";
import { BASE_URL,  } from "../utils/base";
const saveJsonApiUrl =BASE_URL + "/api/auth/save-json";

type SelectProps ={
  submitForm:()=>Promise<void>
}

const Select: React.FC<SelectProps> = ({submitForm}) => {
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const navigate = useNavigate()

  const handleClick = (frame: string) => {
    setSelectedFrame(frame);
  };

  const handleButtonClick = async () => {
    console.log("button click")
    if (!selectedFrame) {
      alert("select frame")
    }
    // @ts-ignore

    await submitForm()

    const userId = JSON.parse(localStorage.getItem("userDetails"))._id;
    const response = await axios.post(saveJsonApiUrl, {
      userId,
      JSONString: JSON.stringify(selectedFrame === "frame1" ? Template1 : Template2),
    });
    if (response.status === 201) {
      console.log("inside navigate")
      setTimeout(() => {
        
        navigate("/editor")
      }, 10);
    }

  }



  return (
    <div className="gap-4 h-full  flex flex-col justify-between py-7 items-center ">
      <h1 className="font-semibold text-[40px] ">
        Choose template of your choice
      </h1>
      <div className="flex flex-row  ">
        <div onClick={() => handleClick("frame1")}>
          <img
            src={selectedFrame === "frame1" ? frame3 : frame1}
            className="w-[300px] h-[360px]"
            alt="Template 1"
          />
        </div>
        <div onClick={() => handleClick("frame2")}>
          <img
            src={selectedFrame === "frame2" ? frame3 : frame2}
            className="w-[300px] h-[360px]"
            alt="Template 2"
          />
        </div>
      </div>
      {selectedFrame && (
        <button disabled={selectedFrame === null} onClick={handleButtonClick} className=" px-[40px] py-[10px] bg-blue-500 text-white font-semibold rounded-[14px] text-[26px]">
          Continue
        </button>
      )}
    </div>
  );
};

export default Select;

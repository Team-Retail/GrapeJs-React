import { useState, FormEvent, useRef, useEffect } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { LocationClient } from "@aws-sdk/client-location";
import { SearchPlaceIndexForTextCommand } from "@aws-sdk/client-location";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {  BASE_URL } from "../utils/base";
import { User } from "../utils/types";
import { Step, Stepper } from "../components/shadcn/stepper";
import StepperNext from "./../components/StepperNext.tsx";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Select from "../components/Select.tsx";
import backImg from "../assets/backImg.png"

const getJsonApiUrl = BASE_URL + "/api/auth/get-json/";
import useTimeout from "../utils/useTimeout.ts";

export default function CompanyDetails() {
  const [modalOpen, setModalOpen] = useState(true);
  const [companyLogo, setCompanyLogo] = useState<FileList | null>(null);
  const [businessCardFront, setBusinessCardFront] = useState<FileList | null>(
    null,
  );
  const [businessCardBack, setBusinessCardBack] = useState<FileList | null>(
    null,
  );
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      // @ts-ignore

      const userId = JSON.parse(localStorage.getItem("userDetails"))._id;

      const response = await axios.get(getJsonApiUrl + userId);
      // if(response.status===201){

      // }
      return JSON.parse(response.data.JSONString);
      // return Template1
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(()=>{
    const data = loadData()
    userFunc()
  },[])

  

  const userFunc = () => {
    const user = JSON.parse(localStorage.getItem("userDetails"))
    console.log("user", user)
    if (!user) {
      navigate("/")
    }
    // @ts-ignore
    if (user?.hasSocial) {
      navigate("/editor")

    }
  }
 

  const [formData, setFormData] = useState({
    company_website: "",
    company_instagram: "",
    company_twitter: "",
    company_address: "",
  
  });


  const [suggestions, setSuggestions] = useState([]);
  const [companyAddress, setCompanyAddress] = useState("");
 
  const companyLogoUrlRef = useRef("");
  const businessCardFrontUrlRef = useRef("");
  const businessCardBackUrlRef = useRef("");
  const URL = BASE_URL + "/api/auth";
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(Date.now());

  useTimeout(() => {

    setModalOpen(true);
  }, 1000);
 

  const s3Client = new S3Client({
    region: import.meta.env.VITE_APP_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY,
    },
  });

  const bucketName = import.meta.env.VITE_APP_AWS_BUCKET_NAME;

  const uploadFileToS3 = async (file: FileList, key: string) => {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file[0],
      ContentType: file[0].type,
    };

    try {
      await s3Client.send(new PutObjectCommand(params));
      return `https://${bucketName}.s3.${import.meta.env.VITE_APP_AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
      return null;
    }
  };

  const handleFileUpload = async () => {
    setIsLoading(true);
    const user: User = JSON.parse(localStorage.getItem('userDetails'))
    const usernameFolder = user.companyName + "_" + user.email

    const uploadPromises = [];

    if (companyLogo && companyLogo.length > 0) {
      const logoKey = `${usernameFolder}/companyLogo-${ref.current}-${companyLogo[0].name}`;
      uploadPromises.push(
        uploadFileToS3(companyLogo, logoKey).then((logoUrl) => {
          if (logoUrl) {
            companyLogoUrlRef.current = logoUrl;
            console.log("Company Logo URL:", logoUrl);
          }
        }),
      );
    }

    if (businessCardFront && businessCardFront.length > 0) {
      const frontKey = `${usernameFolder}/businessCardFront-${ref.current}-${businessCardFront[0].name}`;
      uploadPromises.push(
        uploadFileToS3(businessCardFront, frontKey).then((frontUrl) => {
          if (frontUrl) {
            businessCardFrontUrlRef.current = frontUrl;
            console.log("Business Card Front URL:", frontUrl);
          }
        }),
      );
    }

    if (businessCardBack && businessCardBack.length > 0) {
      const backKey = `${usernameFolder}/businessCardBack-${ref.current}-${businessCardBack[0].name}`;
      uploadPromises.push(
        uploadFileToS3(businessCardBack, backKey).then((backUrl) => {
          if (backUrl) {
            businessCardBackUrlRef.current = backUrl;
            console.log("Business Card Back URL:", backUrl);
          }
        }),
      );
    }
    await Promise.all(uploadPromises);

    setIsLoading(false);
  };

  const searchLocation = async (query: any) => {
    const client = new LocationClient({
      region: "ap-south-1",
      credentials: {
        accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY_LOCATION,
        secretAccessKey: import.meta.env
          .VITE_APP_AWS_SECRET_ACCESS_KEY_ID_LOCATION,
      },
    });

    const params = {
      IndexName: "PlaceIndex1", // Replace with your Place Index Name
      Text: query,
      MaxResults: 5, // Limit the number of suggestions
    };

    try {
      const response = await client.send(
        new SearchPlaceIndexForTextCommand(params),
      );
      if (response && response?.Results) {
        // @ts-ignore
        setSuggestions(response?.Results);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setFormData((prev) => ({ ...prev, company_address: address }));
    if (address.length > 2) {
      searchLocation(address);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    const { Place } = suggestion;
    const [Longitude, Latitude] = Place.Geometry.Point;
    console.log(Latitude, Longitude);
    console.log(suggestion);
    setFormData((prev) => ({
      ...prev,
      company_address: Place.Label,
      // latitude: Latitude,
      // longitude: Longitude,
    }));
    setCompanyAddress(`${Latitude},${Longitude}`);
    setSuggestions([]);
  };

  const submitForm = async () => {
    await handleFileUpload();
    console.log(formData);
    const user = JSON.parse(localStorage.getItem("userDetails") || "{}");
    console.log(user);
    const companyData = {
      user_id: user ? user?._id : "",
      twitter: formData.company_twitter,
      insta: formData.company_instagram,
      logo_url: companyLogoUrlRef.current,
      company_website: formData.company_website,
      business_card_front: businessCardFrontUrlRef.current,
      business_card_back: businessCardBackUrlRef.current,
      companyLocation: companyAddress,
    };
    console.log(companyData);
    try {
      const res = await axios.post(
        URL + "/createSocialMedia",
        companyData,
      );
      console.log("Company Detail Submit response", res.data);

      localStorage.setItem("userDetails", JSON.stringify({
        ...user,
        hasSocial:true

      }));
      
      // clearForm();

      // navigate("/select");
    } catch (error) {
      console.error("Error saving company data:", error);
    }
  };

  const clearForm = () => {
    setFormData({
      // company_name: "",
      company_website: "",
      company_instagram: "",
      company_twitter: "",
      company_address: "",
      // companyLogoUrl: "",
      // businessCardFrontUrl: "",
      // businessCardBackUrl: "",
      // companyLocationUrl: "",
    });
    setCompanyLogo(null);
    setBusinessCardFront(null);
    setBusinessCardBack(null);
    // setCompanyLocation(null);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius:"15px",
    border:"none"
   
  };

  return (
    <div className="w-screen h-screen">
      {/* <Button onClick={() => { setModalOpen(true) }}>Submit</Button> */}
      <img src={backImg} alt="" className="w-full outline-none xl:max-w-[90%] mx-auto h-full" />
      <Modal open={modalOpen} onClose={
        ()=>{

        }       
      }>
        <Box sx={style} className={"bg-white rounded-lg !mx-auto  w-full !max-w-6xl h-[80vh]  p-12"}>
          <Stepper steps={[{}, {}, {}]} initialStep={0} variant={"line"}>
            <Step label={"Enter company details"}>
              <div className={"flex flex-col justify-between py-10 h-full"}>
                <div>
                  <div className="flex flex-col p-6 w-full rounded-[14px]">
                    <label className="text-lg">
                      1. Please enter your Company website link
                    </label>
                    <input
                      className="border-[1.5px] px-4 py-2 rounded-xl w-full mt-2 outline-none text-[#6B6B6B]"
                      type="text"
                      placeholder="Enter website link"
                      value={formData.company_website}
                      onChange={(e) =>
                        setFormData({ ...formData, company_website: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col p-6 rounded-[14px]">
                    <p className="text-lg mb-3">2. Upload Company Logo</p>
                    <label
                      className="w-[fit-content] flex items-center gap-2 py-2 px-4 border border-[#1A72D3] text-[#1A72D3] rounded text-sm font-semibold">
                      <MdOutlineFileUpload
                        type="image/*;capture=camera"
                        color="#1A72D3"
                      />
                      Front side
                      <input
                        className="border-b-2 mt-2 outline-none text-[#6B6B6B]"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => setCompanyLogo(e.target.files)}
                      />
                    </label>
                    <div>{companyLogo && <p>{companyLogo[0]?.name}</p>}</div>
                  </div>
                  <div className="flex flex-col p-6 rounded-[14px]">
                    <p className="text-lg mb-3">3. Upload Front & back of your business card.</p>
                    <div className={"flex gap-x-3"}>
                      <label
                        className="w-[fit-content] flex items-center gap-2 py-2 px-4 border border-[#1A72D3] text-[#1A72D3] rounded text-sm font-semibold">
                        <MdOutlineFileUpload
                          color="#1A72D3"
                          type="image/*;capture=camera"
                        />
                        Front side
                        <input
                          className="border-b-2 mt-2 outline-none text-[#6B6B6B]"
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => setBusinessCardFront(e.target.files)}
                        />
                      </label>
                      <label
                        className="w-[fit-content] flex items-center gap-2 py-2 px-4 border border-[#1A72D3] text-[#1A72D3] rounded text-sm font-semibold">
                        <MdOutlineFileUpload
                          color="#1A72D3"
                          type="image/*;capture=camera"
                        />
                        Back side
                        <input
                          className="border-b-2 mt-2 outline-none text-[#6B6B6B]"
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => setBusinessCardBack(e.target.files)}
                        />
                      </label>
                    </div>
                    <div>{businessCardFront && <p>{businessCardFront[0]?.name}</p>}</div>
                    <div>{businessCardBack && <p>{businessCardBack[0]?.name}</p>}</div>
                  </div>
                </div>
                <div className={"flex items-center justify-center"}>
                  <StepperNext>
                    <Button variant={"contained"}>Save & Next</Button>
                  </StepperNext>
                </div>
              </div>
            </Step>
            <Step label={"Enter other details"}>
              <div className={"flex flex-col justify-between py-10 h-full"}>
                <div className={"grid grid-cols-2 gap-x-5"}>
                  <div>
                    <div className="flex flex-col p-6 w-full rounded-[14px]">
                      <label className="text-lg">
                        5. Enter social media links, [Instagram]
                      </label>
                      <input
                        className="border-[1.5px] px-4 py-2 w-full mt-2 outline-none text-[#6B6B6B]"
                        type="text"
                        placeholder="Enter link"
                        value={formData.company_instagram}
                        onChange={(e) =>
                          setFormData({ ...formData, company_instagram: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex flex-col p-6 w-full rounded-[14px]">
                      <label className="text-lg">
                        6. Enter social media links, [Twitter]
                      </label>
                      <input
                        className="border-[1.5px] px-4 py-2 w-full mt-2 outline-none text-[#6B6B6B]"
                        type="text"
                        placeholder="Enter link"
                        value={formData.company_twitter}
                        onChange={(e) =>
                          setFormData({ ...formData, company_twitter: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex flex-col p-6 w-full rounded-[14px]">
                      <label className="text-lg">
                        7. Enter the Location of your company
                      </label>
                      <div className="flex w-full justify-between gap-3">
                        <input
                          className="border-[1.5px] px-4 py-2 w-full mt-2 outline-none text-[#6B6B6B]"
                          type="text"
                          placeholder="Enter location"
                          value={formData.company_address}

                          onChange={handleAddressChange}
                        />
                        {suggestions.length > 0 && (
                          <ul
                            className="absolute z-10 bg-white border border-gray-300 text-black rounded-md mt-12 w-[80%] max-h-60 overflow-y-auto">
                            {suggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {/* @ts-ignore */}
                                {suggestion?.Place?.Label}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={"flex items-center justify-center"}>
                    <img src={"other_details.png"} alt="map" />
                  </div>
                </div>
                <div className={"flex items-center justify-center"}>
                  <StepperNext>
                    <Button variant={"contained"}>Save & Next</Button>
                  </StepperNext>
                </div>
              </div>
            </Step>
            <Step label={"Choose template"}>
              <Select submitForm={submitForm}/>
            </Step>
          </Stepper>
        </Box>
      </Modal>
    </div>
  );
}

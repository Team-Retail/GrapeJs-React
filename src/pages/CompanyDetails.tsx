import { useState, FormEvent, useRef } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
// import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { LocationClient } from "@aws-sdk/client-location";
import { SearchPlaceIndexForTextCommand } from "@aws-sdk/client-location";

export default function CompanyDetails() {
  const [companyLogo, setCompanyLogo] = useState<FileList | null>(null);
  const [businessCardFront, setBusinessCardFront] = useState<FileList | null>(
    null,
  );
  const [businessCardBack, setBusinessCardBack] = useState<FileList | null>(
    null,
  );
  const [companyLocation, setCompanyLocation] = useState<FileList | null>(null);

  const [formData, setFormData] = useState({
    // company_name: "",
    company_website: "",
    company_instagram: "",
    company_twitter: "",
    company_address: "",
    companyLogoUrl: "",
    businessCardFrontUrl: "",
    businessCardBackUrl: "",
    companyLocationUrl: "",
  });

  // const [query, setQuery] = useState("");
  // const [loading, setLoading] = useState(false);

  const [suggestions, setSuggestions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(Date.now());

  // const REGION = "YOUR_REGION"; // e.g., us-west-2
  // const IDENTITY_POOL_ID = "YOUR_IDENTITY_POOL_ID";

  // const client = new LocationClient({
  //   region: REGION,
  //   credentials: fromCognitoIdentityPool({
  //     client: new CognitoIdentityClient({ region: REGION }),
  //     identityPoolId: IDENTITY_POOL_ID,
  //   }),
  // });

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
    const usernameFolder = localStorage.getItem("COMPANY_USERNAME");
    if (companyLogo) {
      const logoKey = `${usernameFolder}/companyLogo-${ref.current}-${companyLogo[0].name}`;
      const logoUrl = await uploadFileToS3(companyLogo, logoKey);
      console.log(logoUrl);
      if (logoUrl)
        setFormData((prev) => ({ ...prev, companyLogoUrl: logoUrl }));
    }

    if (businessCardFront) {
      const frontKey = `${usernameFolder}/businessCardFront-${ref.current}-${businessCardFront[0].name}`;
      const frontUrl = await uploadFileToS3(businessCardFront, frontKey);
      if (frontUrl)
        setFormData((prev) => ({ ...prev, businessCardFrontUrl: frontUrl }));
    }

    if (businessCardBack) {
      const backKey = `${usernameFolder}/businessCardBack-${ref.current}-${businessCardBack[0].name}`;
      const backUrl = await uploadFileToS3(businessCardBack, backKey);
      if (backUrl)
        setFormData((prev) => ({ ...prev, businessCardBackUrl: backUrl }));
    }

    if (companyLocation) {
      const locationKey = `${usernameFolder}/companyLocation-${ref.current}-${companyLocation[0].name}`;
      const locationUrl = await uploadFileToS3(companyLocation, locationKey);
      if (locationUrl)
        setFormData((prev) => ({ ...prev, companyLocationUrl: locationUrl }));
    }

    setIsLoading(false);
  };

  // const handleAddressChange = async (e: FormEvent<HTMLInputElement>) => {
  //   const value = e.currentTarget.value;
  //   setQuery(value);
  //   if (value.length < 3) {
  //     setSuggestions([]);
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await client.send(
  //       new SearchPlaceIndexForTextCommand({
  //         IndexName: "YourPlaceIndexName",
  //         Text: value,
  //       }),
  //     );
  //     setSuggestions(response.Results || []);
  //   } catch (error) {
  //     console.error("Error searching for place:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const searchLocation = async (query: any) => {
    const client = new LocationClient({
      region: import.meta.env.VITE_APP_AWS_REGION,
      credentials: {
        accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY_LOCATION,
        secretAccessKey: import.meta.env
          .VITE_APP_AWS_SECRET_ACCESS_KEY_ID_LOCATION,
      },
    });

    const params = {
      IndexName: "MyPlaceIndex", // Replace with your Place Index Name
      Text: query,
      MaxResults: 5, // Limit the number of suggestions
    };

    try {
      const response = await client.send(
        new SearchPlaceIndexForTextCommand(params),
      );
      if (response && response?.Results) {
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
    const { Text, Place } = suggestion;
    const [Longitude, Latitude] = Place.Geometry.Point;

    setFormData((prev) => ({
      ...prev,
      company_address: Text,
      latitude: Latitude,
      longitude: Longitude,
    }));

    setSuggestions([]);
  };

  const submitForm = async () => {
    console.log(import.meta.env.VITE_APP_AWS_REGION);
    await handleFileUpload();
    console.log(formData);
  };

  const clearForm = () => {
    setFormData({
      // company_name: "",
      company_website: "",
      company_instagram: "",
      company_twitter: "",
      company_address: "",
      companyLogoUrl: "",
      businessCardFrontUrl: "",
      businessCardBackUrl: "",
      companyLocationUrl: "",
    });
    setCompanyLogo(null);
    setBusinessCardFront(null);
    setBusinessCardBack(null);
    setCompanyLocation(null);
  };

  return (
    <div className="flex flex-col flex-1 items-center m-4 justify-center">
      <h1 className="font-bold text-2xl m-6">
        Enter Details about your company
      </h1>
      <form
        className="flex flex-col gap-4 w-full max-w-[600px] my-6"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          submitForm();
        }}
      >
        {/* <div className="border flex flex-col p-6 w-full rounded-[14px]">
          <label className="text-lg">1. Please enter your Company Name</label>
          <input
            className="border-b-2 w-full mt-2 outline-none text-[#6B6B6B]"
            type="text"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={(e) =>
              setFormData({ ...formData, company_name: e.target.value })
            }
          />
        </div> */}
        <div className="border flex flex-col p-6 w-full rounded-[14px]">
          <label className="text-lg">
            1. Please enter your Company website link
          </label>
          <input
            className="border-b-[1.5px] w-full mt-2 outline-none text-[#6B6B6B]"
            type="text"
            placeholder="Enter website link"
            value={formData.company_website}
            onChange={(e) =>
              setFormData({ ...formData, company_website: e.target.value })
            }
          />
        </div>
        <div className="border flex flex-col p-6 rounded-[14px]">
          <p className="text-lg mb-3">2. Upload Company Logo</p>
          <label className="w-[fit-content] flex items-center gap-2 py-2 px-4 border border-[#1A72D3] text-[#1A72D3] rounded text-sm font-semibold">
            <MdOutlineFileUpload
              type="image/*;capture=camera"
              color="#1A72D3"
            />
            Add file
            <input
              className="border-b-2 mt-2 outline-none text-[#6B6B6B]"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setCompanyLogo(e.target.files)}
            />
          </label>
          <div>{companyLogo && <p>{companyLogo[0]?.name}</p>}</div>
        </div>
        <div className="border flex flex-col p-6 rounded-[14px]">
          <p className="text-lg mb-3">3. Upload Front of your business card.</p>
          <label className="w-[fit-content] flex items-center gap-2 py-2 px-4 border border-[#1A72D3] text-[#1A72D3] rounded text-sm font-semibold">
            <MdOutlineFileUpload
              color="#1A72D3"
              type="image/*;capture=camera"
            />
            Add file
            <input
              className="border-b-2 mt-2 outline-none text-[#6B6B6B]"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setBusinessCardFront(e.target.files)}
            />
          </label>
          <div>{businessCardFront && <p>{businessCardFront[0]?.name}</p>}</div>
        </div>
        <div className="border flex flex-col p-6 rounded-[14px]">
          <p className="text-lg mb-3">
            4. Upload Backside of your business card.
          </p>
          <label className="w-[fit-content] flex items-center gap-2 py-2 px-4 border border-[#1A72D3] text-[#1A72D3] rounded text-sm font-semibold">
            <MdOutlineFileUpload
              color="#1A72D3"
              type="image/*;capture=camera"
            />
            Add file
            <input
              className="border-b-2 mt-2 outline-none text-[#6B6B6B]"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setBusinessCardBack(e.target.files)}
            />
          </label>
          <div>{businessCardBack && <p>{businessCardBack[0]?.name}</p>}</div>
        </div>
        <div className="border flex flex-col p-6 w-full rounded-[14px]">
          <label className="text-lg">
            5. Enter social media links, [Instagram]
          </label>
          <input
            className="border-b-[1.5px] w-full mt-2 outline-none text-[#6B6B6B]"
            type="text"
            placeholder="Your answer"
            value={formData.company_instagram}
            onChange={(e) =>
              setFormData({ ...formData, company_instagram: e.target.value })
            }
          />
        </div>
        <div className="border flex flex-col p-6 w-full rounded-[14px]">
          <label className="text-lg">
            6. Enter social media links, [Twitter]
          </label>
          <input
            className="border-b-[1.5px] w-full mt-2 outline-none text-[#6B6B6B]"
            type="text"
            placeholder="Your answer"
            value={formData.company_twitter}
            onChange={(e) =>
              setFormData({ ...formData, company_twitter: e.target.value })
            }
          />
        </div>
        <div className="border flex flex-col p-6 w-full rounded-[14px]">
          <label className="text-lg">
            7. Enter the Location of your company
          </label>
          <div className="flex w-full justify-between gap-3">
            <input
              // id="company_address"
              className="w-[80%] border-b-[1.5px] mt-2 outline-none text-[#6B6B6B]"
              type="text"
              placeholder="Your answer"
              value={formData.company_address}
              // onChange={(e) =>
              //   setFormData({ ...formData, company_address: e.target.value })
              // }
              onChange={handleAddressChange}
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-12 w-[80%] max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.Text}
                  </li>
                ))}
              </ul>
            )}
            {/* <label className="w-[20%] flex items-center gap-2 py-2 px-4 border border-[#1A72D3] text-[#1A72D3] rounded text-sm font-semibold">
              <MdOutlineFileUpload
                color="#1A72D3"
                type="image/*;capture=camera"
              />
              Add file
              <input
                className="border-b-[1.5px] mt-2 outline-none text-[#6B6B6B]"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => setCompanyLocation(e.target.files)}
              />
            </label> */}
          </div>
        </div>
        <div className="mt-4 flex flex-row justify-between">
          <button
            onClick={clearForm}
            className="border border-[#6B6B6B] rounded-[14px] px-8 py-2"
          >
            Clear
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold rounded-[14px] px-8 py-2"
          >
            {isLoading ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}

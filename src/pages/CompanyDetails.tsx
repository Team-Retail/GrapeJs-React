import { useState, FormEvent } from "react";
import { MdOutlineFileUpload } from "react-icons/md";

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
    company_name: "",
    company_website: "",
    company_instagram: "",
    company_twitter: "",
    company_address: "",
  });

  const submitForm = () => {
    console.log(formData);
    console.log(companyLogo);
    console.log(businessCardFront);
    console.log(businessCardBack);
    console.log(companyLocation);
  };

  const clearForm = () => {
    setFormData({
      company_name: "",
      company_website: "",
      company_instagram: "",
      company_twitter: "",
      company_address: "",
    });
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
        <div className="border flex flex-col p-6 w-full rounded-[14px]">
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
        </div>
        <div className="border flex flex-col p-6 w-full rounded-[14px]">
          <label className="text-lg">
            2. Please enter your Company website link
          </label>
          <input
            className="border-b-2 w-full mt-2 outline-none text-[#6B6B6B]"
            type="text"
            placeholder="Enter website link"
            value={formData.company_website}
            onChange={(e) =>
              setFormData({ ...formData, company_website: e.target.value })
            }
          />
        </div>
        <div className="border flex flex-col p-6 rounded-[14px]">
          <p className="text-lg mb-3">3. Upload Company Logo</p>
          <label className="w-[fit-content] flex items-center gap-2 py-2 px-4 border border-[#1A72D3] text-[#1A72D3] rounded text-sm font-semibold">
            <MdOutlineFileUpload color="#1A72D3" />
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
          <p className="text-lg mb-3">4. Upload Front of your business card.</p>
          <label className="w-[fit-content] flex items-center gap-2 py-2 px-4 border border-[#1A72D3] text-[#1A72D3] rounded text-sm font-semibold">
            <MdOutlineFileUpload color="#1A72D3" />
            Add file
            <input
              className="border-b-2 mt-2 outline-none text-[#6B6B6B]"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setBusinessCardFront(e.target.files)}
            />
          </label>
        </div>
        <div className="border flex flex-col p-6 rounded-[14px]">
          <p className="text-lg mb-3">
            5. Upload Backside of your business card.
          </p>
          <label className="w-[fit-content] flex items-center gap-2 py-2 px-4 border border-[#1A72D3] text-[#1A72D3] rounded text-sm font-semibold">
            <MdOutlineFileUpload color="#1A72D3" />
            Add file
            <input
              className="border-b-2 mt-2 outline-none text-[#6B6B6B]"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setBusinessCardBack(e.target.files)}
            />
          </label>
        </div>
        <div className="border flex flex-col p-6 w-full rounded-[14px]">
          <label className="text-lg">
            6. Enter social media links, [Instagram]
          </label>
          <input
            className="border-b-2 w-full mt-2 outline-none text-[#6B6B6B]"
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
            7. Enter social media links, [Twitter]
          </label>
          <input
            className="border-b-2 w-full mt-2 outline-none text-[#6B6B6B]"
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
            8. Enter the Location of your company
          </label>
          <div className="flex w-full justify-between gap-3">
            <input
              className="w-[80%] border-b-2 mt-2 outline-none text-[#6B6B6B]"
              type="text"
              placeholder="Your answer"
              value={formData.company_address}
              onChange={(e) =>
                setFormData({ ...formData, company_address: e.target.value })
              }
            />
            <label className="w-[20%] flex items-center gap-2 py-2 px-4 border border-[#1A72D3] text-[#1A72D3] rounded text-sm font-semibold">
              <MdOutlineFileUpload color="#1A72D3" />
              Add file
              <input
                className="border-b-2 mt-2 outline-none text-[#6B6B6B]"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => setCompanyLocation(e.target.files)}
              />
            </label>
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
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
}

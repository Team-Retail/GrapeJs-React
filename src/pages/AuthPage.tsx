import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";

export default function AuthPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    email_id: "",
    password: "",
    // company_location: "",
  });
  const [signIn, setSignIn] = useState(true);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  const BASE_URL = "http://13.235.16.143:3000/api/auth";

  const handleSignInSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const signInData = {
      email: formData.email_id,
      password: formData.password,
    };

    try {
      const res = await axios.post(BASE_URL + "/login", signInData);
      console.log("Sign In Response:", res.data);
      resetForm();
      navigate("/editor");
    } catch (error) {
      console.error("Sign In Error:", error);
    }
  };

  const handleSignUpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("Click on sign up");

    e.preventDefault();

    const signUpData = {
      firstName: formData.first_name,
      lastName: formData.last_name,
      companyName: formData.company_name,
      email: formData.email_id,
      password: formData.password,
      // companyLocation: formData.company_location,
      flag: true,
    };

    try {
      const res = await axios.post(BASE_URL + "/signup", signUpData);
      console.log("Sign Up Response:", res.data);
      localStorage.setItem(
        "COMPANY_USERNAME",
        res.data.companyName + " " + res.data.firstName + res.data.lastName,
      );
      resetForm();
      navigate("/company");
    } catch (error) {
      console.error("Sign Up Error:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      company_name: "",
      email_id: "",
      password: "",
      // company_location: "",
    });
  };

  const toggleForm = () => {
    setSignIn((prevSignIn) => !prevSignIn);
    resetForm();
  };

  // console.log(formData);

  return (
    <main className="w-full items-center">
      <div className="flex flex-row flex-1">
        <div className="bg-[#F6F7FA] w-[50%] h-full">
          <img
            src="/groupedImage_login.png"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col bg-white p-[6vw] w-[50%] h-full justify-center">
          {signIn ? (
            <>
              <img src="/CAI logo.png" className="w-10 h-10 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Welcome</h2>
              <h6 className="text-lg text-[#6B6B6B] font-normal mb-6">
                Enter Your Email ID to get one time password
              </h6>
              <form onSubmit={handleSignInSubmit}>
                <div className="flex flex-row items-center border border-[#6B6B6B] rounded p-2">
                  <CiMail className="mr-2" size={20} color="#6B6B6B" />
                  <input
                    className="border-l-[1.5px] h-6 w-full px-2 text-[#6B6B6B] leading-tight focus:outline-none focus:shadow-outline"
                    id="email_id"
                    type="email"
                    placeholder="Enter Your Email"
                    value={formData.email_id}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-row items-center border border-[#6B6B6B] rounded p-2 my-4">
                  <CiLock className="mr-2" size={20} color="#6B6B6B" />
                  <input
                    className="border-l-[1.5px] h-6 w-full px-2 text-[#6B6B6B] leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex text-xs items-center">
                  <input type="checkbox" className="scale-75" />
                  <p className="pl-2 text-[#6B6B6B]">
                    I agree to the{" "}
                    <span className="text-[#1A72D3]">terms and conditions</span>{" "}
                    applied
                  </p>
                </div>
                <div className="flex items-center justify-between mt-10">
                  <button
                    className="bg-[#1A72D3] hover:bg-blue-700 text-white font-normal py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </form>
              <p className="text-xs text-[#6B6B6B] mt-4">
                Don't have an account?{" "}
                <span
                  className="text-[#1A72D3]  cursor-pointer"
                  onClick={toggleForm}
                >
                  Sign Up
                </span>
              </p>
            </>
          ) : (
            <>
              <img src="/CAI logo.png" className="w-10 h-10 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Create Account</h2>
              <h6 className="text-lg text-zinc-600 font-normal mb-6">
                Sign up to get started!
              </h6>
              <form onSubmit={handleSignUpSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-normal mb-2"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="first_name"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-normal mb-2"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="last_name"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-normal mb-2"
                    htmlFor="companyName"
                  >
                    Company Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="company_name"
                    type="text"
                    placeholder="Enter your company name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                  />
                </div>
                {/* <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-normal mb-2"
                    htmlFor="companyLocation"
                  >
                    Company Location
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="company_location"
                    type="text"
                    placeholder="Enter your company location"
                    value={formData.company_location}
                    onChange={handleInputChange}
                  />
                </div> */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-normal mb-2"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email_id"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email_id}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-normal mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    type="submit"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
              <p className="text-xs text-center text-gray-600 font-semibold mt-4">
                Already have an account ?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={toggleForm}
                >
                  Sign In here
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

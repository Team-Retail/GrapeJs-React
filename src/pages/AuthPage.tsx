import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/base";

export default function AuthPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    email_id: "",
    password: "",
  });
  const [signIn, setSignIn] = useState(true);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const URL = BASE_URL + "/api/auth";

  const handleSignInSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const signInData = {
      email: formData.email_id,
      password: formData.password,
    };

    try {
      const res = await axios.post(URL + "/login", signInData);
      console.log("Sign In Response:", res.data);
      const user = res.data;
      localStorage.setItem("userDetails", JSON.stringify(user));
      localStorage.setItem(
        "COMPANY_USERNAME",
        res.data.companyName + "_" + res.data.firstName + res.data.lastName,
      );
      resetForm();
      // navigate("/select");
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
      flag: true,
    };

    try {
      const res = await axios.post(URL + "/signup", signUpData);
      console.log("Sign Up Response:", res.data);
      const user = res.data;
      localStorage.setItem(
        "COMPANY_USERNAME",
        res.data.companyName + "_" + res.data.firstName + res.data.lastName,
      );
      localStorage.setItem("userDetails", JSON.stringify(user));
      resetForm();
      // navigate("/company");
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
    });
  };

  const toggleForm = () => {
    setSignIn((prevSignIn) => !prevSignIn);
    resetForm();
  };

  return (
    <main className="w-full h-full min-h-screen flex items-center">
      <img
        src="/groupedImage_login.png"
        className="w-full h-screen object-cover"
      />
      <div className="p-14 flex flex-col bg-white w-full h-full justify-center">
        <div className="max-w-[500px] rounded-xl border border-gray-300 p-10 shadow-lg mx-auto w-full flex flex-col items-center gap-4">
          <img src="/CAI logo.png" className="w-10 h-10" />
          {signIn ? (
            <>
              <h2 className="text-2xl font-bold">Welcome</h2>
              <h6 className="text-md text-[#6B6B6B] font-semibold">
                Enter Your Email ID to get one time password
              </h6>
              <form onSubmit={handleSignInSubmit} className="w-full flex flex-col gap-4">
                <div className="w-full">
                  <label
                    className="block text-gray-700 text-sm font-normal"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email_id"
                    type="email"
                    placeholder="Enter Your Email"
                    value={formData.email_id}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-normal"
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
                <div className="flex items-center justify-between ">
                  <button
                    className="bg-[#1A72D3] hover:bg-blue-700 text-white font-normal py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </form>
              <p className="text-xs mt-5 text-[#6B6B6B] font-semibold">
                Don't have an account?{" "}
                <span
                  className="text-[#1A72D3] cursor-pointer"
                  onClick={toggleForm}
                >
                  Sign Up
                </span>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Create Account</h2>
              <h6 className="text-md text-[#6B6B6B] font-semibold">
                Sign up to get started!
              </h6>
              <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-normal"
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
                      className="block text-gray-700 text-sm font-normal"
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
                <div>
                  <label
                    className="block text-gray-700 text-sm font-normal"
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
                <div>
                  <label
                    className="block text-gray-700 text-sm font-normal"
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
                <div>
                  <label
                    className="block text-gray-700 text-sm font-normal"
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
              <p className="text-xs mt-5 text-center text-[#6B6B6B] font-semibold">
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

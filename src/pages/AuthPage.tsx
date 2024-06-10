import axios from "axios";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/base";
import whitelogo from "../assets/logowhite.png"
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Icon from '@mdi/react';
import { mdiLoading, mdiCloudUploadOutline } from '@mdi/js';

export default function AuthPage() {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    userFunc()

  }, [])

  const userFunc = () => {
    const user = JSON.parse(localStorage.getItem("userDetails"))
    console.log("user", user)
    if (user) {
      if (!user?.hasSocial) {
        navigate("/company")
  
      }
      navigate("/editor")
    }
    // @ts-ignore
  }



  const URL = BASE_URL + "/api/auth";

  const handleSignInSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const signInData = {
      email: formData.email_id,
      password: formData.password,
    };

    try {
      const res = await axios.post(URL + "/login", signInData);

      const user = res.data;
      if (res.status === 200) {
        console.log(res.data)

        localStorage.setItem("userDetails", JSON.stringify({
          email: user.email,
          token: user.token,
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          companyName: user.companyName,
          hasSocial: user.hasSocial,

        }));
        setSnackbarMessage("User logedIn.");
        setSnackbarSeverity('success');
        resetForm();
        if (res.data.hasSocial) {
          navigate("/editor")
        }
        else {
          navigate("/company")
        }
      }
      else {
        setSnackbarMessage(res.data.message);
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);


    } catch (error) {
      setSnackbarMessage("Sign In Error: " + error.response.data.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error("Sign In Error:", error, error.response.data.message);
    }
    finally{
      setLoading(false);

    }
  };

  const handleSignUpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

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
      // TODO: change to toast
      if (res.status === 201) {
        setSnackbarMessage("User created successfully. Please verify email to continue.");
        setSnackbarSeverity('success');
      }
      else {
        setSnackbarMessage(res.data.message);
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);

      resetForm();
    } catch (error) {
      setSnackbarMessage("Sign Up Error: " + error.response.data.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error("Sign Up Error:", error);
    } finally {
      setLoading(false);

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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <main className="w-full h-full min-h-screen flex items-center">
      <div className=" w-3/5 h-screen bg-blue-500 p-10 pb-28 clipPath flex flex-col justify-between !font-manrope" >

        <img src={whitelogo} alt="logo" className="w-14 h-14" />
        <div className="flex flex-col ">
          <h1 className="text-white font-mono font-semibold text-6xl tracking-tight ">Welcome {signIn ? "Back" : "New User"}!</h1>
          <h1 className="text-white  text-opacity-60 text-xl  font-mono"> {signIn ? "We are happy to have you again." : "We are happy to have you, Signup & Join us"}</h1>
        </div>



        <div className="flex flex-col ">
          <h1 className="text-4xl text-white font-mono font-thin leading-none">{signIn ? "New User?" : "Already a user?"}</h1>
          <p className="text-white text-sm">
            {signIn ? "Sign Up & start Customising!" : "Sign in & start Customising!"}
          </p>

          <button
            className="text-white bg-transparent px-3 py-2 mt-4 text-sm hover:bg-white hover:text-blue-500 transition-colors duration-300 w-fit rounded-md border border-white cursor-pointer"
            onClick={toggleForm}
          >
            Sign Up
          </button>
        </div>



      </div>
      <div className=" max-w-[500px] min-w-[400px]  mx-auto flex flex-col p-14  items-center gap-4 bg-white w-2/5 h-full justify-center">

        {signIn ? (
          <>
            <h2 className="text-4xl text-black  self-start font-semibold">Login</h2>
            <h6 className="text-lg text-[#6B6B6B] font-light self-start">
              Enter your Email & Password to Continue
            </h6>
            <form onSubmit={handleSignInSubmit} className="w-full flex flex-col gap-4">
              <div className="w-full flex flex-col gap-4">
                <label
                  className="block text-gray-700 text-sm font-normal"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email_id"
                  type="email"
                  placeholder="Enter Your Email"
                  value={formData.email_id}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <label
                  className="block text-gray-700 text-sm font-normal"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center justify-between ">
                <button
                  className="bg-[#1A72D3] hover:bg-blue-700 text-white font-normal py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center disabled:opacity-70"
                  type="submit"
                  disabled={loading}
                >
                  {loading&&<Icon path={mdiLoading } size={1} className={loading ? "animate-spin" : ""} />}
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>

          </>
        ) : (
          <>
            <h2 className="text-4xl text-black  self-start font-semibold">Sign Up</h2>
            <h6 className="ttext-lg text-[#6B6B6B] font-light self-start">
              Create your Email & Password to Log in              </h6>
            <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    className="block text-gray-700 text-sm font-normal"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="first_name"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="block text-gray-700 text-sm font-normal"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="last_name"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="block text-gray-700 text-sm font-normal"
                  htmlFor="companyName"
                >
                  Company Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="company_name"
                  type="text"
                  placeholder="Enter your company name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="block text-gray-700 text-sm font-normal"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email_id"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email_id}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="block text-gray-700 text-sm font-normal"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center disabled:opacity-70"
                    type="submit"
                    disabled={loading}
                  >
                    {loading && <Icon path={mdiLoading} size={1} className={loading ? "animate-spin" : ""} />}

                    {loading ? 'Signing up...' : 'Sign Up'}
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
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        {/* @ts-ignore */}
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </main>
  );
}

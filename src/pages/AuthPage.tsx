import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    company_name: '',
    email_id: '',
    password: '',
  });
  const [signIn, setSignIn] = useState(true);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  const BASE_URL = "http://13.235.16.143:3000/api/auth"

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const signInData = {
      email: formData.email_id,
      password: formData.password,
    };

    try {
      const res = await axios.post(BASE_URL + '/login', signInData);
      console.log('Sign In Response:', res.data);
      resetForm();
      navigate('/editor');
    } catch (error) {
      console.error('Sign In Error:', error);
    }
  };

  const handleSignUpSubmit = async (e) => {
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
    const res = await axios.post(BASE_URL + '/signup', signUpData);
    console.log('Sign Up Response:', res.data);
    resetForm();
    navigate('/editor');
  } catch (error) {
    console.error('Sign Up Error:', error);
  }
};

const resetForm = () => {
  setFormData({
    first_name: '',
    last_name: '',
    company_name: '',
    email_id: '',
    password: '',
  });
};

const toggleForm = () => {
  setSignIn((prevSignIn) => !prevSignIn);
  resetForm();
};

console.log(formData);


return (
  <main className="w-full h-screen bg-zinc-200 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <img src='/CAI logo.png' className='w-10 h-10 mb-4' />
      {signIn ? (
        <>
          <h2 className="text-2xl font-bold mb-2">Account Login</h2>
          <h6 className='text-lg text-zinc-600 font-normal mb-6'>Welcome back!</h6>
          <form onSubmit={handleSignInSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-normal mb-2" htmlFor="email">
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
              <label className="block text-gray-700 text-sm font-normal mb-2" htmlFor="password">
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
                Login
              </button>
            </div>
          </form>
          <p className='text-xs text-center text-gray-600 font-semibold mt-4'>
            Don't have an account ?{' '}
            <span className='text-blue-700 underline cursor-pointer' onClick={toggleForm}>Sign Up here</span>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <h6 className='text-lg text-zinc-600 font-normal mb-6'>Sign up to get started!</h6>
          <form onSubmit={handleSignUpSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-normal mb-2" htmlFor="firstName">
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
                <label className="block text-gray-700 text-sm font-normal mb-2" htmlFor="lastName">
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
              <label className="block text-gray-700 text-sm font-normal mb-2" htmlFor="companyName">
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
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-normal mb-2" htmlFor="email">
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
              <label className="block text-gray-700 text-sm font-normal mb-2" htmlFor="password">
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
          <p className='text-xs text-center text-gray-600 font-semibold mt-4'>
            Already have an account ?{' '}
            <span className='text-blue-700 underline cursor-pointer' onClick={toggleForm}>Sign In here</span>
          </p>
        </>
      )}
    </div>
  </main>
);
}

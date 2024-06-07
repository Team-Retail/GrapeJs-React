import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from '../utils/base';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const EmailVerification = () => {

  const { token } = useParams(); // Assumes you're using react-router-dom
  const [message, setMessage] = useState('');
  const navigate=useNavigate();
  const [count, setCount] = useState(4);
  const[verified, setVerified]=useState(false);
  const delay = async (ms) => {
    return new Promise((resolve) =>
      setTimeout(resolve, ms));
  };



  useEffect(() => {

    const verifyEmail = async () => {
      try {
        const response = await axios.get(BASE_URL+`/api/auth/verify/${token}`);
        if (response.status === 200) {
          setMessage('Email verified successfully');
          for(let i=0;i<3;i++){
            setCount((count)=>count-1);
            setVerified((verified)=>true);
            await delay(1000);
          }
          navigate("/");
        }
      } catch (error) {
        setMessage('Email verification failed. '+error);
        setVerified((verified)=>false)
      }
    };

    verifyEmail();
  }, [token]);

  if(verified)
  return (
    <div>
      <div className={"flex flex-col items-center justify-center h-screen font-manrope text-xl"}>
         <CheckCircleIcon style={{ fontSize: '6rem', color: 'green' }}></CheckCircleIcon>
        { message && <h2 className="alert alert-info">{message}</h2>}
         <h2 >Redirecting to Login Page {count} </h2>
      </div>
    </div>
  );
  else{
    return(
      <div className={"flex flex-col items-center justify-center h-screen font-manrope text-xl"}>
        <CancelIcon style={{ fontSize: '6rem', color: 'red' }}></CancelIcon>
      { message && <h2 className="alert alert-info">{message}</h2>}
      </div>
    )
  }
};

export default EmailVerification;


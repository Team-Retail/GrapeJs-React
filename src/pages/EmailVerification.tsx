import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../utils/base';

const EmailVerification = () => {
  const { token } = useParams(); // Assumes you're using react-router-dom
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(BASE_URL+`/api/auth/verify/${token}`);
        if (response.status === 200) {
          setMessage('Email verified successfully.');
        }
      } catch (error) {
        setMessage('Email verification failed. '+error);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div>

      Verifying Email
      {message && <div className="alert alert-info">{message}</div>}
    </div>
  );
};

export default EmailVerification;

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const StatusCard = ({ icon: Icon, title, message, linkTo, linkText, color }) => (
    <div className="w-full max-w-md text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
        <Icon className={`h-16 w-16 mx-auto ${color} mb-4`} />
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <p className="mt-2 text-gray-600">{message}</p>
        <Link
            to={linkTo}
            className="mt-6 inline-block w-full rounded-2xl bg-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105"
        >
            {linkText}
        </Link>
    </div>
);


const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', or 'error'
  const [message, setMessage] = useState('Verifying your account, please wait...');
  const hasVerified = useRef(false); // ✅ 1. Create a ref to track if verification has been attempted

  useEffect(() => {
    // ✅ 2. Check if verification has already run. If so, do nothing.
    if (hasVerified.current) {
      return;
    }

    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token found. The link may be invalid.');
      return;
    }

    const verifyToken = async () => {
      hasVerified.current = true; // ✅ 3. Set the flag to true immediately
      try {
        await axios.get(`http://localhost:5001/api/auth/verify/${token}`);
        setStatus('success');
        setMessage('Your account has been successfully activated.');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.msg || 'Verification failed. The link may be invalid or expired.');
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100 p-4">
      {status === 'loading' && (
         <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600 mb-4" />
            <p className="text-lg text-gray-600 font-medium">{message}</p>
        </div>
      )}
      {status === 'success' && (
        <StatusCard 
            icon={CheckCircle}
            title="Email Verified!"
            message={message}
            linkTo="/login"
            linkText="Proceed to Login"
            color="text-green-500"
        />
      )}
      {status === 'error' && (
        <StatusCard 
            icon={XCircle}
            title="Verification Failed"
            message={message}
            linkTo="/register"
            linkText="Back to Registration"
            color="text-red-500"
        />
      )}
    </div>
  );
};

export default VerifyEmailPage;

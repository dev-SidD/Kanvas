import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

const EmailVerificationPage = () => {
  const location = useLocation();
  // Check the URL path to see if verification was a success or failure
  const isSuccess = location.pathname.includes('success');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100 p-4">
      <div className="w-full max-w-md text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
        {isSuccess ? (
          <>
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Email Verified!</h1>
            <p className="mt-2 text-gray-600">Your account has been successfully activated.</p>
            <Link
              to="/login"
              className="mt-6 inline-block w-full rounded-2xl bg-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105"
            >
              Proceed to Login
            </Link>
          </>
        ) : (
          <>
            <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Verification Failed</h1>
            <p className="mt-2 text-gray-600">The verification link is invalid or has expired. Please try registering again.</p>
            <Link
              to="/register"
              className="mt-6 inline-block w-full rounded-2xl bg-gray-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105"
            >
              Back to Registration
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
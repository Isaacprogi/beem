import React from 'react';

export default function CheckEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Almost there!</h1>
        <p className="text-gray-700 mb-6">
          We’ve sent a confirmation link to your email. Please check your inbox and click the link to verify your account.
        </p>

        <div className="mb-6">
          <svg
            className="mx-auto w-16 h-16 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m0 0l4-4m0 0l4 4M8 12l4 4"></path>
          </svg>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Didn’t receive the email? Check your spam folder or{' '}
          <button
            className="text-blue-600 font-semibold hover:underline"
            onClick={() => window.location.reload()}
          >
            resend
          </button>
          .
        </p>

        <a
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="text-red-500 mb-6">
                    <svg 
                        className="w-16 h-16 mx-auto" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-8">
                    You must be an HR user to access the HR Portal. 
                    Please use an HR email address to sign in.
                </p>
                <Link 
                    to="/login" 
                    className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;

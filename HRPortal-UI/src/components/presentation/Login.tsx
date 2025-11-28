import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

interface LoginProps {
    onLogin: (credential: string) => Promise<void>;
    error?: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
    return (
        <div className="flex items-center justify-center h-full pt-20 pb-10">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96 transition-colors duration-200">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                    Sign in with Google
                </h2>

                {error && (
                    <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            if (credentialResponse.credential) {
                                await onLogin(credentialResponse.credential);
                            }
                        }}
                        onError={() => console.log("Google Login Failed")}
                    />
                </div>

                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Sign in securely with your Google account
                </p>
            </div>
        </div>
    );
};

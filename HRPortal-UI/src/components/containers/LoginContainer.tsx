import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Login } from "../presentation/Login";

export const LoginContainer: React.FC = () => {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();
    const [error, setError] = useState('');

    const handleLogin = async (credential: string) => {
        try {
            setError('');
            // Extract email from the JWT token first
            const token = credential;
            const payload = JSON.parse(atob(token.split('.')[1]));
            const email = payload.email || '';

            // Check if email contains 'hr' before proceeding with login
            if (!email.toLowerCase().includes('hr')) {
                setError('Only HR personnel are allowed to access this portal.');
                return;
            }

            // If email is valid, proceed with login
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ credential }),
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // If we get here, login was successful
            await checkAuth();
            navigate('/employees');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
            setError(errorMessage);
            console.error('Login error details:', err);
        }
    };

    return <Login onLogin={handleLogin} error={error} />;
};

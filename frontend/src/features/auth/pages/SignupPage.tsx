import React from 'react';
import { SignupForm } from '../components/SigupForm';

export const SignupPage: React.FC = () => {
    const handleSignup = async (data: any) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            return { success: result.success, message: result.message };
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
                    <SignupForm onSubmit={handleSignup} />
                </div>
            </div>
        </div>
    );
};

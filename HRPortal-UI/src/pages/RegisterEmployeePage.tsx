import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Department {
    name: string;
    seats_left: number;
    id: number;
}

export const RegisterEmployeePage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        departmentId: ''
    });
    const [departments, setDepartments] = useState<Department[]>([]);
    const [photo, setPhoto] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

useEffect(() => {
    const loadDepartments = async () => {
        try {

            const seatsRes = await fetch('http://localhost:8000/api/department/seats-left');

            if (!seatsRes.ok) {
                throw new Error('Failed to fetch department seat and ID data');
            }

            const departmentsData = await seatsRes.json();

            const mappedDepartments = departmentsData
                .filter((dept: any) => dept.departmentId) // Ensure only valid IDs are included
                .map((dept: any) => ({
                    id: dept.departmentId, // Use the numeric ID
                    name: dept.name,
                    seats_left: dept.seats_left || 0
                }));

            setDepartments(mappedDepartments);

        } catch (err) {
            console.error('Failed to load departments', err);
            setError('Failed to load department information');
        }
    };
    loadDepartments();
}, []);

    const validateForm = () => {
        if (!formData.firstName.trim()) {
            setError('First name is required');
            return false;
        }
        if (!formData.lastName.trim()) {
            setError('Last name is required');
            return false;
        }
        if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
            setError('Valid email is required');
            return false;
        }
        if (!formData.title.trim()) {
            setError('Job title is required');
            return false;
        }
        if (!formData.departmentId) {
            setError('Please select a department');
            return false;
        }
        
        const selectedDept = departments.find(d => String(d.id) === formData.departmentId);
        if (selectedDept && selectedDept.seats_left <= 0) {
            setError('Selected department has no available seats');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        try {
            const form = new FormData();
            form.append('first_name', formData.firstName.trim());
            form.append('last_name', formData.lastName.trim());
            form.append('email', formData.email.trim());
            form.append('title', formData.title.trim());
            form.append('departmentId', formData.departmentId);
            
            if (photo) {
                form.append('photograph', photo);
            }

            const response = await fetch('http://localhost:8000/api/employee/add', {
                method: 'POST',
                body: form
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to register employee');
            }

            // Show success message
            alert('Employee registered successfully!');
            
            // Navigate to employees list on success
            navigate('/employees');
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Failed to register employee. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Register New Employee</h1>
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
                    <p>{error}</p>
                </div>
            )}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                First Name *
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="John"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="john.doe@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Job Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="e.g., Software Engineer"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Department *
                        </label>
                        <select
                            id="departmentId"
                            name="departmentId"
                            value={formData.departmentId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            required
                        >
                            <option value="">Select a department</option>
                            {departments.map((dept) => (
                                <option 
                                    key={dept.id} 
                                    value={dept.id}
                                    disabled={dept.seats_left <= 0}
                                    className={dept.seats_left <= 0 ? 'text-gray-400' : ''}
                                >
                                    {dept.name} {dept.seats_left <= 0 ? '(No seats available)' : `(${dept.seats_left} seat${dept.seats_left !== 1 ? 's' : ''} left)`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Employee Photograph
                        </label>
                        <div className="mt-1 flex items-center">
                            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <span>Upload Photo</span>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handlePhotoChange}
                                    className="sr-only"
                                />
                            </label>
                            <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                                {photo ? photo.name : 'No file chosen'}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            JPG, PNG, or GIF (Max 5MB)
                        </p>
                        {photo && (
                            <div className="mt-2">
                                <img 
                                    src={URL.createObjectURL(photo)} 
                                    alt="Preview" 
                                    className="h-32 w-32 object-cover rounded-md"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/employees')}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Registering...' : 'Register Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

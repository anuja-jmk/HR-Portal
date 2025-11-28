import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Employee } from '../../models/models';

interface Department {
    id: string;  // Changed from number to string to match department names
    name: string;
    seats_left: number;
}

interface EmployeeDetailProps {
    product: Employee | null;
    loading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChangeField?: (field: string, value: any) => void;
    onPhotoChange?: (file: File | null) => void;
    onSave?: () => void;
    onDelete?: () => void;
    departments?: Department[];
    onDepartmentChange?: (departmentId: number) => void;
    selectedDepartmentId?: number;
}

export const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
    product,
    loading,
    onChangeField,
    onPhotoChange,
    onSave,
    onDelete,
    departments = [],
    onDepartmentChange,
    selectedDepartmentId
}) => {
    const [editing, setEditing] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        // Set photo preview when product changes
        if (product) {
            // Always set the image URL with a timestamp to prevent caching issues
            const imageUrl = `http://localhost:8000/api/employee/image/${product.id}?t=${Date.now()}`;
            setPhotoPreview(imageUrl);
        }
    }, [product]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPhotoPreview(objectUrl);
            onPhotoChange?.(file);
        }
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const deptId = e.target.value; // This is the department name (string)
        console.log('Department changed to:', deptId);

        // Find the full department object to get the seat information
        const selectedDept = departments.find(d => d.id === deptId);
        console.log('Selected department:', selectedDept);

        if (onDepartmentChange) {
            onDepartmentChange(deptId);
        } else {
            console.warn('onDepartmentChange callback is not defined');
        }
    };

    if (loading || !product) {
        return <div className="text-center mt-10">Loading employee details...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/employees" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Employees</Link>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2 p-8 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                    {editing ? (
                        <div className="flex flex-col items-center w-full">
                            <div className="relative w-48 h-48 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                    <span className="text-gray-500 dark:text-gray-400">No Image</span>
                                </div>
                                <img
                                    src={photoPreview || ''}
                                    alt="Employee"
                                    className="relative w-full h-full object-cover"
                                    onLoad={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.opacity = '1';
                                        // Hide the "No Image" text when image loads successfully
                                        const noImageText = target.parentElement?.querySelector('span');
                                        if (noImageText) {
                                            noImageText.style.display = 'none';
                                        }
                                    }}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        e.preventDefault();
                                        e.stopPropagation();
                                        // For 204 responses, just hide the image and show "No Image"
                                        target.style.display = 'none';
                                        const noImageText = target.parentElement?.querySelector('span');
                                        if (noImageText) {
                                            noImageText.style.display = 'block';
                                        }
                                        return false;
                                    }}
                                    style={{
                                        opacity: photoPreview ? 0 : 1,
                                        transition: 'opacity 0.3s ease-in-out',
                                        position: 'relative',
                                        zIndex: 1,
                                        display: photoPreview ? 'block' : 'none'
                                    }}
                                />
                            </div>
                            <label className="cursor-pointer bg-white dark:bg-gray-600 text-gray-700 dark:text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                                Change Photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">JPG, PNG, or GIF (Max 5MB)</p>
                        </div>
                    ) : (
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            <div className="relative w-full h-full rounded-full border-4 border-white dark:border-gray-600 shadow-lg overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                    <span className="text-gray-500 dark:text-gray-400">No Image</span>
                                </div>
                                <img
                                    src={`http://localhost:8000/api/employee/image/${product.id}?t=${Date.now()}`}
                                    alt={`${product.firstName} ${product.lastName}`}
                                    className="relative w-full h-full object-cover"
                                    onLoad={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.opacity = '1';
                                        // Hide the "No Image" text when image loads successfully
                                        const noImageText = target.parentElement?.querySelector('span');
                                        if (noImageText) {
                                            noImageText.style.display = 'none';
                                        }
                                    }}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        e.preventDefault();
                                        e.stopPropagation();
                                        target.style.display = 'none';
                                        // Show the "No Image" text when image fails to load
                                        const noImageText = target.parentElement?.querySelector('span');
                                        if (noImageText) {
                                            noImageText.style.display = 'block';
                                        }
                                        return false;
                                    }}
                                    style={{
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease-in-out',
                                        position: 'relative',
                                        zIndex: 1
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="md:w-1/2 p-8">
                    {editing ? (
                        <>
                            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Edit Employee</h1>
                            <div className="space-y-4 w-full">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            defaultValue={product.firstName || ''}
                                            onChange={(e) => onChangeField?.('first_name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            defaultValue={product.lastName || ''}
                                            onChange={(e) => onChangeField?.('last_name', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        defaultValue={product.email || ''}
                                        onChange={(e) => onChangeField?.('email', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        defaultValue={product.title || ''}
                                        onChange={(e) => onChangeField?.('title', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                                    <select
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        value={selectedDepartmentId || ''}
                                        onChange={(e) => {
                                            console.log('Dropdown changed to:', e.target.value);
                                            handleDepartmentChange(e);
                                        }}
                                    >
                                        <option value="">Select Department</option>
                                        {departments
                                            .filter(dept => dept && dept.id !== undefined)
                                            .map((dept) => {
                                                const seatsLeft = dept.seats_left ?? 0;
                                                const isCurrentDept = dept.id === selectedDepartmentId;
                                                const isDisabled = seatsLeft <= 0 && !isCurrentDept;

                                                return (
                                                    <option
                                                        key={`dept-${dept.id}`}
                                                        value={dept.id}
                                                        disabled={isDisabled}
                                                        className={isDisabled ? 'text-gray-400' : ''}
                                                    >
                                                        {dept.name}
                                                        {isCurrentDept
                                                            ? ` (Current - ${seatsLeft} seat${seatsLeft !== 1 ? 's' : ''} left)`
                                                            : isDisabled
                                                                ? ' (No seats available)'
                                                                : ` (${seatsLeft} seat${seatsLeft !== 1 ? 's' : ''} left)`
                                                        }
                                                    </option>
                                                );
                                            })}
                                    </select>
                                </div>

                                <div className="pt-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee ID</label>
                                    <input
                                        type="text"
                                        disabled
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                                        value={product.id}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                                {product.firstName} {product.lastName}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">Employee ID: {product.id}</p>

                            <div className="space-y-4">
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 border-b pb-2">Personal Information</h2>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="pb-4 border-b border-gray-200 dark:border-gray-600">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">First Name</p>
                                                <p className="text-gray-800 dark:text-gray-200 text-sm">{product.firstName || '-'}</p>
                                            </div>
                                            <div className="pb-4 border-b border-gray-200 dark:border-gray-600">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Last Name</p>
                                                <p className="text-gray-800 dark:text-gray-200 text-sm">{product.lastName || '-'}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="pb-4 border-b border-gray-200 dark:border-gray-600">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</p>
                                                <p className="text-gray-800 dark:text-gray-200 text-sm break-all">{product.email || '-'}</p>
                                            </div>
                                            <div className="pb-4 border-b border-gray-200 dark:border-gray-600">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Job Title</p>
                                                <p className="text-gray-800 dark:text-gray-200 text-sm">{product.title || '-'}</p>
                                            </div>
                                        </div>

                                        <div className="pb-4 border-b border-gray-200 dark:border-gray-600">
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Department</p>
                                            <p className="text-gray-800 dark:text-gray-200 text-sm">
                                                {product.department || 'Not assigned'}
                                                {selectedDepartmentId && departments.find(d => d.id === selectedDepartmentId)?.seats_left !== undefined && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                                        ({departments.find(d => d.id === selectedDepartmentId)?.seats_left} seats left)
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex items-center space-x-4 mt-8">
                        {editing ? (
                            <>
                                <button
                                    onClick={() => {
                                        onSave?.();
                                        setEditing(false);
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setEditing(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                                >
                                    Edit Details
                                </button>
                                <button
                                    onClick={onDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
                                >
                                    Delete Employee
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

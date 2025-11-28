import React from 'react';
import { Link } from 'react-router-dom';
import type { Employee } from '../../models/models';
import { useAuth } from '../../context/AuthContext';

interface EmployeeListProps {
    products: Employee[];
    loading: boolean;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ products, loading }) => {
    const { logout } = useAuth();

    if (loading) {
        return <div className="text-center mt-10">Loading employees...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employees</h1>
                <div className="space-x-4">
                    <Link to="/employees/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Add Employee
                    </Link>
                    <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Logout
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="bg-white p-4 flex items-center justify-center h-48">
                            <div className="relative w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                <img 
                                    src={`http://localhost:8000/api/employee/image/${product.id}?t=${Date.now()}`}
                                    alt={`${product.firstName} ${product.lastName}`}
                                    className="max-h-full max-w-full object-contain"
                                    onError={async (e) => {
                                        const target = e.target as HTMLImageElement;
                                        try {
                                            const response = await fetch(target.src, { method: 'HEAD' });
                                            if (response.status === 204) {
                                                // For 204 No Content, just hide the image and show "No Image"
                                                target.style.display = 'none';
                                                const errorText = target.nextElementSibling as HTMLElement;
                                                if (errorText) {
                                                    errorText.style.display = 'block';
                                                }
                                            } else {
                                                // For other errors, use the existing error handling
                                                e.preventDefault();
                                                e.stopPropagation();
                                                target.style.display = 'none';
                                                const errorText = target.nextElementSibling as HTMLElement;
                                                if (errorText) {
                                                    errorText.style.display = 'block';
                                                }
                                            }
                                        } catch (err) {
                                            // If fetch fails, fall back to the default behavior
                                            e.preventDefault();
                                            e.stopPropagation();
                                            target.style.display = 'none';
                                            const errorText = target.nextElementSibling as HTMLElement;
                                            if (errorText) {
                                                errorText.style.display = 'block';
                                            }
                                        }
                                        return false;
                                    }}
                                />
                                <span 
                                    className="absolute text-sm text-gray-500 dark:text-gray-400"
                                    style={{ display: 'none' }}
                                >
                                    No Image
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold truncate text-gray-900 dark:text-white" title={product.title}>{product.title}</h3>
                            {/* price removed for employee view */}
                            <Link
                                to={`/employees/${product.id}`}
                                className="mt-4 block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

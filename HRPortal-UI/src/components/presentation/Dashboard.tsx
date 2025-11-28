
import React from 'react';
import { Link } from 'react-router-dom';
import { useBoard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';

export const Board: React.FC = () => {
    const { items, removeFromBoard, updateQuantity, clearBoard } = useBoard();
    const { logout } = useAuth();

    // No price on items (employees); show count instead
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Your Board is Empty</h2>
                <Link to="/employees" className="text-blue-500 hover:underline">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Board</h1>
                <div className="space-x-4">
                    <Link to="/employees" className="text-blue-500 hover:underline">
                        Continue Shopping
                    </Link>
                    <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Logout
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                Employee
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-10 h-10 bg-white p-1 rounded">
                                            <img className="w-full h-full object-contain" src={item.image} alt={item.title} />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-gray-900 dark:text-white whitespace-no-wrap" title={item.title}>
                                                {item.title.substring(0, 30)}...
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    <div className="flex items-center border dark:border-gray-600 rounded w-24">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white w-8"
                                        >
                                            -
                                        </button>
                                        <span className="px-2 py-1 w-8 text-center text-gray-800 dark:text-white">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white w-8"
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                    <button
                                        onClick={() => removeFromBoard(item.id)}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="px-5 py-5 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex flex-col items-end justify-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Items: {totalItems}
                    </span>
                    <button
                        onClick={clearBoard}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Clear Board
                    </button>
                </div>
            </div>
        </div>
    );
};

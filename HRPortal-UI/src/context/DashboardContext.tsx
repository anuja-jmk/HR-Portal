
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { BoardItem, Employee } from '../models/models';

interface BoardContextType {
    items: BoardItem[];
    addToBoard: (product: Employee) => void;
    removeFromBoard: (productId: number) => void;
    clearBoard: () => void;
    updateQuantity: (productId: number, quantity: number) => void;
    BoardCount: number;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<BoardItem[]>([]);

    const addToBoard = (product: Employee) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromBoard = (productId: number) => {
        setItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromBoard(productId);
            return;
        }
        setItems(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity } : item
        ));
    };

    const clearBoard = () => setItems([]);

    const BoardCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <BoardContext.Provider value={{ items, addToBoard, removeFromBoard, clearBoard, updateQuantity, BoardCount }}>
            {children}
        </BoardContext.Provider>
    );
};

export const useBoard = () => {
    const context = useContext(BoardContext);
    if (!context) {
        throw new Error('useBoard must be used within a BoardProvider');
    }
    return context;
};

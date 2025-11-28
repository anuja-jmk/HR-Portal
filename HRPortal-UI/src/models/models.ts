
export interface User {
    username: string;
}

export interface Employee {
    id: number;
    title: string; 
    description: string; 
    category: string; 
    image: string; 
    email?: string; 
    rating: {
        rate: number;
        count: number;
    };
}

export interface BoardItem extends Employee {
    quantity: number;
}

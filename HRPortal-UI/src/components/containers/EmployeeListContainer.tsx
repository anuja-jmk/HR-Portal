import React, { useEffect, useState } from 'react';
import { EmployeeList } from '../presentation/EmployeeList';
import { HTTPUtils } from '../../utils/httpUtils';
import type { Employee } from '../../models/models';

export const EmployeeListContainer: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const data = await HTTPUtils.get<any[]>('/employee/get');
                const mapped: Employee[] = data.map(emp => ({
                    id: emp.employee_id,
                    title: `${emp.first_name} ${emp.last_name}`,
                    description: `${emp.title || ''} ${emp.department_name ? ' - ' + emp.department_name : ''}\nEmail: ${emp.email || ''}`,
                    category: emp.department_name || '',
                    rating: { rate: 0, count: 0 }
                }));
                setEmployees(mapped);
            } catch (error) {
                console.error('Failed to fetch employees', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    return <EmployeeList products={employees} loading={loading} />;
};

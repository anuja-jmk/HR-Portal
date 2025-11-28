import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EmployeeDetail } from '../presentation/EmployeeDetail';
import { HTTPUtils } from '../../utils/httpUtils';

// Extend the Employee type to include additional fields
interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    title: string;
    department?: string;
    departmentId?: number;
    image?: string;
    rating: {
        rate: number;
        count: number;
    };
}

interface Department {
    id: number;
    name: string;
    seats_left: number;
}

export const EmployeeDetailContainer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState<Employee | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rawEmployee, setRawEmployee] = useState<Record<string, any> | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);

const fetchDepartments = useCallback(async () => {
    try {
        console.log('Fetching department data...');

         const seatsRes = await fetch('http://localhost:8000/api/department/seats-left');

        if (!seatsRes.ok) {
            throw new Error('Failed to fetch department data');
        }

        // Assuming departmentsData is an array of objects like:
        // [{ departmentId: 1, name: 'Finance', seats_left: 5 }, ...]
        const departmentsData = await seatsRes.json();

        console.log('Department data (seats-left):', departmentsData);

         const mergedDepartments = departmentsData
            // Filter to ensure we only process objects with a valid numeric ID
            .filter((dept) => dept && typeof dept.departmentId === 'number')
            .map((dept) => {
                return {
                    // Use the numeric ID returned by the API for 'id'
                    id: dept.departmentId,
                    name: dept.name,
                    // Ensure seats_left is a number, defaulting to 0
                    seats_left: dept.seats_left || 0
                };
            });

        console.log('Merged departments (using numeric ID):', mergedDepartments);
        setDepartments(mergedDepartments);

    } catch (err) {
        console.error('Failed to load departments', err);
        setError('Failed to load department information');
    }
}, []);

    useEffect(() => {
        const fetchEmployee = async () => {
            if (!id) return;
            try {
                setLoading(true);
                // Load departments first
                await fetchDepartments();

                // Then load employee data
                const data = await HTTPUtils.get<any>(`/employee/get-by-id/${id}`);
                setRawEmployee(data);

                // Set the selected department
                if (data.department_id) {
                    setSelectedDepartmentId(data.department_id);
                }

                let image = data.photograph_path || '';
                if (image && !image.startsWith('http')) {
                    image = image.replace(/^\//, '');
                    image = `http://localhost:8000/${image}`;
                }

                const mapped: Employee = {
                    id: data.employee_id,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    email: data.email,
                    title: data.title,
                    department: data.department_name,
                    departmentId: data.department_id,
                    image,
                    rating: { rate: 0, count: 0 }
                };
                setEmployee(mapped);
            } catch (error) {
                console.error('Failed to fetch employee', error);
                setError('Failed to load employee data');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id, fetchDepartments]);

    // Helper to update rawEmployee for fields other than photo/department
    const handleFieldChange = (field: string, value: any) => {
        setRawEmployee((prev: any) => ({
            ...(prev || {}),
            [field]: value
        }));
    };

    // Handle department change with string IDs
    const handleDepartmentChange = (departmentId: string) => {
        console.log('Department changed to:', departmentId);
        setSelectedDepartmentId(departmentId);
        // Update both department_id and department_name in rawEmployee
        setRawEmployee(prev => ({
            ...prev!,
            department_id: departmentId,
            department_name: departments.find(d => d.id === departmentId)?.name || ''
        }));
    };

    const handleSave = async () => {
        if (!rawEmployee || !employee?.id) return;

        try {
            setIsSaving(true);
            setError('');

            const form = new FormData();

            // Use values from rawEmployee for all fields, falling back to employee/empty string if needed
            form.append('first_name', rawEmployee.first_name || employee.firstName || '');
            form.append('last_name', rawEmployee.last_name || employee.lastName || '');
            form.append('email', rawEmployee.email || employee.email || '');
            form.append('title', rawEmployee.title || employee.title || '');

            // Use selectedDepartmentId for the update
            const deptIdToSave = String(selectedDepartmentId || rawEmployee.department_id || '');
            if (deptIdToSave) {
                form.append('departmentId', deptIdToSave);
            }

            if (photoFile) {
                form.append('photograph', photoFile);
            }

            const response = await fetch(`http://localhost:8000/api/employee/update/${employee.id}`, {
                method: 'PUT',
                body: form
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update employee');
            }

            // Refresh the employee data
            const refreshed = await response.json();
            setRawEmployee(refreshed);

            // Update the employee state with the refreshed data
            setEmployee(prev => ({
                ...prev!,
                firstName: refreshed.first_name,
                lastName: refreshed.last_name,
                email: refreshed.email,
                title: refreshed.title,
                department: refreshed.department_name,
                departmentId: refreshed.department_id,
                image: refreshed.photograph_path
                    ? `http://localhost:8000/${refreshed.photograph_path.replace(/^\//, '')}`
                    : prev?.image
            }));

            // Reset the photo file and selected department state
            setPhotoFile(null);
            setSelectedDepartmentId(refreshed.department_id);

            alert('Employee updated successfully');
        } catch (err: any) {
            console.error('Update error:', err);
            setError(err.message || 'Failed to update employee');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!employee?.id) return;

        const ok = window.confirm('Are you sure you want to delete this employee?');
        if (!ok) return;

        try {
            setIsSaving(true);
            const response = await fetch(`http://localhost:8000/api/employee/delete/${employee.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete employee');
            }

            // Navigate back to employees list on success
            navigate('/employees');
        } catch (err: any) {
            console.error('Delete error:', err);
            setError(err.message || 'Failed to delete employee');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!employee) {
        return <div className="text-center py-10">Employee not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <EmployeeDetail
                product={employee}
                loading={isSaving}
                departments={departments}
                selectedDepartmentId={selectedDepartmentId || undefined}
                onDepartmentChange={(deptId) => {
                    console.log('Department changed in container:', deptId);
                    handleDepartmentChange(deptId);
                }}
                onChangeField={(field, value) => {
                    handleFieldChange(field, value);
                }}
                onPhotoChange={(file) => setPhotoFile(file)}
                onSave={handleSave}
                onDelete={handleDelete}
            />
        </div>
    );
};
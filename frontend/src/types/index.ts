export interface Department {
    id: number;
    name: string;
    code: string;
    budget: string;
    is_active: boolean;
    created_at?: string;
    max_employees: number;
}

export interface Employee {
    id: number;
    department_id: number;
    department_name?: string;
    first_name: string;
    last_name: string;
    hire_date: string;
    is_manager: boolean;
    salary: string;
}

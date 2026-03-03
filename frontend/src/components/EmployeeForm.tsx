import { useState, useEffect } from 'react';
import type { Employee, Department } from '@/types';

interface Props {
    employee?: Employee | null;
    departments: Department[];
    onSubmit: (data: Partial<Employee>) => void;
    onCancel: () => void;
}

export const EmployeeForm = ({ employee, departments, onSubmit, onCancel }: Props) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        department_id: '',
        salary: '',
        hire_date: new Date().toISOString().split('T')[0],
        is_manager: false,
    });

    useEffect(() => {
        if (employee) {
            setFormData({
                first_name: employee.first_name,
                last_name: employee.last_name,
                department_id: employee.department_id.toString(),
                salary: employee.salary,
                hire_date: employee.hire_date.substring(0, 10),
                is_manager: employee.is_manager,
            });
        } else if (departments.length > 0) {
            setFormData((prev) => ({ ...prev, department_id: departments[0].id.toString() }));
        }
    }, [employee, departments]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            department_id: Number.parseInt(formData.department_id, 10),
            salary: formData.salary,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                    <label htmlFor="emp-first-name" className="text-sm font-medium text-slate-300">
                        Nombre
                    </label>
                    <input
                        id="emp-first-name"
                        required
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="glass-input"
                        placeholder="Ej. Juan"
                    />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                    <label htmlFor="emp-last-name" className="text-sm font-medium text-slate-300">
                        Apellido
                    </label>
                    <input
                        id="emp-last-name"
                        required
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="glass-input"
                        placeholder="Ej. Perez"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="emp-department" className="text-sm font-medium text-slate-300">
                    Departamento
                </label>
                <select
                    id="emp-department"
                    required
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="glass-input [&>option]:bg-slate-800"
                >
                    {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name} ({d.code})
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                    <label htmlFor="emp-salary" className="text-sm font-medium text-slate-300">
                        Salario
                    </label>
                    <input
                        id="emp-salary"
                        type="number"
                        step="0.01"
                        required
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        className="glass-input"
                        placeholder="3500.00"
                    />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                    <label htmlFor="emp-hire-date" className="text-sm font-medium text-slate-300">
                        Fecha Ingreso
                    </label>
                    <input
                        id="emp-hire-date"
                        type="date"
                        required
                        value={formData.hire_date}
                        onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                        className="glass-input [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
                <label
                    htmlFor="emp-manager"
                    className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors"
                >
                    <input
                        id="emp-manager"
                        type="checkbox"
                        checked={formData.is_manager}
                        onChange={(e) => setFormData({ ...formData, is_manager: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
                    />
                    Asignar Rol de Manager
                </label>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-transparent"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                >
                    Guardar
                </button>
            </div>
        </form>
    );
};

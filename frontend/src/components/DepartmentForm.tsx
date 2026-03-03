import { useState, useEffect } from 'react';
import type { Department } from '@/types';

interface Props {
    department?: Department | null;
    onSubmit: (data: Partial<Department>) => void;
    onCancel: () => void;
}

export const DepartmentForm = ({ department, onSubmit, onCancel }: Props) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        budget: '',
        max_employees: '',
        is_active: true,
    });

    useEffect(() => {
        if (department) {
            setFormData({
                name: department.name,
                code: department.code,
                budget: department.budget,
                max_employees: department.max_employees.toString(),
                is_active: department.is_active,
            });
        }
    }, [department]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            budget: formData.budget,
            max_employees: Number.parseInt(formData.max_employees, 10),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label htmlFor="dept-name" className="text-sm font-medium text-slate-300">
                    Nombre del Departamento
                </label>
                <input
                    id="dept-name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass-input"
                    placeholder="Ej. Tecnologia"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="dept-code" className="text-sm font-medium text-slate-300">
                    Codigo (maximo 5 caracteres)
                </label>
                <input
                    id="dept-code"
                    required
                    maxLength={5}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="glass-input"
                    placeholder="Ej. TEC"
                />
            </div>
            <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                    <label htmlFor="dept-budget" className="text-sm font-medium text-slate-300">
                        Presupuesto
                    </label>
                    <input
                        id="dept-budget"
                        type="number"
                        step="0.01"
                        required
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="glass-input"
                        placeholder="50000.00"
                    />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                    <label htmlFor="dept-max" className="text-sm font-medium text-slate-300">
                        Capacidad Maxima
                    </label>
                    <input
                        id="dept-max"
                        type="number"
                        required
                        value={formData.max_employees}
                        onChange={(e) => setFormData({ ...formData, max_employees: e.target.value })}
                        className="glass-input"
                        placeholder="20"
                    />
                </div>
            </div>
            <div className="flex items-center gap-3 mt-2">
                <label
                    htmlFor="dept-active"
                    className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors"
                >
                    <input
                        id="dept-active"
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
                    />
                    Departamento Activo
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

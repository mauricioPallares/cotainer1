'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Building2,
} from 'lucide-react';
import type { Department, Employee } from '@/types';
import { Modal } from '@/components/Modal';
import { DepartmentForm } from '@/components/DepartmentForm';
import { EmployeeForm } from '@/components/EmployeeForm';

const ITEMS_PER_PAGE = 5;

export default function HomePage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);

  const [deptPage, setDeptPage] = useState(1);
  const [empPage, setEmpPage] = useState(1);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

  const fetchData = async () => {
    try {
      const [depRes, empRes] = await Promise.all([
        fetch(`${apiUrl}/api/departments`),
        fetch(`${apiUrl}/api/employees`),
      ]);

      if (!depRes.ok || !empRes.ok) {
        throw new Error('Failed to fetch data from API');
      }

      const depData: Department[] = await depRes.json();
      const empData: Employee[] = await empRes.json();

      setDepartments(depData);
      setEmployees(empData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error conectando con el backend. Asegurate de que los contenedores esten corriendo.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveDept = async (data: Partial<Department>) => {
    try {
      const isEditing = !!editingDept;
      const url = isEditing
        ? `${apiUrl}/api/departments/${editingDept!.id}`
        : `${apiUrl}/api/departments`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsDeptModalOpen(false);
        setEditingDept(null);
        fetchData();
      } else {
        alert('Error al guardar el departamento');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDept = async (id: number) => {
    if (!confirm('Seguro que deseas eliminar este departamento? Se eliminaran tambien sus empleados.')) return;
    try {
      const res = await fetch(`${apiUrl}/api/departments/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEmp = async (data: Partial<Employee>) => {
    try {
      const isEditing = !!editingEmp;
      const url = isEditing
        ? `${apiUrl}/api/employees/${editingEmp!.id}`
        : `${apiUrl}/api/employees`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsEmpModalOpen(false);
        setEditingEmp(null);
        fetchData();
      } else {
        alert('Error al guardar el empleado');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEmp = async (id: number) => {
    if (!confirm('Seguro que deseas eliminar este empleado?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/employees/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(amount));
  };

  // Paginacion - Departamentos
  const indexOfLastDept = deptPage * ITEMS_PER_PAGE;
  const indexOfFirstDept = indexOfLastDept - ITEMS_PER_PAGE;
  const currentDepts = departments.slice(indexOfFirstDept, indexOfLastDept);
  const totalDeptPages = Math.ceil(departments.length / ITEMS_PER_PAGE);

  // Paginacion - Empleados
  const indexOfLastEmp = empPage * ITEMS_PER_PAGE;
  const indexOfFirstEmp = indexOfLastEmp - ITEMS_PER_PAGE;
  const currentEmps = employees.slice(indexOfFirstEmp, indexOfLastEmp);
  const totalEmpPages = Math.ceil(employees.length / ITEMS_PER_PAGE);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-slate-900 text-slate-100">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 bg-slate-800/80 backdrop-blur-md border-b border-white/5 shrink-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
            <LayoutDashboard className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Enterprise Dashboard
            </h1>
            <p className="text-xs text-slate-400">Gestion de recursos corporativos</p>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-hidden max-w-[1920px] mx-auto w-full">
        {loading && (
          <div className="m-auto text-xl text-indigo-400 animate-pulse">
            Cargando informacion del sistema...
          </div>
        )}
        {error && (
          <div className="m-auto p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Panel de Departamentos */}
            <section className="flex-1 flex flex-col glass-panel rounded-2xl overflow-hidden h-full">
              <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    Departamentos
                    <span className="text-xs py-0.5 px-2 bg-slate-700 rounded-full text-slate-300">
                      {departments.length}
                    </span>
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setEditingDept(null);
                    setIsDeptModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-4 h-4" /> Nuevo
                </button>
              </div>

              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="sticky top-0 bg-slate-800/95 backdrop-blur z-10 text-slate-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3 font-semibold border-b border-white/5">Codigo</th>
                      <th className="px-5 py-3 font-semibold border-b border-white/5">Nombre</th>
                      <th className="px-5 py-3 font-semibold border-b border-white/5">Estado</th>
                      <th className="px-5 py-3 font-semibold border-b border-white/5 text-right">Presupuesto</th>
                      <th className="px-5 py-3 font-semibold border-b border-white/5 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {currentDepts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">
                          No hay departamentos registrados.
                        </td>
                      </tr>
                    ) : (
                      currentDepts.map((dept) => (
                        <tr key={dept.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-5 py-3 whitespace-nowrap text-slate-300 font-mono text-xs">
                            {dept.code}
                          </td>
                          <td className="px-5 py-3 text-slate-200 font-medium">{dept.name}</td>
                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${dept.is_active
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}
                            >
                              {dept.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right text-slate-300 font-mono text-xs">
                            {formatCurrency(dept.budget)}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingDept(dept);
                                  setIsDeptModalOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-md transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDept(dept.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-3 border-t border-white/5 flex items-center justify-between shrink-0 bg-slate-800/50">
                <span className="text-xs text-slate-400">
                  Mostrando{' '}
                  <span className="text-slate-200 font-medium">
                    {departments.length === 0 ? 0 : indexOfFirstDept + 1}
                  </span>{' '}
                  a{' '}
                  <span className="text-slate-200 font-medium">
                    {Math.min(indexOfLastDept, departments.length)}
                  </span>{' '}
                  de{' '}
                  <span className="text-slate-200 font-medium">{departments.length}</span>
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setDeptPage((p) => Math.max(1, p - 1))}
                    disabled={deptPage === 1}
                    className="p-1 rounded-md bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeptPage((p) => Math.min(totalDeptPages, p + 1))}
                    disabled={deptPage === totalDeptPages || totalDeptPages === 0}
                    className="p-1 rounded-md bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </section>

            {/* Panel de Empleados */}
            <section className="flex-1 flex flex-col glass-panel rounded-2xl overflow-hidden h-full">
              <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-purple-500/20 rounded-lg text-purple-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    Empleados
                    <span className="text-xs py-0.5 px-2 bg-slate-700 rounded-full text-slate-300">
                      {employees.length}
                    </span>
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setEditingEmp(null);
                    setIsEmpModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-4 h-4" /> Nuevo
                </button>
              </div>

              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="sticky top-0 bg-slate-800/95 backdrop-blur z-10 text-slate-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3 font-semibold border-b border-white/5">Nombre</th>
                      <th className="px-5 py-3 font-semibold border-b border-white/5">Depto / Rol</th>
                      <th className="px-5 py-3 font-semibold border-b border-white/5">Ingreso</th>
                      <th className="px-5 py-3 font-semibold border-b border-white/5 text-right">Salario</th>
                      <th className="px-5 py-3 font-semibold border-b border-white/5 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {currentEmps.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">
                          No hay empleados registrados.
                        </td>
                      </tr>
                    ) : (
                      currentEmps.map((emp) => (
                        <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-5 py-3">
                            <div className="font-medium text-slate-200">
                              {emp.first_name} {emp.last_name}
                            </div>
                            {emp.is_manager && (
                              <span className="inline-block mt-1 text-[10px] uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                                Manager
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            <div className="text-slate-300">
                              {emp.department_name ?? `Dep. ID: ${emp.department_id}`}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-slate-400 text-xs">
                            {formatDate(emp.hire_date)}
                          </td>
                          <td className="px-5 py-3 text-right text-slate-300 font-mono text-xs">
                            {formatCurrency(emp.salary)}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingEmp(emp);
                                  setIsEmpModalOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-md transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteEmp(emp.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-3 border-t border-white/5 flex items-center justify-between shrink-0 bg-slate-800/50">
                <span className="text-xs text-slate-400">
                  Mostrando{' '}
                  <span className="text-slate-200 font-medium">
                    {employees.length === 0 ? 0 : indexOfFirstEmp + 1}
                  </span>{' '}
                  a{' '}
                  <span className="text-slate-200 font-medium">
                    {Math.min(indexOfLastEmp, employees.length)}
                  </span>{' '}
                  de{' '}
                  <span className="text-slate-200 font-medium">{employees.length}</span>
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEmpPage((p) => Math.max(1, p - 1))}
                    disabled={empPage === 1}
                    className="p-1 rounded-md bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEmpPage((p) => Math.min(totalEmpPages, p + 1))}
                    disabled={empPage === totalEmpPages || totalEmpPages === 0}
                    className="p-1 rounded-md bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Modal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        title={editingDept ? 'Editar Departamento' : 'Nuevo Departamento'}
      >
        <DepartmentForm
          department={editingDept}
          onSubmit={handleSaveDept}
          onCancel={() => setIsDeptModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEmpModalOpen}
        onClose={() => setIsEmpModalOpen(false)}
        title={editingEmp ? 'Editar Empleado' : 'Nuevo Empleado'}
      >
        <EmployeeForm
          employee={editingEmp}
          departments={departments}
          onSubmit={handleSaveEmp}
          onCancel={() => setIsEmpModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

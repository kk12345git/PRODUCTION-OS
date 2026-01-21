"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, RefreshCw, Users } from 'lucide-react';
import type { Employee, EmployeeStatus } from '../../types';
import { getAllEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../lib/db-helpers';

export default function Employees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        email: '',
        phone: '',
        status: 'ACTIVE' as EmployeeStatus,
    });

    // Get unique roles from existing employees for suggestions
    const existingRoles = [...new Set(employees.map(e => e.role).filter(Boolean))];

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            setLoading(true);
            const data = await getAllEmployees();
            setEmployees(data);
        } catch (error) {
            console.error('Failed to load employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!formData.name.trim()) {
            alert('Please enter employee name');
            return;
        }
        if (!formData.role.trim()) {
            alert('Please enter a role');
            return;
        }
        try {
            await createEmployee(formData);
            await loadEmployees();
            setIsAdding(false);
            resetForm();
            alert('✅ Employee added successfully!');
        } catch (error) {
            console.error('Failed to create employee:', error);
            alert('❌ Failed to create employee');
        }
    };

    const handleEdit = (employee: Employee) => {
        setEditingId(employee.id);
        setIsAdding(false);
        setFormData({
            name: employee.name,
            role: employee.role,
            email: employee.email || '',
            phone: employee.phone || '',
            status: employee.status,
        });
    };

    const handleUpdate = async () => {
        if (!editingId) return;
        if (!formData.name.trim()) {
            alert('Please enter employee name');
            return;
        }
        if (!formData.role.trim()) {
            alert('Please enter a role');
            return;
        }
        try {
            await updateEmployee(editingId, formData);
            await loadEmployees();
            setEditingId(null);
            resetForm();
            alert('✅ Employee updated successfully!');
        } catch (error) {
            console.error('Failed to update employee:', error);
            alert('❌ Failed to update employee');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            try {
                await deleteEmployee(id);
                await loadEmployees();
                alert('✅ Employee deleted');
            } catch (error) {
                console.error('Failed to delete employee:', error);
                alert('❌ Failed to delete employee');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            role: '',
            email: '',
            phone: '',
            status: 'ACTIVE',
        });
    };

    const inputClass = "w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-medium text-slate-300 mb-2";

    if (loading && employees.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center -m-8">
                <RefreshCw className="animate-spin text-emerald-400" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 -m-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
                            <Users className="text-purple-400" size={36} />
                            Employee Management
                        </h1>
                        <p className="text-slate-400">Manage your production team</p>
                    </div>
                    <button
                        onClick={() => {
                            setIsAdding(true);
                            setEditingId(null);
                            resetForm();
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg"
                    >
                        <Plus size={18} />
                        Add Employee
                    </button>
                </div>

                {/* Add/Edit Form */}
                {(isAdding || editingId) && (
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-4">
                            {isAdding ? 'Add New Employee' : 'Edit Employee'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={inputClass}
                                    placeholder="Employee name"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Role * <span className="text-slate-500 text-xs">(Type any role)</span></label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g., Operator, Supervisor, Manager..."
                                    list="role-suggestions"
                                />
                                {/* Datalist for autocomplete suggestions */}
                                <datalist id="role-suggestions">
                                    {existingRoles.map((role, idx) => (
                                        <option key={idx} value={role} />
                                    ))}
                                </datalist>

                                {/* Quick role buttons */}
                                {existingRoles.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className="text-xs text-slate-500">Quick select:</span>
                                        {existingRoles.slice(0, 5).map((role, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role })}
                                                className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className={labelClass}>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={inputClass}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={inputClass}
                                    placeholder="+91 9876543210"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
                                    className={inputClass}
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={isAdding ? handleAdd : handleUpdate}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold hover:from-emerald-500 hover:to-emerald-400 transition-all"
                            >
                                <Save size={18} />
                                {isAdding ? 'Add Employee' : 'Update'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setEditingId(null);
                                    resetForm();
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-slate-300 rounded-xl font-medium hover:bg-slate-600 transition-all"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Employees Table */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
                    <table className="w-full">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="text-right py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {employees.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500 italic">
                                        No employees found. Add one to get started.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-slate-800/50 transition-colors group">
                                        <td className="py-4 px-6 text-sm text-white font-medium">{employee.name}</td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full">
                                                {employee.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-400">{employee.email || '-'}</td>
                                        <td className="py-4 px-6 text-sm text-slate-400">{employee.phone || '-'}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${employee.status === 'ACTIVE'
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-slate-700 text-slate-400'
                                                }`}>
                                                {employee.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(employee)}
                                                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(employee.id)}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Role Summary */}
                {existingRoles.length > 0 && (
                    <div className="mt-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-lg font-bold text-white mb-3">Roles in Use</h3>
                        <div className="flex flex-wrap gap-2">
                            {existingRoles.map((role, idx) => {
                                const count = employees.filter(e => e.role === role).length;
                                return (
                                    <div key={idx} className="px-3 py-2 bg-slate-800 rounded-lg border border-slate-700">
                                        <span className="text-purple-400 font-medium">{role}</span>
                                        <span className="ml-2 text-slate-500 text-sm">({count})</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

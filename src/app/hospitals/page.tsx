"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Building2, RefreshCw } from 'lucide-react';
import type { Hospital, HospitalStatus } from '../../types';
import { getAllHospitals, createHospital, updateHospital, deleteHospital } from '../../lib/db-helpers';

export default function Hospitals() {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        contact_person: '',
        phone: '',
        email: '',
        status: 'ACTIVE' as HospitalStatus,
    });

    useEffect(() => {
        loadHospitals();
    }, []);

    const loadHospitals = async () => {
        try {
            setLoading(true);
            const data = await getAllHospitals();
            setHospitals(data);
        } catch (error) {
            console.error('Failed to load hospitals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        try {
            await createHospital(formData);
            await loadHospitals();
            setIsAdding(false);
            resetForm();
        } catch (error) {
            console.error('Failed to create hospital:', error);
            alert('Failed to create hospital');
        }
    };

    const handleEdit = (hospital: Hospital) => {
        setEditingId(hospital.id);
        setFormData({
            name: hospital.name,
            location: hospital.location || '',
            contact_person: hospital.contact_person || '',
            phone: hospital.phone || '',
            email: hospital.email || '',
            status: hospital.status,
        });
    };

    const handleUpdate = async () => {
        if (!editingId) return;
        try {
            await updateHospital(editingId, formData);
            await loadHospitals();
            setEditingId(null);
            resetForm();
        } catch (error) {
            console.error('Failed to update hospital:', error);
            alert('Failed to update hospital');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this hospital?')) {
            try {
                await deleteHospital(id);
                await loadHospitals();
            } catch (error) {
                console.error('Failed to delete hospital:', error);
                alert('Failed to delete hospital');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            location: '',
            contact_person: '',
            phone: '',
            email: '',
            status: 'ACTIVE',
        });
    };

    const inputClass = "w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-medium text-slate-300 mb-2";

    if (loading && hospitals.length === 0) {
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
                        <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent flex items-center gap-3">
                            <Building2 className="text-blue-400" size={36} />
                            Hospital Management
                        </h1>
                        <p className="text-slate-400">Manage hospitals that order products</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg"
                    >
                        <Plus size={18} />
                        Add Hospital
                    </button>
                </div>

                {/* Add/Edit Form */}
                {(isAdding || editingId) && (
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-4">
                            {isAdding ? 'Add New Hospital' : 'Edit Hospital'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Hospital Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g., Apollo Hospital"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className={inputClass}
                                    placeholder="City/Area"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Contact Person</label>
                                <input
                                    type="text"
                                    value={formData.contact_person}
                                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                                    className={inputClass}
                                    placeholder="Contact name"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={inputClass}
                                    placeholder="+91 XXXXXXXXXX"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={inputClass}
                                    placeholder="hospital@example.com"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as HospitalStatus })}
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
                                {isAdding ? 'Add Hospital' : 'Update'}
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

                {/* Hospitals Table */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
                    <table className="w-full">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Hospital Name</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Person</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="text-right py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {hospitals.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500 italic">
                                        No hospitals found. Add one to get started.
                                    </td>
                                </tr>
                            ) : (
                                hospitals.map((hospital) => (
                                    <tr key={hospital.id} className="hover:bg-slate-800/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Building2 size={18} className="text-blue-400" />
                                                <span className="text-sm font-medium text-white">{hospital.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-400">{hospital.location || '-'}</td>
                                        <td className="py-4 px-6 text-sm text-slate-400">{hospital.contact_person || '-'}</td>
                                        <td className="py-4 px-6 text-sm text-slate-400">{hospital.phone || '-'}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${hospital.status === 'ACTIVE'
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-slate-700 text-slate-400'
                                                }`}>
                                                {hospital.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(hospital)}
                                                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(hospital.id)}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
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
            </div>
        </div>
    );
}

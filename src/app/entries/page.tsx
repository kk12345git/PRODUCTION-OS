"use client";
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Eye, Building2, FolderOpen, Activity, Clock, List, RefreshCw } from 'lucide-react';
import type { ProductionEntry, ActivityLog } from '../../types';
import { getProductionEntries, deleteProductionEntry, getRecentActivityLogs } from '../../lib/db-helpers';

export default function ProductionEntries() {
    const [entries, setEntries] = useState<ProductionEntry[]>([]);
    const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState({
        date: '',
        shift: '',
        hospital_id: '',
        production_category: '',
    });

    useEffect(() => {
        loadData();
    }, [filter]);

    const loadData = async () => {
        try {
            setLoading(true);
            const apiFilters = {
                date: filter.date || undefined,
                shift: filter.shift ? (filter.shift as 'A' | 'B' | 'C') : undefined,
                hospital_id: filter.hospital_id || undefined,
                production_category: filter.production_category || undefined,
            };
            const data = await getProductionEntries(apiFilters);
            setEntries(data);
            const logs = await getRecentActivityLogs(10);
            setRecentActivity(logs);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this entry?')) {
            try {
                await deleteProductionEntry(id);
                loadData();
            } catch (error) {
                console.error('Failed to delete entry:', error);
                alert('Failed to delete entry');
            }
        }
    };

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    if (loading && entries.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center -m-8">
                <RefreshCw className="animate-spin text-emerald-400" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 -m-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
                            <List className="text-blue-400" size={36} />
                            Production Records
                        </h1>
                        <p className="text-slate-400">Hospital-wise production tracking and management</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 mb-8 border border-slate-700">
                        <div className="flex flex-col md:flex-row items-end gap-4">
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Date</label>
                                <input
                                    type="date"
                                    value={filter.date}
                                    onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Shift</label>
                                <select
                                    value={filter.shift}
                                    onChange={(e) => setFilter({ ...filter, shift: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                >
                                    <option value="">All Shifts</option>
                                    <option value="A">Shift A</option>
                                    <option value="B">Shift B</option>
                                    <option value="C">Shift C</option>
                                </select>
                            </div>
                            <div className="flex-none">
                                <button
                                    onClick={() => setFilter({ date: '', shift: '', hospital_id: '', production_category: '' })}
                                    className="px-6 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Entries Table */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-800/50 border-b border-slate-700">
                                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Production Info</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Hospital & Category</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Operator</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Qty</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Efficiency</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {entries.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-slate-800/50 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-white">{entry.date}</div>
                                                <div className="text-xs text-slate-500">Shift {entry.shift} • {entry.start_time?.slice(0, 5)}-{entry.end_time?.slice(0, 5)}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Building2 size={14} className="text-blue-400" />
                                                    <span className="font-medium text-slate-300">Hospital {entry.hospital_id?.slice(0, 8)}...</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FolderOpen size={14} className="text-emerald-400" />
                                                    <span className="text-xs text-slate-500">{entry.production_category}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-white">{(entry as any).employees?.name || 'N/A'}</div>
                                                <div className="text-[10px] text-slate-500 capitalize">Operator</div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="font-bold text-white">{entry.actual_qty}</div>
                                                <div className="text-xs text-slate-500">/ {entry.planned_qty}</div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className={`inline-flex items-center justify-end px-3 py-1 rounded-full text-sm font-bold ${(entry.efficiency || 0) >= 90 ? 'text-emerald-400 bg-emerald-500/20' :
                                                    (entry.efficiency || 0) >= 70 ? 'text-amber-400 bg-amber-500/20' :
                                                        'text-red-400 bg-red-500/20'
                                                    }`}>
                                                    {entry.efficiency?.toFixed(1)}%
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => window.location.href = `/entry?id=${entry.id}`}
                                                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                                        title="Edit Record"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(entry.id)}
                                                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                        title="Delete Record"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {entries.length === 0 && (
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-16 text-center mt-8 border border-dashed border-slate-700">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Eye className="text-slate-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Records Found</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your filters or search criteria to see production results.</p>
                            <button
                                onClick={() => setFilter({ date: '', shift: '', hospital_id: '', production_category: '' })}
                                className="mt-6 text-emerald-400 font-semibold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar: Live Activity Feed */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-6 sticky top-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                            <Activity className="text-emerald-400" size={20} />
                            <h2 className="text-lg font-bold text-white">Live Activity</h2>
                        </div>

                        <div className="space-y-6">
                            {recentActivity.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No recent activity.</p>
                            ) : (
                                recentActivity.map((log) => (
                                    <div key={log.id} className="relative pl-6 border-l-2 border-slate-700 last:border-0">
                                        <div className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${log.action_type === 'CREATE' ? 'bg-emerald-500' :
                                            log.action_type === 'UPDATE' ? 'bg-blue-500' :
                                                'bg-red-500'
                                            }`} />
                                        <div className="mb-1">
                                            <span className="text-xs font-bold text-slate-300 block mb-0.5">
                                                {log.action_type} {log.entity_type}
                                            </span>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                {JSON.stringify(log.details).slice(0, 50)}...
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                            <Clock size={10} />
                                            <span>{timeAgo(log.created_at)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

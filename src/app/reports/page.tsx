"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, BarChart3, Download, RefreshCw, Eye, Award, Target, Users } from 'lucide-react';
import { getProductionSummary, getStatsByCategory, getProductionEntries, getEmployeeRankings, getDeepAnalysisReport } from '../../lib/db-helpers';

export default function Reports() {
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
    });

    const [summaryData, setSummaryData] = useState<any>(null);
    const [categoryStats, setCategoryStats] = useState<any[]>([]);
    const [recentEntries, setRecentEntries] = useState<any[]>([]);
    const [employeeRankings, setEmployeeRankings] = useState<any[]>([]);
    const [deepAnalysis, setDeepAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'deep'>('overview');

    useEffect(() => {
        loadData();
    }, [dateRange]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [summary, stats, entries, rankings, deep] = await Promise.all([
                getProductionSummary(dateRange.start, dateRange.end),
                getStatsByCategory(dateRange.start, dateRange.end),
                getProductionEntries(),
                getEmployeeRankings(dateRange.start, dateRange.end),
                getDeepAnalysisReport(dateRange.start, dateRange.end)
            ]);

            setSummaryData(summary);
            setCategoryStats(stats);
            setRecentEntries(entries.slice(0, 10));
            setEmployeeRankings(rankings);
            setDeepAnalysis(deep);
        } catch (error) {
            console.error('Failed to load reports data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 -m-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        Advanced Analytics & Reports
                    </h1>
                    <p className="text-slate-400">Deep-dive analysis and performance insights</p>
                </div>

                {/* Date Range Filter */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-emerald-400" size={20} />
                            <span className="font-medium text-white">Date Range:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <span className="text-slate-500">to</span>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <button
                            onClick={loadData}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors"
                        >
                            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
                            {loading ? 'Loading...' : 'Update View'}
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'overview'
                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        <BarChart3 className="inline mr-2" size={18} />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('deep')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'deep'
                                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        <Target className="inline mr-2" size={18} />
                        Deep Analysis
                    </button>
                </div>

                {summaryData && (
                    <>
                        {activeTab === 'overview' && (
                            <>
                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                    <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-2xl p-6 border border-blue-700/50 shadow-2xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-slate-300 text-sm font-medium">Total Production</h3>
                                            <BarChart3 className="text-blue-400" size={24} />
                                        </div>
                                        <p className="text-4xl font-black text-white">{summaryData.totalActual.toLocaleString()}</p>
                                        <p className="text-sm text-slate-400 mt-2">Goal: {summaryData.totalPlanned.toLocaleString()}</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 rounded-2xl p-6 border border-emerald-700/50 shadow-2xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-slate-300 text-sm font-medium">Avg Efficiency</h3>
                                            <TrendingUp className="text-emerald-400" size={24} />
                                        </div>
                                        <p className="text-4xl font-black text-white">{summaryData.averageEfficiency.toFixed(1)}%</p>
                                        <p className={`text-sm mt-2 ${summaryData.averageEfficiency >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {summaryData.averageEfficiency >= 90 ? '✓ High Performance' : '⚠ Standard'}
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-red-900/50 to-red-800/50 rounded-2xl p-6 border border-red-700/50 shadow-2xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-slate-300 text-sm font-medium">Rejection Qty</h3>
                                            <BarChart3 className="text-red-400" size={24} />
                                        </div>
                                        <p className="text-4xl font-black text-white">{summaryData.totalRejected.toLocaleString()}</p>
                                        <p className="text-sm text-red-400 mt-2">Quality monitoring</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-2xl p-6 border border-purple-700/50 shadow-2xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-slate-300 text-sm font-medium">Discipline Score</h3>
                                            <TrendingUp className="text-purple-400" size={24} />
                                        </div>
                                        <p className="text-4xl font-black text-white">{summaryData.averageDiscipline.toFixed(1)}/100</p>
                                        <p className="text-sm text-emerald-400 mt-2">Team performance</p>
                                    </div>
                                </div>

                                {/* Production by Category */}
                                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700">
                                    <h2 className="text-xl font-bold text-white mb-4">Efficiency by Production Category</h2>
                                    <div className="space-y-4">
                                        {categoryStats.length === 0 ? (
                                            <p className="text-slate-500 italic py-4">No data for selected range.</p>
                                        ) : (
                                            categoryStats.map((stat) => (
                                                <div key={stat.name}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-slate-200">{stat.name}</span>
                                                        <span className="text-sm text-slate-400 font-bold">{stat.efficiency}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-700 rounded-full h-3">
                                                        <div
                                                            className={`h-3 rounded-full transition-all ${stat.efficiency >= 90 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                                                                    stat.efficiency >= 75 ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                                                                        'bg-gradient-to-r from-red-500 to-red-400'
                                                                }`}
                                                            style={{ width: `${stat.efficiency}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between mt-1">
                                                        <span className="text-[10px] text-slate-500">Actual: {stat.actual}</span>
                                                        <span className="text-[10px] text-slate-500">Target: {stat.planned}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Recent Entries Table */}
                                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-700">
                                    <h2 className="text-xl font-bold text-white mb-4">Latest Production Results</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-700">
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Date</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Shift</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Operator</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Category</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Product</th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Planned</th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Actual</th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Efficiency</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentEntries.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={8} className="py-8 text-center text-slate-500">No entries found.</td>
                                                    </tr>
                                                ) : (
                                                    recentEntries.map((entry) => (
                                                        <tr key={entry.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                                            <td className="py-3 px-4 text-sm text-slate-300">{entry.date}</td>
                                                            <td className="py-3 px-4 text-sm text-slate-300 font-medium">{entry.shift}</td>
                                                            <td className="py-3 px-4 text-sm text-slate-300">{(entry as any).employees?.name || '-'}</td>
                                                            <td className="py-3 px-4 text-sm text-slate-300">{entry.production_category}</td>
                                                            <td className="py-3 px-4 text-sm text-slate-300 truncate max-w-[150px]">
                                                                {entry.products?.name || 'Unknown Product'}
                                                            </td>
                                                            <td className="py-3 px-4 text-sm text-slate-400 text-right">{entry.planned_qty}</td>
                                                            <td className="py-3 px-4 text-sm font-bold text-white text-right">{entry.actual_qty}</td>
                                                            <td className={`py-3 px-4 text-sm font-bold text-right ${(entry.efficiency || 0) >= 90 ? 'text-emerald-400' :
                                                                    (entry.efficiency || 0) >= 75 ? 'text-blue-400' : 'text-red-400'
                                                                }`}>
                                                                {entry.efficiency?.toFixed(1)}%
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'deep' && deepAnalysis && (
                            <>
                                {/* Employee Leaderboard */}
                                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Award className="text-yellow-400" size={24} />
                                        <h2 className="text-xl font-bold text-white">Employee Leaderboard</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-700">
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Rank</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Name</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Role</th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Production</th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Efficiency</th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Rejection %</th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Shifts</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeeRankings.map((emp, idx) => (
                                                    <tr key={emp.employee_id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                                        <td className="py-3 px-4">
                                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${idx === 0 ? 'bg-yellow-500 text-slate-900' :
                                                                    idx === 1 ? 'bg-slate-400 text-slate-900' :
                                                                        idx === 2 ? 'bg-amber-700 text-white' :
                                                                            'bg-slate-700 text-slate-300'
                                                                }`}>
                                                                {idx + 1}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-sm font-medium text-white">{emp.name}</td>
                                                        <td className="py-3 px-4 text-sm text-slate-400">{emp.role}</td>
                                                        <td className="py-3 px-4 text-sm text-slate-300 text-right">{emp.totalProduction.toLocaleString()}</td>
                                                        <td className="py-3 px-4 text-sm font-bold text-emerald-400 text-right">{emp.averageEfficiency}%</td>
                                                        <td className="py-3 px-4 text-sm text-slate-400 text-right">{emp.rejectionRate}%</td>
                                                        <td className="py-3 px-4 text-sm text-slate-400 text-right">{emp.shiftsWorked}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Multi-dimensional Analysis */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* By Shift */}
                                    <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-2xl p-6 border border-blue-700/50 shadow-2xl">
                                        <h3 className="font-bold text-white mb-4">By Shift</h3>
                                        <div className="space-y-3">
                                            {deepAnalysis.byShift.map((s: any) => (
                                                <div key={s.shift} className="bg-slate-900/50 p-3 rounded-lg">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-medium text-white">Shift {s.shift}</span>
                                                        <span className="text-sm text-emerald-400 font-bold">{s.efficiency}%</span>
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {s.actual.toLocaleString()} units • {s.count} entries
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* By Hospital */}
                                    <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-2xl p-6 border border-purple-700/50 shadow-2xl">
                                        <h3 className="font-bold text-white mb-4">By Hospital</h3>
                                        <div className="space-y-3">
                                            {deepAnalysis.byHospital.slice(0, 5).map((h: any) => (
                                                <div key={h.hospital} className="bg-slate-900/50 p-3 rounded-lg">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-medium text-white text-sm truncate">{h.hospital}</span>
                                                        <span className="text-sm text-emerald-400 font-bold">{h.efficiency}%</span>
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {h.actual.toLocaleString()} units
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* By Product */}
                                    <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 rounded-2xl p-6 border border-emerald-700/50 shadow-2xl">
                                        <h3 className="font-bold text-white mb-4">Top Products</h3>
                                        <div className="space-y-3">
                                            {deepAnalysis.byProduct.slice(0, 5).map((p: any) => (
                                                <div key={p.product} className="bg-slate-900/50 p-3 rounded-lg">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-medium text-white text-sm truncate">{p.product}</span>
                                                        <span className="text-sm text-emerald-400 font-bold">{p.efficiency}%</span>
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {p.actual.toLocaleString()} units
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}

                {loading && !summaryData && (
                    <div className="py-20 text-center text-slate-500 italic">
                        <RefreshCw className="animate-spin mx-auto mb-4 text-emerald-400" size={32} />
                        Generating advanced analytics...
                    </div>
                )}
            </div>
        </div>
    );
}

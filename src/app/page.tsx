"use client";
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import { Activity, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, RefreshCw, Zap, Target, Award } from 'lucide-react';
import { getProductionSummary, getWeeklyStats, getComparativeSummary, getInsights } from '../lib/db-helpers';

const TechKPICard = ({ title, value, sub, icon: Icon, color, trend }: any) => (
  <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
    {/* Glassmorphism overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm" />

    {/* Animated gradient background */}
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-2">{title}</p>
          <h3 className="text-4xl font-black text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color} shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
            }`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
        <p className="text-xs text-slate-400">{sub}</p>
      </div>
    </div>
  </div>
);

const SystemHealthGauge = ({ efficiency }: { efficiency: number }) => {
  const data = [{ name: 'Efficiency', value: efficiency, fill: efficiency >= 90 ? '#10b981' : efficiency >= 70 ? '#f59e0b' : '#ef4444' }];

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-white text-lg">System Health</h3>
        <Zap className="text-emerald-400" size={20} />
      </div>

      <div className="h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background dataKey="value" cornerRadius={10} />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-black fill-white">
              {efficiency.toFixed(0)}%
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-center text-sm text-slate-400 mt-2">
        {efficiency >= 90 ? '🔥 Peak Performance' : efficiency >= 70 ? '⚡ Optimal Range' : '⚠️ Needs Attention'}
      </p>
    </div>
  );
};

const InsightsPanel = ({ insights }: { insights: string[] }) => (
  <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 p-6 rounded-2xl border border-blue-700/50 shadow-2xl backdrop-blur-sm">
    <div className="flex items-center gap-2 mb-4">
      <Award className="text-yellow-400" size={20} />
      <h3 className="font-bold text-white text-lg">AI Insights</h3>
    </div>

    <div className="space-y-3">
      {insights.map((insight, idx) => (
        <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
          <p className="text-sm text-slate-200 leading-relaxed">{insight}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [comparative, setComparative] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [summary, weekly, comp, insightsData] = await Promise.all([
        getProductionSummary(weekAgo, today),
        getWeeklyStats(),
        getComparativeSummary(weekAgo, today),
        getInsights(weekAgo, today)
      ]);

      setSummaryData(summary);
      setChartData(weekly);
      setComparative(comp);
      setInsights(insightsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !summaryData) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl">
        <div className="text-center">
          <RefreshCw className="animate-spin text-emerald-400 mx-auto mb-4" size={48} />
          <p className="text-slate-400 font-medium">Loading Advanced Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen -m-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Production Command Center
          </h1>
          <p className="text-slate-400">Real-time analytics & performance monitoring</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors shadow-lg"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* KEY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TechKPICard
          title="Total Production"
          value={summaryData?.totalActual?.toLocaleString() || '0'}
          sub={`Target: ${summaryData?.totalPlanned?.toLocaleString()}`}
          icon={Activity}
          color="bg-gradient-to-br from-blue-600 to-blue-500"
          trend={comparative?.changes?.production}
        />
        <TechKPICard
          title="Avg Efficiency"
          value={`${summaryData?.averageEfficiency?.toFixed(1) || '0'}%`}
          sub="vs last period"
          icon={TrendingUp}
          color="bg-gradient-to-br from-emerald-600 to-emerald-500"
          trend={comparative?.changes?.efficiency}
        />
        <TechKPICard
          title="Rejection Qty"
          value={summaryData?.totalRejected?.toLocaleString() || '0'}
          sub="Quality control"
          icon={AlertTriangle}
          color="bg-gradient-to-br from-amber-600 to-amber-500"
          trend={comparative?.changes?.rejections}
        />
        <TechKPICard
          title="Discipline Score"
          value={`${summaryData?.averageDiscipline?.toFixed(1) || '0'}/100`}
          sub="Team performance"
          icon={CheckCircle2}
          color="bg-gradient-to-br from-indigo-600 to-indigo-500"
          trend={comparative?.changes?.discipline}
        />
      </div>

      {/* INSIGHTS & SYSTEM HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InsightsPanel insights={insights} />
        </div>
        <SystemHealthGauge efficiency={summaryData?.averageEfficiency || 0} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Planned vs Actual */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white text-lg">Weekly Output vs Target</h3>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-medium">Last 7 Days</span>
          </div>
          <div className="h-72">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }}
                  />
                  <Bar dataKey="planned" fill="#475569" radius={[8, 8, 0, 0]} name="Planned" />
                  <Bar dataKey="actual" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 italic">No data available</div>
            )}
          </div>
        </div>

        {/* Efficiency Trend */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white text-lg">Efficiency Trend</h3>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${summaryData?.averageEfficiency >= 85 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
              {summaryData?.averageEfficiency >= 85 ? '✓ Healthy' : '⚠ Watching'}
            </span>
          </div>
          <div className="h-72">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <YAxis domain={[0, 120]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }} />
                  <Area type="monotone" dataKey="eff" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEff)" name="Efficiency %" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 italic">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
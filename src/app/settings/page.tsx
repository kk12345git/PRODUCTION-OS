"use client";
import React, { useState } from 'react';
import { Save, User, Building2, Bell, Shield, Database, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
    const [settings, setSettings] = useState({
        companyName: 'KRG Production',
        location: 'Chennai',
        adminEmail: 'admin@krg.com',
        notifications: true,
        autoBackup: true,
        theme: 'dark',
    });

    const handleSave = () => {
        alert('Settings saved successfully!');
    };

    const inputClass = "w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-medium text-slate-300 mb-2";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 -m-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-slate-400 to-slate-200 bg-clip-text text-transparent flex items-center gap-3">
                        <SettingsIcon className="text-slate-400" size={36} />
                        Settings
                    </h1>
                    <p className="text-slate-400">Manage your application settings</p>
                </div>

                {/* Company Information */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/20 rounded-xl">
                            <Building2 className="text-blue-400" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Company Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Company Name</label>
                            <input
                                type="text"
                                value={settings.companyName}
                                onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Location</label>
                            <input
                                type="text"
                                value={settings.location}
                                onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>

                {/* User Settings */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/20 rounded-xl">
                            <User className="text-emerald-400" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">User Settings</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Admin Email</label>
                            <input
                                type="email"
                                value={settings.adminEmail}
                                onChange={(e) => setSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Theme</label>
                            <select
                                value={settings.theme}
                                onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                                className={inputClass}
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="auto">Auto</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-500/20 rounded-xl">
                            <Bell className="text-amber-400" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                            <div>
                                <p className="font-medium text-white">Email Notifications</p>
                                <p className="text-sm text-slate-400">Receive email alerts for important events</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications}
                                    onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* System Settings */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/20 rounded-xl">
                            <Database className="text-purple-400" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">System Settings</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                            <div>
                                <p className="font-medium text-white">Auto Backup</p>
                                <p className="text-sm text-slate-400">Automatically backup data daily</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.autoBackup}
                                    onChange={(e) => setSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-500/20 rounded-xl">
                            <Shield className="text-red-400" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Security</h2>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full px-4 py-3 text-left border border-slate-600 bg-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">
                            Change Password
                        </button>
                        <button className="w-full px-4 py-3 text-left border border-slate-600 bg-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">
                            Two-Factor Authentication
                        </button>
                        <button className="w-full px-4 py-3 text-left border border-red-500/30 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors">
                            Clear All Data
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold hover:from-emerald-500 hover:to-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all shadow-lg"
                    >
                        <Save size={18} />
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}

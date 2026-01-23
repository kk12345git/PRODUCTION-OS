"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PenTool, BarChart3, Settings, LogOut, Users, FolderOpen, List, Building2, Package, Warehouse } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/entry', label: 'Production Entry', icon: PenTool },
        { href: '/entries', label: 'All Entries', icon: List },
        { href: '/employees', label: 'Employees', icon: Users },
        { href: '/hospitals', label: 'Hospitals', icon: Building2 },
        { href: '/categories', label: 'Categories', icon: FolderOpen },
        { href: '/products', label: 'Products', icon: Package },
        { href: '/inventory/raw-materials', label: 'Inventory', icon: Warehouse },
        { href: '/reports', label: 'Reports', icon: BarChart3 },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];



    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex shrink-0">
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-xl font-bold text-emerald-400 tracking-wider uppercase">
                    PRODUCTION<span className="text-white ml-0.5">OS</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">Production Control</p>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative group ${isActive
                                ? 'bg-slate-800 text-emerald-400 font-medium'
                                : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                }`}
                        >
                            {/* Selection Bar Animation */}
                            <div className={`absolute left-0 top-3 bottom-3 w-1 bg-emerald-400 rounded-r-full transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'}`} />

                            <Icon size={20} className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-emerald-400' : ''}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-700">
                <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 w-full rounded-lg transition-colors group">
                    <LogOut size={20} className="transition-transform group-hover:-translate-x-1" /> Logout
                </button>
            </div>
        </aside>
    );
}

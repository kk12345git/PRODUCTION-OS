"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, BarChart3, Settings } from 'lucide-react';

export default function Navigation() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Dashboard', icon: Home },
        { href: '/entry', label: 'Production Entry', icon: FileText },
        { href: '/reports', label: 'Reports', icon: BarChart3 },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold text-gray-800">Production Tracker</h1>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">Admin User</p>
                            <p className="text-xs text-gray-500">Chennai</p>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

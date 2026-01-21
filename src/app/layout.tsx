import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '../components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Production OS - Track',
  description: 'Next-Gen Manufacturing Execution System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 flex h-screen overflow-hidden`}>
        {/* SIDEBAR NAVIGATION */}
        <Sidebar />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto">
          <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8">
            <h2 className="text-slate-500 font-medium">Overview</h2>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">Admin User</p>
                <p className="text-xs text-slate-500">Unit: Chennai</p>
              </div>
              <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">A</div>
            </div>
          </header>
          <div className="p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
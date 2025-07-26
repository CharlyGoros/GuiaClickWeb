import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-[#f7fafa] flex">
            <aside className="w-60 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
                <ul className="space-y-2">
                    {(user?.role === 1 || user?.role === -1) && (
                        <li
                            className="cursor-pointer px-3 py-2 rounded hover:bg-[#e6f4f4]"
                            onClick={() => navigate('/dashboard/users')}
                        >
                            👤 Usuarios
                        </li>
                    )}
                    {(user?.role === 1 || user?.role === -1) && (
                        <li
                            className="cursor-pointer px-3 py-2 rounded hover:bg-[#e6f4f4]"
                            onClick={() => navigate('/dashboard/manuals')}
                        >
                            📄 Manuales
                        </li>
                    )}
                    {user?.role === -1 && (
                        <li
                            className="cursor-pointer px-3 py-2 rounded hover:bg-[#e6f4f4]"
                            onClick={() => navigate('/dashboard/empresas')}
                        >
                            🏢 Empresas
                        </li>
                    )}
                    <li>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-red-600 rounded hover:bg-[#fee]
            "
                        >
                            Cerrar sesión
                        </button>
                    </li>
                </ul>
            </aside>
            <main className="flex-1 p-6 space-y-6"> {children} </main>
        </div>
    );
};

export default DashboardLayout;

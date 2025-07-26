import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from 'lucide-react';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-white shadow px-6 py-2 h-[90px] flex items-center justify-between relative">
            <Menu
                className="w-10 h-10 text-[#127C82] cursor-pointer z-20"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            />

            <div
                className="absolute left-1/2 transform -translate-x-1/2 text-4xl font-bold text-[#127C82] cursor-pointer select-none hover:opacity-80"
                onClick={() => navigate("/")}
            >
                GuíaClick
            </div>

            <div className="w-6" />

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="absolute top-16 left-6 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-30"
                    >
                        <ul className="py-2">
                            {user ? (
                                <>
                                    {/* Dashboard para admins y superadmins */}
                                    {(user.role === 1 || user.role === -1) && (
                                        <li>
                                            <div
                                                onClick={() => { navigate("/dashboard"); setIsMenuOpen(false); }}
                                                className="block px-6 py-3 text-base hover:bg-[#f0f0f0]"
                                            >
                                                Dashboard
                                            </div>
                                        </li>
                                    )}




                                    {/* Editar su propia empresa (solo admin) */}
                                    {user.role === 1 && (
                                        <li>
                                            <div
                                                onClick={() => { navigate(`/editar-empresa/`); setIsMenuOpen(false); }}
                                                className="block px-6 py-3 text-base hover:bg-[#f0f0f0]"
                                            >
                                                Editar Empresa
                                            </div>
                                        </li>
                                    )}

                                    <li>
                                        <div
                                            onClick={() => { navigate("/favorites"); setIsMenuOpen(false); }}
                                            className="block px-6 py-3 text-base hover:bg-[#f0f0f0]"
                                        >
                                            Favoritos
                                        </div>
                                    </li>

                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-6 py-3 text-base text-red-600 hover:bg-[#f0f0f0]"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            to="/registro"
                                            className="block px-6 py-3 text-base hover:bg-[#f0f0f0]"
                                        >
                                            Registro
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/login"
                                            className="block px-6 py-3 text-base hover:bg-[#f0f0f0]"
                                        >
                                            Iniciar sesión
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

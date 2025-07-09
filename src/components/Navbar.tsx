// src/components/Navbar.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from 'lucide-react';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuRef = useRef<HTMLDivElement>(null);
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <nav className="bg-white shadow px-6 py-5 flex items-center justify-between relative">
            <Menu
                className="w-8 h-8 text-[#127C82] cursor-pointer z-20"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            />

            <Link
                to="/"
                className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-[#127C82] hover:opacity-80"
            >
                GuíaClick
            </Link>

            <div className="w-8" />

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
                                    <li>
                                        <Link
                                            to="/configuracion"
                                            className="block px-6 py-3 text-base hover:bg-[#f0f0f0]"
                                        >
                                            Configuración
                                        </Link>
                                    </li>
                                    {/* <li>
                                        <button
                                            onClick={() => setShowPopup(true)}
                                            className="block w-full text-left px-6 py-3 text-base hover:bg-[#f0f0f0]"
                                        >
                                            Sección empresas
                                        </button>
                                    </li> */}
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

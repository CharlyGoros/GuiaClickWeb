import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        navigate('/');
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
            {/* Botón menú hamburguesa */}
            <Menu
                className="w-10 h-10 text-[#127C82] cursor-pointer z-20"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            />

            {/* Logo centrado */}
            <div
                className="absolute left-1/2 transform -translate-x-1/2 text-4xl font-bold text-[#127C82] cursor-pointer select-none hover:opacity-80"
                onClick={() => navigate("/")}
            >
                GuíaClick
            </div>

            {/* Botones de sesión a la derecha */}
            <div className="ml-auto flex items-center gap-4">
                {user ? (
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition font-medium"
                    >
                        Cerrar sesión
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-[#64C1C1] text-white px-4 py-2 rounded shadow hover:bg-[#50a5a5] transition font-medium"
                        >
                            Iniciar sesión
                        </button>
                        <button
                            onClick={() => navigate("/registro")}
                            className="bg-gray-200 text-[#127C82] px-4 py-2 rounded shadow hover:bg-gray-300 transition font-medium"
                        >
                            Registrarse
                        </button>
                    </>
                )}
            </div>

            {/* Menú desplegable lateral */}
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
                                    {(user.role === 1 || user.role === -1) && (
                                        <li>
                                            <div
                                                onClick={() => { navigate("/dashboard"); setIsMenuOpen(false); }}
                                                className="block px-6 py-3 text-base hover:bg-[#f0f0f0] cursor-pointer"
                                            >
                                                Dashboard
                                            </div>
                                        </li>
                                    )}

                                    {user.role === 1 && (
                                        <li>
                                            <div
                                                onClick={() => { navigate(`/editar-empresa/`); setIsMenuOpen(false); }}
                                                className="block px-6 py-3 text-base hover:bg-[#f0f0f0] cursor-pointer"
                                            >
                                                Editar Empresa
                                            </div>
                                        </li>
                                    )}

                                    <li>
                                        <div
                                            onClick={() => { navigate("/favorites"); setIsMenuOpen(false); }}
                                            className="block px-6 py-3 text-base hover:bg-[#f0f0f0] cursor-pointer"
                                        >
                                            Favoritos
                                        </div>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <div
                                            onClick={() => { navigate("/registro"); setIsMenuOpen(false); }}
                                            className="block px-6 py-3 text-base hover:bg-[#f0f0f0] cursor-pointer"
                                        >
                                            Registro
                                        </div>
                                    </li>
                                    <li>
                                        <div
                                            onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
                                            className="block px-6 py-3 text-base hover:bg-[#f0f0f0] cursor-pointer"
                                        >
                                            Iniciar sesión
                                        </div>
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

import React, { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Registro() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col justify-between bg-[#F6F6F6] text-[#202020]">
            {/* Navbar */}
            <nav className="bg-white shadow px-6 py-5 flex items-center justify-between relative">
                <div className="flex items-center gap-4">
                    <div
                        className="w-8 h-8 cursor-pointer z-20"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="text-[#127C82] w-full h-full" />
                    </div>
                </div>

                <Link
                    to="/" wwwwww
                    className="text-2xl font-bold text-[#127C82] tracking-tight hover:opacity-80"
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
                                {location.pathname === "/registro" ? (
                                    <li><Link to="/" className="block px-6 py-3 text-base hover:bg-[#f0f0f0]">Ir a búsqueda</Link></li>
                                ) : (
                                    <li><Link to="/registro" className="block px-6 py-3 text-base hover:bg-[#f0f0f0]">Registro</Link></li>
                                )}
                                <li><Link to="/login" className="block px-6 py-3 text-base hover:bg-[#f0f0f0]">Iniciar sesión</Link></li>
                                <li><Link to="/configuracion" className="block px-6 py-3 text-base hover:bg-[#f0f0f0]">Configuración</Link></li>
                                <li><Link to="/empresas" className="block px-6 py-3 text-base hover:bg-[#f0f0f0]">Sección empresas</Link></li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <div className="flex flex-col items-center justify-center px-6 py-12">
                <h1 className="text-2xl font-bold mb-6 text-[#127C82]">Registro</h1>
                <form className="bg-white p-6 rounded-md shadow-md w-full max-w-md space-y-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#64C1C1]"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#64C1C1]"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#64C1C1]"
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#64C1C1] text-white font-semibold py-2 px-4 rounded hover:bg-[#4DA8A8]"
                    >
                        Registrarse
                    </button>
                </form>
            </div>

            {/* Footer */}
            <footer className="bg-white shadow-inner text-center py-4 text-sm text-gray-500">
                © {new Date().getFullYear()} GuíaClick - Todos los derechos reservados
            </footer>
        </div>
    );
}

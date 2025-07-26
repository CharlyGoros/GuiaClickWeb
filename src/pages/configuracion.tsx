// src/pages/Configuracion.tsx
import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Configuracion() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);


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
                    to="/"
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
                                <li><Link to="/registro" className="block px-6 py-3 text-base hover:bg-[#f0f0f0]">Registro</Link></li>
                                <li><Link to="/login" className="block px-6 py-3 text-base hover:bg-[#f0f0f0]">Iniciar sesión</Link></li>
                                <li><Link to="/configuracion" className="block px-6 py-3 text-base hover:bg-[#f0f0f0]">Configuración</Link></li>
                                <li><Link to="/empresas" className="block px-6 py-3 text-base hover:bg-[#f0f0f0]">Sección empresas</Link></li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <main className="flex flex-col items-center px-6 py-12">
                <h1 className="text-3xl font-bold mb-8 text-[#127C82]">Configuración</h1>

                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-gray-700">🔔 Notificaciones</span>
                        <span className="text-sm text-gray-400">Deshabilitadas</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-gray-700">🌗 Tema oscuro</span>
                        <span className="text-sm text-gray-400">No disponible</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-gray-700">🌐 Idioma</span>
                        <span className="text-sm text-gray-600">Español</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-gray-700">🧹 Borrar caché local</span>
                        <button className="text-sm px-3 py-1 rounded bg-gray-100 text-gray-500 cursor-not-allowed">
                            Futuro
                        </button>
                    </div>
                </div>
            </main>



            {/* Footer */}
            <footer className="bg-white shadow-inner text-center py-4 text-sm text-gray-500">
                © {new Date().getFullYear()} GuíaClick - Todos los derechos reservados
            </footer>
        </div>

    );
}

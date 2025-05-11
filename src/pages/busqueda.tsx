import React, { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function BusquedaPage() {
    const [query, setQuery] = useState("");
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
        <div className="min-h-screen bg-[#F6F6F6] text-[#202020]">
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

                <div className="text-2xl font-bold text-[#127C82] tracking-tight">
                    GuíaClick
                </div>

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

            <div className="px-6 py-12 max-w-6xl mx-auto">
                <div className="flex justify-center mb-12">
                    <img
                        src="/libro-icono.svg"
                        alt="Icono manual"
                        className="w-40 h-40 rounded-full bg-[#E0E0E0] p-5 shadow-md"
                    />
                </div>

                <div className="relative mb-14 max-w-2xl mx-auto">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar manual..."
                        className="w-full rounded-full px-8 py-5 bg-[#64C1C1] text-white placeholder-white text-lg shadow focus:ring-4 focus:ring-[#90DFDF]"
                    />
                    <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white w-6 h-6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <motion.div
                            key={item}
                            className="flex flex-col bg-white rounded-xl shadow-md p-5 h-full cursor-pointer hover:shadow-lg transition-all"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: item * 0.05 }}
                            onClick={() => window.location.href = `/manual/${item}`}
                        >
                            <div className="w-full h-44 bg-gray-200 rounded mb-4" />
                            <div>
                                <div className="text-sm font-semibold bg-[#64C1C1] text-white rounded-full px-3 py-1 inline-block mb-2">
                                    Título del Manual #{item}
                                </div>
                                <p className="text-sm text-gray-700 leading-snug">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. elitassdasdasdasds.
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            <footer className="bg-white shadow-inner text-center py-4 text-sm text-gray-500">
                © {new Date().getFullYear()} GuíaClick - Todos los derechos reservados
            </footer>
        </div>

    );
}

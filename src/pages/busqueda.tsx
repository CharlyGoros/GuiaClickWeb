// src/pages/BusquedaPage.tsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function BusquedaPage() {
    const [query, setQuery] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [codigoEmpresa, setCodigoEmpresa] = useState("");
    const menuRef = useRef(null);
    const navigate = useNavigate();

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

    const handleAceptarCodigo = () => {
        if (codigoEmpresa.trim().length === 6) {
            navigate("/empresas");
        } else {
            alert("Código inválido. Debe tener 6 caracteres.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F6F6] text-[#202020] flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow px-6 py-5 flex items-center justify-between relative">
                <div className="z-20">
                    <Menu className="w-8 h-8 text-[#127C82] cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <Link
                        to="/"
                        className="text-2xl font-bold text-[#127C82] tracking-tight hover:opacity-80"
                    >
                        GuíaClick
                    </Link>
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
                                <li><button onClick={() => setShowPopup(true)} className="block w-full text-left px-6 py-3 text-base hover:bg-[#f0f0f0]">Sección empresas</button></li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Contenido principal */}
            <div className="flex-1 px-4 py-6 max-w-6xl mx-auto">
                <div className="flex justify-center mb-10">
                    <div className="w-24 h-24 rounded-full bg-[#E0E0E0] flex items-center justify-center text-sm text-center text-gray-700 shadow">.icono<br />manual</div>
                </div>

                <div className="relative max-w-xl mx-auto mb-10">
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
                            onClick={() => navigate(`/manual/${item}`)}
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

                <div className="flex justify-center mt-12">
                    <Button className="bg-[#64C1C1] text-white px-6 py-3 rounded-full shadow" onClick={() => setShowPopup(true)}>
                        Código empresarial
                    </Button>
                </div>

                <AnimatePresence>
                    {showPopup && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                                className="bg-white rounded-lg shadow-xl p-6 w-80 text-center"
                            >
                                <p className="text-sm text-gray-700 mb-4">introduce el código<br />de empresa</p>
                                <Input
                                    value={codigoEmpresa}
                                    onChange={(e) => setCodigoEmpresa(e.target.value)}
                                    placeholder="3FK30D"
                                    className="mb-4 text-center bg-[#64C1C1] text-white font-semibold placeholder-white"
                                />
                                <div className="flex justify-between">
                                    <Button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4"
                                        onClick={() => setShowPopup(false)}
                                    >
                                        CANCELAR
                                    </Button>
                                    <Button
                                        className="bg-green-500 hover:bg-green-600 text-white px-4"
                                        onClick={handleAceptarCodigo}
                                    >
                                        ACEPTAR
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <footer className="bg-white shadow-inner text-center py-4 text-sm text-gray-500">
                © {new Date().getFullYear()} GuíaClick - Todos los derechos reservados
            </footer>
        </div>
    );
}

import React, { useState, useEffect } from "react";
import algoliasearch from "algoliasearch/lite";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import logo from "../assets/LogoGC.png";

const ALGOLIA_APP_ID = "P7ILDN8BXE";
const ALGOLIA_SEARCH_KEY = "211b2e615635e2fbb6695b8196c8b8b4";
const INDEX_NAME = "movies_index";

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
const index = searchClient.initIndex(INDEX_NAME);

interface Manual {
    objectID: string;
    title: string;
    description: string;
    image?: string;
}

const Home: React.FC = () => {
    const [query, setQuery] = useState("");
    const [manuals, setManuals] = useState<Manual[]>([]);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [codigoEmpresa, setCodigoEmpresa] = useState("");

    const navigate = useNavigate();

    const handleAceptarCodigo = () => {
        if (codigoEmpresa.trim().length === 6) {
            navigate("/empresas");
        } else {
            alert("Código inválido. Debe tener 6 caracteres.");
        }
    };

    useEffect(() => {
        let cancelled = false;
        const fetchManuales = async () => {
            setLoading(true);
            try {
                const { hits } = await index.search<Manual>(query);
                if (!cancelled) setManuals(hits);
            } catch (err) {
                console.error("Error buscando manuales:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchManuales();
        return () => {
            cancelled = true;
        };
    }, [query]);

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-[#202020] flex flex-col">
            <div className="flex-1 px-4 py-4 max-w-full mx-auto">

                {/* Logo + Título */}
                <div className="flex justify-center mb-2">
                    <div
                        className="cursor-pointer flex flex-col items-center"
                        onClick={() => navigate("/")}
                    >
                        <img
                            src={logo}
                            alt="Logo GuíaClick"
                            className="w-55 h-55 object-contain mb-1"
                        />

                    </div>
                </div>

                {/* Input búsqueda */}
                <div className="relative max-w-xl mx-auto mb-6 w-full">
                    <Input
                        placeholder="Buscar manual..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full rounded-lg px-6 py-4 bg-[#64C1C1] text-white placeholder-white text-lg shadow-sm focus:ring-2 focus:ring-[#90DFDF]"
                    />
                    <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                </div>

                {/* Resultados */}
                {loading ? (
                    <p className="text-center text-gray-500">Cargando manuales…</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
                        {manuals.map((manual) => (
                            <motion.div
                                key={manual.objectID}
                                className="flex flex-col bg-white rounded-lg shadow-sm p-5 h-full min-w-[260px] cursor-pointer hover:shadow-md transition-all"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => navigate(`/manual/${manual.objectID}`)}
                            >
                                {manual.image ? (
                                    <img
                                        src={manual.image}
                                        alt={manual.title}
                                        className="w-full h-60 object-cover rounded mb-4"
                                    />
                                ) : (
                                    <div className="w-full h-60 bg-gray-200 rounded mb-4" />
                                )}
                                <div>
                                    <div className="text-sm font-semibold bg-[#64C1C1] text-white rounded-full px-3 py-1 inline-block mb-2">
                                        {manual.title}
                                    </div>
                                    <p className="text-sm text-gray-700 leading-snug">
                                        {manual.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                        {manuals.length === 0 && (
                            <p className="col-span-full text-center text-gray-400">
                                No se encontraron resultados.
                            </p>
                        )}
                    </div>
                )}

                {/* Botón Código Empresarial */}
                <div className="flex justify-center mt-10">
                    <Button
                        className="bg-[#64C1C1] text-white px-6 py-3 rounded-md shadow hover:bg-[#50a5a5]"
                        onClick={() => setShowPopup(true)}
                    >
                        Código empresarial
                    </Button>
                </div>

                {/* Popup */}
                <AnimatePresence>
                    {showPopup && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="bg-white rounded-md shadow-lg p-6 w-80 text-center"
                            >
                                <p className="text-sm text-gray-700 mb-3">Introduce el código de empresa</p>
                                <Input
                                    value={codigoEmpresa}
                                    onChange={(e) => setCodigoEmpresa(e.target.value)}
                                    placeholder="3FK30D"
                                    className="mb-4 text-center bg-[#64C1C1] text-white font-semibold placeholder-white"
                                />
                                <div className="flex justify-between">
                                    <Button
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                                        onClick={() => setShowPopup(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        className="bg-[#64C1C1] hover:bg-[#50a5a5] text-white px-4 py-2 rounded"
                                        onClick={handleAceptarCodigo}
                                    >
                                        Aceptar
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <footer className="bg-white shadow-inner text-center py-4 text-sm text-gray-400">
                © {new Date().getFullYear()} GuíaClick - Todos los derechos reservados
            </footer>
        </div>
    );
};

export default Home;

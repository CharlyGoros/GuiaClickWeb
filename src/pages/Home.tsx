import React, { useState, useEffect } from "react";
import algoliasearch from "algoliasearch/lite";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Configuración de Algolia
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

    // Hooks para el popup de código empresarial
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

    // Dispara búsqueda en Algolia cada vez que cambia `query`
    useEffect(() => {
        let cancelled = false;
        const fetchManuales = async () => {
            setLoading(true);
            try {
                console.log("Buscando manuales con query:", query);
                const { hits } = await index.search<Manual>(query);
                console.log("Resultados de búsqueda:", hits);
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
        <div className="min-h-screen bg-[#F6F6F6] text-[#202020] flex flex-col">
            {/* Contenido principal */}
            <div className="flex-1 px-4 py-6 max-w-6xl mx-auto">
                {/* Logo */}
                <div className="flex justify-center mb-10">
                    <div className="w-24 h-24 rounded-full bg-[#E0E0E0] flex items-center justify-center text-sm text-gray-700 shadow">
                        .icono<br />manual
                    </div>
                </div>

                {/* Barra de búsqueda */}
                <div className="relative max-w-xl mx-auto mb-10 w-3xl">
                    <Input
                        placeholder="Buscar manual..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full rounded-full px-8 py-5 bg-[#64C1C1] text-white placeholder-white text-lg shadow focus:ring-4 focus:ring-[#90DFDF]"
                    />
                    <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white w-6 h-6" />
                </div>

                {/* Resultados */}
                {loading ? (
                    <p className="text-center text-gray-500">Cargando manuales…</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {manuals.map((manual) => (
                            <motion.div
                                key={manual.objectID}
                                className="flex flex-col bg-white rounded-xl shadow-md p-5 h-full cursor-pointer hover:shadow-lg transition-all"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => navigate(`/manual/${manual.objectID}`)}
                            >
                                {manual.image ? (
                                    <img
                                        src={manual.image}
                                        alt={manual.title}
                                        className="w-full h-44 object-cover rounded mb-4"
                                    />
                                ) : (
                                    <div className="w-full h-44 bg-gray-200 rounded mb-4" />
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
                            <p className="col-span-full text-center text-gray-500">
                                No se encontraron resultados.
                            </p>
                        )}
                    </div>
                )}

                {/* Botón Código Empresarial */}
                <div className="flex justify-center mt-12">
                    <Button
                        className="bg-[#64C1C1] text-white px-6 py-3 rounded-full shadow"
                        onClick={() => setShowPopup(true)}
                    >
                        Código empresarial
                    </Button>
                </div>

                {/* Popup Modal */}
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
                                <p className="text-sm text-gray-700 mb-4">
                                    introduce el código<br />de empresa
                                </p>
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
};

export default Home;
import React, { useState, useEffect } from "react";
import algoliasearch from "algoliasearch/lite";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import logo from "../assets/LogoGC.png";

const ALGOLIA_APP_ID = "P7ILDN8BXE";
const ALGOLIA_SEARCH_KEY = "211b2e615635e2fbb6695b8196c8b8b4";
const INDEX_NAME = "movies_index";

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
const index = searchClient.initIndex(INDEX_NAME);


export interface Manual {
    objectID: string;
    title: string;
    description: string;
    image?: string;
    company_id?: number | null;
    company_name?: string | null;
    step_count: number;
}


interface FavoriteManual {
    id: number;
    title: string;
    description: string;
    image?: string;
    company_id?: number | null;
    company_name?: string | null;

    step_count: number;
}

const Favorites: React.FC = () => {
    const [query, setQuery] = useState("");
    const [manuals, setManuals] = useState<Manual[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [codigoEmpresa, setCodigoEmpresa] = useState("");
    const [showOnlyEnterprise, setShowOnlyEnterprise] = useState(false);

    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    useEffect(() => {
        if (user?.company_id) {
            setShowOnlyEnterprise(true);
        }
    }, [user]);

    const handleAceptarCodigo = async () => {
        if (!codigoEmpresa || !user?.id) return;

        try {
            const response = await fetch(`https://guiaclick.netlify.app/.netlify/functions/server/api/users/${user.id}/company`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: codigoEmpresa }),
            });

            if (!response.ok) {
                throw new Error("Error al asociar usuario a la empresa");
            }

            const data = await response.json();
            console.log("Empresa asociada:", data);

            const updatedUser = {
                ...user,
                company_id: data.company_id,
                company_name: data.company_name ?? null,
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setShowOnlyEnterprise(true);
            setShowPopup(false);
        } catch (error) {
            console.error("Error:", error);
            alert("Código inválido o error del servidor.");
        }
    };

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user) return;
            try {
                const response = await axios.get<{ body: FavoriteManual[] }>(`https://guiaclick.netlify.app/.netlify/functions/server/api/users/${user.id}/favorites`);
                const ids = response.data.body.map((m) => String(m.id));
                setFavoriteIds(ids);
                console.log("Favoritos:", ids);
            } catch (err) {
                console.error("Error obteniendo favoritos:", err);
            }
        };
        fetchFavorites();
    }, [user]);

    useEffect(() => {
        let cancelled = false;
        const fetchManuales = async () => {
            setLoading(true);
            try {
                const { hits } = await index.search<Manual>(query);
                const filtered = hits.filter((m) =>
                    favoriteIds.includes(m.objectID)
                );
                if (!cancelled) setManuals(filtered);
            } catch (err) {
                console.error("Error buscando manuales:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        if (favoriteIds.length > 0 || query !== "") {
            fetchManuales();
        } else {
            setManuals([]);
        }

        return () => {
            cancelled = true;
        };
    }, [query, favoriteIds]);

    const filteredManuals = manuals
        .filter((m) => {
            if (user?.role === -1) return true; // Superadmin ve todos
            if (!user?.company_id) {
                return m.company_id === null || m.company_id === undefined;
            }
            return m.company_id === null || m.company_id === Number(user.company_id);
        })
        .filter((m) => {
            if (user?.role === -1) return true; // Superadmin ve todos
            if (showOnlyEnterprise) {
                return m.company_id === Number(user?.company_id);
            }
            return true;
        });



    return (
        <div className="min-h-screen bg-[#F9FAFB] text-[#202020] flex flex-col">
            <div className="flex-1 px-4 py-4 max-w-full mx-auto">

                <div className="flex justify-center mb-2">
                    <div className="cursor-pointer flex flex-col items-center" onClick={() => navigate("/")}>
                        <img src={logo} alt="Logo GuíaClick" className="w-55 h-55 object-contain mb-1" />
                    </div>
                </div>

                <div className="relative max-w-xl mx-auto mb-6 w-full">
                    <Input
                        placeholder="Buscar manual..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full rounded px-6 py-4 bg-[#64C1C1] text-white placeholder-white text-lg shadow-sm focus:ring-2 focus:ring-[#90DFDF]"
                    />
                    <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                </div>

                {user?.company_id && (
                    <div className="max-w-xl mx-auto mb-4 flex items-center gap-2">
                        <input
                            id="filtro-empresa"
                            type="checkbox"
                            checked={showOnlyEnterprise}
                            onChange={(e) => setShowOnlyEnterprise(e.target.checked)}
                            className="accent-[#64C1C1] w-4 h-4"
                        />
                        <label htmlFor="filtro-empresa" className="text-sm text-gray-800">
                            Mostrar solo manuales empresariales
                        </label>
                    </div>
                )}


                {loading ? (
                    <p className="text-center text-gray-500">Cargando manuales…</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
                        {filteredManuals.map((manual) => (
                            <motion.div
                                key={manual.objectID}
                                className="relative flex flex-col bg-white rounded shadow-sm p-5 h-full min-w-[260px] cursor-pointer hover:shadow-md transition-all"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => navigate(`/manual/${manual.objectID}`)}
                            >
                                {manual.company_id && (
                                    <div className="absolute top-2 right-2 bg-[#64C1C1] text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                                        E
                                    </div>
                                )}

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
                                    <p className="mt-2 text-xs text-gray-500">
                                        Pasos: {manual.step_count}
                                    </p>
                                </div>
                            </motion.div>
                        ))}

                        {filteredManuals.length === 0 && (
                            <p className="col-span-full text-center text-gray-400">
                                No se encontraron resultados.
                            </p>
                        )}
                    </div>
                )}

                {user && !user?.company_id && user?.role != -1 && (
                    <>
                        <div className="flex justify-center mt-10">
                            <Button
                                className="bg-[#64C1C1] text-white px-6 py-3 rounded-md shadow hover:bg-[#50a5a5]"
                                onClick={() => setShowPopup(true)}
                            >
                                Código empresarial
                            </Button>
                        </div>

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
                    </>
                )}
            </div>


        </div>
    );
};

export default Favorites;

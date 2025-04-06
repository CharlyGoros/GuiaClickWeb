import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function BusquedaPage() {
    const [query, setQuery] = useState("");

    return (
        <div className="min-h-screen bg-[#F6F6F6] text-[#202020] px-4 py-6">
            <div className="max-w-2xl mx-auto">
                <motion.h1
                    className="text-2xl font-bold mb-4 text-[#127C82]"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    ¿Qué querés aprender hoy?
                </motion.h1>

                <div className="flex items-center gap-2 mb-6">
                    <Search className="text-[#127C82] w-5 h-5" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar manuales por palabra clave"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                    />
                </div>

                <div className="text-sm text-gray-500 mb-2">Sugerencias rápidas:</div>
                <div className="flex flex-wrap gap-2 mb-6">
                    {[
                        "Instalar WhatsApp",
                        "Crear correo Gmail",
                        "Descomprimir archivos",
                        "Usar Word",
                    ].map((sugerencia, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            className="text-xs text-[#127C82] border-[#127C82]"
                            onClick={() => setQuery(sugerencia)}
                        >
                            {sugerencia}
                        </Button>
                    ))}
                </div>

                <div className="text-md font-semibold text-[#127C82] mb-3">
                    Resultados (mock)
                </div>

                <div className="grid gap-4">
                    {[1, 2, 3].map((item) => (
                        <motion.div
                            key={item}
                            className="bg-white rounded-lg shadow-sm p-4 flex gap-4 items-start"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: item * 0.1 }}
                        >
                            <div className="w-20 h-20 bg-gray-200 rounded" />
                            <div>
                                <h3 className="font-semibold text-[#127C82]">
                                    Nombre del Manual #{item}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Breve descripción del contenido del manual para orientar al usuario.
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

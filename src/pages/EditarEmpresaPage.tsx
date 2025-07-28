import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react"; // opcional, si tenés íconos de lucide o heroicons

const EditarEmpresa: React.FC = () => {
    const navigate = useNavigate();
    const [nombreEmpresa, setNombreEmpresa] = useState("iLikeSoju");
    const [codigoGenerado, setCodigoGenerado] = useState<string | null>(null);

    const handleGuardar = () => {
        console.log("Empresa actualizada:", nombreEmpresa);
    };

    const handleGenerarCodigo = () => {
        const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
        setCodigoGenerado(codigo);
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Editar Empresa</h1>

            <div className="space-y-6 mb-12">
                <div>
                    <label htmlFor="empresa" className="block text-base font-medium text-gray-700 mb-2">
                        Nombre de la empresa
                    </label>
                    <input
                        id="empresa"
                        type="text"
                        value={nombreEmpresa}
                        onChange={(e) => setNombreEmpresa(e.target.value)}
                        className="w-full h-14 px-5 border border-gray-300 rounded shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleGuardar}
                        className="bg-[#117b7b] hover:bg-[#0f6666] text-white font-semibold py-2 px-6 rounded text-base transition-all"
                    >
                        Guardar cambios
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-1 px-6 rounded text-base transition-all flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </button>
                </div>
            </div>

            <hr className="border-t border-gray-300 mb-10" />

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Generar código de acceso</h2>

                <button
                    onClick={handleGenerarCodigo}
                    className="bg-[#117b7b] hover:bg-[#0f6666] text-white font-semibold py-2 px-6 rounded text-base transition-all flex items-center gap-2 w-fit"
                >
                    <RefreshCw className="w-4 h-4" />
                    Generar código nuevo
                </button>

                {codigoGenerado && (
                    <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded flex items-center justify-between gap-4">
                        <div className="text-teal-800 font-mono text-lg font-semibold tracking-wider">
                            Código generado: <span className="text-black">{codigoGenerado}</span>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(codigoGenerado || "");
                            }}
                            className="text-sm text-[#117b7b] hover:underline font-semibold"
                        >
                            Copiar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditarEmpresa;

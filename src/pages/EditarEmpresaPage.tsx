import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import useAuth from "@/hooks/useAuth";

const EditarEmpresa: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [nombreEmpresa, setNombreEmpresa] = useState(user?.company_name || "");
    const [codigoGenerado, setCodigoGenerado] = useState<string | null>(null);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGuardar = async () => {
        if (!user?.company_id) {
            setModalMessage("No se encontró una empresa asociada a tu usuario.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `https://guiaclick.netlify.app/.netlify/functions/server/api/companies/${user.company_id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: nombreEmpresa }),
                }
            );

            if (!response.ok) throw new Error("Error al actualizar empresa");
            setModalMessage("Empresa actualizada correctamente.");
        } catch (err) {
            console.error(err);
            setModalMessage("Error al guardar la empresa.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerarCodigo = async () => {
        if (!user?.company_id) {
            setModalMessage("No se encontró una empresa asociada a tu usuario.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `https://guiaclick.netlify.app/.netlify/functions/server/api/access-codes`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ company_id: user.company_id }),
                }
            );

            if (!response.ok) throw new Error("Error al generar código");

            const data = await response.json();
            setCodigoGenerado(data.body.code);
            setModalMessage("Código generado correctamente.");
        } catch (err) {
            console.error(err);
            setModalMessage("Error generando el código.");
        } finally {
            setLoading(false);
        }
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
                        disabled={loading}
                        className="bg-[#117b7b] hover:bg-[#0f6666] text-white font-semibold py-2 px-6 rounded text-base transition-all disabled:opacity-50"
                    >
                        {loading ? "Guardando..." : "Guardar cambios"}
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
                    disabled={loading}
                    className="bg-[#117b7b] hover:bg-[#0f6666] text-white font-semibold py-2 px-6 rounded text-base transition-all flex items-center gap-2 w-fit disabled:opacity-50"
                >
                    <RefreshCw className="w-4 h-4" />
                    {loading ? "Generando..." : "Generar código nuevo"}
                </button>

                {codigoGenerado && (
                    <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded flex items-center justify-between gap-4">
                        <div className="text-teal-800 font-mono text-lg font-semibold tracking-wider">
                            Código generado: <span className="text-black">{codigoGenerado}</span>
                        </div>
                        <button
                            onClick={() => navigator.clipboard.writeText(codigoGenerado || "")}
                            className="text-sm text-[#117b7b] hover:underline font-semibold"
                        >
                            Copiar
                        </button>
                    </div>
                )}
            </div>

            {/* Modal de feedback */}
            {modalMessage && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                    <div className="relative bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Aviso</h2>
                        <p className="text-gray-600 mb-6">{modalMessage}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setModalMessage(null)}
                                className="px-4 py-2 bg-[#127C82] text-white rounded hover:bg-[#0e6a70]"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditarEmpresa;

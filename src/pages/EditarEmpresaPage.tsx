import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditarEmpresa: React.FC = () => {
    const navigate = useNavigate();
    const [nombreEmpresa, setNombreEmpresa] = useState("iLikeSoju");
    const [codigoGenerado, setCodigoGenerado] = useState<string | null>(null);

    const handleGuardar = () => {
        // Simular guardado
        console.log("Empresa actualizada:", nombreEmpresa);
    };

    const handleGenerarCodigo = () => {
        const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
        setCodigoGenerado(codigo);
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Editar Empresa</h1>

            <div className="space-y-4">
                <label htmlFor="empresa" className="block text-sm font-medium text-gray-700">
                    Nombre de la empresa
                </label>
                <input
                    id="empresa"
                    type="text"
                    value={nombreEmpresa}
                    onChange={(e) => setNombreEmpresa(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                <div className="flex flex-wrap gap-4 mt-4">
                    <button
                        onClick={handleGuardar}
                        className="bg-[#117b7b] hover:bg-[#0f6666] text-white font-semibold py-2 px-6 rounded-md transition-all"
                    >
                        Guardar cambios
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-2 px-6 rounded-md transition-all"
                    >
                        Volver
                    </button>
                </div>
            </div>

            <hr className="my-10 border-gray-300" />

            <h2 className="text-2xl font-bold mb-6 text-gray-800">Generar código de acceso</h2>

            <div className="flex flex-col gap-3">
                <button
                    onClick={handleGenerarCodigo}
                    className="bg-[#117b7b] hover:bg-[#0f6666] text-white font-semibold py-2 px-6 rounded-md w-fit"
                >
                    Generar código nuevo
                </button>

                {codigoGenerado && (
                    <p className="text-green-600 text-sm mt-1">
                        Código generado: <strong>{codigoGenerado}</strong>
                    </p>
                )}
            </div>
        </div>
    );
};

export default EditarEmpresa;

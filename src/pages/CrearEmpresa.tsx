import React, { useState } from "react";
import axios from "axios";

const CrearEmpresa: React.FC = () => {
    const [empresa, setEmpresa] = useState("");
    const [adminNombre, setAdminNombre] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMensaje("");

        try {
            await axios.post(
                "http://localhost:3000/.netlify/functions/server/api/empresas/crear",
                {
                    empresa_nombre: empresa,
                    admin_nombre: adminNombre,
                    admin_email: adminEmail,
                    admin_password: adminPassword,
                }
            );

            setMensaje("✅ Empresa y usuario creados correctamente.");
            setEmpresa("");
            setAdminNombre("");
            setAdminEmail("");
            setAdminPassword("");
        } catch (error: unknown) {
            console.error("Error:", error);
            setMensaje(
                (error as any)?.response?.data?.message ||
                "❌ Ocurrió un error en el servidor."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f7fafa] px-4">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-10">
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                    Crear Empresa y Administrador
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <input
                            type="text"
                            placeholder="Nombre de la empresa"
                            value={empresa}
                            onChange={(e) => setEmpresa(e.target.value)}
                            required
                            className="w-full h-12 px-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div className="mb-5">
                        <input
                            type="text"
                            placeholder="Nombre del administrador"
                            value={adminNombre}
                            onChange={(e) => setAdminNombre(e.target.value)}
                            required
                            className="w-full h-12 px-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div className="mb-5">
                        <input
                            type="email"
                            placeholder="Email del administrador"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            required
                            className="w-full h-12 px-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            required
                            className="w-full h-12 px-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-[#117b7b] hover:bg-[#0f6666] text-white text-base font-semibold rounded-md transition-all"
                    >
                        {loading ? "Creando..." : "Crear empresa y administrador"}
                    </button>

                    {mensaje && (
                        <p
                            className={`text-center text-sm mt-4 ${mensaje.startsWith("✅")
                                ? "text-green-600"
                                : "text-red-600"
                                }`}
                        >
                            {mensaje}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CrearEmpresa;

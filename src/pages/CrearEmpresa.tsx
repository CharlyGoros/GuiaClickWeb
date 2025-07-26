import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
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

            setMensaje("Empresa y usuario creados correctamente.");
            setEmpresa("");
            setAdminNombre("");
            setAdminEmail("");
            setAdminPassword("");
        } catch (error: unknown) {
            console.error("Error:", error);
            setMensaje(
                (error as any)?.response?.data?.message || "Ocurrió un error en el servidor."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 text-center">Crear Empresa + Admin</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    placeholder="Nombre de la empresa"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    required
                />
                <Input
                    placeholder="Nombre del administrador"
                    value={adminNombre}
                    onChange={(e) => setAdminNombre(e.target.value)}
                    required
                />
                <Input
                    placeholder="Email del administrador"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                />
                <Input
                    placeholder="Contraseña"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                />

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#64C1C1] text-white"
                >
                    {loading ? "Creando..." : "Crear empresa y administrador"}
                </Button>
                {mensaje && (
                    <p className="text-center mt-2 text-sm text-gray-700">{mensaje}</p>
                )}
            </form>
        </div>
    );
};

export default CrearEmpresa;

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const EmpresaEditarPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [nombreEmpresa, setNombreEmpresa] = useState("");
    const [codigoGenerado, setCodigoGenerado] = useState("");
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        const fetchEmpresa = async () => {

            console.log("Cargando empresa para el usuario:", user);
            if (!user?.company_id) return;
            try {
                const res = await fetch(`https://guiaclick.netlify.app/.netlify/functions/server/api/companies/${user.company_id}`);
                const data = await res.json();
                setNombreEmpresa(data.body.name || "");
            } catch (error) {
                console.error("Error al obtener empresa:", error);
            }
        };
        fetchEmpresa();
    }, [user]);

    const handleGuardar = async () => {
        if (!user?.company_id || !nombreEmpresa.trim()) return;

        try {
            setGuardando(true);
            const res = await fetch(`https://guiaclick.netlify.app/.netlify/functions/server/api/companies/${user.company_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nombreEmpresa }),
            });

            if (!res.ok) throw new Error("Error al actualizar");

            alert("Empresa actualizada correctamente.");
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al guardar la empresa.");
        } finally {
            setGuardando(false);
        }
    };

    const handleGenerarCodigo = async () => {
        if (!user?.company_id) return;

        try {
            const res = await fetch(`https://guiaclick.netlify.app/.netlify/functions/server/api/access-codes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ company_id: user.company_id }),
            });

            const data = await res.json();
            if (data.body?.code) {
                setCodigoGenerado(data.body.code);
            } else {
                throw new Error("Error al generar código");
            }
        } catch (error) {
            console.error("Error al generar código:", error);
            alert("No se pudo generar el código");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-[#127C82]">Editar Empresa</h1>

            <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-600">Nombre de la empresa</label>
                <Input
                    value={nombreEmpresa}
                    onChange={(e) => setNombreEmpresa(e.target.value)}
                    placeholder="Nombre de la empresa"
                />
            </div>

            <div className="flex gap-4 mt-6">
                <Button onClick={handleGuardar} disabled={guardando}>
                    {guardando ? "Guardando..." : "Guardar cambios"}
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                    Volver
                </Button>
            </div>

            <hr className="my-8" />

            <h2 className="text-xl font-semibold mb-3">Generar código de acceso</h2>
            <Button onClick={handleGenerarCodigo}>Generar código nuevo</Button>

            {codigoGenerado && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded text-center">
                    Código generado: <strong>{codigoGenerado}</strong>
                </div>
            )}
        </div>
    );
};

export default EmpresaEditarPage;

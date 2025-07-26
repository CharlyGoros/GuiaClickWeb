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
        <div className="max-w-lg mx-auto mt-16 bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h1 className="text-3xl font-bold text-center text-[#127C82]">Administrador de Empresas</h1>

            <div>
                <p className="text-lg font-semibold mb-2 text-gray-800">Editando: <span className="font-bold">{nombreEmpresa}</span></p>
                <Input
                    value={nombreEmpresa}
                    onChange={(e) => setNombreEmpresa(e.target.value)}
                    placeholder="Nombre de la empresa"
                />
            </div>

            <div className="flex flex-wrap gap-3 justify-start">
                <Button onClick={handleGuardar} disabled={guardando} className="bg-blue-600 hover:bg-blue-700">
                    {guardando ? "Guardando..." : "Guardar cambios"}
                </Button>
                <Button variant="outline" onClick={handleGenerarCodigo}>
                    Generar Código
                </Button>
                <Button onClick={() => navigate("/")} className="bg-red-600 hover:bg-red-700 text-white">
                    Cancelar
                </Button>
            </div>

            {codigoGenerado && (
                <div className="mt-6 text-center bg-green-100 text-green-800 rounded-md py-2 px-4 font-mono">
                    Código generado: <strong>{codigoGenerado}</strong>
                </div>
            )}
        </div>
    );
};

export default EmpresaEditarPage;

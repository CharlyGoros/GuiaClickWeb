import React, { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Company {
    id: number;
    name: string;
    created_at: string;
}

const SuperadminEmpresas: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [companies, setCompanies] = useState<Company[]>([]);
    const [selected, setSelected] = useState<Company | null>(null);
    const [newName, setNewName] = useState("");
    const [lastCode, setLastCode] = useState<string | null>(null);

    useEffect(() => {
        if (user?.role !== -1) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        fetch(`http://localhost:3000/.netlify/functions/server/api/companies`)
            .then((res) => res.json())
            .then((data) => setCompanies(data.body))
            .catch(console.error);
    }, []);

    const handleEdit = (company: Company) => {
        setSelected(company);
        setNewName(company.name);
        setLastCode(null);
    };

    const handleSave = async () => {
        if (!selected) return;
        try {
            const response = await fetch(
                `http://localhost:3000/.netlify/functions/server/api/companies/${selected.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newName }),
                }
            );
            if (!response.ok) throw new Error("Error al actualizar empresa");
            alert("Empresa actualizada correctamente");
            const updated = companies.map((c) =>
                c.id === selected.id ? { ...c, name: newName } : c
            );
            setCompanies(updated);
            setSelected(null);
        } catch (err) {
            alert("Error al guardar: " + err);
        }
    };

    const handleGenerarCodigo = async () => {
        if (!selected) return;
        try {
            const response = await fetch(
                `http://localhost:3000/.netlify/functions/server/api/access-codes`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ company_id: selected.id }),
                }
            );
            if (!response.ok) throw new Error("Error al generar código");
            const data = await response.json();
            setLastCode(data.body.code);
        } catch (err) {
            alert("Error generando código: " + err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Administrador de Empresas</h1>
                {user?.role === -1 && (
                    <button
                        className="bg-[#127C82] text-white px-4 py-2 rounded hover:bg-[#0e6a70]"
                        onClick={() => navigate("/crear-empresa")}
                    >
                        + Crear Empresa
                    </button>
                )}
            </div>

            {!selected ? (
                <div className="space-y-4">
                    {companies.map((empresa) => (
                        <div
                            key={empresa.id}
                            className="flex justify-between items-center bg-white rounded-xl shadow p-4 border"
                        >
                            <div>
                                <h3 className="text-lg font-semibold">{empresa.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {new Date(empresa.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => handleEdit(empresa)}
                                className="bg-[#127C82] text-white px-4 py-2 rounded hover:bg-[#0e6a70]"
                            >
                                Editar
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-xl shadow space-y-5 border">
                    <h2 className="text-xl font-semibold mb-2">
                        Editando: {selected.name}
                    </h2>
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Nuevo nombre de empresa"
                    />
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleSave}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                        >
                            Guardar cambios
                        </button>
                        <button
                            onClick={handleGenerarCodigo}
                            className="bg-white border border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold py-2 px-4 rounded-lg text-sm"
                        >
                            Generar Código
                        </button>
                        <button
                            onClick={() => setSelected(null)}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                        >
                            Cancelar
                        </button>
                    </div>
                    {lastCode && (
                        <p className="mt-3 text-sm text-green-600">
                            Nuevo código generado: <strong>{lastCode}</strong>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SuperadminEmpresas;

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
            const response = await fetch(`http://localhost:3000/.netlify/functions/server/api/companies/${selected.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            });
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
            const response = await fetch(`http://localhost:3000/.netlify/functions/server/api/access-codes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ company_id: selected.id }),
            });
            if (!response.ok) throw new Error("Error al generar código");
            const data = await response.json();
            setLastCode(data.body.code);
        } catch (err) {
            alert("Error generando código: " + err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold text-center mb-6">Administrador de Empresas</h1>
            {/* Crear Empresa visible para admin y superadmin */}
            {(user?.role == -1) && (
                <li>
                    <div
                        onClick={() => { navigate("/crear-empresa"); }}
                        className="block px-6 py-3 text-base hover:bg-[#f0f0f0]"
                    >
                        Crear Empresa
                    </div>
                </li>
            )}
            {!selected ? (
                <div className="space-y-3">
                    {companies.map((empresa) => (
                        <div
                            key={empresa.id}
                            className="flex justify-between items-center bg-white rounded shadow p-4"
                        >
                            <div>
                                <h3 className="text-lg font-semibold">{empresa.name}</h3>
                                <p className="text-sm text-gray-500">{new Date(empresa.created_at).toLocaleDateString()}</p>
                            </div>
                            <Button onClick={() => handleEdit(empresa)}>Editar</Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-6 rounded shadow space-y-4">
                    <h2 className="text-xl font-semibold mb-2">Editando: {selected.name}</h2>
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Nuevo nombre de empresa"
                    />
                    <div className="flex gap-3">
                        <Button onClick={handleSave}>Guardar cambios</Button>
                        <Button onClick={handleGenerarCodigo} variant="outline">Generar Código</Button>
                        <Button onClick={() => setSelected(null)} variant="destructive">Cancelar</Button>
                    </div>
                    {lastCode && (
                        <p className="mt-2 text-sm text-green-600">Nuevo código generado: <strong>{lastCode}</strong></p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SuperadminEmpresas;

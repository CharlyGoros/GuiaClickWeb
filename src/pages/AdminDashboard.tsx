import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Usuario {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "User";
}

interface Manual {
    id: number;
    title: string;
    description: string;
    image?: string;
    created_at: string;
    author: string;
    step_count: number;
    favorites_count: number;
}

export const DashboardPage: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [manuales, setManuales] = useState<Manual[]>([]);
    const [activeTab, setActiveTab] = useState<"users" | "manuals">("users");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const [resUsers, resManuals] = await Promise.all([
                fetch("http://localhost:3000/.netlify/functions/server/api/usuarios").then((res) =>
                    res.json()
                ),
                fetch("http://localhost:3000/.netlify/functions/server/api/manuales-dashboard").then((res) =>
                    res.json()
                ),
            ]);
            setUsuarios(resUsers.body || []);
            setManuales(resManuals.body || []);
        };

        fetchData();
    }, []);

    const handleDeleteUser = async (id: number) => {
        if (confirm("¿Eliminar este usuario?")) {
            await fetch(`http://localhost:3000/.netlify/functions/server/api/usuarios/${id}`, {
                method: "DELETE",
            });
            setUsuarios((prev) => prev.filter((u) => u.id !== id));
        }
    };

    const handleDeleteManual = async (id: number) => {
        if (confirm("¿Eliminar este manual?")) {
            await fetch(`http://localhost:3000/.netlify/functions/server/api/manuals/${id}`, {
                method: "DELETE",
            });
            setManuales((prev) => prev.filter((m) => m.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-[#f7fafa] flex">
            <aside className="w-60 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
                <ul className="space-y-2">
                    <li
                        className={`cursor-pointer px-3 py-2 rounded ${activeTab === "users" ? "bg-[#e6f4f4] font-medium" : ""}`}
                        onClick={() => setActiveTab("users")}
                    >
                        👤 Usuarios
                    </li>
                    <li
                        className={`cursor-pointer px-3 py-2 rounded ${activeTab === "manuals" ? "bg-[#e6f4f4] font-medium" : ""}`}
                        onClick={() => setActiveTab("manuals")}
                    >
                        📄 Manuales
                    </li>
                </ul>
            </aside>

            <main className="flex-1 p-6 space-y-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                {activeTab === "users" && (
                    <div className="bg-white rounded shadow overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#f0f0f0] text-sm text-gray-600">
                                <tr>
                                    <th className="p-3">Nombre</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Rol</th>
                                    <th className="p-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((u) => (
                                    <tr key={u.id} className="border-t text-sm">
                                        <td className="p-3">{u.name}</td>
                                        <td className="p-3 text-[#38bdf8]">{u.email}</td>
                                        <td className="p-3">{u.role}</td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <button
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                    onClick={() => handleDeleteUser(u.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "manuals" && (
                    <>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Manuales</h2>
                            <button
                                className="bg-[#127C82] text-white px-4 py-2 rounded hover:bg-[#0e6a70]"
                                onClick={() => navigate("/crear-manual")}
                            >
                                + Crear Manual
                            </button>
                        </div>

                        <div className="bg-white rounded shadow overflow-x-auto mt-4">
                            <table className="w-full text-left">
                                <thead className="bg-[#f0f0f0] text-sm text-gray-600">
                                    <tr>
                                        <th className="p-3">Imagen</th>
                                        <th className="p-3">Título</th>
                                        <th className="p-3">Autor</th>
                                        <th className="p-3">Fecha</th>
                                        <th className="p-3">Pasos</th>
                                        <th className="p-3">Favoritos</th>
                                        <th className="p-3">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {manuales.map((m) => (
                                        <tr key={m.id} className="border-t text-sm">
                                            <td className="p-3">
                                                {m.image && (
                                                    <img
                                                        src={m.image}
                                                        alt={m.title}
                                                        className="h-12 w-20 object-cover rounded"
                                                    />
                                                )}
                                            </td>
                                            <td className="p-3 font-medium">{m.title}</td>
                                            <td className="p-3">{m.author}</td>
                                            <td className="p-3">
                                                {new Date(m.created_at).toLocaleDateString("es-AR")}
                                            </td>
                                            <td className="p-3">{m.step_count}</td>
                                            <td className="p-3">{m.favorites_count}</td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="bg-[#127C82] text-white px-3 py-1 rounded hover:bg-[#0e6a70]"
                                                        onClick={() => navigate(`/editar-manual/${m.id}`)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                        onClick={() => handleDeleteManual(m.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

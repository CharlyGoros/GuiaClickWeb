import React, { useEffect, useState } from "react";

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
                        className={`cursor-pointer px-3 py-2 rounded ${activeTab === "users" ? "bg-[#e6f4f4] font-medium" : ""
                            }`}
                        onClick={() => setActiveTab("users")}
                    >
                        👤 Users
                    </li>
                    <li
                        className={`cursor-pointer px-3 py-2 rounded ${activeTab === "manuals" ? "bg-[#e6f4f4] font-medium" : ""
                            }`}
                        onClick={() => setActiveTab("manuals")}
                    >
                        📄 Manuals
                    </li>
                </ul>
            </aside>

            <main className="flex-1 p-6 space-y-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                {activeTab === "users" && (
                    <>
                        <div className="bg-white rounded shadow overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#f0f0f0] text-sm text-gray-600">
                                    <tr>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">Role</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((u) => (
                                        <tr key={u.id} className="border-t text-sm">
                                            <td className="p-3">{u.name}</td>
                                            <td className="p-3 text-[#38bdf8]">{u.email}</td>
                                            <td className="p-3">{u.role}</td>
                                            <td className="p-3">
                                                <button
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleDeleteUser(u.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === "manuals" && (
                    <>
                        <div className="bg-white rounded shadow overflow-x-auto">
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
                                            <td className="p-3 space-x-2">
                                                <button
                                                    className="text-blue-600 hover:underline"
                                                    onClick={() =>
                                                        window.location.assign(`/editar-manual/${m.id}`)
                                                    }
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="text-red-500 hover:underline"
                                                    onClick={() => handleDeleteManual(m.id)}
                                                >
                                                    Eliminar
                                                </button>
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


// src/pages/UsersListPage.tsx
import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';

interface Usuario {
    id: number;
    name: string;
    email: string;
    role: string;
}

const UsersListPage: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/.netlify/functions/server/api/usuarios')
            .then(res => res.json())
            .then(data => setUsuarios(data.body || []))
            .catch(console.error);
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar usuario?')) return;
        await fetch(`http://localhost:3000/.netlify/functions/server/api/usuarios/${id}`, { method: 'DELETE' });
        setUsuarios(prev => prev.filter(u => u.id !== id));
    };

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold">Usuarios</h1>
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f0f0f0] text-sm text-gray-600">
                        <tr>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Rol</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(u => (
                            <tr key={u.id} className="border-t text-sm">
                                <td className="p-3">{u.name}</td>
                                <td className="p-3 text-blue-500">{u.email}</td>
                                <td className="p-3">{u.role}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleDelete(u.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default UsersListPage;
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
    const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);

    useEffect(() => {
        fetch('http://localhost:3000/.netlify/functions/server/api/usuarios')
            .then(res => res.json())
            .then(data => setUsuarios(data.body || []))
            .catch(console.error);
    }, []);

    const confirmDelete = async () => {
        if (!userToDelete) return;
        await fetch(`http://localhost:3000/.netlify/functions/server/api/usuarios/${userToDelete.id}`, {
            method: 'DELETE',
        });
        setUsuarios(prev => prev.filter(u => u.id !== userToDelete.id));
        setUserToDelete(null);
    };

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
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
                                        onClick={() => setUserToDelete(u)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {usuarios.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-gray-500">
                                    No hay usuarios para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de confirmación */}
            {userToDelete && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Fondo con blur y transparencia */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

                    {/* Caja del modal */}
                    <div className="relative bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            Confirmar eliminación
                        </h2>
                        <p className="text-gray-600 mb-6">
                            ¿Seguro que deseas eliminar al usuario "
                            <span className="font-semibold">{userToDelete.name}</span>"?
                        </p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setUserToDelete(null)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default UsersListPage;

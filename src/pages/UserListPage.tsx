import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import useAuth from '@/hooks/useAuth';
import { c } from 'node_modules/vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf';

interface Usuario {
    id: number;
    name: string;
    email: string;
    role: string | number;
    company_id?: number | null;
}

const UsersListPage: React.FC = () => {
    const { user } = useAuth();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('https://guiaclick.netlify.app/.netlify/functions/server/api/usuarios');
                const data = await res.json();

                let list: Usuario[] = data.body || [];

                // 🔹 Si es admin de empresa, filtra solo los de su empresa
                if (user?.role === 1 && user.company_id) {
                    console.log("🔎 Filtrando usuarios para admin de empresa:", user.company_id);

                    list = list.filter((u) => {
                        const include = u.company_id == user.company_id && u.id != user.id;
                        console.log(u);
                        console.log(
                            `Usuario ID: ${u.id}, Nombre: ${u.name}, Empresa: ${u.company_id} → ${include ? "INCLUIDO ✅" : "EXCLUIDO ❌"
                            }`
                        );
                        return include;
                    });
                }

                // 🔹 Si es superadmin (-1), ve todos
                setUsuarios(list);
            } catch (err) {
                console.error('Error cargando usuarios:', err);
            }
        };

        fetchUsers();
    }, [user]);

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await fetch(
                `https://guiaclick.netlify.app/.netlify/functions/server/api/usuarios/${userToDelete.id}`,
                { method: 'DELETE' }
            );
            setUsuarios(prev => prev.filter(u => u.id !== userToDelete.id));
            setUserToDelete(null);
        } catch (err) {
            console.error('Error eliminando usuario:', err);
        }
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
                                <td className="p-3">
                                    {u.role === -1
                                        ? 'Superadmin'
                                        : u.role === 1
                                            ? 'Admin Empresa'
                                            : 'Usuario'}
                                </td>
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
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
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

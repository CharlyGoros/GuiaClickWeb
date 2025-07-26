// src/pages/ManualsListPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import useAuth from '@/hooks/useAuth';

interface Manual {
    id: number;
    title: string;
    description: string;
    image?: string;
    author: string;
    created_at: string;
    step_count: number;
    favorites_count: number;
    company_id: number;     // <-- añadimos esta propiedad
}

const ManualsListPage: React.FC = () => {
    const [manuales, setManuales] = useState<Manual[]>([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Definimos cuándo es admin: en tu backend rol 1 = Admin
    const isAdmin = user?.role == 1;

    useEffect(() => {
        fetch('http://localhost:3000/.netlify/functions/server/api/manuales-dashboard')
            .then(res => res.json())
            .then(data => {
                let list: Manual[] = data.body || [];

                // Si es admin, filtramos solo los manuales de su empresa
                if (isAdmin && user?.company_id) {
                    list = list.filter(m => m.company_id === user.company_id);
                }

                setManuales(list);
            })
            .catch(console.error);
    }, [isAdmin, user?.company_id]);

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar manual?')) return;
        await fetch(`http://localhost:3000/.netlify/functions/server/api/manuales/${id}`, { method: 'DELETE' });
        setManuales(prev => prev.filter(m => m.id !== id));
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Manuales</h1>
                <button
                    onClick={() => navigate('/crear-manual')}
                    className="bg-[#127C82] text-white px-4 py-2 rounded hover:bg-[#0e6a70]"
                >
                    + Crear Manual
                </button>
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full">
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
                        {manuales.map(m => (
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
                                    {new Date(m.created_at).toLocaleDateString('es-AR')}
                                </td>
                                <td className="p-3">{m.step_count}</td>
                                <td className="p-3">{m.favorites_count}</td>
                                <td className="p-3 space-x-2">
                                    <button
                                        onClick={() => navigate(`/editar-manual/${m.id}`)}
                                        className="bg-[#127C82] text-white px-3 py-1 rounded hover:bg-[#0e6a70]"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(m.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {manuales.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-gray-500">
                                    No hay manuales para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default ManualsListPage;

import React from 'react';

type Props = {
    hit: {
        objectID: string;
        titulo: string;
        descripcion?: string;
    };
};

export function ManualCard({ hit }: { hit: Props["hit"] }) {
    return (
        <div
            className="flex flex-col bg-white rounded-xl shadow-md p-5 h-full cursor-pointer hover:shadow-lg transition-all"
            onClick={() => window.location.href = `/manual/${hit.objectID}`}
        >
            <div className="w-full h-44 bg-gray-200 rounded mb-4" />
            <div>
                <div className="text-sm font-semibold bg-[#64C1C1] text-white rounded-full px-3 py-1 inline-block mb-2">
                    {hit.titulo}
                </div>
                <p className="text-sm text-gray-700 leading-snug">
                    {hit.descripcion?.slice(0, 100) || 'Sin descripción'}
                </p>
            </div>
        </div>
    );
}

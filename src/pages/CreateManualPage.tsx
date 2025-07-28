import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

interface StepData {
    order: number;
    title: string;
    description: string;
    image: File | null;
}

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/ddnjtzlim/image/upload";
const UPLOAD_PRESET = "presettest";

const CrearManualPage: React.FC = () => {
    const { user } = useAuth();

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [steps, setSteps] = useState<StepData[]>([
        { order: 1, title: "", description: "", image: null }
    ]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isGlobalManual, setIsGlobalManual] = useState<boolean>(false);

    // Modal de feedback
    const [modalMessage, setModalMessage] = useState<string | null>(null);

    const isFormValid =
        title.trim().length > 0 &&
        description.trim().length > 0 &&
        steps.every(s => s.title.trim().length > 0 && s.description.trim().length > 0);

    const handleManualImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleStepChange = <K extends keyof StepData>(
        index: number,
        field: K,
        value: StepData[K]
    ) => {
        const updated = [...steps];
        updated[index] = { ...updated[index], [field]: value };
        setSteps(updated);
    };

    const handleStepImageChange = (index: number, file: File) => {
        const updated = [...steps];
        updated[index].image = file;
        setSteps(updated);
    };

    const addStep = () => {
        setSteps(prev => [
            ...prev,
            { order: prev.length + 1, title: "", description: "", image: null }
        ]);
    };

    const removeStep = (index: number) => {
        setSteps(prev => {
            const filtered = prev.filter((_, i) => i !== index);
            return filtered.map((step, idx) => ({ ...step, order: idx + 1 }));
        });
    };

    const uploadImageToCloudinary = async (file: File): Promise<string> => {
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", UPLOAD_PRESET);
        const res = await axios.post(CLOUDINARY_URL, form);
        return res.data.secure_url;
    };

    const handleSubmit = async () => {
        if (!isFormValid) {
            setModalMessage("⚠️ Por favor completa todos los campos requeridos");
            return;
        }
        setIsUploading(true);
        try {
            let manualUrl: string | null = null;
            if (image) manualUrl = await uploadImageToCloudinary(image);

            const processed = await Promise.all(
                steps.map(async step => {
                    let url: string | null = null;
                    if (step.image) url = await uploadImageToCloudinary(step.image);
                    return {
                        order: step.order,
                        title: step.title,
                        description: step.description,
                        image: url
                    };
                })
            );

            const payload = {
                title,
                description,
                created_by: user?.id ?? 1,
                public: true,
                image: manualUrl,
                steps: processed,
                company_id:
                    user?.role === 1 && user?.company_id && !isGlobalManual
                        ? user.company_id
                        : null
            };

            await axios.post(
                "http://localhost:3000/.netlify/functions/server/api/manuals",
                payload
            );

            setModalMessage(" Manual creado correctamente");

            // Reset form después de crear
            setTitle("");
            setDescription("");
            setImage(null);
            setSteps([{ order: 1, title: "", description: "", image: null }]);
            setIsGlobalManual(false);
        } catch (error) {
            console.error(error);
            setModalMessage(" Error al crear el manual.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Crear Nuevo Manual</h1>

            <input
                required
                className="w-full p-2 border rounded mb-2"
                placeholder="Título del manual"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />

            <textarea
                required
                className="w-full p-2 border rounded mb-2"
                placeholder="Descripción"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />

            <div className="mb-4">
                <label className="block font-semibold mb-2">Imagen principal:</label>
                <div className="flex items-center gap-4">
                    <label className="bg-[#127C82] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#0e6a70]">
                        Seleccionar archivo
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleManualImageChange}
                        />
                    </label>
                    {image && <span className="text-sm">{image.name}</span>}
                </div>
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-2">Pasos</h2>
            {steps.map((step, idx) => (
                <div key={idx} className="border p-4 mb-4 rounded shadow-sm">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">Paso {idx + 1}</p>
                        {steps.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeStep(idx)}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                Eliminar
                            </button>
                        )}
                    </div>
                    <input
                        required
                        className="w-full p-2 border rounded mb-2"
                        placeholder="Título del paso"
                        value={step.title}
                        onChange={e => handleStepChange(idx, "title", e.target.value)}
                    />
                    <textarea
                        required
                        className="w-full p-2 border rounded mb-2"
                        placeholder="Descripción del paso"
                        value={step.description}
                        onChange={e => handleStepChange(idx, "description", e.target.value)}
                    />
                    <div className="flex items-center gap-4 mt-2">
                        <label className="bg-[#127C82] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#0e6a70]">
                            Seleccionar archivo
                            <input
                                type="file"
                                className="hidden"
                                onChange={e =>
                                    e.target.files?.[0] &&
                                    handleStepImageChange(idx, e.target.files[0])
                                }
                            />
                        </label>
                        {step.image && <span className="text-sm">{step.image.name}</span>}
                    </div>
                </div>
            ))}

            <div className="flex gap-4 mt-6">
                <button
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={addStep}
                    type="button"
                >
                    Agregar Paso
                </button>

                <button
                    className="bg-[#127C82] text-white px-6 py-2 rounded hover:bg-[#0e6a70] disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={!isFormValid || isUploading}
                >
                    {isUploading ? "Subiendo..." : "Crear Manual"}
                </button>
            </div>

            {/* Modal de feedback */}
            {modalMessage && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                    <div className="relative bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Aviso</h2>
                        <p className="text-gray-600 mb-6">{modalMessage}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setModalMessage(null)}
                                className="px-4 py-2 bg-[#127C82] text-white rounded hover:bg-[#0e6a70]"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrearManualPage;

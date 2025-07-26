import React, { useState, ChangeEvent } from "react";
import axios from "axios";

interface StepData {
    order: number;
    title: string;
    description: string;
    image: File | null;
}

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/ddnjtzlim/image/upload";
const UPLOAD_PRESET = "presettest";

const CrearManualPage: React.FC = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [steps, setSteps] = useState<StepData[]>([
        { order: 1, title: "", description: "", image: null }
    ]);
    const [isUploading, setIsUploading] = useState<boolean>(false);

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
        const updatedSteps = [...steps];
        updatedSteps[index] = {
            ...updatedSteps[index],
            [field]: value
        };
        setSteps(updatedSteps);
    };

    const handleStepImageChange = (index: number, file: File) => {
        const updatedSteps = [...steps];
        updatedSteps[index].image = file;
        setSteps(updatedSteps);
    };

    const addStep = () => {
        setSteps([
            ...steps,
            { order: steps.length + 1, title: "", description: "", image: null }
        ]);
    };

    const uploadImageToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await axios.post(CLOUDINARY_URL, formData);
        return response.data.secure_url;
    };

    const handleSubmit = async () => {
        try {
            setIsUploading(true);

            let manualImageUrl: string | null = null;
            if (image) {
                manualImageUrl = await uploadImageToCloudinary(image);
            }

            const processedSteps = await Promise.all(
                steps.map(async (step) => {
                    let stepImageUrl: string | null = null;
                    if (step.image) {
                        stepImageUrl = await uploadImageToCloudinary(step.image);
                    }
                    return {
                        order: step.order,
                        title: step.title,
                        description: step.description,
                        image: stepImageUrl
                    };
                })
            );

            await axios.post("https://guiaclick.netlify.app/.netlify/functions/server/api/manuals", {
                title,
                description,
                created_by: 1,
                public: true,
                image: manualImageUrl,
                steps: processedSteps
            });

            alert("Manual creado correctamente");

            setTitle("");
            setDescription("");
            setImage(null);
            setSteps([{ order: 1, title: "", description: "", image: null }]);
        } catch (error) {
            console.error(error);
            alert("Error al crear el manual.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Crear Nuevo Manual</h1>

            <input
                className="w-full p-2 border rounded mb-2"
                placeholder="Título del manual"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                className="w-full p-2 border rounded mb-2"
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
            {steps.map((step, index) => (
                <div key={index} className="border p-4 mb-4 rounded shadow-sm">
                    <p className="font-semibold mb-2">Paso {index + 1}</p>
                    <input
                        className="w-full p-2 border rounded mb-2"
                        placeholder="Título del paso"
                        value={step.title}
                        onChange={(e) => handleStepChange(index, "title", e.target.value)}
                    />
                    <textarea
                        className="w-full p-2 border rounded mb-2"
                        placeholder="Descripción del paso"
                        value={step.description}
                        onChange={(e) => handleStepChange(index, "description", e.target.value)}
                    />
                    <div className="flex items-center gap-4 mt-2">
                        <label className="bg-[#127C82] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#0e6a70]">
                            Seleccionar archivo
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                    e.target.files?.[0] && handleStepImageChange(index, e.target.files[0])
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
                >
                    Agregar Paso
                </button>

                <button
                    className="bg-[#127C82] text-white px-6 py-2 rounded hover:bg-[#0e6a70]"
                    onClick={handleSubmit}
                    disabled={isUploading}
                >
                    {isUploading ? "Subiendo..." : "Crear Manual"}
                </button>
            </div>
        </div>
    );
};

export default CrearManualPage;

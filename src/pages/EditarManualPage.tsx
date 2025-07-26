import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Step {
    id?: number;
    order: number;
    title: string;
    description: string;
    image: string | File | null;
}

interface ManualData {
    title: string;
    description: string;
    image: string | File | null;
    public: boolean;
    steps: Step[];
}

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/ddnjtzlim/image/upload";
const UPLOAD_PRESET = "presettest";

const EditarManualPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [manual, setManual] = useState<ManualData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [manualRes, stepsRes] = await Promise.all([
                    axios.get(`https://guiaclick.netlify.app/.netlify/functions/server/api/manuales/${id}`),
                    axios.get(`https://guiaclick.netlify.app/.netlify/functions/server/api/manuals/${id}/steps`)
                ]);

                const manualData = manualRes.data.body;
                const stepsData = stepsRes.data.body;

                const formattedSteps: Step[] = stepsData.map((step: Step) => ({
                    id: step.id,
                    order: step.order,
                    title: step.title,
                    description: step.description,
                    image: step.image
                }));

                setManual({
                    title: manualData.title,
                    description: manualData.description,
                    image: manualData.image,
                    public: manualData.public,
                    steps: formattedSteps
                });
            } catch (err) {
                console.error("Error cargando manual o pasos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleInputChange = (field: keyof ManualData, value: string | boolean) => {
        if (!manual) return;
        setManual({ ...manual, [field]: value });
    };

    const handleStepChange = (index: number, field: keyof Step, value: string) => {
        if (!manual) return;
        const updatedSteps = [...manual.steps];
        updatedSteps[index] = { ...updatedSteps[index], [field]: value };
        setManual({ ...manual, steps: updatedSteps });
    };

    const handleStepImageChange = (index: number, file: File) => {
        if (!manual) return;
        const updatedSteps = [...manual.steps];
        updatedSteps[index].image = file;
        setManual({ ...manual, steps: updatedSteps });
    };

    const handleManualImageChange = (file: File) => {
        if (!manual) return;
        setManual({ ...manual, image: file });
    };

    const addStep = () => {
        if (!manual) return;
        const newStep: Step = {
            order: manual.steps.length + 1,
            title: "",
            description: "",
            image: null
        };
        setManual({ ...manual, steps: [...manual.steps, newStep] });
    };

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        const res = await axios.post(CLOUDINARY_URL, formData);
        return res.data.secure_url;
    };

    const handleSubmit = async () => {
        if (!manual) return;
        setLoading(true);
        try {
            let manualImageUrl = manual.image;
            if (manual.image instanceof File) {
                manualImageUrl = await uploadImage(manual.image);
            }

            const processedSteps = await Promise.all(
                manual.steps.map(async (step) => {
                    let stepImage = step.image;
                    if (step.image instanceof File) {
                        stepImage = await uploadImage(step.image);
                    }
                    return {
                        order: step.order,
                        title: step.title,
                        description: step.description,
                        image: stepImage
                    };
                })
            );

            const payload = {
                title: manual.title,
                description: manual.description,
                image: manualImageUrl,
                public: manual.public,
                steps: processedSteps
            };

            await axios.put(`https://guiaclick.netlify.app/.netlify/functions/server/api/manuals/${id}`, payload);
            alert("Manual actualizado correctamente");
            navigate("/dashboard");
        } catch (err) {
            console.error("Error actualizando manual:", err);
            alert("Error al actualizar el manual");
        } finally {
            setLoading(false);
        }
    };

    if (loading || !manual) return <p className="p-4 text-center">Cargando manual...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Editar Manual</h1>

            <input
                className="w-full p-2 border rounded mb-2"
                placeholder="Título"
                value={manual.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
            />

            <textarea
                className="w-full p-2 border rounded mb-2"
                placeholder="Descripción"
                value={manual.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
            />

            <div className="mb-4">
                <label className="block font-semibold mb-2">Imagen principal:</label>
                <div className="flex items-center gap-4 mb-2">
                    <label className="bg-[#127C82] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#0e6a70]">
                        Seleccionar archivo
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleManualImageChange(e.target.files[0])}
                        />
                    </label>
                    <span className="text-sm max-w-[300px] truncate">
                        {manual.image instanceof File
                            ? manual.image.name
                            : typeof manual.image === "string"
                                ? manual.image.split("/").pop()?.split("?")[0]
                                : ""}
                    </span>
                </div>
                {manual.image && (
                    <img
                        src={manual.image instanceof File ? URL.createObjectURL(manual.image) : manual.image}
                        alt="Preview principal"
                        className="mt-2 w-full max-h-48 object-cover rounded"
                    />
                )}
            </div>

            <label className="block my-2">
                <input
                    type="checkbox"
                    checked={manual.public}
                    onChange={(e) => handleInputChange("public", e.target.checked)}
                />{" "}
                Manual público
            </label>

            <h2 className="text-lg font-semibold mt-6 mb-2">Pasos</h2>
            {manual.steps.map((step, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                    <p className="font-bold mb-2">Paso {index + 1}</p>
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
                    <div className="flex items-center gap-4 mb-2">
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
                        <span className="text-sm max-w-[300px] truncate">
                            {step.image instanceof File
                                ? step.image.name
                                : typeof step.image === "string"
                                    ? step.image.split("/").pop()?.split("?")[0]
                                    : ""}
                        </span>
                    </div>
                    {step.image && (
                        <img
                            src={step.image instanceof File ? URL.createObjectURL(step.image) : step.image}
                            alt={`Preview paso ${index + 1}`}
                            className="mt-2 w-full max-h-48 object-cover rounded"
                        />
                    )}
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
                    disabled={loading}
                >
                    {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
            </div>
        </div>
    );
};

export default EditarManualPage;

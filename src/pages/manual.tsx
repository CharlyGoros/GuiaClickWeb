import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, StarOff, ArrowLeft, User, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Manual {
    id: number;
    title: string;
    description: string;
    image?: string;
}
interface ManualStep {
    id: number;
    order: number;
    title: string;
    description: string;
    image?: string;
}
interface Rating {
    id: number;
    user_id: number;
    score: number;
    comment: string;
    created_at: string;
}

export const ManualPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const manualId = Number(id);
    const navigate = useNavigate();

    const currentUserId = 1; // Cambia según tu lógica de auth

    const [manual, setManual] = useState<Manual | null>(null);
    const [steps, setSteps] = useState<ManualStep[]>([]);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [isFav, setIsFav] = useState(false);
    const [loading, setLoading] = useState(true);

    // Estados para el modal de nueva opinión
    const [showAddModal, setShowAddModal] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [newScore, setNewScore] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const loadAll = async () => {
            setLoading(true);
            try {
                const [mRes, sRes, rRes, fRes] = await Promise.all([
                    fetch(`http://localhost:3000/.netlify/functions/server/api/manuales/${manualId}`)
                        .then(r => r.json()),
                    fetch(`http://localhost:3000/.netlify/functions/server/api/manuals/${manualId}/steps`)
                        .then(r => r.json()),
                    fetch(`http://localhost:3000/.netlify/functions/server/api/valoraciones/manuales/${manualId}`)
                        .then(r => r.json()),
                    fetch(`http://localhost:3000/.netlify/functions/server/api/users/${currentUserId}/favorites/${manualId}/check`)
                        .then(r => r.json()),
                ]);

                if (!cancelled) {
                    setManual(mRes.body);
                    setSteps(sRes.body);
                    setRatings(rRes.body);
                    setIsFav(fRes.body);
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        loadAll();
        return () => { cancelled = true; };
    }, [manualId]);

    const toggleFavorite = async () => {
        const url = `http://localhost:3000/.netlify/functions/server/api/users/${currentUserId}/favorites/${manualId}`;
        try {
            await fetch(url, { method: isFav ? "DELETE" : "POST" });
            setIsFav(!isFav);
        } catch (e) { console.error(e); }
    };

    const reloadRatings = async () => {
        const rRes = await fetch(
            `http://localhost:3000/.netlify/functions/server/api/valoraciones/manuales/${manualId}`
        ).then(r => r.json());
        setRatings(rRes.body);
    };

    const handleDeleteRating = async (ratingId: number) => {
        await fetch(
            `http://localhost:3000/.netlify/functions/server/api/ratings/${currentUserId}/${ratingId}`,
            { method: "DELETE" }
        );
        reloadRatings();
    };

    const openAddModal = () => setShowAddModal(true);
    const closeAddModal = () => {
        setShowAddModal(false);
        setNewComment("");
        setNewScore(0);
    };

    const confirmAdd = async () => {
        await fetch(
            `http://localhost:3000/.netlify/functions/server/api/ratings`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: currentUserId,
                    manual_id: manualId,
                    score: newScore,
                    comment: newComment,
                }),
            }
        );
        await reloadRatings();
        closeAddModal();
    };

    if (loading || !manual) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin h-8 w-8 border-4 border-[#64C1C1] border-t-transparent rounded-full" />
            </div>
        );
    }

    // Separamos mi opinión del resto
    const myRating = ratings.find(r => r.user_id === currentUserId);
    const otherRatings = ratings.filter(r => r.user_id !== currentUserId);

    return (
        <div className="bg-[#EAEAEA] min-h-screen w-[50%] m-auto">
            {/* AppBar */}
            <div className="flex items-center bg-white p-4 shadow">
                <button onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="flex-1 text-center font-semibold text-lg">
                    {manual.title}
                </h1>
                <button onClick={toggleFavorite}>
                    {isFav
                        ? <Star className="w-6 h-6 text-yellow-400" />
                        : <StarOff className="w-6 h-6 text-gray-400" />}
                </button>
            </div>

            <div className="p-4 space-y-6">
                {manual.image && (
                    <img
                        src={manual.image}
                        alt={manual.title}
                        className="w-full h-48 object-cover rounded-lg"
                    />
                )}

                <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-800">{manual.description}</p>
                </div>

                {/* Pasos */}
                <div>
                    <div className="bg-[#64C1C1] text-white px-4 py-2 rounded-t-lg font-bold">
                        Pasos
                    </div>
                    <div className="space-y-4">
                        {steps.map(step => (
                            <div
                                key={step.id}
                                className="bg-[#F7F5FF] rounded-lg overflow-hidden shadow"
                            >
                                <div className="px-4 py-2 font-semibold">
                                    Paso {step.order}: {step.title}
                                </div>
                                {step.image && (
                                    <img
                                        src={step.image}
                                        alt={step.title}
                                        className="w-full h-40 object-cover"
                                    />
                                )}
                                <div className="px-4 py-2">{step.description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mi opinión */}
                {myRating && (
                    <>
                        <div className="bg-[#64C1C1] text-white px-4 py-2 rounded-lg font-bold">
                            Mi opinión
                        </div>
                        <div className="bg-white rounded-lg p-4 flex items-center shadow">
                            <User className="w-10 h-10 text-gray-400" />
                            <div className="ml-3 flex-1">
                                <p className="text-gray-800">{myRating.comment}</p>
                                <p className="text-gray-500 text-sm">
                                    {new Date(myRating.created_at).toLocaleString("es-AR", {
                                        day: "2-digit", month: "2-digit", year: "numeric",
                                        hour: "2-digit", minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) =>
                                    i < myRating.score
                                        ? <Star key={i} className="w-5 h-5 text-yellow-400" />
                                        : <StarOff key={i} className="w-5 h-5 text-gray-300" />
                                )}
                            </div>
                            <button
                                onClick={() => handleDeleteRating(myRating.id)}
                                className="ml-4"
                            >
                                <Trash2 className="w-6 h-6 text-red-500 hover:text-red-700" />
                            </button>
                        </div>
                    </>
                )}

                {/* Agregar / Otras opiniones */}
                <button
                    onClick={openAddModal}
                    className="w-full bg-[#64C1C1] text-white py-3 rounded-lg font-semibold"
                >
                    + Agregar opinión
                </button>

                {otherRatings.length > 0 && (
                    <>
                        <div className="bg-[#64C1C1] text-white px-4 py-2 rounded-lg font-bold">
                            Otras opiniones
                        </div>
                        <div className="space-y-4">
                            {otherRatings.map(r => (
                                <div
                                    key={r.id}
                                    className="bg-white rounded-lg p-4 flex items-center shadow"
                                >
                                    <User className="w-10 h-10 text-gray-400" />
                                    <div className="ml-3 flex-1">
                                        <p className="text-gray-800">{r.comment}</p>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(r.created_at).toLocaleString("es-AR", {
                                                day: "2-digit", month: "2-digit", year: "numeric",
                                                hour: "2-digit", minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) =>
                                            i < r.score
                                                ? <Star key={i} className="w-5 h-5 text-yellow-400" />
                                                : <StarOff key={i} className="w-5 h-5 text-gray-300" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modal de Agregar opinión */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl p-6 w-80"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <h2 className="bg-[#64C1C1] text-white px-4 py-2 rounded text-center mb-4">
                                Califica el manual
                            </h2>
                            <textarea
                                rows={4}
                                placeholder="Escribe tu opinión"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full border border-[#64C1C1] rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#64C1C1]"
                            />

                            <div className="flex justify-center space-x-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <button key={i} onClick={() => setNewScore(i)}>
                                        {i <= newScore
                                            ? <Star className="w-8 h-8 text-yellow-400" />
                                            : <StarOff className="w-8 h-8 text-gray-300" />}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={closeAddModal}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAdd}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
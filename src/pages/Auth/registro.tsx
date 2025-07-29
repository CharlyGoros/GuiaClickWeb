import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../services/api';
import logo from "../../assets/LogoGC.png";
import bgImage from "../../assets/background.jpg";

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { name, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await createUser({ name, email, password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 1500);
        } catch (err: unknown) {
            if (typeof err === 'object' && err !== null) {
                const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
                setError(errorObj.response?.data?.message ?? errorObj.message ?? 'Error desconocido');
            } else {
                setError('Error desconocido');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 bg-[#f7fafa] overflow-hidden">
            {/* Fondo blur */}
            <img
                src={bgImage}
                alt="fondo login"
                className="absolute inset-0 w-full h-full object-cover opacity-35 blur-sm"
            />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <div className="flex flex-col items-center mb-6">
                    <img src={logo} alt="GuíaClick" className="w-35 h-35 mb-" />
                    <h2 className="text-2xl font-bold text-gray-800">Registrar Cuenta</h2>
                    <p className="text-sm text-gray-600">Unite y empezá a aprender tecnología</p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
                        Registro exitoso. Redirigiendo...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre completo"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded focus:ring-2 focus:ring-[#64C1C1] outline-none"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded focus:ring-2 focus:ring-[#64C1C1] outline-none"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded focus:ring-2 focus:ring-[#64C1C1] outline-none"
                        required
                        minLength={6}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmar contraseña"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded focus:ring-2 focus:ring-[#64C1C1] outline-none"
                        required
                        minLength={6}
                    />

                    <button
                        type="submit"
                        className="w-full bg-[#127C82] text-white py-3 rounded shadow hover:bg-[#0e6366] transition"
                        disabled={loading || success}
                    >
                        {loading ? "Registrando..." : "Registrarme"}
                    </button>
                </form>

                <div className="text-center mt-4 text-sm text-gray-600">
                    ¿Ya tienes cuenta?{" "}

                    <div onClick={() => navigate("/login")} className="inline-block text-[#117b7b] hover:underline cursor-pointer">
                        Iniciar Sesión
                    </div>
                </div>
                {/* Botón facha para ir al Home */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => navigate("/")}
                        className="w-full h-12 bg-[#64C1C1] hover:bg-[#50a5a5] text-white font-semibold text-base rounded-md shadow-md transition-all"
                    >
                        Ir al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/LogoGC.png";
import bgImage from "../../assets/background.jpg";

interface LoginFormData {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const { login, loading, error: authError } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const user = await login(formData);
            navigate(user.role === 1 || user.role === -1 ? "/home" : "/home");
        } catch {
            // authError se muestra abajo
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

            {/* Contenedor del formulario */}
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-10 z-10">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="GuíaClick" className="h-35" />
                </div>

                <h2 className="text-2xl font-bold text-center mb-3 text-gray-800">
                    Bienvenido a GuíaClick
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    La forma más simple de aprender tecnología.
                </p>

                {authError && (
                    <div className="text-red-600 text-sm text-center mb-4">
                        {authError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full h-12 px-4 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full h-12 px-4 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-[#127C82] hover:bg-[#0f6666] text-white text-base font-semibold rounded transition-all"
                    >
                        {loading ? "Ingresando..." : "Entrar"}
                    </button>
                </form>

                <div className="text-center mt-5 text-sm text-gray-600">
                    ¿No tenés cuenta?{" "}
                    <div onClick={() => navigate("/registro")} className="inline-block text-[#117b7b] hover:underline cursor-pointer">
                        Regístrate
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

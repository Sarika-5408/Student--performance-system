import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
    const res = await axios.post("https://role-rador-backend.onrender.com/api/auth/login", {
      email,
      password,
    });
      localStorage.setItem("token", res.data.token);
     navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 overflow-hidden">
      
      {/* 🔥 BACKGROUND GLOWS */}
      <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30 top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30 bottom-10 right-10"></div>

      {/* ⭐ EXTRA PINK GLOW (CENTER) */}
      <div className="absolute w-[500px] h-[500px] bg-pink-500 rounded-full blur-3xl opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      {/* 💎 GLASS CARD */}
      <div className="relative z-10 w-96 p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(139,92,246,0.3)] text-white transition duration-300 hover:scale-105">
        
        <h1 className="text-3xl font-bold text-center mb-2 tracking-wide">
          🚀 Role Radar
        </h1>

        <p className="text-center text-gray-300 mb-6 text-sm tracking-wide">
          Discover your future with AI
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/30 transition"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-5 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/30 transition"
          />

          <button
            type="submit"
            className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:scale-105 hover:shadow-lg transition font-semibold"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-sm text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-400 hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
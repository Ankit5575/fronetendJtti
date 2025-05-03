import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lottie from "lottie-react";
import planeAnimation from "../assets/animation3.json"; // ✅ Your animation path

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const navigate = useNavigate();

  const motivationalLines = [
    "Stay focused, success is near!",
    "Every great journey begins with a single step.",
    "You are stronger than you think!",
    "Dream big. Work hard. Stay humble!",
    "Progress, not perfection!",
    "Believe in yourself and all that you are.",
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setCurrentLineIndex((prevIndex) => (prevIndex + 1) % motivationalLines.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`https://newportal.onrender.com/admin/login`, {
        email,
        password,
      });
      const { token } = res.data;
      if (token) {
        localStorage.setItem("token", token);
      }
      if (res.data.success) {
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
        navigate("/admin-dashboard");
      } else {
        toast.error("Admin credentials are incorrect.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error during admin login.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 relative">

      {/* 🔥 Loading Overlay with Animation & Text */}
      {loading && (
        <div className="absolute inset-0 flex flex-col justify-center items-center z-50  bg-opacity-30 backdrop-blur-sm">
          <Lottie animationData={planeAnimation} className="w-60 h-60" loop={true} />
          <p className="mt-4 text-lg font-semibold text-black text-center animate-pulse">
            {motivationalLines[currentLineIndex]}
          </p>
        </div>
      )}

      {/* Form Box */}
      <div
        className={`bg-white shadow-2xl rounded-xl p-8 w-full max-w-md transition-all duration-300 ${
          loading ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Admin Login</h1>
          <p className="text-gray-500">Login to access the admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-600 font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}

export default AdminLogin;

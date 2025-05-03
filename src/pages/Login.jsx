import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Lottie from "lottie-react";
import planeAnimation from "../assets/animation3.json"; // ✅ Make sure you have this animation file

function Login() {
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const navigate = useNavigate();

  const motivationalLines = [
    "Believe in yourself!",
    "Keep pushing forward!",
    "Dream big, work hard!",
    "Success is no accident!",
    "Stay positive and strong!",
    "Every effort counts!"
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
      const res = await axios.post(`https://newportal.onrender.com/api/user/login`, {
        email,
        rollNumber,
      });

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/profile");
      } else {
        toast.error("Credentials do not match!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Your credentials are incorrect.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 relative">

      {/* 🔥 Loading Overlay */}
      {loading && (
        <>
          {/* Blue transparent background */}
          <div className="absolute inset-0  bg-opacity-50 z-40"></div>

          {/* Animation and motivational text */}
          <div className="absolute inset-0 flex flex-col justify-center items-center z-50">
            <Lottie animationData={planeAnimation} className="w-60 h-60" loop={true} />
            <p className="mt-4 text-lg font-semibold text-black text-center animate-pulse">
              {motivationalLines[currentLineIndex]}
            </p>
          </div>
        </>
      )}

      {/* Form Box */}
      <div className={`bg-white shadow-2xl rounded-xl p-8 w-full max-w-md transition-all duration-300 ${loading ? 'blur-sm' : ''}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">JTTI Student Portal</h1>
          <p className="text-gray-500">Login to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-600 font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600 font-medium">Roll Number</label>
            <input
              type="text"
              placeholder="Enter your roll number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
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

        {/* Sign up link */}
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/sinup" className="text-indigo-600 hover:text-indigo-800">
            Sign up
          </Link>
        </p>

        {/* Admin login link */}
        <p className="mt-6 text-center">
          <Link 
            to="/admin-login" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-green-800 transition-colors duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                clipRule="evenodd" 
              />
            </svg>
            Login as Admin
          </Link>
        </p>
      </div>

      {/* ✅ Footer Section */}
      <footer className="text-center py-4 text-white text-sm mt-6">
        Made with ❤️ by <span className="font-bold">JTTI</span> |
        <a
          href="https://www.instagram.com/jtti.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:underline ml-1"
        >
          @Jtti.in
        </a>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer />
      
    </div>
  );
}

export default Login;

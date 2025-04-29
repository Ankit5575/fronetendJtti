import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://newportal.onrender.com/admin/login`, {
        email,
        password,
      });
      const { token } = res.data; // ✅ token mil raha hai backend se
      if (token) {
          localStorage.setItem('token', token); // ✅ token ko localStorage me save karo
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
}

export default AdminLogin;

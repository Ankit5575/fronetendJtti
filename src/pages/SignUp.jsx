import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUp() { 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [adharNumber, setAdharNumber] = useState("");
  const [fee, setFee] = useState("");
  const [course, setCourse] = useState("");
  const [months, setMonths] = useState("");  
  const [timing, setTiming] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const courses = ['Basic Computer', 'Web Development', 'Web Design', 'Tally Prime', 'Excel', 'ETEC'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("rollNumber", rollNumber);
    formData.append("adharNumber", adharNumber);
    formData.append("fee", fee);
    formData.append("course", course);
    formData.append("months", months);  
    formData.append("timing", timing);
    formData.append("photo", photo);

    try {
      const res = await axios.post("https://newportal.onrender.com/api/user/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("User registered successfully!");
        setTimeout(() => navigate("/welcome"), 2000);
      }
    } catch (error) {
      console.error(error);
      
      if (error.response) {
        if (error.response.data.message === "Roll Number already exists. Please use a different Roll Number.") {
          toast.error("Roll Number already exists!");
        } 
        else if (error.response.data.message === "Email already exists. Please use a different Email.") {
          toast.error("Email already exists!");
        } 
        else {
          toast.error("Registration failed. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPhotoPreview(fileURL);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {loading && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Sign Up for JTTI Portal</h1>
          <p className="text-gray-500">Create an account to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-600 font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

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
              placeholder="Must be Unique"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">Adhar Number</label>
            <input
              type="text"
              placeholder="Enter your 12-digit Aadhaar number"

               value={adharNumber}
              onChange={(e) => setAdharNumber(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">Fee</label>
            <input
              type="number"
              placeholder="Enter your fee"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">Course</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="">Select a course</option>
              {courses.map((courseOption, index) => (
                <option key={index} value={courseOption}>
                  {courseOption}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">Starting Month</label>
            <select
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">Timing</label>
            <select
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="">Select Timing</option>
              <option value="9-10 AM">9-10 AM</option>
              <option value="10-11 AM">10-11 AM</option>
              <option value="11-12 PM">11-12 PM</option>
              <option value="12-1 PM">12-1 PM</option>
              <option value="1-2 PM">1-2 PM</option>
              <option value="2-3 PM">2-3 PM</option>
              <option value="3-4 PM">3-4 PM</option>
              <option value="4-5 PM">4-5 PM</option>
              <option value="5-6 PM">5-6 PM</option>
              <option value="6-7 PM">6-7 PM</option>
              <option value="7-8 PM">7-8 PM</option>
              <option value="8-9 PM">8-9 PM</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">Photo</label>
            <input
              type="file"
              onChange={handlePhotoChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {photoPreview && (
            <div className="mt-4 relative">
              <h2 className="text-gray-700 font-medium">Uploaded Photo</h2>
              <img
                src={photoPreview}
                alt="Uploaded Preview"
                className="mt-2 w-32 h-32 object-cover rounded-full mx-auto"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-0 right-0 bg-gray-500 text-white rounded-full p-1"
              >
                &times;
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Sign Up
          </button>
          
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                className="text-indigo-600 hover:underline cursor-pointer font-semibold"
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
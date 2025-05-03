import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [adharNumber, setAdharNumber] = useState("");
  // const [fee, setFee] = useState("");
  const [course, setCourse] = useState("");
  const [months, setMonths] = useState("");
  const [timing, setTiming] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const courses = [
    "Basic Computer", "DCA", "Advanced Excel", "Photoshop", "CorelDraw",
    "Advaanced Basic", "ADC", "Typing English", "Typing Hindi",
    "Web Development", "Web Design", "Tally Prime", "Excel", "ETEC"
  ];

  // Load saved form data from localStorage
  useEffect(() => {
    const savedForm = JSON.parse(localStorage.getItem("signupForm"));
    if (savedForm) {
      setName(savedForm.name || "");
      setEmail(savedForm.email || "");
      setRollNumber(savedForm.rollNumber || "");
      setAdharNumber(savedForm.adharNumber || "");
      // setFee(savedForm.fee || "");
      setCourse(savedForm.course || "");
      setMonths(savedForm.months || "");
      setTiming(savedForm.timing || "");
      setPhone(savedForm.phone || "");
    }
  }, []);

  const updateFormField = (field, value) => {
    const currentForm = JSON.parse(localStorage.getItem("signupForm")) || {};
    currentForm[field] = value;
    localStorage.setItem("signupForm", JSON.stringify(currentForm));

    switch (field) {
      case "name": setName(value); break;
      case "email": setEmail(value); break;
      case "rollNumber": setRollNumber(value); break;
      case "adharNumber": setAdharNumber(value); break;
      // case "fee": setFee(value); break;
      case "course": setCourse(value); break;
      case "months": setMonths(value); break;
      case "timing": setTiming(value); break;
      case "phone": setPhone(value); break;
      default: break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side field validations
    if (!name || !email || !rollNumber || !adharNumber  || !course || !months || !timing || !phone || !photo) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    if (!/^\d{12}$/.test(adharNumber)) {
      toast.error("Aadhar number must be 12 digits.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be 10 digits.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("rollNumber", rollNumber);
    formData.append("adharNumber", adharNumber);
    // formData.append("fee", fee);
    formData.append("phone", phone);
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
        localStorage.removeItem("signupForm");
        setTimeout(() => navigate("/welcome"), 2000);
      }
    } catch (error) {
      const message = error.response?.data?.message;
      if (message) {
        if (message.toLowerCase().includes("aadhar")) {
          toast.error("Aadhar number already exists.");
        } else if (message.toLowerCase().includes("roll")) {
          toast.error("Roll number already exists.");
        } else if (message.toLowerCase().includes("email")) {
          toast.error("Email already exists.");
        } else {
          toast.error(message);
        }
      } else {
        toast.error("Something went wrong. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
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
          {[
            { label: "Name", value: name, field: "name", type: "text", placeholder: "Enter your full name" },
            { label: "Email Address", value: email, field: "email", type: "email", placeholder: "Enter your email" },
            { label: "Roll Number", value: rollNumber, field: "rollNumber", type: "text", placeholder: "Must be Unique" },
            { label: "Aadhar Number", value: adharNumber, field: "adharNumber", type: "text", placeholder: "Enter 12-digit Aadhaar number" },
            { label: "Phone Number", value: phone, field: "phone", type: "text", placeholder: "Enter 10-digit phone number" },
            // { label: "Fee", value: fee, field: "fee", type: "number", placeholder: "Enter fee amount" },
          ].map(({ label, value, field, type, placeholder }, i) => (
            <div key={i}>
              <label className="block mb-1 text-gray-600 font-medium">{label}</label>
              <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => updateFormField(field, e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
          ))}

          {/* Course Dropdown */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">Course</label>
            <select
              value={course}
              onChange={(e) => updateFormField("course", e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="">Select a course</option>
              {courses.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Starting Month and Timing */}
          {[
            {
              label: "Starting Month", value: months, field: "months", options: [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"]
            },
            {
              label: "Timing", value: timing, field: "timing", options: [
                "9-10 AM", "10-11 AM", "11-12 PM", "12-1 PM", "1-2 PM",
                "2-3 PM", "3-4 PM", "4-5 PM", "5-6 PM", "6-7 PM", "7-8 PM", "8-9 PM"]
            }
          ].map(({ label, value, field, options }, i) => (
            <div key={i}>
              <label className="block mb-1 text-gray-600 font-medium">{label}</label>
              <select
                value={value}
                onChange={(e) => updateFormField(field, e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="">Select {label}</option>
                {options.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          {/* Photo Upload */}
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

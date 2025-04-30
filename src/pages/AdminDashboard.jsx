import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     rollNumber: "",
//     adharNumber: "",       //mene 3 thing addd ki ek fromData mai aur ek algag fun handlefile wala aur 
                                  //fiel add ki hai 
//     course: "",
//     batch: "",
//     fee: "",
//   });
const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    adharNumber: "",
    course: "",
    batch: "",
    fee: "",
    photo: null,         // image ke liye
    certificate: null,   // certificate ke liye
    idCard: null,        // id card ke liye
  });
  

  // Filter states
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [availableBatches, setAvailableBatches] = useState([]);

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  // Update filtered users when users or filters change
  useEffect(() => {
    let result = users;

    // Apply course filter
    if (selectedCourse) {
      result = result.filter((user) => user.course === selectedCourse);
    }

    // Apply batch filter
    if (selectedBatch) {
      result = result.filter((user) => user.batch === selectedBatch);
    }

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.adharNumber.includes(searchTerm) ||
          user.rollNumber.includes(searchTerm) ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(result);

    // Update available batches when course changes
    if (selectedCourse) {
      const batches = [
        ...new Set(
          users
            .filter((user) => user.course === selectedCourse)
            .map((user) => user.batch)
        ),
      ];
      setAvailableBatches(batches);
      setSelectedBatch(""); // Reset batch when course changes
    } else {
      setAvailableBatches([]);
      setSelectedBatch("");
    }
  }, [users, selectedCourse, selectedBatch, searchTerm]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://newportal.onrender.com/api/user/all");
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://newportal.onrender.com/api/user/delete/${id}`);
  
      toast.success("User deleted successfully");
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user");
    }
  };
  
  
  // Edit user
  // const handleEdit = (user) => {
  //     setEditingUser(user._id);
  //     setFormData({
  //     name: user.name,
  //     email: user.email,
  //     rollNumber: user.rollNumber,
  //     adharNumber: user.adharNumber,
  //     course: user.course,
  //     batch: user.batch,
  //     fee: user.fee
  //     });
  //     // ${currentUser._id}
  // };
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      rollNumber: user.rollNumber || '',
      adharNumber: user.adharNumber || '',
      course: user.course || '',
      batch: user.batch || '',
      fee: user.fee || '',
      photo: user.photo || '', // Cloudinary या server URL
      certificate: user.certificate || '',
      idCard: user.idCard || '',
    });
  };
  

//   const handleUpdate = async (id) => {
//     try {
//       const token = localStorage.getItem("token");

//       // Check karo kya formData me koi file hai?
//       const hasFileUpload =
//         formData.photo || formData.certificate || formData.idCard;

//       let url = `http://localhost:8080/api/user/edit/${id}`;
//       let dataToSend = formData;
//       let config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       if (hasFileUpload) {
//         url = `http://localhost:8080/api/user/editFile/${id}`;

//         // Agar file hai to FormData banana padega
//         const fileFormData = new FormData();
//         if (formData.photo) fileFormData.append("photo", formData.photo);
//         if (formData.certificate)
//           fileFormData.append("certificate", formData.certificate);
//         if (formData.idCard) fileFormData.append("idCard", formData.idCard);

//         // Text fields bhi chaho to append kar sakte ho
//         if (formData.name) fileFormData.append("name", formData.name);
//         if (formData.course) fileFormData.append("course", formData.course);
//         if (formData.feeStatus)
//           fileFormData.append("feeStatus", formData.feeStatus);

//         dataToSend = fileFormData;

//         // Jab FormData bhejte ho tab header me 'Content-Type' mat set karo, browser khud kar deta hai
//         config.headers["Content-Type"] = "multipart/form-data";
//       }

//       await axios.put(url, dataToSend, config);

//       toast.success("User updated successfully");
//       setEditingUser(null);
//       fetchUsers();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to update user");
//     }
//   };
const handleSmartUpdate = async (id) => {
  const token = localStorage.getItem("token");

  // Check if any files are present
  const hasFiles = formData.photo || formData.certificate || formData.idCard;

  try {
    if (hasFiles) {
      const form = new FormData();
      if (formData.photo) form.append("photo", formData.photo);
      if (formData.certificate) form.append("certificate", formData.certificate);
      if (formData.idCard) form.append("idCard", formData.idCard);

      // Add regular fields
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("rollNumber", formData.rollNumber);
      form.append("adharNumber", formData.adharNumber);
      form.append("course", formData.course);
      form.append("batch", formData.batch);
      form.append("fee", formData.fee);

      await axios.put(
        `https://newportal.onrender.com/api/user/editFile/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't manually set content-type for FormData
          },
        }
      );
    } else {
      await axios.put(
        `https://newportal.onrender.com/api/user/edit/${id}`,
        {
          name: formData.name,
          email: formData.email,
          rollNumber: formData.rollNumber,
          adharNumber: formData.adharNumber,
          course: formData.course,
          batch: formData.batch,
          fee: formData.fee,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    toast.success("User updated successfully");
    setEditingUser(null);
    fetchUsers();
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update user");
  }
};

  
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setSelectedCourse("");
    setSelectedBatch("");
    setSearchTerm("");
  };
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setFormData({
  //     ...formData,
  //     feeFile: file,
  //   });
  // };
  // const handleFileChange = (e) => {
  //   const { name, files } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: files[0], // photo, idCard, certificate
  //   }));
  // };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
  
    if (file) {
      const previewUrl = URL.createObjectURL(file);
  
      setFormData((prev) => ({
        ...prev,
        [name]: file,
        [`${name}Preview`]: previewUrl, // e.g., photoPreview, idCardPreview, certificatePreview
      }));
    }
  };
  
  
  
  // Get unique courses from users
  const availableCourses = [...new Set(users.map((user) => user.course))];

  return (
    <div className="">
    <div className="container mx-auto px-4 py-8 ">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

      <div className="mb-8 bg-blue-950 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Student Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-gray-600">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-gray-600">Active Courses</p>
            <p className="text-2xl font-bold">{availableCourses.length}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <p className="text-gray-600">Total Fees</p>
            <p className="text-2xl font-bold">
              ₹{users.reduce((sum, user) => sum + (parseInt(user.fee) || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Courses</option>
              {availableCourses.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={!selectedBatch}
            >
              <option value="">All Batches</option>
              {availableBatches.map((batch, index) => (
                <option key={index} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="flex">
              <input
                type="text"
                placeholder=" Aadhar Number !"
                className="flex-grow p-2 border rounded-l"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={resetFilters}
                className="bg-gray-500 text-white px-3 py-2 rounded-r hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Roll No.</th>
              <th className="py-3 px-4 text-left">Aadhar No.</th>
              <th className="py-3 px-4 text-left">Course</th>
              <th className="py-3 px-4 text-left">Batch</th>
              <th className="py-3 px-4 text-left">Fee</th>
              <th className="py-3 px-4 text-left">Images</th>
              <th className="py-3 px-4 text-left">idCard</th>
              <th className="py-3 px-4 text-left">certificate</th>
                            {/* <th className="py-3 px-4 text-left">Roll No.</th> */}

            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">
                  {editingUser === user._id ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="p-1 border rounded"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="py-3 px-4">
                  {editingUser === user._id ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="p-1 border rounded"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="py-3 px-4">
                  {editingUser === user._id ? (
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      className="p-1 border rounded"
                    />
                  ) : (
                    user.rollNumber
                  )}
                </td>
                <td className="py-3 px-4">{user.adharNumber}</td>
                <td className="py-3 px-4">
                  {editingUser === user._id ? (
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className="p-1 border rounded"
                    >
                      {availableCourses.map((course, index) => (
                        <option key={index} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  ) : (
                    user.course
                  )}
                </td>
                <td className="py-3 px-4">
                  {editingUser === user._id ? (
                    <input
                      type="text"
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                      className="p-1 border rounded"
                    />
                  ) : (
                    user.batch
                  )}
                </td>
                <td className="py-3 px-4">
                  {editingUser === user._id ? (
                    <input
                      type="number"
                      name="fee"
                      value={formData.fee}
                      onChange={handleChange}
                      className="p-1 border rounded"
                    />
                  ) : (
                    `₹${user.fee}`
                  )}
                </td>
                {/* //for file uplod ;// */}
      {/* 📸 Photo column */}
<td className="py-3 px-4">
  {editingUser === user._id ? (
    <input
      type="file"
      name="photo"
      onChange={handleFileChange}
      className="p-1 border rounded"
    />
  ) : (
    user.photo ? <img src={user.photo} alt="Photo" className="w-10 h-10 object-cover rounded" /> : "No Photo"
  )}
</td>

{/* 🪪 ID Card column */}
<td className="py-3 px-4">
  {editingUser === user._id ? (
    <input
      type="file"
      name="idCard"
      onChange={handleFileChange}
      className="p-1 border rounded"
    />
  ) : (
    user.idCard ?  <img src={user.idCard} alt="idcard" className="w-10 h-10 object-cover rounded" /> : "No Photo"
  )}
  
</td>

{/* 📄 Certificate column */}
<td className="py-3 px-4">
  {editingUser === user._id ? (
    <input
      type="file"
      name="certificate"
      onChange={handleFileChange}
      className="p-1 border rounded"
    />
  ) : (
    user.certificate ?  <img src={user.certificate} alt="certificate" className="w-10 h-10 object-cover rounded" /> : "No Photo"
  )}
  
</td>


                   
                <td className="py-3 px-4 space-x-2">
                  {editingUser === user._id ? (
                    <>
                      <button
                        onClick={() => handleSmartUpdate(user._id)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default AdminDashboard;

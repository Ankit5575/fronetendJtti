import { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://newportal.onrender.com/api/user/all")
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUsers(data.users);
        }
      })
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">All Users</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex flex-col items-center">
              <img 
                src={user.photo} 
                alt={user.name} 
                className=" "
              />
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p><strong>Roll No:</strong> {user.rollNumber}</p>
              <p><strong>Aadhar No:</strong> {user.adharNumber}</p>
              <p><strong>Fee:</strong> 
                <span className={`ml-2 font-bold ${user.fee === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                  {user.fee}
                </span>
              </p>
              <p><strong>Course:</strong> {user.course}</p>
            </div>

            <div className="mt-4 space-y-2">
              {user.idCard && (
                <a 
                  href={user.idCard} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-blue-500 hover:underline"
                >
                  View ID Card
                </a>
              )}
              {user.certificate && (
                <a 
                  href={user.certificate} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-green-500 hover:underline"
                >
                  View Certificate
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;

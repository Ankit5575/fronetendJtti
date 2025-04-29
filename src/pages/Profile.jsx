import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));

    if (!userInfo) {
      navigate("/");
    } else {
      // Simulate loading for better UX                              //last edit 2025 by ankitsingh557
      setTimeout(() => {
        setUser(userInfo);
        setIsLoading(false);
      }, 800);
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="mt-4 text-xl font-medium text-gray-700">Loading your profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="">

   
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-8">
          
          <h1 className="text-3xl font-bold text-gray-800">JTTI STUDENT PROFILE</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Profile Header with background */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 sm:p-8 text-black">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <img
                  src={user.photo}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {user.fee === 'Paid' && (
                  <div className="absolute bottom-0 right-0 bg-green-500 text-blue-700 rounded-full p-1 shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold">{user.name}</h2>
                <p className="text-indigo-100">{user.email}</p>
                <p className="mt-2 bg-white bg-opacity-20 rounded-full px-4 py-1 inline-flex items-center text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  {user.course} Student
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h3>
              <DetailItem label="Roll Number" value={user.rollNumber} />
              <DetailItem label="Aadhar Number" value={user.adharNumber} />
              <DetailItem label="Course" value={user.course} />
            </div>

            {/* Academic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Academic Details</h3>
              <DetailItem 
                label="Fee Status" 
                value={user.fee} 
                valueClass={user.fee === 'Paid' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'} 
              />
              <DetailItem label="Months" value={user.months} />
               <DetailItem label="Class Timing" value={user.timing} />
            </div>

            {/* Documents */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DocumentItem 
                  label="Certificate" 
                  value={user.certificate} 
                  type="download" 
                  color="indigo"
                />
                <DocumentItem 
                  label="ID Card" 
                  value={user.idCard} 
                  type="view" 
                  color="purple"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 sm:px-8 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => {
                localStorage.removeItem("user");
                navigate("/");
              }}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

// Reusable Detail Item Component
function DetailItem({ label, value, valueClass = "text-gray-600" }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500 font-medium">{label}:</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

// Reusable Document Item Component
function DocumentItem({ label, value, type, color = "indigo" }) {
  const colorClasses = {
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      hover: "hover:bg-indigo-100",
      icon: "text-indigo-500"
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      hover: "hover:bg-purple-100",
      icon: "text-purple-500"
    }
  };

  return (
    <div className={`${colorClasses[color].bg} p-4 rounded-lg`}>
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-700">{label}</span>
        {value ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${colorClasses[color].text} ${colorClasses[color].hover} transition-colors`}
          >
            {type === 'download' ? (
              <>
                <svg className={`w-4 h-4 mr-1 ${colorClasses[color].icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </>
            ) : (
              <>
                <svg className={`w-4 h-4 mr-1 ${colorClasses[color].icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </>
            )}
          </a>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-50 text-amber-600">
            <svg className="w-4 h-4 mr-1 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Coming Soon
          </span>
        )}
      </div>
    </div>
  );
}

export default Profile;
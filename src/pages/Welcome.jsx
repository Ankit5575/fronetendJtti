import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 animate-gradient-x">
      <div className="bg-white bg-opacity-90 shadow-2xl rounded-2xl p-8 w-full max-w-lg text-center transform transition-all hover:scale-105 duration-300">
        <div className="mb-6 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 mb-4">
          Welcome to JTTI Student
        </h1>
        <p className="text-lg text-gray-600 mb-8 animate-pulse">
          User registered successfully! 🎉
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Continue to Login
        </button>
      </div>
    </div>
  );
}

export default Welcome;
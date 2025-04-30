import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import successAnimation from '../assets/ani2.json'; // Make sure this path is correct

function Welcome() {
  const navigate = useNavigate();
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const funFacts = [
    "Did you know? The average person spends 6 months of their life waiting for red lights to turn green.",
    "JTTI students have solved over 10,000 real-world problems through their projects!",
    "The brain processes visuals 60,000 times faster than text - that's why our interface is so visual!",
    "Over 85% of JTTI graduates land jobs within 3 months of completing their program.",
    "The first computer programmer was a woman named Ada Lovelace in the 1840s!",
    "Typing on a keyboard for one hour burns approximately 100 calories - keep coding!",
    "JTTI's curriculum is updated every 6 months to keep pace with industry trends."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prevIndex) =>
        prevIndex === funFacts.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 animate-gradient-x">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="bg-white bg-opacity-90 shadow-2xl rounded-2xl p-8 w-full max-w-lg text-center overflow-hidden"
      >
        {/* Animated Confetti Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24'][Math.floor(Math.random() * 4)],
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ y: -100, opacity: 0 }}
              animate={{
                y: [0, 1000],
                opacity: [1, 0],
                x: Math.random() > 0.5 ? [0, 100] : [0, -100]
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* ✅ Replaced tick SVG with Lottie animation */}
          <div className="mb-6">
            <Lottie
              animationData={successAnimation}
              loop={false}
              autoplay={true}
              style={{ height: 120, width: 120, margin: "0 auto" }}
            />
          </div>

          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 mb-4">
            Welcome to JTTI Student
          </h1>

          <p className="text-red-600 font-bold uppercase text-center mt-4">
            Don't forget to verify your Gmail and Roll Number!
          </p>

          <p className="text-lg text-gray-600 mb-6">
            User registered successfully! 🎉
          </p>

          {/* Fun Facts Carousel */}
          <div className="min-h-[100px] mb-8 relative overflow-hidden">
            {funFacts.map((fact, index) => (
              <motion.div
                key={index}
                className="absolute top-0 left-0 right-0 p-4 bg-indigo-50 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: index === currentFactIndex ? 1 : 0,
                  y: index === currentFactIndex ? 0 : 20
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mt-1 mr-2 text-indigo-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-700 text-left">{fact}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg overflow-hidden"
          >
            <span className="relative z-10">Continue to Login</span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <div className="mt-6 text-sm text-gray-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Your data is securely encrypted
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Welcome;

  import React, { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { motion } from 'framer-motion';

  function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const userName = localStorage.getItem('name') || "Quiz Master"; // Default name if not found

    useEffect(() => {
      fetch('https://opentdb.com/api.php?amount=10&category=18&type=multiple')
        .then((res) => res.json())
        .then((data) => {
          const shuffledQuestions = data.results.map((q) => ({
            ...q,
            answers: shuffle([...q.incorrect_answers, q.correct_answer]),
          }));
          setQuestions(shuffledQuestions);
        });
    }, []);

    function shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    }

    const handleAnswer = (qIndex, answer) => {
      setUserAnswers({ ...userAnswers, [qIndex]: answer });
    };

    const handleSubmit = () => {
      setIsSubmitting(true);
      setTimeout(() => {
        let correct = 0;
        questions.forEach((q, index) => {
          if (userAnswers[index] === q.correct_answer) {
            correct++;
          }
        });
        setScore(correct);
        setShowResult(true);
        setIsSubmitting(false);
      }, 1000); // Simulate processing delay
    };

    const goBack = () => {
      navigate('/profile');
    };

    // Animation variants
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    };

    const questionVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.5
        }
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-800">Quiz Challenge</h1>
            <div className="bg-indigo-100 px-4 py-2 rounded-full">
              <span className="font-medium text-indigo-700">Player: {userName}</span>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`space-y-6 ${showResult ? 'filter blur-sm' : ''}`}
          >
            {questions.map((q, index) => (
              <motion.div 
                key={index} 
                variants={questionVariants}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 
                  className="font-semibold text-lg mb-4 text-gray-800"
                  dangerouslySetInnerHTML={{ __html: `${index + 1}. ${q.question}` }} 
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.answers.map((answer, i) => (
                    <label 
                      key={i} 
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all 
                        ${userAnswers[index] === answer ? 
                          'bg-indigo-100 border-2 border-indigo-400' : 
                          'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'}`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={answer}
                        checked={userAnswers[index] === answer}
                        onChange={() => handleAnswer(index, answer)}
                        className="hidden"
                      />
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mr-3 
                        ${userAnswers[index] === answer ? 
                          'border-indigo-600 bg-indigo-600' : 
                          'border-gray-400'}`}></span>
                      <span 
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: answer }} 
                      />
                    </label>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {!showResult && (
            <div className="text-center mt-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(userAnswers).length !== questions.length}
                className={`px-8 py-3 rounded-full text-lg font-semibold shadow-md transition-all
                  ${isSubmitting ? 'bg-indigo-400' : 
                    Object.keys(userAnswers).length === questions.length ? 
                    'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg' : 
                    'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Submit Quiz'}
              </motion.button>
              <p className="mt-3 text-gray-500">
                {Object.keys(userAnswers).length} of {questions.length} questions answered
              </p>
            </div>
          )}
        </motion.div>

        {/* Result Modal */}
        {showResult && (
          <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
                <p className="text-lg text-gray-600 mb-6">Here's how you did:</p>
                
                <div className="bg-indigo-50 rounded-xl p-6 mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Player:</span>
                    <span className="font-bold text-indigo-700">{userName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Score:</span>
                    <span className="text-2xl font-bold text-indigo-700">
                      {score} <span className="text-gray-500">/</span> {questions.length}
                    </span>
                  </div>
                  
                  <div className="mt-4 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                      style={{ width: `${(score / questions.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-right mt-1 text-sm text-gray-500">
                    {Math.round((score / questions.length) * 100)}% correct
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goBack}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
                >
                  Back to Profile
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  export default Quiz;
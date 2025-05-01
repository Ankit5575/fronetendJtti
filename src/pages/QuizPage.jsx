import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function QuizPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (state) {
      setQuiz(state.quiz);
      setUser(state.user);
      setAnswers(Array(state.quiz.questions.length).fill(null));
      setLoading(false);
      
      // Optional: Add timer if quiz has time limit
      if (state.quiz.timeLimit) {
        setTimeRemaining(state.quiz.timeLimit * 60); // convert minutes to seconds
      }
    } else {
      // Handle case where user navigates directly to this page
      navigate('/');
    }
  }, [state, navigate]);

  useEffect(() => {
    let timer;
    if (timeRemaining > 0 && !submitted) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeRemaining, submitted]);

  const handleSelect = (qIndex, optionIndex) => {
    if (submitted) return;
    const updated = [...answers];
    updated[qIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    if (submitted) return;
    
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctOption) {
        correct++;
      }
    });
    setScore(correct);
    setSubmitted(true);
  };

  const restartQuiz = () => {
    setAnswers(Array(quiz.questions.length).fill(null));
    setSubmitted(false);
    setScore(0);
    if (quiz.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Quiz Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{quiz.title}</h1>
              <p className="text-blue-100 mt-1">{quiz.description}</p>
            </div>
            {timeRemaining > 0 && (
              <div className="bg-white text-blue-800 px-3 py-1 rounded-full font-semibold">
                Time: {formatTime(timeRemaining)}
              </div>
            )}
          </div>
          {user && (
            <div className="mt-4 text-sm text-blue-100">
              Participant: <span className="font-medium">{user.name}</span>
            </div>
          )}
        </div>

        {/* Quiz Content */}
        <div className="p-6">
          {quiz.questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-8 last:mb-0">
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  {qIndex + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg text-gray-800 mb-3">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = answers[qIndex] === optIndex;
                      const isCorrect = q.correctOption === optIndex;
                      const isWrong = isSelected && !isCorrect;

                      return (
                        <div
                          key={optIndex}
                          className={`p-3 border rounded-lg transition-all cursor-pointer
                            ${!submitted && isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                            ${submitted && isCorrect ? 'border-green-500 bg-green-50' : ''}
                            ${submitted && isWrong ? 'border-red-500 bg-red-50' : ''}
                            hover:shadow-sm
                          `}
                          onClick={() => handleSelect(qIndex, optIndex)}
                        >
                          <div className="flex items-start">
                            <div className={`w-5 h-5 rounded-full border flex-shrink-0 mt-0.5 mr-3
                              ${!submitted && isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                              ${submitted && isCorrect ? 'border-green-500 bg-green-500' : ''}
                              ${submitted && isWrong ? 'border-red-500' : ''}
                            `}>
                              {((!submitted && isSelected) || (submitted && isCorrect)) && (
                                <div className="w-full h-full flex items-center justify-center text-white">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    {!submitted || isCorrect ? (
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    ) : (
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    )}
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className={`${submitted && isCorrect ? 'font-medium text-green-700' : ''} ${submitted && isWrong ? 'font-medium text-red-700' : ''}`}>
                              {opt}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {!submitted ? (
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={answers.every(a => a === null)}
                  className={`px-6 py-3 rounded-lg font-medium text-white transition-all
                    ${answers.every(a => a === null) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                  `}
                >
                  Submit Quiz
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</div>
                  <div className="text-xl">
                    Your score: <span className="font-bold text-blue-600">{score}</span> out of <span className="font-medium">{quiz.questions.length}</span>
                  </div>
                  <div className="mt-2 text-gray-600">
                    {score === quiz.questions.length ? 'Perfect score! 🎉' : 
                     score >= quiz.questions.length * 0.8 ? 'Great job! 👍' : 
                     score >= quiz.questions.length * 0.5 ? 'Good effort! 💪' : 
                     'Keep practicing! 📚'}
                  </div>
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => navigate('/profile')}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-gray-800 transition-all"
                  >
                    Back to Profile
                  </button>
                  <button
                    onClick={restartQuiz}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-all"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
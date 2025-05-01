import React, { useEffect, useState } from 'react';
import axios from 'axios';

const courseList = [
  'Basic Computer',
  'Web Development',
  'Web Design',
  'Tally Prime',
  'Excel',
  'ETEC'
];                         //4 bar link change kiya ha ? 

const AdminCreateQuiz = () => {
  const [course, setCourse] = useState('');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [existingQuizId, setExistingQuizId] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch quiz on course selection
  useEffect(() => {
    if (!course) return;

    setLoading(true);
    axios
      .get(`https://newportal.onrender.com/admin/quiz/course/${course}`)
      .then((res) => {
        if (res.data.quiz) {
          const quiz = res.data.quiz;
          setTitle(quiz.title);
          setQuestions(quiz.questions);
          setExistingQuizId(quiz._id);
          setIsLive(quiz.isLive || false);
        } else {
          resetForm();
        }
      })
      .catch(() => {
        resetForm();
      })
      .finally(() => setLoading(false));
  }, [course]);

  const resetForm = () => {
    setTitle('');
    setQuestions([]);
    setExistingQuizId(null);
    setIsLive(false);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], correctOption: 0 }
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    if (!title || !course) {
      setMessage('Please select a course and enter a title');
      return;
    }
    if (questions.length < 1) {
      setMessage('Please add at least one question');
      return;
    }

    // Validate all questions and options
    for (const q of questions) {
      if (!q.question.trim()) {
        setMessage('All questions must have text');
        return;
      }
      for (const opt of q.options) {
        if (!opt.trim()) {
          setMessage('All options must be filled');
          return;
        }
      }
    }

    setLoading(true);
    try {
      let res;
      if (existingQuizId) {
        res = await axios.put(
          `https://newportal.onrender.com/admin/quiz/${existingQuizId}`,
          { title, course, questions, isLive }
        );
      } else {
        res = await axios.post(`https://newportal.onrender.com/admin/quiz`, {
          title,
          course,
          questions,
          isLive
        });
      }

      setMessage(res.data.msg);
      setExistingQuizId(res.data.quiz._id);
    } catch (err) {
      setMessage(err?.response?.data?.error || 'Failed to save quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLive = async () => {
    if (!existingQuizId) {
      setMessage('Please save the quiz before toggling live status');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(`https://newportal.onrender.com/admin/quiz/toggle`, {
        quizId: existingQuizId,
        isLive: !isLive
      });

      setIsLive(res.data.quiz.isLive);
      setMessage(`Quiz is now ${res.data.quiz.isLive ? 'Live' : 'Offline'}`);
    } catch (err) {
      setMessage(err?.response?.data?.error || 'Failed to toggle quiz status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 text-white">
          <h2 className="text-2xl font-bold">Quiz Management</h2>
          <p className="text-blue-100 mt-1">
            {existingQuizId ? 'Update existing quiz' : 'Create new quiz'}
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Course Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Course
            </label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              disabled={loading}
            >
              <option value="">-- Select Course --</option>
              {courseList.map((c, idx) => (
                <option key={idx} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Quiz Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Title
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              disabled={loading}
            />
          </div>

          {/* Status and Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
              <p className="text-sm text-gray-500">
                {questions.length} question{questions.length !== 1 ? 's' : ''} added
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleToggleLive}
                disabled={loading || !existingQuizId}
                className={`px-4 py-2 rounded-lg font-medium text-white transition-all flex items-center gap-2
                  ${isLive ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'}
                  ${(loading || !existingQuizId) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isLive ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Live
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    Offline
                  </>
                )}
              </button>
              <button
                onClick={handleAddQuestion}
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-all flex items-center gap-2
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Question
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4 mb-6">
            {questions.map((q, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder={`Question ${idx + 1}`}
                      className="flex-1 p-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                      value={q.question}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[idx].question = e.target.value;
                        setQuestions(updated);
                      }}
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveQuestion(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  {q.options.map((opt, i) => (
                    <div key={i} className="flex items-center">
                      <span className="mr-2 font-medium text-gray-600 w-5">{String.fromCharCode(65 + i)}.</span>
                      <input
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[idx].options[i] = e.target.value;
                          setQuestions(updated);
                        }}
                        disabled={loading}
                      />
                    </div>
                  ))}
                </div>

                <select
                  value={q.correctOption}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[idx].correctOption = parseInt(e.target.value);
                    setQuestions(updated);
                  }}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value={0}>Correct Answer: A</option>
                  <option value={1}>Correct Answer: B</option>
                  <option value={2}>Correct Answer: C</option>
                  <option value={3}>Correct Answer: D</option>
                </select>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading || !title || !course || questions.length === 0}
              className={`px-6 py-3 rounded-lg font-medium text-white transition-all flex items-center gap-2
                ${(loading || !title || !course || questions.length === 0) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {existingQuizId ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  {existingQuizId ? 'Update Quiz' : 'Create Quiz'}
                </>
              )}
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg ${message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCreateQuiz;
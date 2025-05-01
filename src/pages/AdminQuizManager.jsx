// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const courseList = [
//   'Basic Computer',
//   'Web Development',
//   'Web Design',
//   'Tally Prime',
//   'Excel',
//   'ETEC'
// ];

// const AdminQuizManager = () => {
//   const [course, setCourse] = useState('');
//   const [title, setTitle] = useState('');
//   const [questions, setQuestions] = useState([]);
//   const [existingQuizId, setExistingQuizId] = useState(null);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     if (!course) return;

//     // Check if quiz exists for selected course
//     axios.get(`http://localhost:5000/api/quizzes/course/${course}`)
//       .then(res => {
//         if (res.data.quiz) {
//           const quiz = res.data.quiz;
//           setTitle(quiz.title);
//           setQuestions(quiz.questions);
//           setExistingQuizId(quiz._id);
//         } else {
//           setTitle('');
//           setQuestions([]);
//           setExistingQuizId(null);
//         }
//       })
//       .catch(() => {
//         setTitle('');
//         setQuestions([]);
//         setExistingQuizId(null);
//       });
//   }, [course]);

//   const handleAddQuestion = () => {
//     setQuestions([...questions, {
//       question: '',
//       options: ['', '', '', ''],
//       correctOption: 0
//     }]);
//   };

//   const handleSubmit = async () => {
//     if (!title || !course || questions.length < 10) {
//       alert('Please fill course, title, and at least 10 questions.');
//       return;
//     }

//     try {
//       const res = await axios.post('http://localhost:5000/api/quizzes', {
//         title,
//         course,
//         questions
//       });

//       setMessage(res.data.msg);
//       setExistingQuizId(res.data.quiz._id);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to save quiz');
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Admin Quiz Manager</h2>

//       <label className="block mb-1">Select Course</label>
//       <select
//         value={course}
//         onChange={(e) => setCourse(e.target.value)}
//         className="w-full p-2 border rounded mb-4"
//       >
//         <option value="">-- Select Course --</option>
//         {courseList.map((c, idx) => (
//           <option key={idx} value={c}>{c}</option>
//         ))}
//       </select>

//       <label className="block mb-1">Quiz Title</label>
//       <input
//         type="text"
//         className="w-full p-2 border rounded mb-4"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         placeholder="Enter quiz title"
//       />

//       <h3 className="text-lg font-semibold mb-2">Questions</h3>
//       {questions.map((q, idx) => (
//         <div key={idx} className="mb-4 border p-3 rounded">
//           <input
//             type="text"
//             placeholder={`Question ${idx + 1}`}
//             className="w-full p-2 border rounded mb-2"
//             value={q.question}
//             onChange={(e) => {
//               const updated = [...questions];
//               updated[idx].question = e.target.value;
//               setQuestions(updated);
//             }}
//           />
//           {q.options.map((opt, i) => (
//             <input
//               key={i}
//               type="text"
//               placeholder={`Option ${i + 1}`}
//               className="w-full p-2 border rounded mb-1"
//               value={opt}
//               onChange={(e) => {
//                 const updated = [...questions];
//                 updated[idx].options[i] = e.target.value;
//                 setQuestions(updated);
//               }}
//             />
//           ))}
//           <label>Select Correct Option:</label>
//           <select
//             value={q.correctOption}
//             onChange={(e) => {
//               const updated = [...questions];
//               updated[idx].correctOption = parseInt(e.target.value);
//               setQuestions(updated);
//             }}
//             className="w-full p-2 border rounded"
//           >
//             <option value={0}>Option A</option>
//             <option value={1}>Option B</option>
//             <option value={2}>Option C</option>
//             <option value={3}>Option D</option>
//           </select>
//         </div>
//       ))}

//       <button onClick={handleAddQuestion} className="bg-blue-500 text-white px-4 py-2 rounded mr-4">
//         Add Question
//       </button>

//       <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
//         {existingQuizId ? 'Update Quiz' : 'Create Quiz'}
//       </button>

//       {message && <p className="mt-4 text-green-600">{message}</p>}
//     </div>
//   );
// };

// export default AdminQuizManager;

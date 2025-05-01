import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import UserList from "./compoents/UserList";
import SignUp from "./pages/SignUp";
import Welcome from "./pages/Welcome";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Quiz from "./pages/Quiz";
import AdminCreateQuiz from "./pages/AdminCreateQuiz";
import QuizPage from "./pages/QuizPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sinup" element={<SignUp/>} />
        <Route path="/welcome" element={<Welcome/>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* <Route path="/quiz" element={<Quiz />} /> */}
        <Route path="/quiz" element={<QuizPage/>} />
        

      </Routes>

{/* //admin routes  */}
<Routes>
  <Route path="/admin/user" element= {<UserList/>}  />
  <Route path="/admin/create-quiz" element={<AdminCreateQuiz/>} /> 
</Routes>



    </Router>

  );
}

export default App;

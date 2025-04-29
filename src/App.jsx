import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import UserList from "./compoents/UserList";
import SignUp from "./pages/SignUp";
import Welcome from "./pages/Welcome";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

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
      </Routes>

{/* //admin routes  */}
<Routes>
  <Route path="/admin/user" element= {<UserList/>}  /> 
</Routes>



    </Router>

  );
}

export default App;

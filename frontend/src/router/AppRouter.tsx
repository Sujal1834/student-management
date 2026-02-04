import { Routes, Route } from "react-router-dom";
import Course from "../components/Course";
import Student from "../pages/Student";
import Createcourse from "../components/Createcourse";
// import Createstudent from "../components/Createstudent";
import Header from "../components/Header";
import Home from "../components/Home";
import Login from "../components/Login";
// import Pagination from "../components/Pagination";
import Profile from "../components/Profile";
import Assignment from "../pages/Assignment";
import StudentAssignment from "../components/StudentAssignment";
import ResetPassword from "../components/ResetPassword";
import QuizPage from "../pages/QuizPage";
import QuizManager from "../pages/QuizManager";
import AttendanceTable from "../components/AttendanceTable";
import AttendancePage from "../pages/AttendancePage";
import StudentAttendancePage from "../pages/StudentAttendancePage";
import Footer from "../components/Footer";

const AppRouter = () => {
  return (
    <Routes>

      {/* Default route */}
      <Route path="/" element={<><Header /><Home /><Footer /></>} />

      {/* Course list */}
      <Route path="/course" element={<><Header /><Course /></>} />

      {/* Create course */}
      <Route path="/course/create" element={<><Header /><Createcourse /></>} />

      {/* student list */}
      <Route path="/student" element={<><Header /><Student /></>} />

      {/* login form */}
      <Route path="/login" element={<><Header /><Login /></>} />

      {/* profile page */}
      <Route path="/profile" element={<><Header /><Profile /></>} />

      {/* student assignment page */}
      <Route path="/student/assignment" element={<><Header /><StudentAssignment /></>} />

      {/* 404 */}
      <Route path="*" element={<h2>404 - Page Not Found</h2>} />

      {/* assignment page */}
      <Route path="/assignment" element={<><Header /><Assignment /></>} />

      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* student quiz */}
      <Route path="/quiz" element={<><Header /><QuizPage /></>} />

      {/* faculty quiz */}
      <Route path="/faculty/quiz/:quizId?" element={<><Header /><QuizManager /></>} />

      <Route path="/attendance" element={<><Header /><AttendancePage /></>} />

      <Route path="/student/attendance" element={<><Header /><StudentAttendancePage /></>} />
      {/* <Route path="/test" element={<><Header /><AttendanceTable/></>} /> */}
      {/* Create student */}
      {/* <Route path="/student/create" element={<><Header /><Createstudent/></>} /> */}
      {/* <Route path="/page" element={<><Pagination /></>} /> */}
      {/* Update course (dynamic id) */}
      {/* <Route path="/courses/edit/:id" element={<UpdateCourse />} /> */}


    </Routes>
  );
};

export default AppRouter;

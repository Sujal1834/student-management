import { useState } from "react";
import StudentAttendance from "../components/studentatendance/StudentAttendance"
import StudentFullAttendance from "../components/studentatendance/StudentFullAttendance";
import "../styles/StudentAttendance.css";

const StudentAttendancePage = () => {

  return (
    <div className="student-attendance-page">
      <StudentFullAttendance />
      <StudentAttendance/>
    </div>
  );
};

export default StudentAttendancePage;

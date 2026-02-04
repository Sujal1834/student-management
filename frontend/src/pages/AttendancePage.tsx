import React, { useEffect, useState } from "react";
// import { useStudents } from "../hooks/useStudents";
import AttendanceTable from "../components/AttendanceTable";
import axios from "axios";
import "../styles/Attendance.css"

const AttendancePage: React.FC = () => {
  const token = localStorage.getItem("access_token");
  const login_id = Number(localStorage.getItem("login_id"));
  const [students,setStudents] = useState([])
  const [courses,setCourses] = useState([])
  const [courseId,setCourseId] = useState<string>("")

  // Fetch all students for attendance
//   const { students } = useStudents(token);

  useEffect(() => {
    const fetchdata = async() => {
            const res =await axios.get("http://127.0.0.1:8000/student/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(res)
            setStudents(res.data)
        }
    fetchdata()
  },[])

  // useEffect(()=> {
  //   const fetchsearch = async() => {
  //           const res =await axios.get(`http://127.0.0.1:8000/student/search/?course_id=${courseId}&`, {
  //               headers: { Authorization: `Bearer ${token}` },
  //           });
  //           console.log(res.data)
  //           setFilterStudents(res.data)
  //         }

  //   if(courseId)
  //   {
  //     fetchsearch()
  //   }
  // },[courseId])

  useEffect(() => {
      fetch("http://127.0.0.1:8000/course/")
        .then(res => res.json())
        .then(setCourses)
        .catch(console.error);
    }, []);

  return (
    <div className="attendance-page" style={{ padding: "20px 100px" }}>
      <div className="attendance-header">
        <h2>Mark Attendance</h2>  
        {/* <select
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">No Course</option>
          {courses.map((c) => (
            <option key={c[0]} value={c[0]}>
              {c[1]}
            </option>
          ))}
        </select> */}
      </div>
      <AttendanceTable students={students} facultyId={login_id} />
    </div>
  );
};

export default AttendancePage;

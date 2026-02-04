// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const StudentFullAttendance = () => {
//   const token = localStorage.getItem("access_token");
//   const studentId = localStorage.getItem("login_id");
//   const [rows, setRows] = useState<any[]>([]);

//   useEffect(() => {
//     axios
//       .get("http://127.0.0.1:8000/student/attendance/history/", 
//         {
//             headers: { Authorization: `Bearer ${token}` },
//             params: { student_id: studentId },
//         })
//        .then((res) => setRows(res.data));
//   }, []);

//   return (
//     <div style={{ padding: 30 }}>
//       <h2>Attendance History</h2>

//       <table border={1} cellPadding={8}>
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Course</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((r, i) => (
//             <tr key={i}>
//               <td>{r.date}</td>
//               <td>{r.course_name}</td>
//               <td>{r.status === "P" ? "Present" : "Absent"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default StudentFullAttendance;
import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "./CircularProgress";

const StudentFullAttendance = () => {
  const token = localStorage.getItem("access_token");
  const student_id = localStorage.getItem("login_id");
  const [data, setData] = useState<any>(null);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/student/attendance/history", {
        headers: { Authorization: `Bearer ${token}` },
        params: { student_id,year },
      })
      .then((res) => setData(res.data));
  }, [year]);

  if (!data) return null;

  return (
    <div className="annual-attendance-card">
        <h3>Annual Attendance</h3>

        <CircularProgress percentage={data.percentage}/>

        <p>Total Lectures: <strong>{data.total_lectures}</strong></p>
        <p>Present: <strong>{data.present}</strong></p>
        <h2 className={data.percentage > 75 ? "green-percentage" : "red-percentage"}>{data.percentage}%</h2>
        <p>{data.percentage < 75 && (
          `Your current attendance is ${data.percentage}%, which is below the minimum required attendance of 75%.`
        )}</p>
    </div>

  );
};

export default StudentFullAttendance;

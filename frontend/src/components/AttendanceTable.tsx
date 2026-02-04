import React, { useState,useEffect } from "react";
import axios from "axios";
import Toast from "./Toast";

interface Props {
  students: any[];      // because backend sends array-of-arrays
  facultyId: number;
}

const AttendanceTable: React.FC<Props> = ({ students, facultyId }) => {
  // attendance state: { student_id: "P" | "A" }
  const [attendance, setAttendance] = useState<Record<number, "P" | "A">>({});

  const [toast, setToast] = useState<{
      id: number;
      type: "success" | "error" | "warning" | "info";
      message: string;
    } | null>(null);

  const showToast = (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    setToast({
      id: Date.now(), // 👈 forces re-render every time
      type,
      message,
    });
  };

 useEffect(() => {
  const init: Record<number, "P" | "A"> = {};

    students.forEach((s) => {
        const student_id = s[0]; // ✅ correct index
        init[student_id] = "A";  // default Absent
    });

    setAttendance(init);
    }, [students]);


  const handleCheckboxChange = (studentId: number, checked: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: checked ? "P" : "A",
    }));
  };

  const handleSubmit = async () => {
    try {
      for (const s of students) {
        const student_id = s[0];
        const course_id = s[6];

        const res = await axios.post(
          "http://127.0.0.1:8000/faculty/attendance/create/",
          {
            student_id: student_id,
            faculty_id: facultyId,
            course_id: course_id,
            status: attendance[student_id] ?? "A",
          }
        )
      }
        const reset: Record<number, "P" | "A"> = {};
        students.forEach((s) => {
        reset[s[0]] = "A";
        });
        setAttendance(reset);
        showToast("success","Attendance Marked...")
    } catch (error:any) {
      console.error(error.response.data.error);
      showToast("error",error.response?.data?.error)
    }
  };

  return (
    <>
    {toast && <Toast key={toast.id}  type={toast.type as any} message={toast.message} onClose={() => setToast(null)} />}
    <div className="attendance-container">
  <table className="attendance-table">
    <thead>
      <tr>
        <th>Student ID</th>
        <th>Name</th>
        <th>Course ID</th>
        <th>Present</th>
      </tr>
    </thead>
    <tbody>
      {students.map((s, idx) => (
        <tr key={idx}>
          <td>{s[0]}</td>
          <td>{s[2]}</td>
          <td>{s[6]}</td>
          <td>
            <input
              type="checkbox"
              className="attendance-checkbox"
              checked={attendance[s[0]] === "P"}
              onChange={(e) =>
                handleCheckboxChange(s[0], e.target.checked)
              }
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  <button className="attendance-submit" onClick={handleSubmit}>
    Mark Attendance
  </button>
</div>
</>
  );
};

export default AttendanceTable;

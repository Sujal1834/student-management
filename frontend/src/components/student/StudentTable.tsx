import React from "react";

type Props = {
  students: any[];
  onEdit: (student: any) => void;
  onConfirmToggle: (student: any) => void;
  onConfirmCount: (student: any) => void;
};

const StudentTable = ({ students, onEdit, onConfirmToggle, onConfirmCount }: Props) => {
  const isToday = (dateStr: string | null) => {
    if (!dateStr) return false;

    const date = new Date(dateStr);
    const today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  return (
    <>
    <table className="student-table">
      <thead>
        <tr>
          <th>Roll No</th>
          <th>Name</th>
          <th>Email</th>
          <th>DOB</th>
          <th>Gender</th>
          <th>Course</th>
          <th>Today Active</th>
          <th>Actions</th>
          <th>status</th>
        </tr>
      </thead>

      <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan={7} className="no-data">
              No students found
            </td>
          </tr>
        ) : (
          students.map((s, index) => (
            <tr key={index}>
              <td>{s.roll_no}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.dob}</td>
              <td>{s.gender}</td>
              <td>{s.course_id}</td>
              <td>{isToday(s.last_login) ? (
                  <span style={{ color: "green" }}> 🟢 Active</span>
                ) : (
                  <span style={{ color: "red" }}> 🔴 Not Active</span>
                )}
                </td>
              <td>
                <button
                  className="btn update-btn"
                  onClick={() => onEdit(s)}
                >
                  Update
                </button>
                {/* <button className="btn delete-btn"
                > 
                  Delete 
                </button> */}
                 <button
                    className={s.is_active ? "btn disable-btn" : "btn enable-btn"}
                    onClick={() => onConfirmToggle(s)}
                  >
                    {s.is_active ? "Disable" : "Enable"}
                </button>
              </td>
              <td>
                {/* <button
                    className={s.count != 3 ? "btn unblock-btn" : "btn block-btn"}
                    onClick={() => onConfirmCount(s)}
                  >
                    {s.count != 3 ? "block" : "unblock"}
                </button> */}
                {
                  s.count != 3 ? (<p>Unblock</p>) : (<button className="btn block-btn" onClick={() => onConfirmCount(s)}>Unblock</button>)
                }
              </td>
              
            </tr>
          ))
        )}
      </tbody>
    </table>
    </>
  );
};

export default StudentTable;

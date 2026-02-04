import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/StudentAssignment.css";
import Toast from "./Toast";

const StudentAssignment = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const courseId = location.state.course_id 
  const student_id = localStorage.getItem("login_id");
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

  const isLateSubmission = (submittedAt: string, dueDate: string) => {
    // Convert submittedAt timestamp to date string
    const submittedDate = new Date(submittedAt).toISOString().split("T")[0];

    // Ensure dueDate is also in YYYY-MM-DD format
    const due = new Date(dueDate).toISOString().split("T")[0];

    // Compare strings (safe because YYYY-MM-DD lexicographically works)
    return submittedDate > due;
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/student/assignment/my/${courseId}`,
          {
            params: { student_id: student_id },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        setAssignments(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleUpload = async (assignmentId: number, file: File) => {
      const formData = new FormData();
      const loginId = localStorage.getItem("login_id")
      formData.append("assignment_id", assignmentId.toString());
      if(loginId)
      {
        formData.append("student_id",loginId)
      }
      if(!file)
      {
        showToast("error","please select file")
      }
      formData.append("file", file);

      try {
        await axios.post(
          "http://127.0.0.1:8000/assignment/submit/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        showToast("success", "Assignment submitted successfully");

        // refresh list
        const res = await axios.get(
          `http://127.0.0.1:8000/student/assignment/my/${courseId}`,
          {
            params: { student_id: student_id },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        setAssignments(res.data);

      } catch {
        showToast("error", "Submission failed");
      }
    };


  if (loading) return <p>Loading assignments...</p>;

  return (
    <>
    {toast && <Toast key={toast.id}  type={toast.type as any} message={toast.message} onClose={() => setToast(null)} />}
    <div className="student-container">
        <div className="assignment-container">
        <h2>My Assignments</h2>

        {assignments.length === 0 && <p>No assignments found</p>}

        {assignments.map((a) => (
            <div key={a.id} className="assignment-card">
            <h3><span>Title :</span> {a.title}</h3>
            <p>{a.description}</p>
            <p>
                <b>Due Date:</b> {a.due_date}
            </p>

            {a.file && (<a href={`http://127.0.0.1:8000/media/assignment/${a.file}`}>Question File</a>
            )}

            {!a.submitted_at ? (
            <div className="submit-box">
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />

              <button
                onClick={() => {
                  if (!selectedFile) {
                    showToast("warning", "Please select a file");
                    return;
                  }
                  handleUpload(a.id, selectedFile);
                }}
              >
                Submit
              </button>
            </div>
          ):(
            <div className="submit-box-final">
              <h3>
                Submitted at {new Date(a.submitted_at).toISOString().split("T")[0]}
              </h3>

              {isLateSubmission(a.submitted_at, a.due_date) ? (
                <span className="late">⚠️ Late Submission</span>
              ) : (
                <span className="on-time">✅ On Time Submission</span>
              )}
            </div>
          )}

            </div>
        ))}
        </div>
    </div>
    </>
  );
};

export default StudentAssignment;

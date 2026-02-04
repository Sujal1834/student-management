import { useState,useEffect } from "react";
import { Assignment } from "../../types/assignment";
import { createAssignment, updateAssignment } from "../../services/assignmentService";
import "../../styles/Assignment.css";
import Toast from "../Toast";

type Props = {
  assignment: Assignment | null;
  onClose: () => void;
  onSuccess: () => void;
};

const AssignmentModal = ({ assignment, onClose, onSuccess }: Props) => {
  const a_id = assignment?.id || 0
  const [title, setTitle] = useState(assignment?.title || "");
  const [description, setDescription] = useState(assignment?.description || "");
  const [date, setDate] = useState(assignment?.due_date || "");
  const [courseId, setCourseId] = useState(assignment?.course_id || "");
  const [studentId, setStudentId] = useState(assignment?.student_id || "");
  const [file, setFile] = useState<File | null>(null);
  const today = new Date().toISOString().split("T")[0];
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

  const [courses, setCourses] = useState<any[]>([]);
  
  useEffect(() => {
    fetch("http://127.0.0.1:8000/course/")
        .then(res => res.json())
        .then(setCourses)
        .catch(console.error);

    const id = localStorage.getItem("login_id");
  if (id) {
    setStudentId(Number(id));
  }
    }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("due_date",date);
    formData.append("course_id",String(courseId));
    formData.append("student_id",String(studentId))
    if (file) formData.append("file", file);

    if (assignment) {
        console.log("id : ",a_id)
      await updateAssignment(a_id, formData);
    } else {
      const data = await createAssignment(formData);
      showToast("success",data.data.message);
    }

    onSuccess();
    onClose();
  };

  return (
    // <div className="modal">
    //   <h3>{assignment ? "Update Assignment" : "Create Assignment"}</h3>

    //   <input value={title} onChange={(e) => setTitle(e.target.value)} />
    //   <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
    //   <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />

    //   <button onClick={handleSubmit}>Save</button>
    //   <button onClick={onClose}>Cancel</button>
    // </div>
    <>
    {toast && <Toast key={toast.id}  type={toast.type as any} message={toast.message} onClose={() => setToast(null)} />}
    <div className="modal-overlay">
        <div className="modal">
            <h3 className="modal-title">
            {assignment ? "Update Assignment" : "Create Assignment"}
            </h3>

            <div className="form-group">
            <label>Title</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter assignment title"
            />
            </div>

            <div className="form-group">
            <label>Description</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter assignment description"
            />
            </div>

            <div className="form-group">
            <label>Due Date</label>
                <input
                    type="date"
                    value={date}
                    min={today}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Enter assignment title"
                />
            </div>

            <div className="form-group">
            <label>Course</label>
            <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
            >
                <option value="">All Courses</option>
                {courses.map((c) => (
                <option key={c[0]} value={c[0]}>
                    {c[1]}
                </option>
                ))}
            </select>
            </div>

            <div className="form-group">
                {assignment?.file && (
                <div className="existing-file">
                    <span>Existing File:</span>
                    <a
                    href={`http://127.0.0.1:8000/media/assignment/${assignment.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    View File
                    </a>
                </div>
                )}
            </div>

            <div className="form-group">
            <label>Upload File</label>
            <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            </div>

            <div className="form-actions">
            <button className="save-btn" onClick={handleSubmit}>
                Save
            </button>
            <button className="cancel-btn" onClick={onClose}>
                Cancel
            </button>
            </div>
        </div>
    </div>
    </>
  );
};

export default AssignmentModal;

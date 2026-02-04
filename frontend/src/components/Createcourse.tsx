import React, { useState,useEffect } from "react";
import "../styles/Createcourse.css";
import { useLocation,useNavigate } from "react-router-dom";
import {createCourse,updateCourse} from "../services/CourseService"
import Toast from "./Toast";

const Createcourse = () => {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state;
  const isEdit = Boolean(course)
  const [toast, setToast] = useState<{
      id: number;
      type: "success" | "error" | "warning" | "info";
      message: string;
    } | null>(null);

  // -----------------fetching name from course-------------------------
  useEffect(()=>{
    if(course)
    {
      setName(course.name);
    }
  },[course]);

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

  // ------------------ form submit----------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Course name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if(!isEdit)
      {
         await createCourse({name})
         setName("");
      }
      else
      {
         const value = await updateCourse(course.id,{name})
        //  console.log("value : ",value);
         showToast("success",value.message)
          setTimeout(() => {
          navigate("/course"); // redirect to student list
      }, 2000);
      }
    
      setError("")
    } catch (err : any) {
      // setError(err.message);
      showToast("error",err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="create-course-container">
    //   <h2>Create Course</h2>

    //   {error && <p className="error-text">{error}</p>}

    //   <form onSubmit={handleSubmit} className="course-form">
    //     <div className="form-group">
    //       <label>Course Name</label>
    //       <input
    //         type="text"
    //         placeholder="Enter course name"
    //         value={name}
    //         onChange={(e) => setName(e.target.value)}
    //       />
    //     </div>

    //     <button type="submit" disabled={loading}>
    //       {loading ? "Creating..." : "Create Course"}
    //     </button>
    //   </form>
    // </div>
    <>
    {toast && <Toast key={toast.id}  type={toast.type as any} message={toast.message} onClose={() => setToast(null)} />}

    <div className="create-course-container">
      <div className="form-card">
        <h2>{isEdit ? "Update Course" : "Create Course"}</h2>
        {/* <p className="form-subtitle">Add a new program to the curriculum</p> */}

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-group">
            <label>Course Name</label>
            <input
              type="text"
              placeholder="e.g. Computer Science & Engineering"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Course"
                : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default Createcourse;

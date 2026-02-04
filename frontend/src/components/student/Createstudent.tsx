import React, { useState,useEffect } from "react";
import "../../styles/Createstudent.css";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../ErrorPopup";
import Toast from "../Toast";
import {validateStudentForm} from "../../utils/validations";

type Props = {
  student?: any;
  onClose: () => void;
};

type StudentFormData = {
  roll_no: string;
  name: string;
  email: string;
  dob: string;
  gender: string;
  course_id: number | string; // keep string for select
};

const Createstudent = ({ student, onClose }: Props) => {

  const [formData, setFormData] = useState<StudentFormData>({
    roll_no: "",
    name: "",
    email: "",
    dob: "",
    gender: "",
    course_id: ""
  });
  // const [toast, setToast] = useState<{type: string, message: string} | null>(null);
  const [toast, setToast] = useState<{
    id: number;
    type: "success" | "error" | "warning" | "info";
    message: string;
  } | null>(null);

  // const errors: { type: "error" | "warning" | "success"; message: string }[] = [];

  const payload = {
    roll_no: formData.roll_no,
    name: formData.name,
    email: formData.email,
    dob: formData.dob,
    gender: formData.gender,
    course_id: Number(formData.course_id)
  };
  const [courses, setCourses] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  // const navigate = useNavigate();
  const isEdit = Boolean(student)

  // const showFormError = (message: string) => {
  //   setError(message);

  //   setTimeout(() => {
  //     setError("");
  //   }, 3000);
  // };

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
      if(student)
        {
          setFormData({
            roll_no: student.roll_no,
            name: student.name,
            email: student.email,
            dob: student.dob,
            gender: student.gender,
            course_id: String(student.course_id)
          });
        }
        fetchCourses();
      
        // console.log("Selected course_id:", course_id);
        }, [student]);
  
    const fetchCourses = async () => {
      const res = await fetch("http://127.0.0.1:8000/course/");
      const data = await res.json();
      setCourses(data);
    };

    // console.log("course : "+courses)
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    };

    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formerror  = validateStudentForm(formData);
    //   if (formData.dob) {
    //     const selectedDate = new Date(formData.dob);
    //     const today = new Date();

    //     today.setHours(0, 0, 0, 0); // normalize

    //     if (selectedDate > today) {
    //       showToast("warning", "Date of birth cannot be in the future");
    //       return;
    //     }
    // }

    // if (!formData.roll_no.trim()) {
    //   // showFormError("student roll number is required");
    //   // setToast({ type: "error", message: "student roll number is required" });
    
    if(formerror)
    {
      console.log("error : ",formerror )
      showToast("error", formerror);
      return;
    }
    //   return;
    // }

    // if (!/^\d+$/.test(formData.roll_no)) {
    //   // showFormError("Roll number must contain only numbers");
    //   // setToast({ type: "warning", message: "Roll number must contain only numbers" });
    //   showToast("warning", "Roll number must contain only numbers");
    //   return;
    // }

    // if (!formData.name.trim()) {
    //   // showFormError("student name is required");
    //   // setToast({ type: "error", message: "student name is required" });
    //   showToast("error","student name is required")
    //   return;
    // }

    // if (!formData.email.trim()) {
    //   // showFormError("student email is required");
    //   // setToast({ type: "error", message: "student email is required" });
    //   showToast("error","student email is required")
    //   return;
    // }

    // if (!formData.dob.trim()) {
    //   // showFormError("student Date Of Birth is required");
    //   // setToast({ type: "error", message: "student Date Of Birth is required" });
    //   showToast("error","student Date Of Birth is required")
    //   return;
    // }
    
    // if (!formData.gender.trim()) {
    //   // showFormError("gender is required");
    //   // setToast({ type: "error", message: "student gender is required" });
    //   showToast("error","student gender is required")
    //   return;
    // }

    // if(formData.course_id === "")
    // {
    //     // showFormError("student course is required");
    //     // setToast({ type: "error", message: "student course is required" });
    //     showToast("error","student course is required")
    //     return;
    // }


    try {
      setLoading(true);

      const url = isEdit
        ? `http://127.0.0.1:8000/student/update/${student.id}/`
        : "http://127.0.0.1:8000/student/create/";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // showFormError(data.error || "Something went wrong" );
        showToast("error",data.error );
        return;
      }

      // <ErrorPopup
      //   message={data.message}
      //   onClose={() => setError("")}
      // />

      // alert(isEdit ? "Student updated successfully" : "Student created successfully");

      // Reset form ONLY after create
      if (!isEdit) {
        showToast("success",data.message );
        setFormData({
          roll_no: "",
          name: "",
          email: "",
          dob: "",
          gender: "",
          course_id: ""
        });
      }
      else
      {
        showToast("success",data.message);
        setTimeout(() => {
        // navigate("/student"); // redirect to student list
          onClose();
      }, 2000);
        // navigate("/student")
      }

      setError("");
    } catch (err : any) {
      console.log(err)
      setError(err.message);
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
    {toast && <Toast key={toast.id}  type={toast.type as any} message={toast.message} onClose={() => setToast(null)} />}

    <ErrorPopup
        message={error}
        onClose={() => setError("")}
      />
  <div className="create-student-container">
    <h2>{isEdit ? "Update Student" : "Create Student"}</h2>

    {/* {error && <p className="error-text">{error}</p>} */}

    <form className="student-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Roll No.</label>
        <input
          type="text"
          name="roll_no"
          placeholder="Enter roll number"
          value={formData.roll_no}
          onChange={handleChange}
        />

        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter student name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="text"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>DOB</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />

        {/* <label>Gender</label>

        <label className="radio-label">
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={formData.gender === "Male"}
            onChange={handleChange}
          />
          Male
        </label>

        <label className="radio-label">
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={formData.gender === "Female"}
            onChange={handleChange}
          />
          Female
        </label> */}
        {/* Inside your form-group div */}
        <label>Gender</label>
        <div className="radio-group" style={{ display: 'flex', marginTop: '10px' }}>
          <label className="radio-label">
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange}
            />
            Male
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange}
            />
            Female
          </label>
        </div>

        <label>Course</label>
        <select
          name="course_id"
          value={formData.course_id}
          onChange={handleChange}
          >
          <option value="">-- Select Course --</option>

          {courses.map((c : any) => (
              <option key={c[0]} value={c[0]}>
              {c[1]}
              </option>
          ))}
          </select>
      </div>

      <button type="submit" disabled={loading}>
        {loading
          ? isEdit
            ? "Updating..."
            : "Creating..."
          : isEdit
            ? "Update Student"
            : "Create Student"}
      </button>
    </form>
  </div>
  </>
  );
};

export default Createstudent;

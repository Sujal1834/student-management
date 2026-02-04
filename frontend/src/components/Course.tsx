import React, { useEffect, useState } from "react";
import "../styles/Course.css";
import { NavLink } from "react-router-dom";
import { deleteCourse } from "../services/CourseService";
import Createcourse from "./Createcourse";
import ConfirmToast from "./ConfirmToast";
import Toast from "./Toast";
import { useNavigate } from "react-router-dom";

const Course = () => {
  const [courses, setCourses] = useState([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 2;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const currentData = courses.slice(indexOfFirstItem, indexOfLastItem);
  
  const [search,setSearch] = useState<string>("");
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [showConfirm, setShowConfirm] = useState(false);
  const isSearching = search.trim().length > 0;
  const dataToShow = isSearching ? filteredCourses : currentData;
  const [isShow,setIsShow] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate()
  const token = localStorage.getItem("access_token")

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
    fetchCourses();
    const filtered = courses.filter((c : any) => c[1].toLowerCase().includes(search.toLowerCase()))
    setFilteredCourses(filtered);
    console.log("search",filteredCourses);
    console.log("search value",search)
  }, [search]);

  const fetchCourses = async () => {
    const res = await fetch("http://127.0.0.1:8000/course/",{
      headers:{
        Authorization : `Bearer ${token}`
      }
    });
    const data = await res.json();
    setCourses(data);
    
  };

  // const handleDelete = async (id : number) => {
  //   if (!window.confirm("Are you sure you want to delete this course?")) return;

  //   // deleteCourse(id);
  //   // navigate("/course");
  //   // window.location.reload();
  // };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async() => {
    if (deleteId) {
      const val = await deleteCourse(deleteId);
      console.log(val);
      showToast("success",val.message)
    }
    setShowConfirm(false);
    setDeleteId(null);
  }

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  }
     // const handleUpdate = (id : number) => {
  //   setUpdate(true)
  //   // alert(`Redirect to update course ${id}`);
  //   // later: navigate(`/courses/update/${id}`)
  // };

//   const handleCreate = () => {
//     // alert("Redirect to create course page");
//     // navigate("/courses/create")
//   };

  return (
    <>
    {showConfirm && (
  <ConfirmToast
    message="Are you sure you want to delete this course? This action cannot be undone."
    onConfirm={confirmDelete}
    onCancel={cancelDelete}
  />
)}
 {toast && <Toast key={toast.id}  type={toast.type as any} message={toast.message} onClose={() => setToast(null)} />}
  <div className={`${isShow ? "blurred" : ""}`}>
    <div className="course-container">
      <div className="course-header">
        <h2>Courses</h2>
        {/* <input type="text" name="search" value={search} placeholder="search" onChange={(e) => setSearch(e.target.value)}/> */}
        <div className="search-wrapper">
          <input
            type="text"
            name="search"
            value={search}
            placeholder="Search courses..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* <NavLink to="create/"> */}
            <button className="btn create-btn" onClick={() => setIsShow(true)}>
                Create Course
            </button>
        {/* </NavLink> */}
      </div>

      <table className="course-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Course Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dataToShow.length === 0 ? (
            <tr>
              <td className="no-data" colSpan={3}>
                No courses found
              </td>
            </tr>
          ) : (
            dataToShow.map((course: any) => (
              <tr key={course[0]}>
                <td>{course[0]}</td>
                <td>{course[1]}</td>
                <td>
                  <NavLink
                    to="create/"
                    state={{ id: course[0], name: course[1] }}
                  >
                    <button className="btn update-btn">Update</button>
                  </NavLink>

                  <button
                    className="btn delete-btn"
                    onClick={() => handleDeleteClick(course[0])}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
        
        {/* <div className="pagination-wrapper"> */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              ← Prev
            </button>

            {/* {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={page === currentPage ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))} */}

            <span className="page-info">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next →
            </button>
          </div>
        {/* </div> */}

    </div> 
  </div>
  {isShow && (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={() => setIsShow(false)}>X</button>
        <Createcourse />
      </div>
    </div>)
}
    </>
  );
};

export default Course;

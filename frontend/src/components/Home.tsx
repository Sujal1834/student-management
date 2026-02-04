// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../styles/Home.css";

// const Home = () => {
//   const [profile, setProfile] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const fetchProfile = async () => {
//     const token = localStorage.getItem("access_token");

//     // 🔒 If token missing → force login
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       const res = await axios.get(
//         "http://127.0.0.1:8000/profile/",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // ✅ IMPORTANT FIX
//       setProfile(res.data);
//       console.log("Profile data:", res.data);

//     } catch (err) {
//       console.error("Error fetching profile:", err);
//       // localStorage.clear();
//       navigate("/login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const handleLogout = () => {
//     // 🔹 Just clear token (no backend call needed)
//     localStorage.clear();
//     navigate("/login");
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="home-container">
//       <div className="home-card">
//         <h2 className="home-title">
//           Welcome {profile?.name || "Student"}
//         </h2>

//         {profile && (
//           <div className="profile-details">
//             <p>
//               <span>Student ID</span>
//               {profile.student_id}
//             </p>
//             <p>
//               <span>Name</span>
//               {profile.name}
//             </p>
//             <p>
//               <span>Email</span>
//               {profile.email}
//             </p>
//           </div>
//         )}

//         <button className="logout-btn" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Home;


import React, { useState,useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { apiGet } from "../api/apiRequest";
import "../styles/Home.css";
import Profile from "./Profile"; // import
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import QuizPage from "../pages/QuizPage";
import useCountUp from "../hooks/useCountUp";

const Home = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [is_faculty,setIs_faculty] = useState<Boolean>(false)
  const[profile_image,setProfile_image] = useState<string>("")
  const [is_login,setIs_login] = useState<Boolean>(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [courseId,setCourseId] = useState<string | number>("");
  const [courserow,setCourseRow] = useState<number>(0);
  const [studentrow,setStudentRow] = useState<number>(0);
  const [assignmentrow,setAssignmentRow] = useState<number>(0);
  // const [count, setCount] = useState(1);
  const [quizrow,setQuizRow] = useState<number>(0)
  const picture = localStorage.getItem("google_image")

  const courseCount = useCountUp(courserow);
  const studentCount = useCountUp(studentrow);
  const assignmentCount = useCountUp(assignmentrow);
  const quizCount = useCountUp(quizrow);

  // const isTokenExpired = (token: string) => {
  //     try {
  //       const decoded: any = jwtDecode(token);
  //       return decoded.exp * 1000 < Date.now();
  //     } catch {
  //       return true;
  //     }
  //   };

    useEffect(()=>{
     const fetchFacultyData = async () => {
        try {
          const res = await apiGet("http://127.0.0.1:8000/faculty-detail/");
          const data = res.data;
          console.log("data for faculty:", data.course_row[0]);
          setCourseRow(data.course_row[0]);
          setStudentRow(data.student_row[0])
          setAssignmentRow(data.assignment_row[0])
          setQuizRow(data.quiz_row[0])
          // use the data here, e.g., set state
          // setFaculty(data);
        } catch (error) {
          console.error("Error fetching faculty data:", error);
        }
      };

      fetchFacultyData();
    },[])

  useEffect(()=>{
      const token = localStorage.getItem("access_token");
      if(!token)
      {
        setIs_login(false)
      }
      else
      {
        setIs_login(true)
      }
  
      // if (!token || isTokenExpired(token)) {
      //   updatetoken()
      //   // window.location.reload()
      // }

      fetchProfile()
    },[]);

    const fetchProfile = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) navigate("/");

    if(token)
    {
      try {
        const res = await axios.get("http://127.0.0.1:8000/profile/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfile_image(res.data.profile_image)
          setIs_faculty(res.data.is_faculty)
          setCourseId(res.data.course_id)
        } catch (err) {
          console.error(err);
        } finally {
          setProfileLoading(false)
        }
    }
    };

  //   const updatetoken = async() => {
  //   const email = localStorage.getItem("email");
  //   const password = localStorage.getItem("password");
  //    if(email && password)
  //   {
  //     const response = await axios.post(
  //       "http://127.0.0.1:8000/login/token/",
  //         {
  //             email: email,
  //             password: password,
  //         },
  //         {
  //             withCredentials: true, // ✅ replaces credentials: "include"
  //             headers: {
  //             "Content-Type": "application/json",
  //             },
  //         }
  //         );
  //         const data = response.data;
  //         localStorage.setItem("access_token", data.access_token);
  //         if(email && password)
  //         {
  //           localStorage.setItem("email",email);
  //           localStorage.setItem("password",password);
  //         }
  //         console.log("without update:", data);
  //     }
  //     else
  //     {
  //       navigate("/login");
  //     }
  // }

  if (profileLoading && is_login) return <div className="home-container-spin"><div className="spin"></div></div>;

  return (
    <div className="home-container">

    {/* {profileLoading && 
        (<p>Loading...</p>) // or spinner
    } */}

    {is_login && 
        (
        <>
        <header className="home-header">
        {is_faculty && <h2>Welcome To Admin Page</h2>}
        {!is_faculty && <h2>Welcome To Home Page</h2>}

            <img
              src={
                profile_image
                  ? `http://127.0.0.1:8000/media/profile/${profile_image}`
                  : "http://127.0.0.1:8000/media/profile/avtar.jpg"
              }
              alt={profile_image}
              className="profile-avatar"
              onClick={() => navigate("/profile")}
            /> 
          
      </header>

      <main className="home-main">
        {/* <p>Welcome back</p> */}
        {/* <div className="welcome-section">
          <p>Here is what's happening with your account today.</p>
        </div> */}

        {is_faculty &&
          <div className="stats-grid">
            <NavLink to="/course">
            <div className="stat-card">
              <p className="stat-icon">📚</p>
              <p className="stat-number">{courseCount}</p>
              <h3>Courses</h3>
            </div>
            </NavLink>
            <NavLink to="/student">
            <div className="stat-card">
              <p className="stat-icon">👨‍🎓</p>
              <p className="stat-number">{studentCount}</p>
              <h3>Students</h3>
            </div>
            </NavLink>
            <NavLink to="/assignment">
            <div className="stat-card">
              <p className="stat-icon">📝</p>
              <p className="stat-number">{assignmentCount}</p>
              <h3>Assignments</h3>
            </div>
            </NavLink>
            <NavLink to="/faculty/quiz">
            <div className="stat-card">
              <p className="stat-icon">🧠</p>
              <p className="stat-number">{quizCount}</p>
              <h3>Quiz</h3>
            </div>
            </NavLink>
            <NavLink to="/attendance">
            <div className="stat-card">
              <p className="stat-icon">✍️</p>
              <p className="stat-number">{studentCount}</p>
              <h3>Attendance</h3>
            </div>
            </NavLink>
          </div>
        }

        {!is_faculty &&
        (<>
          <div className="stats-grid">
            <NavLink to="/student/attendance">
            <div className="stat-card">
              <h3>Attendance</h3>
              <p className="stat-number"></p>
            </div>
            </NavLink>
            <NavLink to="/">
            <div className="stat-card">
              <h3>Fees</h3>
              <p className="stat-number"></p>
            </div>
            </NavLink>
            <NavLink to="/student/assignment" state={{course_id : courseId}}>
            <div className="stat-card">
              <h3>Assignments</h3>
              <p className="stat-number"></p>
            </div>
            </NavLink>
          </div>
          <QuizPage />
        </>)
        }
       
        {/* <div className="action-section">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn primary">View Schedule</button>
            <button className="action-btn secondary">Contact Support</button>
          </div>
        </div> */}
      </main>
       </>)
   }
    {
      !is_login && (
        <div className="guest-home">

          {/* Hero */}
          <section className="guest-hero">
            <h1>Student Management System</h1>
            <p>
              Manage attendance, assignments, quizzes and student progress
              — all in one place.
            </p>

            <div className="guest-actions">
              <button className="btn primary" onClick={() => navigate("/login")}>
                Login
              </button>
              {/* <button className="btn outline" onClick={() => navigate("/register")}>
                Register
              </button> */}
            </div>
          </section>

          {/* Features */}
          <section className="guest-features">
            <div className="feature-card">
              📊
              <h3>Dashboard</h3>
              <p>Track your academic performance easily</p>
            </div>

            <div className="feature-card">
              📝
              <h3>Assignments</h3>
              <p>View, submit and manage assignments</p>
            </div>

            <div className="feature-card">
              🧠
              <h3>Quiz</h3>
              <p>Attempt quizzes and view results instantly</p>
            </div>

            <div className="feature-card">
              ✍️
              <h3>Attendance</h3>
              <p>Monitor attendance percentage in real time</p>
            </div>
          </section>

        </div>
      )
    }

      {showProfile && (
        <Profile onClose={() => setShowProfile(false)} />
      )}


    </div>
  );
};

export default Home;

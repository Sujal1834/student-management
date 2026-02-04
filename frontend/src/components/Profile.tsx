import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";
import {jwtDecode} from "jwt-decode";
import Toast from "./Toast";


type StudentScore = {
  student_id : number;
  obtain_marks : number;
  total_marks : number;
  quiz_count : number;
}
type ProfileProps = {
  onClose?: () => void;
};

const Profile = ({ onClose }: ProfileProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [is_faculty,setIs_faculty] = useState<Boolean>(false)
  const [is_login, setIs_login] = useState<Boolean>(false);
  const [percentage, setPercentage] = useState<number>(0)
  const [scoreboard, setScoreBoard] = useState<StudentScore>();
  const [progress, setProgress] = useState(0);
  const [id,setId] = useState()
  const picture = localStorage.getItem("google_image");
  // const percentage : number = 0;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
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
  // const isTokenExpired = (token: string) => {
  //       try {
  //         const decoded: any = jwtDecode(token);
  //         return decoded.exp * 1000 < Date.now();
  //       } catch {
  //         return true;
  //       }
  //     };

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
    
        fetchProfile()
        fetchStudentmarks()
      },[]);
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 300);

    return () => clearTimeout(timer);
  }, [percentage]);


  const fetchProfile = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await axios.get("http://127.0.0.1:8000/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setIs_faculty(res.data.is_faculty)
      setId(res.data.student_id)
    //   console.log(res.data)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentmarks = async () => {
    const token = localStorage.getItem("access_token");
    const student_id = localStorage.getItem("login_id");
    if (!token) return;

    try {
      const res = await axios.get(`http://127.0.0.1:8000/student/profile/${student_id}/score/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScoreBoard(res.data[0])
      console.log(res.data[0])
      setPercentage(Math.round((res.data[0].obtain_marks / res.data[0].total_marks) * 100))
      console.log("score : ",res.data)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchProfile();
  // }, []);

   const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
    ) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];

    // const token = localStorage.getItem("access_token");
    const formData = new FormData();
    if(id)
    {
        formData.append("id",id)
    }
    formData.append("profile", file);
    console.log("id : ",id," image : ",file);

    try {
        const res = await axios.put(
        "http://127.0.0.1:8000/student/profile_image/",
        formData,
        {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        }
        );
        showToast("success",res.data.success)
        // alert(res.data.success)
        // update UI instantly
        setProfile((prev: any) => ({
        ...prev,
        profile_image: res.data.profile_image,
        }));
    } catch (err) {
        console.error("Image upload failed", err);
    }
    };


  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) return <div className="home-container-spin"><div className="spin"></div></div>;

  return (
    <>
    {toast && <Toast key={toast.id}  type={toast.type as any} message={toast.message} onClose={() => setToast(null)} />}

    <div className="dashboard-layout">
      <aside className="profile-sidebar">
        <div className="profile-main">
          <div className="profile-card">
            <h2>Profile</h2>
            {onClose && <button className="close-btn" onClick={onClose}>X</button>}
            {!profile && (
                <div><h4>No Data Found</h4></div>
            )}
            {profile && (
                <>
              <div className="profile-details">
                {/* <div className="profile-image-container"><img src="http://127.0.0.1:8000/media/profile/avtar.jpg" alt="" className="profile-image"/></div> */}
                
                  <img
                    src={
                        profile.profile_image
                        ? `http://127.0.0.1:8000/media/profile/${profile.profile_image}`
                        : "http://127.0.0.1:8000/media/profile/avtar.jpg"
                    }
                    alt={profile.profile_image}
                    className="profile-image"
                    onClick={handleImageClick}
                    />

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                    />
                    
                {/* <p><img src="http://127.0.0.1:8000/media/profile/avtar.jpg" alt="" className="profile-image"/></p> */}
                {!is_faculty ? (
                  <><p><span>Student ID:</span> {profile.roll_no}</p>
                  <p><span>Name:</span> {profile.name}</p>
                  <p><span>Email:</span> {profile.email}</p>
                  <p><span>Course:</span> {profile.course_name}</p></>
                ) : (
                  <><p><span>Faculty ID:</span> {profile.student_id}</p>
                  <p><span>Name:</span> {profile.name}</p>
                  <p><span>Email:</span> {profile.email}</p></>
                )}
              </div>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </>
            )}
          </div>
        </div>
      </aside>

      <main className="dashboard-content">
        {is_faculty 
        ?( 
          <>
              <h2 className="welcome-board">Welcome to Admin Dashboard</h2>
          </>
        ):(
          <>
          {/* <div className="student-dashboard"> */}
            <h2 className="welcome-board">Welcome to Student Dashboard</h2>
            {scoreboard && 
              (
                <>
                <div className="student-dashboard">
                  <h2 className="dashboard-title">📊 Student Performance</h2>
                  <h3><span>Given Quiz : </span>{scoreboard.quiz_count}</h3>
                  <div className="dashboard-cards">
                    <div className="dashboard-card">
                      <p className="card-label">Obtained Marks</p>
                      <h3 className="card-value">{scoreboard.obtain_marks}</h3>
                    </div>

                    <div className="dashboard-card">
                      <p className="card-label">Total Marks</p>
                      <h3 className="card-value">{scoreboard.total_marks}</h3>
                    </div>

                    <div className="dashboard-card highlight">
                      <p className="card-label">Percentage</p>
                      <h3 className="card-value">{!Number.isNaN(percentage) ? percentage : 0}%</h3>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="progress-section">
                    <div className="progress-label">
                      Performance Progress
                      <span>{!Number.isNaN(percentage) ? percentage : 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                </>
              )
            }
            {/* </div> */}
          </>
        )}
      </main>
    </div>
  </>
  );
};

export default Profile;

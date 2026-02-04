import React, { useEffect, useState } from "react";
import axios from "axios";
import Toast from "../Toast";

const StudentAttendance = () => {
  const [loading,setLoading] = useState<boolean>(true);
  const token = localStorage.getItem("access_token");
  const [data, setData] = useState<any[]>([]);
  const [month, setMonth] = useState("1");
  const [year, setYear] = useState("2026");
  const student_id = localStorage.getItem("login_id")
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


  const fetchData = async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    if (Number(year) > currentYear || (Number(year) === currentYear && Number(month) > currentMonth)) {
      showToast("error","Cannot select a future month or year")
      return;
    }

    try
    {
      const res = await axios.get(
        "http://127.0.0.1:8000/student/attendance/",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { student_id,month, year },
        }
      );
      console.log(res.data[0]);
      setData(res.data);
    }
    catch(error:any)
    {
      showToast("error",error.response?.data?.error);
    }
    finally
    {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if(loading) return <div className="home-container-spin"><div className="spin"></div></div>;

  return (
    <>
      {toast && <Toast key={toast.id}  type={toast.type as any} message={toast.message} onClose={() => setToast(null)} />}
      <div className="attendance-summary">
        <h2>Attendance Summary</h2>
        <div className="attendance-form">
          <div className="attendance-filters">
            <div className="filter-item">
              <label htmlFor="month">Month</label>
              <input
                id="month"
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>

            <div className="filter-item">
              <label htmlFor="year">Year</label>
              <input
                id="year"
                type="number"
                min={2000}
                max={new Date().getFullYear()}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            <button onClick={fetchData}>Apply</button>
          </div>


          <div className="attendance-cards">
            {data.map((a, i) => (
              <div className="attendance-card" key={i}>
                <p>Total: <strong>{a.total}</strong></p>
                <p>Present: <span className="present">{a.present}</span></p>
                <p>Absent: <span className="absent">{a.absent}</span></p>
                <h3>{a.percentage}%</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentAttendance;

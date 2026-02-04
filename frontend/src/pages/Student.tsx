import React, { useState } from "react";
import "../styles/Student.css";
import { useStudents } from "../hooks/useStudents";
import StudentTable from "../components/student/StudentTable";
import StudentHeader from "../components/student/StudentHeader";
import StudentPagination from "../components/student/StudentPagination";
import Createstudent from "../components/student/Createstudent";
import ConfirmToast from "../components/ConfirmToast";
import AttendanceTable from "../components/AttendanceTable";

const Student = () => {
  const token = localStorage.getItem("access_token");
  const login_id = localStorage.getItem("login_id");
  const [isShow, setIsShow] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [confirmStudent, setConfirmStudent] = useState<any | null>(null);
  const [confirmStudentcount, setConfirmStudentCount] = useState<any | null>(null);

  const {
    students,
    filteredStudents,
    page,
    totalCount,
    search,
    courseId,
    toggleStudentStatus,
    studentCount,
    setPage,
    setSearch,
    setCourseId,
  } = useStudents(token);

  const dataToShow =
    search.trim() || courseId ? filteredStudents : students;

  return (
    <>
      <div className={isShow ? "blurred" : "noblur"}>
        <div className="student-container">
          <StudentHeader
            search={search}
            courseId={courseId}
            onSearch={setSearch}
            onCourseChange={setCourseId}
            onCreate={() => {
              setSelectedStudent(null);
              setIsShow(true);
            }}
          />

          <StudentTable
            students={dataToShow}
            onEdit={(student) => {
              setSelectedStudent(student);
              setIsShow(true);
            }}
            onConfirmToggle={(student) => setConfirmStudent(student)}
            onConfirmCount={(student) => setConfirmStudentCount(student)}
          />

          <StudentPagination
            page={page}
            totalCount={totalCount}
            pageSize={2}
            onPageChange={setPage}
          />

          {/* <AttendanceTable students={students} facultyId={Number(login_id)} /> */}
        </div>
      </div>

      {isShow && (
        <div className="student-model">
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="cancle-btn" onClick={() => setIsShow(false)}>
              X
            </button>
            <Createstudent
              student={selectedStudent}
              onClose={() => setIsShow(false)}
            />
          </div>
        </div>
        </div>
      )}

       {confirmStudent && (
        <ConfirmToast
          message={`Are you sure you want to ${
            confirmStudent.is_active ? "disable" : "enable"
          } ${confirmStudent.name}?`}
          // isLoading={isLoading}
          onConfirm={async () => {
            // setIsLoading(true);
            try {
              await toggleStudentStatus(
                confirmStudent.id,
                confirmStudent.is_active
              );
            } finally {
              // setIsLoading(false);
              setConfirmStudent(null);
            }
          }}
          onCancel={() => setConfirmStudent(null)}
        />
      )}
      {confirmStudentcount && (
        <ConfirmToast
          message={`Are you sure you want to ${
            confirmStudentcount.count !=3 ? "block" : "Unblock"
          } ${confirmStudentcount.name}?`}
          // isLoading={isLoading}
          onConfirm={async () => {
            // setIsLoading(true);
            try {
              await studentCount(
                confirmStudentcount.id
              );
            } finally {
              // setIsLoading(false);
              setConfirmStudentCount(null);
            }
          }}
          onCancel={() => setConfirmStudentCount(null)}
        />
      )}
    </>
  );
};

export default Student;

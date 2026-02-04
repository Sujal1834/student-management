import React, { useEffect, useState } from "react";

type Props = {
  search: string;
  courseId: string | number;
  onSearch: (value: string) => void;
  onCourseChange: (value: string) => void;
  onCreate: () => void;
};

const StudentHeader = ({
  search,
  courseId,
  onSearch,
  onCourseChange,
  onCreate,
}: Props) => {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/course/")
      .then(res => res.json())
      .then(setCourses)
      .catch(console.error);
  }, []);

  return (
    <div className="student-header">
      <h2>Students</h2>

      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <select
        value={courseId}
        onChange={(e) => onCourseChange(e.target.value)}
      >
        <option value="">All Courses</option>
        {courses.map((c) => (
          <option key={c[0]} value={c[0]}>
            {c[1]}
          </option>
        ))}
      </select>

      <button className="btn create-btn" onClick={onCreate}>
        Create Student
      </button>
    </div>
  );
};

export default StudentHeader;

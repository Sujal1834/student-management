import { useEffect, useState, useRef } from "react";
import { getStudents, searchStudents,gettoggleStudentStatus,updateStudentCount } from "../services/studentService";

export const useStudents = (token: string | null) => {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFiltered] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState("");

  useEffect(() => {
    if (!token) return;

    getStudents(page, token).then(res => {
      setStudents(res.data.results);
      setTotalCount(res.data.count);
    });
  }, [page, token]);

  useEffect(() => {
    if (!search.trim() && !courseId) {
      setFiltered([]);
      return;
    }

    searchStudents({ name: search, course_id: courseId })
      .then(setFiltered);
  }, [search, courseId]);

   const toggleStudentStatus = async (
    id: number,
    currentStatus: boolean
    ) => {
      await gettoggleStudentStatus(id);

      // optimistic UI update
      setStudents((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, is_active: !currentStatus } : s
        )
      );
    };

    const studentCount = async (id:number) =>
    {
      await updateStudentCount(id);

      setStudents((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, count: 0 } : s
        )
      );
    }


  return {
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
  };
};

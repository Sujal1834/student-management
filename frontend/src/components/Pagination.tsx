import { useState,useEffect } from "react";
import axios from "axios";

const Pagination = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(2);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const fetchStudents = async (pageNumber: number) => {
    const res = await axios.get(
      `http://127.0.0.1:8000/student/page/?page=${pageNumber}`
    );

    setStudents(res.data.results);
    setTotalCount(res.data.count);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <ul>
        {students.map((s) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>

      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Prev
      </button>

      <span>{page} / {totalPages}</span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </>
  );
};

export default Pagination

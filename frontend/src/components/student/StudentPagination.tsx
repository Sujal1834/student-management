import React from "react";

type Props = {
  page: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

const StudentPagination = ({
  page,
  totalCount,
  pageSize,
  onPageChange,
}: Props) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Prev
      </button>

      <span className="page-info">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>

      <button
        className="page-btn"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
};

export default StudentPagination;

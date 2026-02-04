import { Assignment } from "../../types/assignment";

type Props = {
  assignment: Assignment;
  loggedInStudentId: number;
  onEdit: (a: Assignment) => void;
};

const AssignmentRow = ({ assignment, loggedInStudentId, onEdit }: Props) => {
  const isOwner = assignment.student_id === loggedInStudentId;
  const finalfile = "http://127.0.0.1:8000/media/assignment/"+assignment.file
  return (
    <tr>
      <td>{assignment.title}</td>
      <td>{assignment.description}</td>
      <td>{assignment.course_name}</td>
      <td>{assignment.due_date}</td>
      <td>
        {assignment.file ? (
          <a href={finalfile} target="_blank" rel="noopener noreferrer">
            View
          </a>
        ) : (
          "—"
        )}
      </td>
      <td>
        {isOwner && (
          <button className="btn update-btn" onClick={() => onEdit(assignment)}>
            Edit
          </button>
        )}
      </td>
    </tr>
  );
};

export default AssignmentRow;

import AssignmentRow from "./AssignmentRow";
import { Assignment } from "../../types/assignment";

type Props = {
  assignments: Assignment[];
  loggedInStudentId: number;
  onEdit: (a: Assignment) => void;
};

const AssignmentTable = ({ assignments, loggedInStudentId, onEdit }: Props) => {
  if (!assignments.length) {
    return <p>No assignments found</p>;
  }

  return (
    <table className="assignment-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Course</th>
          <th>Due Date</th>
          <th>File</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {assignments.map((a) => (
          <AssignmentRow
            key={a.id}
            assignment={a}
            loggedInStudentId={loggedInStudentId}
            onEdit={onEdit}
          />
        ))}
      </tbody>
    </table>
  );
};

export default AssignmentTable;

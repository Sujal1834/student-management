type Props = {
  onCreate: () => void;
};

const AssignmentHeader = ({ onCreate }: Props) => {
  return (
    <div className="assignment-header">
      <h2>Assignments</h2>

      <button className="btn create-btn" onClick={onCreate}>
        Create Assignment
      </button>
    </div>
  );
};

export default AssignmentHeader;

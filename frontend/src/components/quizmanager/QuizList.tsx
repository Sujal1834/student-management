type Props = {
  quizzes: any[];
  onSelect: (quiz: any) => void;
  onDelete: (quiz: any) => void;
  onConfirmToggle: (quiz: any) => void;
};

const QuizList = ({ quizzes, onSelect, onDelete ,onConfirmToggle }: Props) => (
  <div className="quiz-page">
    <div className="quiz-table">

      {/* Header */}
      <div className="quiz-table-header">
        <span>Quiz Title</span>
        <span>marks</span>
        <span>Time</span>
        <span>Actions</span>
      </div>

      {/* Rows */}
      {quizzes.map((q: any) => (
        <div className="quiz-table-row" key={q.id}>
          <span className="quiz-title">{q.title}</span>
          <span>{q.total_marks}</span>
          <span>{q.time_limit}</span>
          <div className="quiz-actions">
            <button onClick={() => onSelect(q.id)}>Manage</button>
            <button
                    className={q.is_published ? "btn disable-btn" : "btn enable-btn"}
                    onClick={() => onConfirmToggle(q)}
                  >
                    {q.is_published ? "Unpublished" : "Published"}
                </button>
          </div>
        </div>
      ))}

    </div>
  </div>
);

export default QuizList;

import { Formik, Form, Field } from "formik";

const QuestionForm = ({ onSubmit, onCancel }: any) => (
  <div className="quiz-form">
    <h3>Add Question</h3>

    <Formik
      initialValues={{ text: "", marks: 1 }}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values.text, values.marks);
        resetForm();
      }}
    >
      <Form className="form-grid">

        <div className="form-field">
          <label htmlFor="text">Question Text</label>
          <Field
            id="text"
            name="text"
            placeholder="Enter question text"
          />
        </div>

        <div className="form-field">
          <label htmlFor="marks">Marks</label>
          <Field
            id="marks"
            name="marks"
            type="number"
            placeholder="1"
            min={1}
          />
        </div>

        <div className="form-actions">
          <button type="submit">Add Question</button>
          {onCancel && (
            <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
          )}
        </div>

      </Form>
    </Formik>
  </div>
);

export default QuestionForm;

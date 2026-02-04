import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const QuizSchema = Yup.object({
  title: Yup.string().required("Quiz title is required"),
  description: Yup.string().required("Description is required"),
  total_marks: Yup.number()
    .typeError("Total marks must be a number")
    .required("Total marks is required")
    .positive("Total marks must be greater than 0"),
  time_limit: Yup.number()
    .typeError("Time limit must be a number")
    .required("Time limit is required")
    .min(1, "Time limit must be at least 1 minute"),
});

const QuizForm = ({ onSubmit, onCancel }: any) => (
  <div className="quiz-form">
    <h3>Create Quiz</h3>

    <Formik
      initialValues={{
        title: "",
        description: "",
        total_marks: 0,
        time_limit: 0,
      }}
      validationSchema={QuizSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
    >
      <Form className="form-grid">

        <div className="form-field">
          <label htmlFor="title">Quiz Title</label>
          <Field id="title" name="title" placeholder="Enter quiz title" />
          <ErrorMessage name="title" component="div" className="error" />
        </div>

        <div className="form-field">
          <label htmlFor="description">Description</label>
          <Field
            id="description"
            name="description"
            as="textarea"
            placeholder="Enter quiz description"
          />
          <ErrorMessage name="description" component="div" className="error" />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="total_marks">Total Marks</label>
            <Field
              id="total_marks"
              name="total_marks"
              type="number"
              placeholder="0"
            />
            <ErrorMessage name="total_marks" component="div" className="error" />
          </div>

          <div className="form-field">
            <label htmlFor="time_limit">Time Limit (minutes)</label>
            <Field
              id="time_limit"
              name="time_limit"
              type="number"
              placeholder="0"
            />
             <ErrorMessage name="time_limit" component="div" className="error" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">Create Quiz</button>
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>

      </Form>
    </Formik>
  </div>
);

export default QuizForm;

import { Formik, Form, Field } from "formik";

const OptionForm = ({ questionId, onSubmit, onCancel }: any) => (
  <div className="option-form">
    <h4>Add Option</h4>

    <Formik
      initialValues={{ text: "", is_correct: false }}
      onSubmit={(values, { resetForm }) => {
        onSubmit(questionId, values.text, values.is_correct);
        resetForm();
      }}
    >
      <Form className="form-grid">

        <div className="form-field">
          <label htmlFor="text">Option Text</label>
          <Field
            id="text"
            name="text"
            placeholder="Enter option text"
          />
        </div>

        <div className="form-field checkbox-field">
          <label>
            <Field type="checkbox" name="is_correct" />
            Correct Answer
          </label>
        </div>

        <div className="form-actions">
          <button type="submit">Add Option</button>
          {onCancel && (
            <button type="button" className="secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>

      </Form>
    </Formik>
  </div>
);

export default OptionForm;

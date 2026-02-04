import "../styles/ErrorPopup.css";

const ErrorPopup = ({ message, onClose }: {
  message: string;
  onClose: () => void;
}) => {
  if (!message) return null;

  return (
    <div className="error-toast">
      <div className="error-toast-content">
        <div className="error-toast-icon">!</div>

        <div className="error-toast-text">
          <h4>Error</h4>
          <p>{message}</p>
        </div>
      </div>

      <button
        className="error-toast-close"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
};


export default ErrorPopup;

import { useParams, Link } from "react-router-dom"; // Added Link
import { useState,useEffect } from "react";
import axios from "axios";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); 
  const [showForm, setShowForm] = useState(false);

   useEffect(() => {
    const checkToken = async () => {
      try {
        await axios.post("http://127.0.0.1:8000/reset-password/validate-token/", {
          token,
        });
        setShowForm(true); // token is valid
      } catch {
        setIsError(true);
        setMessage("Invalid or expired link. Please request a new one.");
        setShowForm(false); // token invalid
      } 
    };

    checkToken();
  }, [token]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);

    try {
      const res = await axios.post("http://127.0.0.1:8000/reset-password/", {
        token,
        password,
      });
      setMessage(res.data.message);
      setShowForm(false);
    } catch (err) {
      setIsError(true);
      setMessage("Invalid or expired link. Please request a new one.");
      setShowForm(false);
    }
  };

  return (
    <div className="reset-container">
      {showForm ? (
        <form className="reset-form" onSubmit={handleReset}>
          <h2>Reset Password</h2>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      ) : (
        <div className={`message-card ${isError ? "message-error" : "message-success"}`}>
          <h2>{isError ? "Request Failed" : "Success!"}</h2>
          <p>{message}</p>
          <Link to="/login" className="login-link">
            Go to Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
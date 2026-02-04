import "../styles/Footer.css"
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    return (
        <>
            <footer className="app-footer">
                <div className="footer-container">

                    {/* Left */}
                    <div className="footer-brand">
                    <h3>Student Management System</h3>
                    <p>
                        A smart platform to manage attendance, assignments,
                        quizzes and student progress efficiently.
                    </p>
                    </div>

                    {/* Center */}
                    <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li onClick={() => navigate("/")}>Home</li>
                        <li onClick={() => navigate("/login")}>Login</li>
                        <li>Contact</li>
                    </ul>
                    </div>

                    {/* Right */}
                    <div className="footer-info">
                    <h4>Contact</h4>
                    <p>Email: support@sms.com</p>
                    <p>Phone: +91 9XXXXXXXXX</p>
                    </div>

                </div>

                <div className="footer-bottom">
                    © {new Date().getFullYear()} Student Management System. All rights reserved.
                </div>
                </footer>

        </>
    )
}

export default Footer;
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "./Toast";
import { useState } from "react";

const GoogleLoginButton = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState<{
          id: number;
          type: "success" | "error" | "warning" | "info";
          message: string;
        } | null>(null);
    
      const showToast = (
        type: "success" | "error" | "warning" | "info",
        message: string
      ) => {
        setToast({
          id: Date.now(), // 👈 forces re-render every time
          type,
          message,
        });
      };

    const handleSuccess = async (res: any) => {
        try {
        const response = await axios.post(
            "http://localhost:8000/login/google/",
            {
            token: res.credential,
            }
        );
        console.log(response.data)
        const data = response.data
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("login_id", data.login_id);
        localStorage.setItem("email",data.email);
        localStorage.setItem("google_image",data.google_image);

        navigate("/") // or use navigate()
        } catch (error:any) {
        // console.error("Google login failed", error);
        // alert(error.response?.data?.error);
        showToast("error",error.response?.data?.error)
        }
    };

    return (
        <>
        {toast && <Toast key={toast.id}  type={toast.type as any} message={toast.message} onClose={() => setToast(null)} />}
        <div className="google-login-wrapper">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => alert("Google Sign-in failed")}
            />
        </div>
        </>
    );
};

export default GoogleLoginButton;

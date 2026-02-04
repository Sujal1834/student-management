import "../styles/Login.css";
import { useState } from "react";
import { validateLoginForm } from "../utils/validations";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";
import axios from "axios";
import ConfirmToast from "./ConfirmToast";
import GoogleLoginButton from "./GoogleLoginButton";

type LoginUser = {
    email : string;
    password : string;
}

const Login = () => {

    const [formData,setformData] = useState<LoginUser>({
        email:"",
        password : "",
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [password1,setPassword1] = useState<string>("");
    const [password2,setPassword2] = useState<string>("");
    const [showpassword,setShowpassword] = useState<boolean>(false);
    const [show,setShow] = useState<boolean>(false);
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

    const forgotPassword = async(email : string) => {
        // if (!email.trim())
        // {
        //     showToast("error","email is required")
        // }
        setLoading(true);
        try
        {
            const response = await axios.post("http://127.0.0.1:8000/forgot-password/",
                {email : email}
            )

            const data = response.data
            console.log("data : ",data)
            showToast("success",data.message);
            setShow(false)
        }
        catch(error : any)
        {
            const errorMsg =error.response?.data?.error || "Something went wrong";
            showToast("error", errorMsg);
        }
        finally {
            setLoading(false); 
        }
    }

    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setformData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // console.log("email : ",formData.email,"password : ",formData.password);
    
    const handlesubmit = async (e : React.FormEvent) => {
        e.preventDefault();
        const error = validateLoginForm(formData);
        if(error)
        {
            showToast("error",error);
            return;
        }
        try
        {
            const response = await fetch("http://127.0.0.1:8000/login/",
                {
                    method:"POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                })

            const data = await response.json()
            if (data.error)
            {
                showToast("error",data.error)
            }
            else
            {
                console.log(data[0].password)
                if(data[0].password === "Stu@123")
                {
                    setShowpassword(true);
                    if(password1 && password2)
                    {
                        if(password1 !== password2)
                        {
                            showToast("error","Password do not metch");
                            return;
                        }

                        const response = await fetch("http://127.0.0.1:8000/login/password/update/",
                        {
                            method:"PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                "email" : formData.email,
                                "password" : password1
                                }),
                        })
                        const data = await response.json()

                        if(data.error)
                        {
                            showToast("error",data.error)
                        }
                        else
                        {
                            showToast("success",data.message)
                            {
                                const response = await axios.post(
                                "http://127.0.0.1:8000/login/token/",
                                {
                                    email: formData.email,
                                    password: password1,
                                },
                                {
                                    withCredentials: true, // ✅ replaces credentials: "include"
                                    headers: {
                                    "Content-Type": "application/json",
                                    },
                                }
                                );

                                const data = response.data;
                                // localStorage.setItem("access", data.access);
                                localStorage.setItem("access_token", data.access_token);
                                localStorage.setItem("refresh_token", data.refresh_token);
                                localStorage.setItem("login_id", data.login_id);
                                localStorage.setItem("email",formData.email);
                                localStorage.setItem("google_image",data.google_image);
                                // localStorage.setItem("password",password1);
                                console.log("with update:", data.access);
                                setTimeout(() => {
                                    navigate("/");
                                }, 3000); 
                            }
                        }
                    }
                    if (!password1.trim())
                    {
                      showToast("error","New password is required");
                      return;
                    }

                    if (!password2.trim())
                    {
                        showToast("error","Reenter Password is required");
                        return;
                    }
                }
                else
                {
                    try
                    {
                        const response = await axios.post(
                        "http://127.0.0.1:8000/login/token/",
                        {
                            email: formData.email,
                            password: formData.password,
                        },
                        {
                            withCredentials: true, // ✅ replaces credentials: "include"
                            headers: {
                            "Content-Type": "application/json",
                            },
                        }
                        );

                        const data = response.data;
                        localStorage.setItem("access_token", data.access_token);
                        localStorage.setItem("refresh_token", data.refresh_token);
                        localStorage.setItem("login_id", data.login_id);
                        localStorage.setItem("email",formData.email);
                        localStorage.setItem("google_image",data.google_image);
                        // localStorage.setItem("password",formData.password);
                        console.log("without update:", data);
                        navigate("/");
                    }
                    catch(error : any)
                    {
                        showToast("error",error?.response?.data?.error)
                    }
                }
                // navigate('/')
            }
        }
        catch
        {

        }
    };


    return (
        <>
        {loading && (
            <div className="loader-overlay">
                <div className="spinner"></div>
                <p>Sending reset link...</p>
            </div>
        )}

        {show && (
        <ConfirmToast
                message={loading ? "Sending email..." : "Enter your email to reset password"}
                showInput={!loading} // Hide input while processing
                inputType="email"
                inputPlaceholder="Enter email"
                isLoading={loading} // 👈 Pass this prop to your component
                onConfirm={(value) => {
                    if (!value || loading) return;
                    forgotPassword(value);
                }}
                onCancel={() => !loading && setShow(false)} // Prevent close during loading
            />
        )}

        
        {toast && <Toast key={toast.id}  type={toast.type as any} message={toast.message} onClose={() => setToast(null)} />}
            <div className="login-container">
                <div className="login-title">
                    <h2>LOG IN</h2>
                </div>
                <div className="login-form">
                    <form onSubmit={handlesubmit}>
                       {!showpassword && (<>
                            <input 
                            type="email"
                            name="email" 
                            placeholder="Email"
                            value={formData.email}
                            onChange = {handleChange}
                            />

                            <input 
                            type="text" 
                            name="password"
                            placeholder="password"
                            value={formData.password}
                            onChange = {handleChange}
                            />

                            <button type="button" className="for-btn" onClick={() => setShow(true)}>Forgot password?</button>
                            </>
                        )
                        }
                        {showpassword && ( <>

                        <input 
                            type="email"
                            name="email" 
                            placeholder="Email"
                            value={formData.email}
                            onChange = {handleChange}
                            readOnly/>

                            <input 
                            type="text" 
                            name="password"
                            placeholder="password"
                            value={formData.password}
                            onChange = {handleChange}
                            readOnly/>

                            <input 
                            type="text" 
                            name="password1"
                            placeholder="New password"
                            value={password1}
                            onChange = {(e)=>setPassword1(e.target.value)}
                            />

                            <input 
                            type="text" 
                            name="password2"
                            placeholder="reenter New password"
                            value={password2}
                            onChange = {(e)=>setPassword2(e.target.value)}
                            /></>
                        )}


                        <button value="" type="submit" className="btn">
                        Login
                        </button>

                        <GoogleLoginButton />
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
import { useEffect, useState } from "react";
import "../styles/Toast.css";

type ToastProps = {
  type?: "success" | "error" | "warning" | "info";
  message: string;
  onClose: () => void;
};

const Toast = ({ type = "info", message, onClose }: ToastProps) => {
  const [progress, setProgress] = useState(100);

  const colors = {
    success: { icon: "✔", bg: "#d1fae5", accent: "#10b981", text: "#065f46" },
    error: { icon: "❌", bg: "#fee2e2", accent: "#ef4444", text: "#991b1b" },
    warning: { icon: "⚠️", bg: "#fef3c7", accent: "#f59e0b", text: "#78350f" },
    info: { icon: "ℹ️", bg: "#e0f2fe", accent: "#3b82f6", text: "#1e40af" },
  };

  const current = colors[type];

  // useEffect(() => {
  //   const interval = 20;
  //   const step = (interval / 2000) * 100;

  //   const timer = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev <= 0) {
  //         clearInterval(timer);
  //         onClose();
  //         return 0;
  //       }
  //       return prev - step;
  //     });
  //   }, interval);

  //   return () => clearInterval(timer);
  // }, [onClose]);

  return (
    <>
    <div className="toast" style={{ backgroundColor: current.bg, borderLeft: `6px solid ${current.accent}` }}>
      <div className="toast-icon" style={{ background: current.accent, color: "#fff" }}>{current.icon}</div> {/* can be !, ⚠️, ℹ️ */}
      <div className="toast-content" >
        {message}
      </div>
      <button className="toast-close" onClick={onClose}>✕</button>

      {/* ⏳ Progress Line */}
      {/* <div className="toast-timer">
        <div
          className="toast-timer-fill"
          style={{ width: `${progress}%`, background: current.accent }}
        />
      </div> */}
    </div>
  </>
  );
};

export default Toast;
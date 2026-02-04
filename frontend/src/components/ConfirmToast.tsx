import "../styles/ConfirmToast.css";
import { useState } from "react";

interface ConfirmToastProps {
  message: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;

  isLoading?: boolean;
  showInput?: boolean;
  inputPlaceholder?: string;
  inputType?: string;
}

const ConfirmToast = ({
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  showInput = false,
  inputPlaceholder = "",
  inputType = "text",
}: ConfirmToastProps) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="confirm-toast-overlay">
      <div className="confirm-toast">
        <p>{message}</p>

        {showInput && (
          <input
            type={inputType}
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="confirm-input"
            disabled={isLoading}
          />
        )}

        <div className="confirm-buttons">
          <button
            className="btn confirm-yes"
            onClick={() => onConfirm(inputValue)}
            disabled={showInput && !inputValue.trim()}
          >
            Yes
          </button>

          <button className="btn confirm-no" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmToast;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSendOTP = () => {

    if (!email) {
      alert("Enter email");
      return;
    }

    alert("OTP sent to " + email + " (simulation)");
    setOtpSent(true);
  };

  const handleVerifyOTP = () => {

    if (!otp) {
      alert("Enter OTP");
      return;
    }

    alert("Login successful via OTP");
    navigate("/dashboard");
  };

  return (

    <div className="auth-container">

      <div className="auth-box">

        <h2>Forgot Password</h2>

        {!otpSent ? (
          <>
            <input
              type="email"
              placeholder="Enter email"
              onChange={(e)=>setEmail(e.target.value)}
            />

            <button onClick={handleSendOTP}>
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              onChange={(e)=>setOtp(e.target.value)}
            />

            <button onClick={handleVerifyOTP}>
              Verify & Login
            </button>
          </>
        )}

      </div>

    </div>

  );
}

export default ForgotPassword;

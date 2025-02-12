import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassoword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const {backendUrl} = useContext(AppContext)
  const navigate = useNavigate();
  const inputRefs = React.useRef([]);

  axios.defaults.withCredentials = true;

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handKeyDowm = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // Method for sending password reset otp
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {

      const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email});

      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success &&  setIsEmailSent(true)  
      
    } catch (error) {
      toast.error(error.message);
    }
    
  }

  // Method to check otp api onsubmitting the OTP
  const onSubmitOtp = async (e) => {

    e.preventDefault();

    const otp = inputRefs.current.map(e => e.value)
    setOtp(otp.join(''));
    setIsOtpSubmitted(true)

    try {
      
    } catch (error) {
      
    }
    
  }

  //
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try{
      const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {email,otp,newPassword})

      data.success ? toast.success(data.message) : toast.error(error.message);

      data.success && navigate('/login')
    }
    catch(error){
      toast.error(error.message);
    }
    
  }



  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        alt=""
      />
      {/* enter email id */}
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address.
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className="w-3 h-3" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="Email id"
              className="bg-transparent outline-none text-white"
            />
          </div>
          <button className="text-white py-2.5 w-full bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full mt-3">
            Submit
          </button>
        </form>
      )}

      {/*  OTP input form */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code sent to your email id.
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                  type="text"
                  maxLength={1}
                  key={index}
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handKeyDowm(e, index)}
                  required
                />
              ))}
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white text-center"
          >
            Submit
          </button>
        </form>
      )}

      {/* Enter new password */}

      {isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the new password below.
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className="w-3 h-3" />
            <input
              value={newPassword}
              onChange={(e) => setNewPassoword(e.target.value)}
              required
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none text-white"
            />
          </div>
          <button className="text-white py-2.5 w-full bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full mt-3">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;

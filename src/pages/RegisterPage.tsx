import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import useGoogleLogin from "../hooks/useGoogleLogin";
import useEmailRegister from "../hooks/useEmailRegister";
import { LoginButton } from "@telegram-auth/react";
import useTelegramLogin from "../hooks/useTelegramLogin";
import { message, Spin } from "antd";
import logo from '../images/logo.png'; // Import the image file

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signalId } = useParams();
  const [searchParams] = useSearchParams();
  const refernece = searchParams.get("ref");
  const { handleGoogleLogin, googleLoginPending, googleLoginError } =
    useGoogleLogin(refernece);
  const {
    handleRegisterEmailAuth,
    handleRegisterEmailAuthPending,
    handleRegisterEmailAuthError,
  } = useEmailRegister(signalId, refernece);
  const { handleTelegramLogin, handleTelegramLoginPending } =
    useTelegramLogin();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailTrimmed = email.trim();
    const usernameTrimmed = username.trim();
    const passwordTrimmed = password.trim();

    if (!emailTrimmed) {
      message.warning("Email is required");
      return;
    }

    if (!usernameTrimmed) {
      message.warning("Username is required");
      return;
    }

    if (!passwordTrimmed) {
      message.warning("Password is required");
      return;
    }

    // Custom email domain check
    const commonEmailDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "yopmail.com"];
    const emailParts = emailTrimmed.split("@");

    if (emailParts.length !== 2 || !emailParts[1].includes(".")) {
      message.error("Please enter a valid email address");
      return;
    }

    const domain = emailParts[1].toLowerCase();
    const isCommon = commonEmailDomains.includes(domain);

    if (!isCommon) {
      message.error("Invalid email format. Please enter a valid email address.");
      return;
    }

    const payload = {
      email: emailTrimmed,
      password: passwordTrimmed,
      username: usernameTrimmed,
      usertype: "TRADER",
      refernece,
    };

    await handleRegisterEmailAuth(payload);
  };

  const handleNavigation = () => {
    if (refernece) {
      navigate(`/loginReferral?ref=${refernece}`, { replace: true });
    }else
    if (signalId && refernece) {
      navigate(`/login/signal/${signalId}?ref=${refernece}`, { replace: true });
    } else {
      navigate("/login");
    }
  };
  return (
    <Spin spinning={handleTelegramLoginPending}>
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            {/* Traderate */}
            <img src={logo} alt="Logo" className="loginLogo" width="60px" />
          </div>
        </div>

        <div className="px-6 py-8 max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-slate-400">Join our trading community</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  placeholder="Choose a username"
                  required
                />
                <User className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  placeholder="Create a password"
                  required
                />
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                {passwordVisible ? (
                  <EyeOff
                    className="w-5 h-5 text-slate-400 absolute right-4 top-3.5 cursor-pointer"
                    onClick={() => setPasswordVisible(false)}
                  />
                ) : (
                  <Eye
                    className="w-5 h-5 text-slate-400 absolute right-4 top-3.5 cursor-pointer"
                    onClick={() => setPasswordVisible(true)}
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={googleLoginPending || handleRegisterEmailAuthPending}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {handleRegisterEmailAuthPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
            {handleRegisterEmailAuthError && (
              <p className="text-red-500 text-sm">
                Register failed. Please try again.
              </p>
            )}
            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={handleNavigation}
                className="text-pink-500 hover:text-pink-400 transition-colors"
                disabled={googleLoginPending || handleRegisterEmailAuthPending}
              >
                Sign in
              </button>
            </p>
            <div className="relative text-center pt-4 pb-1 border-b border-white w-full text-slate-400 text-sm">
              or
            </div>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => handleGoogleLogin()}
                disabled={googleLoginPending || handleRegisterEmailAuthPending}
                className="flex items-center gap-3 px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-100 transition disabled:opacity-50"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>

              {googleLoginError && (
                <p className="text-red-500 text-sm">
                  Register failed. Please try again.
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <div>
                <LoginButton
                  buttonSize="large"
                  botUsername={import.meta.env.VITE_TELEGRAM_BOT}
                  onAuthCallback={(user) => {
                    handleTelegramLogin(user);
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Spin>
  );
};

export default RegisterPage;

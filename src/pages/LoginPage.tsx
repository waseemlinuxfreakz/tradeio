import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { message, Spin } from "antd";
import { Loader2 } from "lucide-react";
import useGoogleLogin from "../hooks/useGoogleLogin";
import useEmailLogin from "../hooks/useEmailLogin";
import { LoginButton } from "@telegram-auth/react";
import useTelegramLogin from "../hooks/useTelegramLogin";
import { If, Then } from "react-if";
import logo from '../images/logo.png'; // Import the image file

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signalId } = useParams();
  const [searchParams] = useSearchParams();
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const isTelegram = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const { handleTelegramLogin, handleTelegramLoginPending } =
    useTelegramLogin();
  const reference = searchParams.get("ref");
  const { handleGoogleLogin, googleLoginPending, googleLoginError } =
    useGoogleLogin(reference);
  const {
    handleLoginEmailAuth,
    handleLoginEmailAuthPending,
    handleLoginEmailAuthError,
  } = useEmailLogin(signalId);

  const handleRegisterClick = () => {
    if (signalId && reference) {
      navigate(`/signal/${signalId}?ref=${reference}`, { replace: true });
    } else {
      navigate("/register");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      message.warning("Please enter your email address.");
      return;
    }

    if (!trimmedPassword) {
      message.warning("Please enter your password.");
      return;
    }
    const commonEmailDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "yopmail.com",
    ];
    const emailParts = trimmedEmail.split("@");

    if (emailParts.length !== 2 || !emailParts[1].includes(".")) {
      message.error("Please enter a valid email address");
      return;
    }

    const domain = emailParts[1].toLowerCase();
    const isCommon = commonEmailDomains.includes(domain);

    if (!isCommon) {
      message.error(
        "Invalid email format. Please enter a valid email address."
      );
      return;
    }
    const payload = {
      email: trimmedEmail,
      password: trimmedPassword,
      reference,
    };

    handleLoginEmailAuth(payload);
  };

  return (
    <Spin spinning={handleLoginEmailAuthPending || handleTelegramLoginPending}>
      <div className="min-h-screen bg-slate-900 text-white">
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
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-slate-400">Sign in to continue trading</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <If condition={!(isTelegram && isMobile)}>
              <Then>
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
                  <label className="text-sm text-slate-400">Password</label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                      placeholder="Enter your password"
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
                  disabled={handleLoginEmailAuthPending || googleLoginPending}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {handleLoginEmailAuthPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {handleLoginEmailAuthError && (
                  <p className="text-red-500 text-sm">
                    Login failed. Please try again.
                  </p>
                )}
                <div className="mt-4 flex justify-center">
                  <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                    Don't have an account?
                  </span>
                  <div
                    className="ml-1 text-sm cursor-pointer font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-opacity"
                    onClick={handleRegisterClick}
                  >
                    Register
                  </div>
                </div>
                <div className="relative text-center pt-4 pb-1 border-b border-white w-full text-slate-400 text-sm">
                  or
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGoogleLogin()}
                    disabled={googleLoginPending || handleLoginEmailAuthPending}
                    className="flex items-center gap-3 px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    {googleLoginPending
                      ? "Signing in..."
                      : "Continue with Google"}
                  </button>

                  {googleLoginError && (
                    <p className="text-red-500 text-sm">
                      Login failed. Please try again.
                    </p>
                  )}
                </div>
              </Then>
            </If>
            <div className="flex flex-col items-center gap-2">
              <div>
                <LoginButton
                  buttonSize="large"
                  botUsername={import.meta.env.VITE_TELEGRAM_BOT}
                  onAuthCallback={(user) => {
                    const tg = window.Telegram?.WebApp;
                    const isTelegram =
                      window.Telegram?.WebApp?.initDataUnsafe?.user;

                    if (tg) {
                      tg.ready();
                      const isTelegram = tg.initData;
                      const isMobile = /Mobi|Android/i.test(
                        navigator.userAgent
                      );
                      if (
                        window?.Telegram?.WebApp?.initDataUnsafe?.user &&
                        isMobile &&
                        isTelegram
                      )
                        handleTelegramLogin(
                          window?.Telegram?.WebApp?.initDataUnsafe?.user
                        );
                      else if (isMobile && !isTelegram) {
                        window.location.href = `https://t.me/${import.meta.env.VITE_TELEGRAM_BOT}`;
                      } else {
                        handleTelegramLogin(user);
                      }
                    } else if (isMobile) {
                      window.location.href = `https://t.me/${import.meta.env.VITE_TELEGRAM_BOT}`;
                    } else {
                      handleTelegramLogin(user);
                    }
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

export default LoginPage;

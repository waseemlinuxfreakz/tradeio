import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../lib/store";
import { useNavigate } from "react-router-dom";
import { telegramSignIn } from "../apis/apiEndpoints";
import { message } from "antd";

const useTelegramLogin = () => {
    const navigate = useNavigate();
    const {
        mutateAsync: handleTelegramLogin,
        isPending: handleTelegramLoginPending,
    } = useMutation({
        mutationFn: (payload: {}) =>
            telegramSignIn(payload),
        onSuccess: (response: any) => {
            if (response.status === 200) {
                const token = response.data.data.token;
                localStorage.setItem("token", token);
                useAuthStore.setState({
                    isAuthenticated: true,
                    user: { email: "" },
                });
                const isSignalShare = localStorage.getItem("signal");
                if (isSignalShare) {
                    navigate(`/signal/${isSignalShare}`)
                    localStorage.removeItem("signal");
                } else {
                    message.success("Login successfully using telegram");
                    navigate("/dashbaord");
                }
            } else {
                message.error("Login failed. Please try again.");
            }
        },
        onError: (error) => {
            if (error?.message) {
                message.error(error.message);
            } else {
                message.error("Login failed. Please try again.");
            }
        },
    });
    return {
        handleTelegramLogin,
        handleTelegramLoginPending,
    };
};

export default useTelegramLogin;

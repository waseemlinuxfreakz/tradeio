import { useMutation } from "@tanstack/react-query";
import React from "react";
import { EmailAuthPayload } from "../types/auth";
import { useAuthStore } from "../lib/store";
import { useNavigate } from "react-router-dom";
import { handleLoginFirebaseEmailAuth } from "../apis/apiEndpoints";
import { message } from "antd";

const useEmailLogin = (signalId: string | undefined) => {
	const navigate = useNavigate();

	const {
		mutateAsync: handleLoginEmailAuth,
		isPending: handleLoginEmailAuthPending,
		isError: handleLoginEmailAuthError,
	} = useMutation({
		mutationFn: async (payload: EmailAuthPayload) => {
			const res = await handleLoginFirebaseEmailAuth(payload);
			return res;
		},
		onSuccess: (response) => {
			if (!response || !response.data) {
				console.warn("Login failed or returned no data");
				return;
			}

			const token = response.data.token;
			const userEmail = response.data.user.email;

			localStorage.setItem("token", token);
			useAuthStore.setState({
				isAuthenticated: true,
				user: { email: userEmail },
			});

			console.log("✅ Navigating to:", signalId ? `/login/signal/${signalId}` : "/dashboard");
			navigate(signalId ? `/signal/${signalId}` : "/dashboard");
		}
		,
		onError: (error: any) => {
			console.error("❌ Login failed:", error);
			message.error(error.message || "Login failed. Please try again.");
		},
	});

	return {
		handleLoginEmailAuth,
		handleLoginEmailAuthPending,
		handleLoginEmailAuthError,
	};
};

export default useEmailLogin;

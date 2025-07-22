import { useMutation } from "@tanstack/react-query";
import React from "react";
import { EmailAuthPayload } from "../types/auth";
import { useAuthStore } from "../lib/store";
import { useNavigate } from "react-router-dom";
import { handleRegisterFirebaseEmailAuth } from "../apis/apiEndpoints";
import { message } from "antd";

const useEmailRegister = (
	signalId: string | undefined,
	reference: string | null
) => {
	const navigate = useNavigate();
	const {
		mutateAsync: handleRegisterEmailAuth,
		isPending: handleRegisterEmailAuthPending,
		isError: handleRegisterEmailAuthError,
	} = useMutation({
		mutationFn: (payload: EmailAuthPayload) =>
			handleRegisterFirebaseEmailAuth(payload),
		onSuccess: (response: any) => {

			if (response && response.data) {
				if (signalId && reference) {
					navigate(`/login/signal/${signalId}?ref=${reference}`, {
						replace: true,
					});
				} else {
					navigate("/login");
				}
			}
		}
		,
		onError: (error) => {
			console.log("The error", error);
			if (error) {
				message.error(error.message);
			}
		},
	});
	return {
		handleRegisterEmailAuth,
		handleRegisterEmailAuthPending,
		handleRegisterEmailAuthError,
	};
};

export default useEmailRegister;

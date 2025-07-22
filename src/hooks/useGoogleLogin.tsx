import React from "react";
import {loginWithGoogle} from "../apis/apiEndpoints";
import {useMutation} from "@tanstack/react-query";
import {message} from "antd";
import {useAuthStore} from "../lib/store";
import {useNavigate} from "react-router-dom";

const useGoogleLogin = (reference:string|null) => {
	const navigate = useNavigate();
	const {
		mutateAsync: handleGoogleLogin,
		isPending: googleLoginPending,
		isError: googleLoginError,
	} = useMutation({
		mutationFn: () => loginWithGoogle(reference),
		onSuccess: (response) => {
			if (response?.status===200) {
				message.success("User logged in successfully");
				localStorage.setItem("token", response.data.token);
				useAuthStore.setState({
					isAuthenticated: true,
					user: {email: response.data.user.email},
				});
				if (response.data.token) {
					navigate("/dashboard", {replace: true});
				} else {
					navigate("/");
				}
			}
		},
	
	});
	return {
		handleGoogleLogin,
		googleLoginPending,
		googleLoginError,
	};
};

export default useGoogleLogin;

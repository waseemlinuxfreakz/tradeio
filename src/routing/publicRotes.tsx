import {lazy} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import ReferralRedirect from "../pages/ReferralRedirect";
import LoginReferralRedirect from "../pages/LoginReferralRedirect";
const LandingPage = lazy(() => import("../pages/LandingPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));

const PublicRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/signal/:signalId" element={<RegisterPage />} />
			<Route path="/login/signal/:signalId" element={<LoginPage />} />
			<Route path="/referrals" element={<ReferralRedirect/>}/>
			<Route path="/loginReferral" element={<LoginReferralRedirect/>}/>
			<Route path="/analyst/:id" element={<ReferralRedirect/>}/>
			<Route path="*" element={<Navigate to="/login" />} />
		</Routes>
	);
};

export default PublicRoutes;

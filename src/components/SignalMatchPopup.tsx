import React, {useEffect, useState} from "react";
import {X, ArrowRight, User} from "lucide-react";
import ExecuteSignalModal from "./ExecuteSignalModal";
import {getDecodedUserToken} from "../utils";
import {Signals} from "../types/signal";

interface SignalMatchPopupProps {
	onClose: () => void;
	signal: Signals;
}

const SignalMatchPopup = ({onClose, signal}: SignalMatchPopupProps) => {
	const [showExecuteModal, setShowExecuteModal] = useState(false);
	const user = getDecodedUserToken();
	const handleExecute = () => {
		setShowExecuteModal(true);
	};

	return (
		<>
			<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
				<div className="w-full max-w-sm bg-slate-800 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-300">
					{/* Header */}
					<div className="px-6 py-4 border-b border-slate-700/50 flex justify-between items-center">
						<h3 className="text-lg font-bold">Signal Match!</h3>
						<button
							onClick={onClose}
							className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					{/* Content */}
					<div className="p-6">
						<div className="flex justify-center items-center gap-4 mb-6">
							<div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-0.5 flex items-center justify-center">
								{signal && signal.user.image ? (
									<img
										src={signal.user.image}
										alt="User"
										referrerPolicy="no-referrer"
										className="w-full h-full rounded-full object-cover"
										onError={() => {
											console.error(
												"❌ Image failed to load:",
												signal.user.image
											);
										}}
									/>
								) : (
									<User className="w-10 h-10 text-white" />
								)}
							</div>
							<ArrowRight className="w-6 h-6 text-slate-400" />
							<div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-0.5 flex items-center justify-center">
								{user && user.image ? (
									<img
										src={user.image}
										alt="User"
										referrerPolicy="no-referrer"
										className="w-full h-full rounded-full object-cover"
										onError={() => {
											console.error("❌ Image failed to load:", user.image);
										}}
									/>
								) : (
									<User className="w-10 h-10 text-white" />
								)}
							</div>
						</div>

						<p className="text-center text-slate-300 mb-6">
							You've matched with this signal! Execute now to start trading
							together.
						</p>

						<button
							onClick={handleExecute}
							className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
						>
							Join Trade Now
						</button>
					</div>

					{/* <div className="bg-slate-700/30 px-6 py-4">
						<p className="text-sm text-slate-400 text-center">
							92% of traders agreed with this signal
						</p>
					</div> */}
				</div>
			</div>

			{showExecuteModal && (
				<ExecuteSignalModal
					onClose={() => setShowExecuteModal(false)}
					signalData={signal}
				/>
			)}
		</>
	);
};

export default SignalMatchPopup;

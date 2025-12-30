import { useState, useEffect } from "react";
import { SocialPlatform } from "../../types";
import * as Icons from "../Icons";

interface ConnectAccountModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConnect: (platform: SocialPlatform, data: any) => void;
}

type Step = "select" | "webview" | "verifying" | "success";

export function ConnectAccountModal({
	isOpen,
	onClose,
	onConnect,
}: ConnectAccountModalProps) {
	const [step, setStep] = useState<Step>("select");
	const [selectedPlatform, setSelectedPlatform] =
		useState<SocialPlatform | null>(null);

	useEffect(() => {
		if (isOpen) setStep("select");
	}, [isOpen]);

	const handlePlatformSelect = (p: SocialPlatform) => {
		setSelectedPlatform(p);
		setStep("webview");
	};

	const handleSimulateLogin = () => {
		setStep("verifying");
		setTimeout(() => setStep("success"), 2000);
	};

	const handleFinish = () => {
		if (selectedPlatform) onConnect(selectedPlatform, {});
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="modal modal-open">
			<div className="modal-box w-11/12 max-w-3xl p-0 bg-base-100 overflow-hidden shadow-2xl flex flex-col h-[600px] border border-base-300">
				{/* Header */}
				<div className="p-4 bg-base-200 flex justify-between items-center border-b border-base-300">
					<div className="flex items-center gap-2">
						{step !== "select" && (
							<button
								type="button"
								onClick={() => setStep("select")}
								className="btn btn-ghost btn-xs btn-circle"
							>
								<Icons.ChevronLeft className="w-4 h-4" />
							</button>
						)}
						<h3 className="font-bold text-sm">Account Connection Manager</h3>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="btn btn-ghost btn-xs btn-circle"
					>
						<Icons.X className="w-4 h-4" />
					</button>
				</div>

				{/* Dynamic Content */}
				<div className="flex-1 flex flex-col overflow-hidden">
					{/* Progress Indicator */}
					<div className="p-4 flex justify-center border-b border-base-300 bg-base-100">
						<ul className="steps steps-horizontal w-full max-w-md text-[10px] font-bold">
							<li
								className={`step ${["select", "webview", "verifying", "success"].includes(step) ? "step-primary" : ""}`}
							>
								Target
							</li>
							<li
								className={`step ${["webview", "verifying", "success"].includes(step) ? "step-primary" : ""}`}
							>
								Authenticate
							</li>
							<li
								className={`step ${["verifying", "success"].includes(step) ? "step-primary" : ""}`}
							>
								Secure
							</li>
							<li
								className={`step ${["success"].includes(step) ? "step-primary" : ""}`}
							>
								Complete
							</li>
						</ul>
					</div>

					<div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center">
						{step === "select" && (
							<div className="w-full max-w-xl space-y-6">
								<div className="text-center">
									<h2 className="text-2xl font-bold mb-2">Connect Channel</h2>
									<p className="text-xs opacity-50">
										Choose a platform to authenticate into our secure automation
										cloud.
									</p>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<button
										type="button"
										onClick={() => handlePlatformSelect(SocialPlatform.XHS)}
										className="btn btn-outline btn-xl flex-col h-32 gap-3 hover:bg-xhs/10 hover:border-xhs group"
									>
										<Icons.XhsLogo className="w-10 h-10 group-hover:text-xhs" />
										<span className="text-xs font-bold">Xiaohongshu</span>
									</button>
									<button
										type="button"
										onClick={() => handlePlatformSelect(SocialPlatform.TIKTOK)}
										className="btn btn-outline btn-xl flex-col h-32 gap-3 hover:bg-tiktok/10 hover:border-tiktok group"
									>
										<Icons.TikTokLogo className="w-10 h-10 group-hover:text-tiktok" />
										<span className="text-xs font-bold">TikTok</span>
									</button>
								</div>
							</div>
						)}

						{step === "webview" && (
							<div className="w-full flex flex-col items-center gap-6">
								<div className="mockup-browser border bg-base-300 w-full max-w-md shadow-lg">
									<div className="mockup-browser-toolbar">
										<div className="input text-[10px]">
											https://{selectedPlatform?.toLowerCase()}.com/login
										</div>
									</div>
									<div className="flex flex-col items-center px-4 py-16 bg-white text-black gap-4">
										<div className="font-bold text-sm">
											Login via {selectedPlatform}
										</div>
										<div className="flex flex-col gap-2 w-full max-w-xs">
											<input
												disabled
												type="text"
												placeholder="Username"
												className="input input-sm input-bordered bg-gray-50"
											/>
											<input
												disabled
												type="password"
												placeholder="Password"
												className="input input-sm input-bordered bg-gray-50"
											/>
											<button
												type="button"
												onClick={handleSimulateLogin}
												className="btn btn-neutral btn-sm w-full"
											>
												Log In Now
											</button>
										</div>
									</div>
								</div>
								<p className="text-xs opacity-40 italic">
									Using isolated sandbox for credential safety.
								</p>
							</div>
						)}

						{step === "verifying" && (
							<div className="flex flex-col items-center gap-4">
								<span className="loading loading-spinner loading-lg text-primary"></span>
								<p className="font-bold animate-pulse">
									Syncing Secure Handshake...
								</p>
							</div>
						)}

						{step === "success" && (
							<div className="text-center space-y-6 animate-in zoom-in">
								<div className="avatar bg-success/20 p-6 rounded-full inline-block">
									<Icons.Check className="w-16 h-16 text-success" />
								</div>
								<div>
									<h2 className="text-3xl font-extrabold mb-1">
										Authenticated!
									</h2>
									<p className="text-sm opacity-60">
										Session established and encrypted.
									</p>
								</div>
								<button
									type="button"
									onClick={handleFinish}
									className="btn btn-primary w-full max-w-xs"
								>
									Return to Dashboard
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

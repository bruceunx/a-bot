import { useState, useEffect, useRef } from "react";
import { SocialPlatform } from "../../types";
import * as Icons from "../Icons";
import WebviewBrowser from "./WebviewBrowser";

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
	const [logs, setLogs] = useState<string[]>([]);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [sessionDetected, setSessionDetected] = useState(false);

	const logEndRef = useRef<HTMLDivElement>(null);

	// Auto-scroll logs
	useEffect(() => {
		logEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [logs]);

	useEffect(() => {
		if (isOpen) {
			setStep("select");
			setLogs([]);
			setSessionDetected(false);
		}
	}, [isOpen]);

	const addLog = (msg: string) => {
		const time = new Date().toLocaleTimeString([], {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
		setLogs((prev) => [...prev, `[${time}] ${msg}`]);
	};

	const handlePlatformSelect = (p: SocialPlatform) => {
		setSelectedPlatform(p);
		setStep("webview");
		addLog(`Initializing sandboxed browser for ${p}...`);
		addLog(`Bypassing proxy filters...`);
		addLog(`Waiting for user login on ${p} official page...`);
	};

	const handleRefresh = () => {
		setIsRefreshing(true);
		addLog(`Refreshing session...`);
		setTimeout(() => {
			setIsRefreshing(false);
			addLog(`Browser context restored.`);
		}, 800);
	};

	// Simulate detecting a login state
	const handleDetectLogin = () => {
		setSessionDetected(true);
		addLog(`CRITICAL: Auth token detected in header stream.`);
		addLog(`Injecting session verification script...`);

		setTimeout(() => {
			setStep("verifying");
			addLog(`Validating session persistence...`);
		}, 1200);

		setTimeout(() => {
			setStep("success");
			addLog(`Account linked successfully.`);
		}, 3500);
	};

	const handleFinish = () => {
		if (selectedPlatform) onConnect(selectedPlatform, {});
		onClose();
	};

	const getPlatformUrl = () => {
		if (selectedPlatform === SocialPlatform.XHS)
			return "https://creator.xiaohongshu.com";
		if (selectedPlatform === SocialPlatform.TIKTOK)
			return "https://www.tiktok.com/login";
		return "https://google.com";
	};

	if (!isOpen) return null;

	return (
		<div className="modal modal-open select-none">
			<div className="modal-box w-11/12 max-w-5xl p-0 bg-base-100 overflow-hidden shadow-2xl flex flex-col h-[750px] border border-base-300">
				{/* Header */}
				<div className="p-4 bg-base-200 flex justify-between items-center border-b border-base-300 shrink-0">
					<div className="flex items-center gap-2">
						{step !== "select" && step !== "success" && (
							<button
								onClick={() => setStep("select")}
								className="btn btn-ghost btn-xs btn-circle"
							>
								<Icons.ChevronLeft className="w-4 h-4" />
							</button>
						)}
						<div className="flex flex-col">
							<h3 className="font-bold text-xs uppercase tracking-tight">
								Automation Node Configurator
							</h3>
							{selectedPlatform && (
								<span className="text-[10px] opacity-50">
									Target: {selectedPlatform}
								</span>
							)}
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="badge badge-outline badge-xs gap-1 opacity-50">
							<div className="w-1 h-1 rounded-full bg-success"></div>
							SSL Secured
						</div>
						<button
							onClick={onClose}
							className="btn btn-ghost btn-xs btn-circle"
						>
							<Icons.X className="w-4 h-4" />
						</button>
					</div>
				</div>

				{/* Dynamic Content */}
				<div className="flex-1 flex flex-col overflow-hidden">
					{/* Progress Indicator */}
					<div className="p-3 flex justify-center border-b border-base-300 bg-base-100 shrink-0">
						<ul className="steps steps-horizontal w-full max-w-2xl text-[10px] font-bold">
							<li
								className={`step ${["select", "webview", "verifying", "success"].includes(step) ? "step-primary" : ""}`}
							>
								Target
							</li>
							<li
								className={`step ${["webview", "verifying", "success"].includes(step) ? "step-primary" : ""}`}
							>
								Interactive Login
							</li>
							<li
								className={`step ${["verifying", "success"].includes(step) ? "step-primary" : ""}`}
							>
								Token Extraction
							</li>
							<li
								className={`step ${["success"].includes(step) ? "step-primary" : ""}`}
							>
								Ready
							</li>
						</ul>
					</div>

					<div className="flex-1 overflow-hidden flex">
						{step === "select" ? (
							<div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
								<div className="space-y-2">
									<h2 className="text-3xl font-black tracking-tighter">
										Add Automation Node
									</h2>
									<p className="text-sm opacity-50 max-w-md">
										Connect your social accounts to our cloud-headless
										architecture. We use isolated browser environments for
										maximum safety.
									</p>
								</div>
								<div className="grid grid-cols-2 gap-6 w-full max-w-lg">
									<button
										onClick={() => handlePlatformSelect(SocialPlatform.XHS)}
										className="btn btn-outline btn-xl flex-col h-40 gap-4 hover:bg-xhs/10 hover:border-xhs group border-2"
									>
										<Icons.XhsLogo className="w-12 h-12 group-hover:text-xhs transition-transform group-hover:scale-110" />
										<div className="flex flex-col">
											<span className="text-sm font-bold">Xiaohongshu</span>
											<span className="text-[10px] opacity-40">
												Mainland China Node
											</span>
										</div>
									</button>
									<button
										onClick={() => handlePlatformSelect(SocialPlatform.TIKTOK)}
										className="btn btn-outline btn-xl flex-col h-40 gap-4 hover:bg-tiktok/10 hover:border-tiktok group border-2"
									>
										<Icons.TikTokLogo className="w-12 h-12 group-hover:text-tiktok transition-transform group-hover:scale-110" />
										<div className="flex flex-col">
											<span className="text-sm font-bold">TikTok</span>
											<span className="text-[10px] opacity-40">
												Global Edge Node
											</span>
										</div>
									</button>
								</div>
							</div>
						) : step === "webview" ? (
							<div className="flex-1 flex flex-col p-4 gap-4 animate-in slide-in-from-bottom-4 duration-300">
								<WebviewBrowser />

								{/* Automation Logs Area */}
								<div className="h-32 bg-neutral text-neutral-content rounded-xl p-3 font-mono text-[10px] overflow-y-auto border border-white/5 shadow-2xl shrink-0">
									<div className="flex items-center gap-2 mb-2 pb-1 border-b border-white/10 opacity-50">
										<Icons.Bot className="w-3 h-3" />
										<span>ENGINE_LOGS_V3.1</span>
									</div>
									{logs.map((log, i) => (
										<div
											key={i}
											className="mb-0.5 animate-in fade-in slide-in-from-left-2 duration-300"
										>
											<span className="opacity-40 mr-2">$</span>
											<span
												className={
													log.includes("CRITICAL")
														? "text-warning font-bold"
														: ""
												}
											>
												{log}
											</span>
										</div>
									))}
									<div ref={logEndRef} />
								</div>
							</div>
						) : step === "verifying" ? (
							<div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 animate-in fade-in duration-500">
								<div className="relative">
									<span className="loading loading-spinner w-24 h-24 text-primary opacity-20"></span>
									<div className="absolute inset-0 flex items-center justify-center">
										<Icons.Lock className="w-8 h-8 text-primary animate-pulse" />
									</div>
								</div>
								<div className="text-center space-y-2">
									<h3 className="text-xl font-bold tracking-tight">
										Verifying Security Handshake
									</h3>
									<p className="text-sm opacity-50">
										Hardening session tokens and initializing encryption keys...
									</p>
								</div>
								<div className="w-full max-w-xs bg-base-200 h-1.5 rounded-full overflow-hidden">
									<div className="h-full bg-primary animate-progress-indefinite w-full"></div>
								</div>
							</div>
						) : (
							<div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
								<div className="relative">
									<div className="absolute -inset-4 bg-success/20 rounded-full blur-2xl animate-pulse"></div>
									<div className="w-20 h-20 bg-success text-success-content rounded-3xl flex items-center justify-center shadow-2xl relative rotate-3">
										<Icons.Check className="w-12 h-12 stroke-[3px]" />
									</div>
								</div>
								<div className="space-y-2">
									<h2 className="text-4xl font-black tracking-tighter">
										Connection Ready
									</h2>
									<p className="text-sm opacity-50 max-w-sm mx-auto">
										Your {selectedPlatform} account is now connected to the
										SocialFlow node network. You can start publishing
										immediately.
									</p>
								</div>
								<div className="grid grid-cols-2 gap-3 w-full max-w-md">
									<div className="bg-base-200 p-4 rounded-2xl border border-base-300 text-left">
										<p className="text-[10px] font-bold opacity-40 uppercase">
											Session Status
										</p>
										<p className="text-xs font-bold text-success">
											Active / Secure
										</p>
									</div>
									<div className="bg-base-200 p-4 rounded-2xl border border-base-300 text-left">
										<p className="text-[10px] font-bold opacity-40 uppercase">
											Node ID
										</p>
										<p className="text-xs font-mono font-bold">
											SF-{Math.floor(Math.random() * 9000) + 1000}
										</p>
									</div>
								</div>
								<button
									onClick={handleFinish}
									className="btn btn-primary btn-lg w-full max-w-sm shadow-2xl"
								>
									Go to Dashboard
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
			<style>{`
        @keyframes progress-indefinite {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-indefinite {
          animation: progress-indefinite 2s infinite linear;
        }
      `}</style>
		</div>
	);
}

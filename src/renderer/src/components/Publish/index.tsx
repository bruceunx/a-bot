import type { PublishingJob } from "../../types";

import { TaskStatus, SocialPlatform } from "../../types";
import { useState, useEffect, useMemo } from "react";
import { MOCK_ACCOUNTS } from "../../data";
import * as Icons from "../Icons";

export default function Publisher() {
	const [content, setContent] = useState("");
	const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
	const [jobs, setJobs] = useState<PublishingJob[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [accountSearch, setAccountSearch] = useState("");
	const [filterPlatform, setFilterPlatform] = useState<"All" | SocialPlatform>(
		"All",
	);
	const [filterGroup, setFilterGroup] = useState<string>("All");

	useEffect(() => {
		const interval = setInterval(() => {
			setJobs((currentJobs) =>
				currentJobs.map((job) => {
					if (job.status === TaskStatus.QUEUED)
						return { ...job, status: TaskStatus.PUBLISHING, progress: 10 };
					if (job.status === TaskStatus.PUBLISHING) {
						const newProgress = job.progress + 15;
						return newProgress >= 100
							? { ...job, progress: 100, status: TaskStatus.COMPLETED }
							: { ...job, progress: newProgress };
					}
					return job;
				}),
			);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	// Extract unique groups for the filter dropdown
	const groups = useMemo(() => {
		const g = new Set(MOCK_ACCOUNTS.map((a) => a.group).filter(Boolean));
		return ["All", ...Array.from(g)];
	}, []);

	const filteredAccounts = useMemo(() => {
		return MOCK_ACCOUNTS.filter((acc) => {
			const matchesSearch =
				acc.name.toLowerCase().includes(accountSearch.toLowerCase()) ||
				acc.handle.toLowerCase().includes(accountSearch.toLowerCase());
			const matchesPlatform =
				filterPlatform === "All" || acc.platform === filterPlatform;
			const matchesGroup = filterGroup === "All" || acc.group === filterGroup;
			return matchesSearch && matchesPlatform && matchesGroup;
		});
	}, [accountSearch, filterPlatform, filterGroup]);

	const toggleAccount = (id: string) => {
		setSelectedAccounts((prev) =>
			prev.includes(id) ? prev.filter((accId) => accId !== id) : [...prev, id],
		);
	};

	const toggleAllFiltered = () => {
		const ids = filteredAccounts.map((a) => a.id);
		const allSelected = ids.every((id) => selectedAccounts.includes(id));
		if (allSelected) {
			setSelectedAccounts((prev) => prev.filter((id) => !ids.includes(id)));
		} else {
			setSelectedAccounts((prev) => Array.from(new Set([...prev, ...ids])));
		}
	};

	const handleMagicGenerate = async () => {
		setIsGenerating(true);
		try {
			const result = "test result";
			setContent(result);
		} catch (e) {
			console.error(e);
		} finally {
			setIsGenerating(false);
		}
	};

	const handlePublish = () => {
		if (!content || selectedAccounts.length === 0) return;
		const newJob: PublishingJob = {
			id: Date.now().toString(),
			content,
			targetAccounts: selectedAccounts,
			status: TaskStatus.QUEUED,
			timestamp: new Date().toLocaleTimeString(),
			progress: 0,
		};
		setJobs([newJob, ...jobs]);
		setContent("");
		setSelectedAccounts([]);
	};

	return (
		<div className="p-8 h-full flex flex-col md:flex-row gap-8 animate-in fade-in duration-500 overflow-hidden">
			<div className="flex-1 flex flex-col gap-6 overflow-hidden">
				<header>
					<h1 className="text-3xl font-extrabold tracking-tight mb-2">
						Publisher Studio
					</h1>
					<div className="flex items-center gap-2 text-sm opacity-60">
						<Icons.Users className="w-4 h-4" />
						<span>Targeting {selectedAccounts.length} selected profiles</span>
					</div>
				</header>

				{/* Account Selection Area */}
				<div className="card bg-base-100 border border-base-300 shadow-sm flex-1 overflow-hidden flex flex-col">
					<div className="p-4 bg-base-200/50 flex flex-wrap gap-2 items-center">
						<label className="input input-sm input-bordered flex items-center gap-2 flex-1 min-w-[150px]">
							<Icons.Search className="w-4 h-4 opacity-50" />
							<input
								type="text"
								placeholder="Search..."
								value={accountSearch}
								onChange={(e) => setAccountSearch(e.target.value)}
							/>
						</label>

						{/* Group Filter Dropdown */}
						<select
							className="select select-sm select-bordered"
							value={filterGroup}
							onChange={(e) => setFilterGroup(e.target.value)}
						>
							<option value="All">All Groups</option>
							{groups
								.filter((g) => g !== "All")
								.map((g) => (
									<option key={g} value={g}>
										{g}
									</option>
								))}
						</select>

						<select
							className="select select-sm select-bordered"
							value={filterPlatform}
							onChange={(e) => setFilterPlatform(e.target.value as SocialPlatform)}
						>
							<option value="All">All Platforms</option>
							<option value={SocialPlatform.XHS}>Xiaohongshu</option>
							<option value={SocialPlatform.TIKTOK}>TikTok</option>
						</select>

						<button
							type="button"
							onClick={toggleAllFiltered}
							className="btn btn-sm btn-ghost text-xs"
						>
							Toggle Visible
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
						<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
							{filteredAccounts.map((account) => (
								<div
									key={account.id}
									onClick={() => toggleAccount(account.id)}
									className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all active:scale-95
                    ${
											selectedAccounts.includes(account.id)
												? "bg-primary/10 border-primary ring-1 ring-primary shadow-inner"
												: "bg-base-200 border-transparent hover:border-base-300"
										}`}
								>
									<div className={`avatar placeholder`}>
										<div
											className={`${account.avatarColor} text-white rounded-full w-8`}
										>
											<span className="text-xs font-bold">
												{account.name[0]}
											</span>
										</div>
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-xs font-bold truncate leading-none mb-1">
											{account.name}
										</p>
										<div className="flex items-center gap-1 opacity-60">
											{account.platform === SocialPlatform.XHS ? (
												<Icons.XhsLogo className="w-2.5 h-2.5" />
											) : (
												<Icons.TikTokLogo className="w-2.5 h-2.5" />
											)}
											<span className="text-[9px] truncate">
												{account.group}
											</span>
										</div>
									</div>
								</div>
							))}
							{filteredAccounts.length === 0 && (
								<div className="col-span-full py-10 text-center opacity-30 italic text-sm">
									No accounts match your filters
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Composer Card */}
				<div className="card bg-base-100 border border-base-300 shadow-lg p-1">
					<div className="card-body p-4">
						<div className="relative">
							<textarea
								value={content}
								onChange={(e) => setContent(e.target.value)}
								placeholder="Enter caption or use AI to generate viral text..."
								className="textarea textarea-ghost w-full min-h-[160px] text-lg leading-relaxed focus:bg-transparent placeholder:opacity-30"
							/>
							{isGenerating && (
								<div className="absolute inset-0 bg-base-100/60 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
									<span className="loading loading-dots loading-lg text-primary"></span>
								</div>
							)}
						</div>

						<div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-300">
							<div className="flex gap-1">
								<button
									className="btn btn-ghost btn-circle btn-sm"
									type="button"
								>
									<Icons.Image className="w-5 h-5" />
								</button>
								<button
									type="button"
									onClick={handleMagicGenerate}
									className={`btn btn-sm btn-outline gap-2 ${isGenerating ? "loading" : ""}`}
								>
									{!isGenerating && <Icons.Sparkles className="w-4 h-4" />}
									AI Assist
								</button>
							</div>

							<button
								type="button"
								onClick={handlePublish}
								disabled={selectedAccounts.length === 0 || !content}
								className="btn btn-primary btn-md shadow-xl gap-2 px-8"
							>
								<Icons.Send className="w-4 h-4" />
								<span>Queue Post</span>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Right Rail: Activity Feed */}
			<div className="w-full md:w-80 flex flex-col h-full gap-6">
				<div className="card bg-base-200/50 border border-base-300 h-full flex flex-col overflow-hidden">
					<div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-300/30">
						<h3 className="text-xs font-bold uppercase tracking-widest opacity-60">
							Pipeline
						</h3>
						<span className="badge badge-sm badge-neutral">{jobs.length}</span>
					</div>

					<div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
						{jobs.length === 0 && (
							<div className="py-20 text-center opacity-20 italic">
								<p className="text-sm">Queue is empty</p>
							</div>
						)}

						{jobs.map((job) => (
							<div
								key={job.id}
								className="card bg-base-100 border border-base-300 shadow-sm p-3 gap-2"
							>
								<div className="flex justify-between items-center">
									<div className="flex -space-x-2">
										{job.targetAccounts.slice(0, 4).map((accId) => {
											const acc = MOCK_ACCOUNTS.find((a) => a.id === accId);
											return (
												<div
													key={accId}
													className={`avatar avatar-xs placeholder border-2 border-base-100 rounded-full`}
												>
													<div className={`${acc?.avatarColor} w-4`}></div>
												</div>
											);
										})}
									</div>
									<div
										className={`badge badge-xs ${job.status === TaskStatus.COMPLETED ? "badge-success" : "badge-primary animate-pulse"}`}
									>
										{job.status}
									</div>
								</div>

								<p className="text-[10px] leading-snug line-clamp-2 opacity-70">
									{job.content}
								</p>

								{job.status === TaskStatus.PUBLISHING && (
									<progress
										className="progress progress-primary w-full h-1"
										value={job.progress}
										max="100"
									></progress>
								)}

								<div className="flex justify-between items-center text-[9px] opacity-40">
									<span>{job.timestamp}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

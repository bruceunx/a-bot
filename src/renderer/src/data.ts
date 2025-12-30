import type { SocialAccount } from "./types";
import { SocialPlatform, AccountStatus } from "./types";

const COLORS = [
	"bg-red-500",
	"bg-orange-500",
	"bg-amber-500",
	"bg-yellow-500",
	"bg-lime-500",
	"bg-green-500",
	"bg-emerald-500",
	"bg-teal-500",
	"bg-cyan-500",
	"bg-sky-500",
	"bg-blue-500",
	"bg-indigo-500",
	"bg-violet-500",
	"bg-purple-500",
	"bg-fuchsia-500",
	"bg-pink-500",
	"bg-rose-500",
];

const GROUPS = [
	"Personal",
	"Business",
	"Client A",
	"Client B",
	"Marketing",
	"Influencer Network",
];

// Deterministic mock data generation
export const generateMockAccounts = (count: number): SocialAccount[] => {
	return Array.from({ length: count }).map((_, i) => {
		const platform = i % 3 === 0 ? SocialPlatform.XHS : SocialPlatform.TIKTOK;
		const group = GROUPS[i % GROUPS.length];
		const isError = i % 15 === 0;

		return {
			id: `acc_${i}`,
			name: `Account ${i + 1}`,
			handle: `@user_${1000 + i}`,
			platform,
			avatarColor: COLORS[i % COLORS.length],
			group,
			status: isError ? AccountStatus.NEEDS_REAUTH : AccountStatus.CONNECTED,
			followers: Math.floor(Math.random() * 500000) + 1000,
			postsCount: Math.floor(Math.random() * 500) + 10,
		};
	});
};

export const MOCK_ACCOUNTS = generateMockAccounts(7); // Generate 52 accounts

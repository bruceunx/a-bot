export type DataViewItem = {
  label: string;
  value: number;
  note?: string;
};

export enum SocialPlatform {
  XHS = "xhs",
  TIKTOK = "tiktok",
  INSTAGRAM = "Instagram",
}

export enum TaskStatus {
  IDLE = "IDLE",
  QUEUED = "QUEUED",
  RUNNING = "RUNNING",
  PUBLISHING = "PUBLISHING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum AccountStatus {
  CONNECTED = "Connected",
  DISCONNECTED = "Disconnected",
  NEEDS_REAUTH = "Re-login Required",
}

export interface SocialAccount {
  id: string;
  name: string;
  handle: string;
  platform: SocialPlatform;
  avatarColor: string;
  group?: string; // e.g., "Marketing", "Personal"
  status: AccountStatus;
  followers: number;
  postsCount: number;
}

export interface PublishingJob {
  id: string;
  content: string;
  imageUrl?: string;
  targetAccounts: number[]; // IDs of accounts
  status: TaskStatus;
  timestamp: string;
  progress: number; // 0-100
}

export type RawAccount = {
  username: string;
  avatar: string;
  accountId: string;
};

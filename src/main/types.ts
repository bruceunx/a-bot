export interface AccountRow {
  id: number;
  accountId: string;
  username: string;
  avatar: string;
  platform: string;
  cookies: string;
  userAgent: string;
  status: string;
  groups_json?: string;
  created_at: string;
}

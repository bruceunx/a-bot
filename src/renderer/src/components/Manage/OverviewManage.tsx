import { useEffect, useState } from "react";
import { Users, Briefcase, Activity, Clock } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { JobStatus, type PublishJob } from "@common/types";

// Types matching the shape returned from our new db function
interface DashboardData {
  totalAccounts: number;
  activeAccounts: number;
  totalJobs: number;
  runningJobs: number;
  successRate: number;
  recentJobs: PublishJob[];
  dailyStats: { date: string; success: number; failed: number }[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetching data from Electron Main Process
  useEffect(() => {
    // In reality: const stats = await window.electron.getDashboardStats();
    // For now, we simulate the data structure based on your DB schema
    const mockFetch = () => {
      setTimeout(() => {
        setData({
          totalAccounts: 12,
          activeAccounts: 10,
          totalJobs: 145,
          runningJobs: 2,
          successRate: 94,
          recentJobs: [
            {
              id: 105,
              status: JobStatus.Running,
              total_tasks: 50,
              message: "Daily Post Batch",
              created_at: new Date().toISOString(),
            },
            {
              id: 104,
              status: JobStatus.Completed,
              total_tasks: 20,
              message: "Promo Campaign",
              created_at: new Date(Date.now() - 86400000).toISOString(),
              finished_at: new Date().toISOString(),
            },
            {
              id: 103,
              status: JobStatus.Failed,
              total_tasks: 10,
              message: "Test Run",
              created_at: new Date(Date.now() - 172800000).toISOString(),
              finished_at: new Date().toISOString(),
            },
            {
              id: 102,
              status: JobStatus.Completed,
              total_tasks: 100,
              message: "Mass Update",
              created_at: new Date(Date.now() - 259200000).toISOString(),
              finished_at: new Date().toISOString(),
            },
          ] as any,
          dailyStats: [
            { date: "Mon", success: 45, failed: 2 },
            { date: "Tue", success: 52, failed: 5 },
            { date: "Wed", success: 38, failed: 0 },
            { date: "Thu", success: 65, failed: 8 },
            { date: "Fri", success: 48, failed: 1 },
            { date: "Sat", success: 20, failed: 0 },
            { date: "Sun", success: 34, failed: 2 },
          ],
        });
        setLoading(false);
      }, 500);
    };
    mockFetch();
  }, []);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case JobStatus.Running: // 0
        return (
          <div className="badge badge-info gap-2">
            <span className="loading loading-spinner loading-xs"></span> Running
          </div>
        );
      case JobStatus.Completed: // 1
        return <div className="badge badge-success gap-2">Completed</div>;
      case JobStatus.Failed: // 2
        return <div className="badge badge-error gap-2">Failed</div>;
      default:
        return <div className="badge badge-ghost">Unknown</div>;
    }
  };

  if (loading)
    return (
      <div className="p-8 flex justify-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-20">
      {/* 1. Stats Grid */}
      <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 border border-base-300 w-full">
        {/* Accounts Stat */}
        <div className="stat">
          <div className="stat-figure text-primary">
            <Users className="w-8 h-8 opacity-70" />
          </div>
          <div className="stat-title">Accounts</div>
          <div className="stat-value text-primary">{data?.totalAccounts}</div>
          <div className="stat-desc text-success">
            {data?.activeAccounts} Active
          </div>
        </div>

        {/* Jobs Stat */}
        <div className="stat">
          <div className="stat-figure text-secondary">
            <Briefcase className="w-8 h-8 opacity-70" />
          </div>
          <div className="stat-title">Total Jobs</div>
          <div className="stat-value text-secondary">{data?.totalJobs}</div>
          <div className="stat-desc">Lifetime executions</div>
        </div>

        {/* Success Rate Stat */}
        <div className="stat">
          <div className="stat-figure text-success">
            <Activity className="w-8 h-8 opacity-70" />
          </div>
          <div className="stat-title">Task Success Rate</div>
          <div className="stat-value text-success">{data?.successRate}%</div>
          <div className="stat-desc">Based on task history</div>
        </div>

        {/* Running Status */}
        <div className="stat">
          <div className="stat-figure text-warning">
            <div className="avatar placeholder">
              <div className="bg-warning/10 text-warning rounded-full w-12">
                <span>{data?.runningJobs}</span>
              </div>
            </div>
          </div>
          <div className="stat-title">Active Jobs</div>
          <div className="stat-value">{data?.runningJobs}</div>
          <div className="stat-desc">Currently processing</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Main Chart: Task Performance (Success vs Fail) */}
        <div className="lg:col-span-2 card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h2 className="card-title mb-6 flex justify-between">
              <span>Task Execution History</span>
              <span className="text-xs font-normal opacity-50">
                Last 7 Days
              </span>
            </h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.dailyStats}>
                  <defs>
                    <linearGradient
                      id="colorSuccess"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorFailed"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="currentColor"
                    opacity={0.3}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis hide />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.1}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area
                    type="monotone"
                    name="Successful Tasks"
                    dataKey="success"
                    stroke="#22c55e"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSuccess)"
                  />
                  <Area
                    type="monotone"
                    name="Failed Tasks"
                    dataKey="failed"
                    stroke="#ef4444"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorFailed)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. Recent Job History Table */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-0">
            <div className="p-6 pb-2 border-b border-base-200">
              <h2 className="card-title text-base">Recent Job History</h2>
              <p className="text-xs opacity-60">
                Status of latest batch operations
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Job / Time</th>
                    <th className="text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recentJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-base-200/50">
                      <td>
                        <div className="font-semibold text-xs">
                          {job.message || `Job #${job.id}`}
                        </div>
                        <div className="text-[10px] opacity-50 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="text-right">
                        {getStatusBadge(job.status)}
                        <div className="text-[10px] opacity-60 mt-1">
                          {job.total_tasks} Tasks
                        </div>
                      </td>
                    </tr>
                  ))}

                  {(!data?.recentJobs || data.recentJobs.length === 0) && (
                    <tr>
                      <td
                        colSpan={2}
                        className="text-center py-8 opacity-50 text-xs"
                      >
                        No jobs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

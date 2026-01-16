import { Layout } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", xhs: 40, tiktok: 24 },
  { name: "Tue", xhs: 30, tiktok: 13 },
  { name: "Wed", xhs: 20, tiktok: 98 },
  { name: "Thu", xhs: 27, tiktok: 39 },
  { name: "Fri", xhs: 18, tiktok: 48 },
  { name: "Sat", xhs: 23, tiktok: 38 },
  { name: "Sun", xhs: 34, tiktok: 43 },
];

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <div className="text-sm breadcrumbs opacity-60 mb-1">
          <ul>
            <li>
              <a>Application</a>
            </li>
            <li>
              <a>Analytics</a>
            </li>
            <li>Command Center</li>
          </ul>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          Command Center
        </h1>
        <p className="opacity-60">
          Real-time performance across your automation network.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 border border-base-300 w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Layout className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Tasks</div>
          <div className="stat-value text-primary">1.2K</div>
          <div className="stat-desc text-success">↘ 400 (12%) last week</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-xhs">
            <div className="avatar placeholder">
              <div className="bg-xhs/10 text-xhs rounded-full w-12">
                <span>X</span>
              </div>
            </div>
          </div>
          <div className="stat-title">XHS Engagement</div>
          <div className="stat-value text-xhs">45.2K</div>
          <div className="stat-desc">Likes & Favorites</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-tiktok">
            <div className="avatar placeholder">
              <div className="bg-tiktok/10 text-tiktok rounded-full w-12">
                <span>T</span>
              </div>
            </div>
          </div>
          <div className="stat-title">TikTok Views</div>
          <div className="stat-value text-tiktok">890K</div>
          <div className="stat-desc text-success">↗ 8% trending</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <div
              className="radial-progress text-secondary"
              style={{ "--value": 70, "--size": "3rem" } as any}
            >
              70%
            </div>
          </div>
          <div className="stat-title">Credits Used</div>
          <div className="stat-value">Unlimited</div>
          <div className="stat-desc">Pro Plan</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <div className="lg:col-span-2 card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <h2 className="card-title mb-6">Engagement Trajectory</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorXhs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff2442" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ff2442" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorTiktok"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#00f2ea" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00f2ea" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
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
                  <Area
                    type="monotone"
                    dataKey="xhs"
                    stroke="#ff2442"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorXhs)"
                  />
                  <Area
                    type="monotone"
                    dataKey="tiktok"
                    stroke="#00f2ea"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTiktok)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Task Activity Card */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-0">
            <div className="p-6 pb-2">
              <h2 className="card-title">Active Workflows</h2>
              <p className="text-xs opacity-60">Currently processing nodes</p>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra table-md">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-xs font-bold">Auto-Reply Bot</td>
                    <td>
                      <div className="badge badge-success badge-xs"></div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-xs font-bold">Daily Scheduler</td>
                    <td>
                      <div className="badge badge-ghost badge-xs"></div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-xs font-bold">XHS Scraper</td>
                    <td>
                      <div className="badge badge-warning badge-xs animate-pulse"></div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-xs font-bold">Video Upscaler</td>
                    <td>
                      <div className="badge badge-error badge-xs"></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 text-center">
              <button className="btn btn-ghost btn-xs">
                See activity logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

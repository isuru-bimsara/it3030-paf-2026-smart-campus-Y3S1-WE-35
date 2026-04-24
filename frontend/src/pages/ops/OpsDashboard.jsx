// frontend/src/pages/ops/OpsDashboard.jsx
import { useEffect, useState } from "react";
import { opsApi } from "../../api/ops";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  CalendarCheck, Box, Clock, CheckCircle, XCircle, Users,
  TrendingUp, ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PIE_COLORS      = ["#10b981", "#f59e0b", "#ef4444"];
const AREA_COLORS     = { bookings: "#10b981", resources: "#6366f1" };

export default function OpsDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    rejectedBookings: 0,
    totalResources: 0,
    totalUsers: 0,
    distribution: [],
    bookingTrend: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    opsApi
      .getStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to load stats:", err))
      .finally(() => setLoading(false));
  }, []);

  // Build fake resource-utilization area data from bookingTrend for demo
  const utilizationData = stats.bookingTrend.map((d) => ({
    name: d.name,
    bookings: d.bookings,
    // estimated utilization %: bookings / max(1, totalResources) * some factor
    utilization: Math.min(
      100,
      Math.round((d.bookings / Math.max(1, stats.totalResources)) * 100)
    ),
  }));

  const statCards = [
    { title: "Total Bookings",    value: stats.totalBookings,    icon: <CalendarCheck className="w-6 h-6 text-white" />, gradient: "from-indigo-500 to-indigo-700" },
    { title: "Pending Approval",  value: stats.pendingBookings,  icon: <Clock className="w-6 h-6 text-white" />,         gradient: "from-amber-400 to-amber-600" },
    { title: "Approved",          value: stats.approvedBookings, icon: <CheckCircle className="w-6 h-6 text-white" />,   gradient: "from-blue-500 to-blue-700" },
    { title: "Rejected",          value: stats.rejectedBookings, icon: <XCircle className="w-6 h-6 text-white" />,       gradient: "from-rose-500 to-rose-700" },
    { title: "Total Resources",   value: stats.totalResources,   icon: <Box className="w-6 h-6 text-white" />,           gradient: "from-violet-500 to-violet-700" },
    { title: "Registered Users",  value: stats.totalUsers,       icon: <Users className="w-6 h-6 text-white" />,         gradient: "from-slate-500 to-slate-700" },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Operations Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Real-time overview of resources, bookings and system activity.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          Live Data
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} loading={loading} />
        ))}
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* BOOKING TREND BAR CHART */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-700">Booking Activity</h3>
              <p className="text-xs text-slate-400 mt-0.5">Daily booking volume</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
              Last 7 Days
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.bookingTrend} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px -4px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="bookings" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOOKING STATUS PIE */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-700">Booking Status</h3>
              <p className="text-xs text-slate-400 mt-0.5">Current distribution breakdown</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    stats.distribution.some((d) => d.value > 0)
                      ? stats.distribution
                      : [{ name: "No Data", value: 1 }]
                  }
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* UTILIZATION AREA CHART */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-700">Resource Utilization</h3>
              <p className="text-xs text-slate-400 mt-0.5">Estimated utilization % per day</p>
            </div>
            <TrendingUp className="w-5 h-5 text-violet-500" />
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={utilizationData}>
                <defs>
                  <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} unit="%" domain={[0, 100]} />
                <Tooltip
                  formatter={(v) => [`${v}%`, "Utilization"]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                />
                <Area
                  type="monotone"
                  dataKey="utilization"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#utilGrad)"
                  dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* QUICK ACTIONS CARD */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-3xl shadow-lg text-white flex flex-col justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Pending Requests</h2>
            <p className="text-indigo-100 leading-relaxed">
              There are currently{" "}
              <span className="font-black text-white text-xl">{stats.pendingBookings}</span>{" "}
              bookings awaiting your approval.{" "}
              {stats.pendingBookings > 0
                ? "Review them to keep operations running smoothly."
                : "Great job staying on top of things!"}
            </p>
          </div>

          {/* Mini stat grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Resources</p>
              <p className="text-2xl font-black">{stats.totalResources}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Users</p>
              <p className="text-2xl font-black">{stats.totalUsers}</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/operation-manager/bookings")}
            className="w-full flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold py-3 px-6 rounded-xl hover:bg-indigo-50 active:scale-95 transition-all"
          >
            Review Bookings <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient, loading }) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 text-white shadow-md flex items-center gap-4 transform hover:scale-[1.02] transition-transform duration-200`}
    >
      <div className="p-3 bg-white/20 rounded-2xl flex-shrink-0 backdrop-blur-sm">{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">{title}</p>
        {loading ? (
          <div className="h-8 w-16 bg-white/20 rounded-lg animate-pulse mt-1" />
        ) : (
          <p className="text-3xl font-black">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        )}
      </div>
    </div>
  );
}

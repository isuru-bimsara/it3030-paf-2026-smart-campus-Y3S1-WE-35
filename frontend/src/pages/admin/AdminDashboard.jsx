// frontend/src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import {
  Bar, ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    bookings: 0,
    pendingBookings: 0,
    tickets: 0,
    distribution: [],
    userGrowth: [],
    activityTrends: []
  });

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error("Failed to fetch admin stats:", err));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Smart-Uni Analytics</h1>
        <p className="text-gray-500">System-wide overview and activity trends</p>
      </header>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users"       value={stats.users}          color="border-blue-500" />
        <StatCard title="Total Bookings"    value={stats.bookings}       color="border-emerald-500" />
        <StatCard title="Pending Requests"  value={stats.pendingBookings} color="border-amber-500" />
        <StatCard title="Support Tickets"   value={stats.tickets}        color="border-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* USER GROWTH BAR CHART */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-700">User Registration Growth</h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Last 7 Days</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOOKINGS VS TICKETS COMPOSED CHART */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-700">Bookings vs. Support Tickets</h3>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Live Activity</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stats.activityTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar name="New Bookings" dataKey="bookings" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                <Line name="New Tickets" type="monotone" dataKey="tickets" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOOKING STATUS PIE */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-700">Booking Status Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.distribution.length > 0 ? stats.distribution : [{ name: 'No Data', value: 1 }]}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2">System Summary</h2>
          <p className="text-blue-100 opacity-90 leading-relaxed">
            There are currently{" "}
            <span className="font-bold text-white">{stats.pendingBookings}</span> pending bookings
            and <span className="font-bold text-white">{stats.tickets}</span> open support tickets.
            Keep the system efficient by reviewing pending requests daily.
          </p>
          <a
            href="/admin/bookings"
            className="mt-6 inline-block bg-white text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors w-fit"
          >
            View All Bookings →
          </a>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${color} transform transition-transform hover:scale-[1.02]`}>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-800">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
}
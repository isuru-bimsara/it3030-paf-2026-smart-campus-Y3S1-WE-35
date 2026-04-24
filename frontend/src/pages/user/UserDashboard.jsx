import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function UserDashboard() {
  const [stats, setStats] = useState({
    myBookings: 0,
    pendingBookings: 0,
    tickets: 0
  });

  useEffect(() => {
    api.get('/user/stats').then(res => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 bg-white shadow">
          <p className="text-sm text-gray-500">My Bookings</p>
          <p className="text-xl font-bold">{stats.myBookings}</p>
        </div>
        <div className="card p-4 bg-white shadow">
          <p className="text-sm text-gray-500">Pending Bookings</p>
          <p className="text-xl font-bold">{stats.pendingBookings}</p>
        </div>
        <div className="card p-4 bg-white shadow">
          <p className="text-sm text-gray-500">My Tickets</p>
          <p className="text-xl font-bold">{stats.tickets}</p>
        </div>
      </div>
    </div>
  )
}
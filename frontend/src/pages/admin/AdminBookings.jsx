import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { bookingsApi } from "../../api/bookings";
import { format, formatDistanceToNowStrict } from "date-fns";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  User,
  MapPin,
  ArrowRight,
  MoreVertical,
  ChevronRight,
} from "lucide-react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await bookingsApi.getAll();
      const updated = res.data.data.map((b) => {
        const now = new Date();
        if (new Date(b.endTime) < now && b.status === "PENDING") {
          b.status = "CANCELLED";
          b.autoCancelled = true;
        }
        return b;
      });
      setBookings(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const bookingId = searchParams.get("bookingId");
    if (bookingId && bookings.length > 0) {
      const b = bookings.find((item) => String(item.id) === String(bookingId));
      if (b) setSelectedBooking(b);
    }
  }, [searchParams, bookings]);

  // Derived Stats
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === "PENDING").length,
      approved: bookings.filter(b => b.status === "APPROVED").length,
    };
  }, [bookings]);

  const getStatusStyle = (status) => {
    const map = {
      APPROVED: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      PENDING: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: <Clock className="w-3 h-3" />,
      },
      REJECTED: {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        icon: <XCircle className="w-3 h-3" />,
      },
      CANCELLED: {
        bg: "bg-slate-100",
        text: "text-slate-600",
        border: "border-slate-200",
        icon: <AlertCircle className="w-3 h-3" />,
      },
    };
    return map[status] || { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: null };
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium animate-pulse">Loading reservations...</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-20">
      
      {/* HEADER & STATS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
              <Calendar className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Bookings
            </h1>
          </div>
          <p className="text-slate-500">Manage and monitor all resource reservations.</p>
        </div>

        <div className="flex gap-4">
          <StatCard label="Pending" value={stats.pending} color="text-amber-600" />
          <StatCard label="Approved" value={stats.approved} color="text-emerald-600" />
          <StatCard label="Total" value={stats.total} color="text-indigo-600" />
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by resource, user, or status..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {bookings.length === 0 ? (
            <div className="py-24 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No bookings found</h3>
              <p className="text-slate-500">New reservations will appear here automatically.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Resource</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Requested By</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bookings.map((b) => {
                  const style = getStatusStyle(b.status);
                  return (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className="group hover:bg-indigo-50/30 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-white transition-colors">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-slate-700">{b.resourceName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-[10px] flex items-center justify-center font-bold">
                            {b.userName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-600">{b.userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-slate-700 font-medium">
                          {format(new Date(b.startTime), "MMM dd, yyyy")}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {format(new Date(b.startTime), "HH:mm")} - {format(new Date(b.endTime), "HH:mm")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${style.bg} ${style.text} ${style.border}`}>
                          {style.icon}
                          {b.status}
                          {b.autoCancelled && <span className="text-[10px] opacity-70 ml-1">(AUTO)</span>}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-all group-hover:translate-x-1" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* RIGHT DRAWER */}
      {selectedBooking && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] transition-opacity"
            onClick={() => setSelectedBooking(null)}
          />
          <div className="fixed top-0 right-0 w-full sm:w-[450px] h-full bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* DRAWER HEADER */}
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="font-black text-xl text-slate-800">Booking Details</h2>
                <p className="text-xs text-slate-500">ID: #{selectedBooking.id}</p>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* DRAWER CONTENT */}
            <div className="p-8 space-y-8 overflow-y-auto flex-1">
              {/* STATUS BOX */}
              <div className={`p-4 rounded-2xl border ${getStatusStyle(selectedBooking.status).bg} ${getStatusStyle(selectedBooking.status).border} flex items-center justify-between`}>
                <span className={`text-sm font-bold ${getStatusStyle(selectedBooking.status).text}`}>Current Status</span>
                <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${getStatusStyle(selectedBooking.status).bg} ${getStatusStyle(selectedBooking.status).text}`}>
                   {selectedBooking.status}
                </span>
              </div>

              {/* INFO GROUPS */}
              <div className="grid grid-cols-2 gap-6">
                <InfoItem label="Resource Name" icon={<MapPin className="w-4 h-4" />}>
                  <span className="font-bold text-slate-800">{selectedBooking.resourceName}</span>
                </InfoItem>
                <InfoItem label="Requested By" icon={<User className="w-4 h-4" />}>
                  <span className="font-bold text-slate-800">{selectedBooking.userName}</span>
                </InfoItem>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Timeline</h4>
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <div className="w-0.5 h-12 bg-slate-100" />
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                  </div>
                  <div className="space-y-6 flex-1">
                    <div>
                      <p className="text-xs text-slate-400">Start Time</p>
                      <p className="font-semibold text-slate-700">{format(new Date(selectedBooking.startTime), "PPPP p")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">End Time</p>
                      <p className="font-semibold text-slate-700">{format(new Date(selectedBooking.endTime), "PPPP p")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Purpose of Booking</h4>
                <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-600 leading-relaxed border border-slate-100 italic">
                  "{selectedBooking.purpose || "No specific purpose provided for this reservation."}"
                </div>
              </div>
              
              <div className="pt-6">
                 <div className="flex justify-between items-center text-[11px] text-slate-400 px-1">
                    <span>Created: {format(new Date(selectedBooking.createdAt), "MMM dd, yyyy HH:mm")}</span>
                    {selectedBooking.autoCancelled && <span className="text-rose-500 font-bold">Auto-Cancelled</span>}
                 </div>
              </div>
            </div>

            {/* DRAWER FOOTER */}
            <div className="p-6 border-t bg-slate-50/50 mt-auto">
              <button 
                onClick={() => setSelectedBooking(null)}
                className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Sub-components for cleaner code
function StatCard({ label, value, color }) {
  return (
    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function InfoItem({ label, icon, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
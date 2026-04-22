

import { useState, useEffect } from "react";
import { bookingsApi } from "../../api/bookings";
import { formatDistanceToNowStrict } from "date-fns";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  Loader2,
} from "lucide-react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch bookings
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

  // Handle booking actions
  const handleStatusChange = async (id, action) => {
    try {
      let res;
      if (action === "approve") res = await bookingsApi.approve(id);
      if (action === "reject") res = await bookingsApi.reject(id);
      if (action === "cancel") res = await bookingsApi.cancel(id);

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? res.data.data : b))
      );

      // Update panel if open
      setSelectedBooking(res.data.data);
    } catch {
      alert("Failed to update status");
    }
  };

  // Status style mapping
  const getStatusStyle = (status) => {
    const map = {
      APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
      PENDING: "bg-amber-50 text-amber-700 border-amber-200",
      REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
      CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
    };
    return map[status] || "bg-blue-50 text-blue-700 border-blue-200";
  };

  const renderCancelledTime = (b) => {
    if (b.status !== "CANCELLED") return "-";
    const cancelTime = b.updatedAt
      ? new Date(b.updatedAt)
      : new Date();
    return formatDistanceToNowStrict(cancelTime, { addSuffix: true });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
          <Calendar className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            Booking Management
          </h1>
          <p className="text-slate-500">
            Monitor and control all reservations
          </p>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            All Bookings
          </h3>
        </div>

        <div className="overflow-x-auto">
          {bookings.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              No bookings found
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Resource</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className="hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-6 py-5 font-bold">{b.resourceName}</td>
                    <td className="px-6 py-5">{b.userName}</td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(b.startTime).toLocaleString()}
                      <div className="text-xs text-slate-400">
                        → {new Date(b.endTime).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusStyle(b.status)}`}>
                        {b.status} {b.autoCancelled && "(auto)"}
                      </span>
                    </td>
                    <td className="px-6 py-5 space-x-2">
                      {b.status === "PENDING" && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(b.id, "approve"); }}
                            className="text-blue-600 text-xs font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(b.id, "reject"); }}
                            className="text-rose-600 text-xs font-semibold"
                          >
                            Reject
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(b.id, "cancel"); }}
                            className="text-orange-600 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {b.status === "APPROVED" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(b.id, "cancel"); }}
                          className="text-orange-600 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      {selectedBooking && (
        <div className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-2xl border-l z-50 overflow-y-auto">
          
          {/* HEADER */}
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="font-bold text-lg">Booking Details</h2>
            <button onClick={() => setSelectedBooking(null)}>✕</button>
          </div>

          {/* CONTENT */}
          <div className="p-6 space-y-4">

            <div>
              <p className="text-xs text-slate-400">Resource</p>
              <p className="font-bold">{selectedBooking.resourceName}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">User</p>
              <p>{selectedBooking.userName}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Time</p>
              <p>{new Date(selectedBooking.startTime).toLocaleString()}</p>
              <p className="text-sm text-slate-400">
                → {new Date(selectedBooking.endTime).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Purpose</p>
              <p className="bg-slate-50 p-3 rounded-lg">
                {selectedBooking.purpose || "No purpose provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Status</p>
              <span className={`px-3 py-1 rounded-full text-xs border ${getStatusStyle(selectedBooking.status)}`}>
                {selectedBooking.status} {selectedBooking.autoCancelled && "(auto)"}
              </span>
            </div>

            <div>
              <p className="text-xs text-slate-400">Created</p>
              <p>{new Date(selectedBooking.createdAt).toLocaleString()}</p>
            </div>

            {/* ACTIONS */}
            <div className="pt-4 space-y-2">
              {selectedBooking.status === "PENDING" && (
                <>
                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, "approve")}
                    className="w-full bg-blue-600 text-white py-2 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, "reject")}
                    className="w-full bg-red-600 text-white py-2 rounded"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, "cancel")}
                    className="w-full bg-orange-500 text-white py-2 rounded"
                  >
                    Cancel
                  </button>
                </>
              )}

              {selectedBooking.status === "APPROVED" && (
                <button
                  onClick={() => handleStatusChange(selectedBooking.id, "cancel")}
                  className="w-full bg-orange-500 text-white py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { bookingsApi } from "../../api/bookings";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Ban,
  Loader2,
  BellRing,
} from "lucide-react";

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // notification deep-link
  const bookingIdFromQuery = searchParams.get("bookingId");

  useEffect(() => {
    setLoading(true);
    bookingsApi
      .getMyBookings()
      .then((res) => setBookings(res.data.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  // clear query after page handles highlight
  useEffect(() => {
    if (!bookingIdFromQuery) return;
    const timeout = setTimeout(() => {
      setSearchParams({}, { replace: true });
    }, 1200);
    return () => clearTimeout(timeout);
  }, [bookingIdFromQuery, setSearchParams]);

  const sortedBookings = useMemo(() => {
    return [...bookings].sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );
  }, [bookings]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 className="w-4 h-4" />,
        };
      case "PENDING":
        return {
          badge: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <AlertCircle className="w-4 h-4" />,
        };
      case "REJECTED":
        return {
          badge: "bg-rose-50 text-rose-700 border-rose-200",
          icon: <XCircle className="w-4 h-4" />,
        };
      case "CANCELLED":
        return {
          badge: "bg-slate-100 text-slate-600 border-slate-200",
          icon: <Ban className="w-4 h-4" />,
        };
      default:
        return {
          badge: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Clock3 className="w-4 h-4" />,
        };
    }
  };

  const formatDateTime = (d) =>
    new Date(d).toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
          <CalendarDays className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            My Bookings
          </h1>
          <p className="text-slate-500 font-medium mt-0.5">
            Track your reservations and approval status.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Booking History
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Newest bookings appear first
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500">
            {sortedBookings.length} Total
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
              Loading bookings...
            </p>
          </div>
        ) : sortedBookings.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-7 h-7 text-slate-300" />
            </div>
            <h3 className="text-slate-800 font-bold text-lg">
              No bookings yet
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Your booked resources will show here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Resource
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Time
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {sortedBookings.map((b) => {
                  const isHighlighted =
                    bookingIdFromQuery &&
                    Number(bookingIdFromQuery) === Number(b.id);
                  const status = getStatusStyle(b.status);

                  return (
                    <tr
                      key={b.id}
                      className={`transition-all ${
                        isHighlighted
                          ? "bg-indigo-50/60 ring-1 ring-inset ring-indigo-100"
                          : "hover:bg-slate-50/60"
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          {isHighlighted && (
                            <BellRing className="w-4 h-4 text-indigo-600 animate-pulse" />
                          )}
                          <p className="font-bold text-slate-800">
                            {b.resourceName}
                          </p>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Booking #{b.id}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <div className="text-sm text-slate-700 font-semibold">
                          {formatDateTime(b.startTime)}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          → {formatDateTime(b.endTime)}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${status.badge}`}
                        >
                          {status.icon}
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

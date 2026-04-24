import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api/axios";
import { Calendar, Clock, Info, ShieldAlert, CheckCircle2, List } from "lucide-react";

const SLOT_MINUTES = 30;

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function isSameDay(left, right) {
  return left.toDateString() === right.toDateString();
}

function roundUpToNextSlot(date, minutes = SLOT_MINUTES) {
  const next = new Date(date);
  next.setSeconds(0, 0);
  const remainder = next.getMinutes() % minutes;
  if (remainder !== 0) {
    next.setMinutes(next.getMinutes() + (minutes - remainder));
  }
  return next;
}

function formatLocalDateTime(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function BookResource() {
  const { id } = useParams();
  const navigate = useNavigate();
  const initialStart = roundUpToNextSlot(new Date());
  const initialEnd = new Date(initialStart.getTime() + SLOT_MINUTES * 2 * 60 * 1000);

  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [startTime, setStartTime] = useState(initialStart);
  const [endTime, setEndTime] = useState(initialEnd);
  const [purpose, setPurpose] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get(`/bookings/resource/${id}`);
        const fetchedBookings = res.data.data || [];
        setBookings(
          fetchedBookings.map((booking) => ({
            ...booking,
            startTime: new Date(booking.startTime),
            endTime: new Date(booking.endTime),
          })),
        );
      } catch (err) {
        console.error(err);
        setBookings([]);
      }
    };

    fetchBookings();
  }, [id]);

  const intervals = bookings.map((booking) => ({
    start: booking.startTime,
    end: booking.endTime,
  }));

  const isConflict = (start, end) =>
    intervals.some((interval) => start < interval.end && end > interval.start);

  const getDisabledHours = (date) => {
    if (!date) return [];

    const disabled = [];
    intervals.forEach((interval) => {
      if (interval.start.toDateString() === date.toDateString()) {
        for (let hour = interval.start.getHours(); hour < interval.end.getHours(); hour += 1) {
          disabled.push(hour);
        }
      }
    });
    return disabled;
  };

  const highlightDates = intervals.map((interval) => interval.start);
  const now = roundUpToNextSlot(new Date());
  const minStartTime =
    startTime && isSameDay(startTime, now) ? now : startOfDay(startTime || now);
  const endFloor = startTime
    ? new Date(startTime.getTime() + SLOT_MINUTES * 60 * 1000)
    : now;
  const minEndTime =
    endTime && isSameDay(endTime, endFloor)
      ? endFloor
      : startOfDay(endTime || endFloor);

  useEffect(() => {
    if (startTime && endTime && endTime <= startTime) {
      setEndTime(new Date(startTime.getTime() + SLOT_MINUTES * 2 * 60 * 1000));
    }
  }, [startTime, endTime]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedPurpose = purpose.trim();

    if (!startTime || !endTime || !trimmedPurpose) {
      alert("Please fill all fields");
      return;
    }

    if (startTime <= new Date()) {
      alert("Start time must be in the future");
      return;
    }

    if (endTime <= startTime) {
      alert("End time must be after start time");
      return;
    }

    if (isConflict(startTime, endTime)) {
      alert("This time is already booked");
      return;
    }

    try {
      setLoading(true);
      await api.post("/bookings", {
        resourceId: Number(id),
        startTime: formatLocalDateTime(startTime),
        endTime: formatLocalDateTime(endTime),
        purpose: trimmedPurpose,
      });
      alert("Booking successful");
      navigate("/user/bookings");
    } catch (err) {
      console.error(err);

      const apiMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.data;
      const fieldMessage =
        validationErrors && typeof validationErrors === "object"
          ? Object.values(validationErrors)[0]
          : null;

      alert(fieldMessage || apiMessage || err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-indigo-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Reserve Resource
              </h2>
              <p className="text-indigo-100 text-sm mt-1">Resource ID: #{id}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" /> Start Time
                </label>
                <DatePicker
                  selected={startTime}
                  onChange={(date) => setStartTime(date)}
                  onChangeRaw={(event) => event.preventDefault()}
                  showTimeSelect
                  timeIntervals={SLOT_MINUTES}
                  dateFormat="MMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  minTime={minStartTime}
                  maxTime={endOfDay(startTime || now)}
                  highlightDates={highlightDates}
                  filterTime={
                    startTime
                      ? (time) => !getDisabledHours(startTime).includes(time.getHours())
                      : undefined
                  }
                  placeholderText="Select start date & time"
                  readOnly
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-500" /> End Time
                </label>
                <DatePicker
                  selected={endTime}
                  onChange={(date) => setEndTime(date)}
                  onChangeRaw={(event) => event.preventDefault()}
                  showTimeSelect
                  timeIntervals={SLOT_MINUTES}
                  dateFormat="MMM d, yyyy h:mm aa"
                  minDate={startTime || new Date()}
                  minTime={minEndTime}
                  maxTime={endOfDay(endTime || endFloor)}
                  highlightDates={highlightDates}
                  filterTime={
                    endTime || startTime
                      ? (time) =>
                          !getDisabledHours(endTime || startTime).includes(time.getHours())
                      : undefined
                  }
                  placeholderText="Select end date & time"
                  readOnly
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400" /> Purpose
                </label>
                <textarea
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                  placeholder="What is this booking for?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
                  loading ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Processing..." : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Confirm Booking
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <List className="w-5 h-5 text-indigo-500" /> Current Availability
              </h3>
              <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full border border-rose-100 uppercase tracking-wider">
                Reserved Slots
              </span>
            </div>

            <div className="overflow-x-auto">
              {bookings.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                    <Calendar className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">No active bookings for this resource.</p>
                  <p className="text-slate-400 text-sm">Be the first to reserve a spot!</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Start Time</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">End Time</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                          {new Date(booking.startTime).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                          {new Date(booking.endTime).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase border border-amber-100">
                            {booking.status || "Booked"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 italic max-w-[200px] truncate">
                          {booking.purpose}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Overlapping bookings are automatically blocked by the system.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

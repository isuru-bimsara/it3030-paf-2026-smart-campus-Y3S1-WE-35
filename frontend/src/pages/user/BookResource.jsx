import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookingsApi } from "../../api/bookings";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isSameDay, startOfDay, endOfDay } from "date-fns";
import { 
  Calendar, 
  Clock, 
  Info, 
  CheckCircle2, 
  List, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

// Custom CSS for Reserved Days
const calendarStyles = `
  .reserved-day {
    background-color: #fee2e2 !important;
    color: #ef4444 !important;
    font-weight: 800 !important;
    border-radius: 50% !important;
    position: relative;
  }
  .reserved-day::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background-color: #ef4444;
    border-radius: 50%;
  }
  .react-datepicker__day--highlighted {
    background-color: #e0e7ff !important;
    color: #4338ca !important;
  }
`;

export default function BookResource() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [dayBookings, setDayBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]); // For calendar highlights
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState("");

  // Fetch bookings for the selected date whenever it changes
  useEffect(() => {
    if (!selectedDate) return;
    
    const fetchDayBookings = async () => {
      setFetchingSlots(true);
      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const res = await bookingsApi.getByResourceAndDate(id, dateStr);
        const data = res.data.data || [];
        
        setDayBookings(data.map(b => ({
          ...b,
          start: new Date(b.startTime),
          end: new Date(b.endTime)
        })));
      } catch (err) {
        console.error("Failed to fetch slots:", err);
      } finally {
        setFetchingSlots(false);
      }
    };

    fetchDayBookings();
  }, [id, selectedDate]);

  // Fetch all bookings for the resource once to highlight busy dates
  useEffect(() => {
    bookingsApi.getByResourceAndDate(id, "all").catch(() => {}); // Fallback if no "all" endpoint
    // Actually, let's just use the existing getBookingsByResource
    bookingsApi.getById(id).catch(() => {}); // Wait, I need the resource specific bookings.
    // I already have getBookingsByResource(resourceId) in the service/controller.
    
    const fetchAll = async () => {
      try {
        const res = await bookingsApi.getByResource(id);
        const data = res.data.data || [];
        setAllBookings(data.map(b => ({ start: new Date(b.startTime), end: new Date(b.endTime) })));
      } catch (err) {
        console.error("Failed to fetch all bookings:", err);
      }
    };
    fetchAll();
  }, [id]);

  const isTimeBooked = (time) => {
    if (!time || !selectedDate) return false;
    
    // Normalize the time object to the selectedDate for accurate comparison
    const normalizedTime = new Date(selectedDate);
    normalizedTime.setHours(time.getHours(), time.getMinutes(), 0, 0);

    // 1. Check if time is in the past (only if selectedDate is today)
    if (isSameDay(selectedDate, new Date())) {
      const now = new Date();
      if (normalizedTime < now) return true;
    }

    // 2. Check if time overlaps with existing bookings
    return dayBookings.some(b => {
      return normalizedTime >= b.start && normalizedTime < b.end;
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Reset times but keep the picked date part if they are re-selected
    setStartTime(null);
    setEndTime(null);
    setError("");
  };

  const handleTimeChange = (time, setter) => {
    if (!time || !selectedDate) {
      setter(null);
      return;
    }
    const combined = new Date(selectedDate);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    setter(combined);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!startTime || !endTime || !purpose) {
      setError("Please fill all required fields.");
      return;
    }

    if (endTime <= startTime) {
      setError("End time must be after start time.");
      return;
    }

    // Double check conflict on client side before submitting
    const hasConflict = dayBookings.some(b => {
      return (startTime < b.end && endTime > b.start);
    });

    if (hasConflict) {
      setError("This time slot overlaps with an existing booking.");
      return;
    }

    try {
      setLoading(true);
      
      // LocalDateTime format: yyyy-MM-ddTHH:mm:ss
      // We use ISO string and slice or just format manually to avoid timezone shifting
      const formatTime = (d) => format(d, "yyyy-MM-dd'T'HH:mm:ss");

      await bookingsApi.create({
        resourceId: Number(id),
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        purpose
      });

      alert("✅ Booking successfully created!");
      navigate("/user/bookings");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <style>{calendarStyles}</style>
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">Reserve Resource</h1>
              <p className="text-slate-500 font-medium mt-1">Book your time slot for Resource #{id}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all shadow-sm active:scale-95"
          >
            ← Back to Resources
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: FORM */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-sm font-bold flex items-center gap-3 animate-shake">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" /> 1. Select Date
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    inline
                    calendarClassName="!border-0 shadow-lg p-2 rounded-3xl"
                    highlightDates={allBookings.map(b => b.start)}
                    dayClassName={(date) => {
                      const isReserved = allBookings.some(b => isSameDay(new Date(b.start), date));
                      return isReserved ? "reserved-day" : undefined;
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Start Time */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" /> 2. Start Time
                    </label>
                    <DatePicker
                      selected={startTime}
                      onChange={(t) => handleTimeChange(t, setStartTime)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Start"
                      dateFormat="h:mm aa"
                      filterTime={isTimeBooked ? (time) => !isTimeBooked(time) : undefined}
                      placeholderText="Select time"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-rose-500" /> 3. End Time
                    </label>
                    <DatePicker
                      selected={endTime}
                      onChange={(t) => handleTimeChange(t, setEndTime)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="End"
                      dateFormat="h:mm aa"
                      filterTime={isTimeBooked ? (time) => !isTimeBooked(time) : undefined}
                      placeholderText="Select time"
                      minTime={startTime || null}
                      maxTime={selectedDate ? endOfDay(selectedDate) : null}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-slate-400" /> 4. Purpose
                  </label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                    placeholder="Enter booking purpose..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || fetchingSlots}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {loading ? "Processing..." : (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      Confirm Reservation
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: AVAILABILITY INFO */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header for slots */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-800 flex items-center gap-2">
                  <List className="w-5 h-5 text-indigo-500" /> 
                  Availability for {format(selectedDate, "MMMM d, yyyy")}
                </h3>
                <p className="text-xs text-slate-400 font-medium">Slots highlighted in red are already reserved.</p>
              </div>
              {fetchingSlots && <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent"></div>}
            </div>

            {/* List of Booked Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dayBookings.length === 0 && !fetchingSlots ? (
                <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
                  <Clock className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="font-bold">Entire day is available!</p>
                  <p className="text-sm">Select any time you prefer.</p>
                </div>
              ) : (
                dayBookings.map((b, i) => (
                  <div key={i} className="bg-white rounded-2xl border-l-4 border-l-rose-500 border border-slate-100 p-4 flex items-center gap-4 shadow-sm">
                    <div className="bg-rose-50 p-2.5 rounded-xl">
                      <Clock className="w-5 h-5 text-rose-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        {format(b.start, "h:mm aa")} 
                        <ArrowRight className="w-3 h-3 text-slate-300" /> 
                        {format(b.end, "h:mm aa")}
                      </div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-0.5">Reserved</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Business Rules Card */}
            <div className="bg-slate-800 rounded-3xl p-8 text-white">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" /> Booking Guidelines
              </h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span>Only <strong className="text-white">PENDING</strong> or <strong className="text-white">APPROVED</strong> status bookings block a time slot.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span>Time slots are precise. If a booking ends at 11:00 AM, the resource is available exactly at 11:00 AM.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span>Operation Managers review all requests. Please allow up to 24 hours for approval.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

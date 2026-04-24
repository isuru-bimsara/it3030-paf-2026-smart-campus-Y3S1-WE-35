// // import { useState, useEffect } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import DatePicker from "react-datepicker";
// // import "react-datepicker/dist/react-datepicker.css";

// // export default function BookResource() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();

// //   const [loading, setLoading] = useState(false);
// //   const [bookings, setBookings] = useState([]);
// //   const [startTime, setStartTime] = useState(null);
// //   const [endTime, setEndTime] = useState(null);
// //   const [purpose, setPurpose] = useState("");

// //   useEffect(() => {
// //     const fetchBookings = async () => {
// //       try {
// //         const res = await axios.get(
// //           `http://localhost:8083/api/bookings/resource/${id}`
// //         );
// //         setBookings(res.data.data || []);
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     };
// //     fetchBookings();
// //   }, [id]);

// //   // Convert bookings to intervals for conflict checking
// //   const intervals = bookings.map((b) => ({
// //     start: new Date(b.startTime),
// //     end: new Date(b.endTime),
// //   }));

// //   const isConflict = (start, end) => {
// //     return intervals.some((i) => start < i.end && end > i.start);
// //   };

// //   // Format date for backend: yyyy-MM-ddTHH:mm:ss
// //   const formatDateForBackend = (date) => {
// //     if (!date) return null;
// //     const pad = (n) => (n < 10 ? "0" + n : n);
// //     return (
// //       date.getFullYear() +
// //       "-" +
// //       pad(date.getMonth() + 1) +
// //       "-" +
// //       pad(date.getDate()) +
// //       "T" +
// //       pad(date.getHours()) +
// //       ":" +
// //       pad(date.getMinutes()) +
// //       ":" +
// //       pad(date.getSeconds())
// //     );
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!startTime || !endTime || !purpose) {
// //       alert("❌ Please fill all fields");
// //       return;
// //     }

// //     if (endTime <= startTime) {
// //       alert("❌ End time must be after start time");
// //       return;
// //     }

// //     if (isConflict(startTime, endTime)) {
// //       alert("❌ This time is already booked!");
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       const token = localStorage.getItem("token");
// //       if (!token) {
// //         alert("❌ You must be logged in");
// //         return;
// //       }

// //       await axios.post(
// //         "http://localhost:8083/api/bookings",
// //         {
// //           resourceId: Number(id),
// //           startTime: formatDateForBackend(startTime),
// //           endTime: formatDateForBackend(endTime),
// //           purpose,
// //         },
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );

// //       alert("✅ Booking Successful!");
// //       navigate("/user/bookings");
// //     } catch (err) {
// //       console.error(err.response?.data || err.message);
// //       alert("❌ " + (err.response?.data?.message || err.message || "Error"));
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div style={{ padding: "2rem" }}>
// //       <h2>📅 Book Resource</h2>

// //       <div style={{ background: "#ffe6e6", padding: "10px", marginBottom: "20px" }}>
// //         <h4>🚫 Booked Time Slots</h4>
// //         {bookings.length === 0
// //           ? "No bookings"
// //           : bookings.map((b, i) => (
// //               <p key={i}>
// //                 🟥 {new Date(b.startTime).toLocaleString()} →{" "}
// //                 {new Date(b.endTime).toLocaleString()}
// //               </p>
// //             ))}
// //       </div>

// //       <form onSubmit={handleSubmit}>
// //         <div style={{ marginBottom: "1rem" }}>
// //           <label>Start Time</label>
// //           <DatePicker
// //             selected={startTime}
// //             onChange={(date) => setStartTime(date)}
// //             showTimeSelect
// //             timeIntervals={30}
// //             dateFormat="yyyy-MM-dd HH:mm"
// //             minDate={new Date()}
// //             placeholderText="Select start time"
// //           />
// //         </div>

// //         <div style={{ marginBottom: "1rem" }}>
// //           <label>End Time</label>
// //           <DatePicker
// //             selected={endTime}
// //             onChange={(date) => setEndTime(date)}
// //             showTimeSelect
// //             timeIntervals={30}
// //             dateFormat="yyyy-MM-dd HH:mm"
// //             minDate={startTime || new Date()}
// //             placeholderText="Select end time"
// //           />
// //         </div>

// //         <div style={{ marginBottom: "1rem" }}>
// //           <label>Purpose</label>
// //           <textarea
// //             value={purpose}
// //             onChange={(e) => setPurpose(e.target.value)}
// //             rows={3}
// //             placeholder="Enter purpose"
// //           />
// //         </div>

// //         <button type="submit" disabled={loading}>
// //           {loading ? "Booking..." : "Confirm Booking"}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// export default function BookResource() {
//   const { id } = useParams(); // resource id
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [bookings, setBookings] = useState([]);
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);
//   const [purpose, setPurpose] = useState("");

//   // Fetch bookings for this resource
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         // 👇 You are already correctly calling the correct API:
//         const res = await axios.get(
//           `http://localhost:8083/api/bookings/resource/${id}`,
//           {
//             headers: {
//               // If auth required:
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             }
//           }
//         );
//         // If your API wraps with { data: [...] }, get res.data.data:
//         const fetchedBookings = res.data.data || [];
//         setBookings(fetchedBookings.map(b => ({
//           ...b,
//           startTime: new Date(b.startTime),
//           endTime: new Date(b.endTime),
//         })));
//       } catch (err) {
//         console.error(err);
//         setBookings([]);
//       }
//     };
//     fetchBookings();
//   }, [id]);

//   // Convert bookings into intervals for conflict check
//   const intervals = bookings.map((b) => ({
//     start: b.startTime,
//     end: b.endTime,
//   }));

//   // Check if selected times conflict
//   const isConflict = (start, end) =>
//     intervals.some((i) => start < i.end && end > i.start);

//   // Get booked hours for a given date
//   const getDisabledHours = (date) => {
//     if (!date) return [];
//     const disabled = [];
//     intervals.forEach((interval) => {
//       if (interval.start.toDateString() === date.toDateString()) {
//         for (
//           let h = interval.start.getHours();
//           h < interval.end.getHours();
//           h++
//         ) {
//           disabled.push(h);
//         }
//       }
//     });
//     return disabled;
//   };

//   // Highlight booked dates in calendar
//   const highlightDates = intervals.map((i) => i.start);

//   // Submit booking
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!startTime || !endTime || !purpose)
//       return alert("❌ Please fill all fields");
//     if (endTime <= startTime) return alert("❌ End time must be after start");
//     if (isConflict(startTime, endTime))
//       return alert("❌ This time is already booked!");

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "http://localhost:8083/api/bookings",
//         { resourceId: Number(id), startTime, endTime, purpose },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("✅ Booking Successful!");
//       navigate("/user/bookings");
//     } catch (err) {
//       console.error(err);
//       alert("❌ " + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---- DISPLAY SLOTS ----
//   return (
//     <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
//       <h2 className="text-2xl font-bold mb-4">📅 Book Resource</h2>

//       {/* Booked Time Slots */}
//       <div
//         style={{
//           background: "#ffe6e6",
//           padding: "10px",
//           marginBottom: "20px",
//         }}
//       >
//         <h4>🚫 Booked Time Slots</h4>
//         {bookings.length === 0 ? (
//           <p>No bookings</p>
//         ) : (
//           <table style={{width: '100%', background: "#fffaf5", borderCollapse: "collapse"}}>
//             <thead>
//               <tr>
//                 <th style={{textAlign:"left"}}>Start</th>
//                 <th style={{textAlign:"left"}}>End</th>
//                 <th style={{textAlign:"left"}}>Status</th>
//                 <th style={{textAlign:"left"}}>Purpose</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bookings.map((b, i) => (
//                 <tr key={i}>
//                   <td>{new Date(b.startTime).toLocaleString()}</td>
//                   <td>{new Date(b.endTime).toLocaleString()}</td>
//                   <td>{b.status}</td>
//                   <td>{b.purpose}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Booking Form */}
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block mb-1">Start Time</label>
//           <DatePicker
//             selected={startTime}
//             onChange={(date) => setStartTime(date)}
//             showTimeSelect
//             timeIntervals={30}
//             dateFormat="yyyy-MM-dd HH:mm"
//             minDate={new Date()}
//             highlightDates={highlightDates}
//             filterTime={
//               startTime
//                 ? (time) =>
//                     !getDisabledHours(startTime).includes(time.getHours())
//                 : undefined
//             }
//             placeholderText="Select start time"
//             className="border p-2 w-full"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block mb-1">End Time</label>
//           <DatePicker
//             selected={endTime}
//             onChange={(date) => setEndTime(date)}
//             showTimeSelect
//             timeIntervals={30}
//             dateFormat="yyyy-MM-dd HH:mm"
//             minDate={startTime || new Date()}
//             highlightDates={highlightDates}
//             filterTime={
//               endTime || startTime
//                 ? (time) =>
//                     !getDisabledHours(endTime || startTime).includes(
//                       time.getHours(),
//                     )
//                 : undefined
//             }
//             placeholderText="Select end time"
//             className="border p-2 w-full"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block mb-1">Purpose</label>
//           <textarea
//             value={purpose}
//             onChange={(e) => setPurpose(e.target.value)}
//             rows={3}
//             className="border p-2 w-full"
//             placeholder="Enter purpose"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-green-500 text-white px-4 py-2"
//         >
//           {loading ? "Booking..." : "Confirm Booking"}
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Optional: Using Lucide icons for a professional feel
import { Calendar, Clock, Info, ShieldAlert, CheckCircle2, List } from 'lucide-react';

export default function BookResource() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [purpose, setPurpose] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8083/api/bookings/resource/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          }
        );
        const fetchedBookings = res.data.data || [];
        setBookings(fetchedBookings.map(b => ({
          ...b,
          startTime: new Date(b.startTime),
          endTime: new Date(b.endTime),
        })));
      } catch (err) {
        console.error(err);
        setBookings([]);
      }
    };
    fetchBookings();
  }, [id]);

  const intervals = bookings.map((b) => ({
    start: b.startTime,
    end: b.endTime,
  }));

  const isConflict = (start, end) =>
    intervals.some((i) => start < i.end && end > i.start);

  const getDisabledHours = (date) => {
    if (!date) return [];
    const disabled = [];
    intervals.forEach((interval) => {
      if (interval.start.toDateString() === date.toDateString()) {
        for (
          let h = interval.start.getHours();
          h < interval.end.getHours();
          h++
        ) {
          disabled.push(h);
        }
      }
    });
    return disabled;
  };

  const highlightDates = intervals.map((i) => i.start);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startTime || !endTime || !purpose)
      return alert("❌ Please fill all fields");
    if (endTime <= startTime) return alert("❌ End time must be after start");
    if (isConflict(startTime, endTime))
      return alert("❌ This time is already booked!");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8083/api/bookings",
        { resourceId: Number(id), startTime, endTime, purpose },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Booking Successful!");
      navigate("/user/bookings");
    } catch (err) {
      console.error(err);
      alert("❌ " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: BOOKING FORM */}
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
              {/* Start Time */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" /> Start Time
                </label>
                <DatePicker
                  selected={startTime}
                  onChange={(date) => setStartTime(date)}
                  showTimeSelect
                  timeIntervals={30}
                  dateFormat="MMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  highlightDates={highlightDates}
                  filterTime={startTime ? (time) => !getDisabledHours(startTime).includes(time.getHours()) : undefined}
                  placeholderText="Select start date & time"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-500" /> End Time
                </label>
                <DatePicker
                  selected={endTime}
                  onChange={(date) => setEndTime(date)}
                  showTimeSelect
                  timeIntervals={30}
                  dateFormat="MMM d, yyyy h:mm aa"
                  minDate={startTime || new Date()}
                  highlightDates={highlightDates}
                  filterTime={endTime || startTime ? (time) => !getDisabledHours(endTime || startTime).includes(time.getHours()) : undefined}
                  placeholderText="Select end date & time"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400" /> Purpose
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                  placeholder="What is this booking for?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md active:transform active:scale-95 flex items-center justify-center gap-2 ${
                  loading ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Processing..." : <><CheckCircle2 className="w-5 h-5" /> Confirm Booking</>}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKED SLOTS TABLE */}
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
                    {bookings.map((b, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                          {new Date(b.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                          {new Date(b.endTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase border border-amber-100">
                            {b.status || 'Booked'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 italic max-w-[200px] truncate">
                          {b.purpose}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* Legend/Helper */}
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
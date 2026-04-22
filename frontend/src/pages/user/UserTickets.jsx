import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ticketsApi } from "../../api/tickets";
import TicketComments from "../TicketComments";
import {
  PlusCircle,
  Ticket,
  MessageSquare,
  Layers,
  AlertCircle,
  Image as ImageIcon,
  Send,
  Loader2,
  Clock,
  CalendarDays,
} from "lucide-react";

export default function UserTickets() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Comments state
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentTicketId, setCommentTicketId] = useState(null);

  // NEW: read notification query params
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const ticketIdFromQuery = searchParams.get("ticketId");
  const openCommentsFromQuery = searchParams.get("openComments") === "true";

  const fetchTickets = async () => {
    try {
      setFetching(true);
      const res = await ticketsApi.getMyTickets();
      setTickets(res.data.data || []);
    } catch {
      setTickets([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // NEW: notification deep-link behavior
  useEffect(() => {
    if (fetching) return;
    if (!ticketIdFromQuery) return;

    const ticketIdNum = Number(ticketIdFromQuery);
    if (Number.isNaN(ticketIdNum)) return;

    const exists = tickets.some((t) => Number(t.id) === ticketIdNum);

    // If ticket exists in user's tickets -> open its comments modal when needed
    if (exists && openCommentsFromQuery) {
      setCommentTicketId(ticketIdNum);
      setCommentOpen(true);
    }

    // optional cleanup query params after handling (prevents re-open on refresh)
    // keep user on same path
    const timeout = setTimeout(() => {
      setSearchParams({}, { replace: true });
    }, 0);

    return () => clearTimeout(timeout);
  }, [
    fetching,
    ticketIdFromQuery,
    openCommentsFromQuery,
    tickets,
    setSearchParams,
  ]);

  // SORTING LOGIC: Priority Status > Newest Date
  const sortedTickets = useMemo(() => {
    const statusPriority = {
      OPEN: 1,
      IN_PROGRESS: 2,
      RESOLVED: 3,
      CLOSED: 4,
    };

    return [...tickets].sort((a, b) => {
      const priorityA = statusPriority[a.status] || 5;
      const priorityB = statusPriority[b.status] || 5;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tickets]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageChange(e) {
    setImages(Array.from(e.target.files));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append(
      "ticket",
      new Blob([JSON.stringify(form)], { type: "application/json" }),
    );
    for (let i = 0; i < images.length; i++) {
      fd.append("images", images[i]);
    }
    try {
      await ticketsApi.create(fd);
      alert("✅ Ticket created successfully!");
      setForm({ title: "", description: "", category: "", priority: "" });
      setImages([]);
      fetchTickets();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20";
      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20";
      case "RESOLVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
      case "CLOSED":
        return "bg-slate-50 text-slate-600 border-slate-200 ring-slate-500/20";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 p-6 md:p-0">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="p-3.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center">
          <Ticket className="text-white w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Support Center
          </h1>
          <p className="text-slate-500 font-medium mt-0.5">
            Report issues or request maintenance for resources.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* LEFT: CREATE TICKET FORM */}
        <div className="xl:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              New Support Request
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                Subject
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
                required
                name="title"
                placeholder="Brief summary of the issue"
                value={form.title}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                Details
              </label>
              <textarea
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none text-sm font-medium leading-relaxed"
                required
                name="description"
                placeholder="Describe the problem in detail..."
                rows={4}
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                  Category
                </label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none appearance-none cursor-pointer text-sm font-semibold text-slate-700"
                    name="category"
                    required
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select...
                    </option>
                    <option value="ELECTRICAL">Electrical</option>
                    <option value="PLUMBING">Plumbing</option>
                    <option value="HVAC">HVAC</option>
                    <option value="IT">IT Support</option>
                    <option value="CLEANING">Cleaning</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                  Priority
                </label>
                <div className="relative">
                  <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none appearance-none cursor-pointer text-sm font-semibold text-slate-700"
                    name="priority"
                    required
                    value={form.priority}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Level...
                    </option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                Attachments (Max 3)
              </label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all bg-slate-50/50">
                <div className="flex flex-col items-center justify-center pt-2">
                  <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
                  <p className="text-xs font-medium text-slate-500">
                    {images.length > 0 ? (
                      <span className="text-indigo-600 font-bold">
                        {images.length} file(s) ready
                      </span>
                    ) : (
                      "Upload photos of the issue"
                    )}
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" /> Submit Request
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: TICKET TABLE */}
        <div className="xl:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-fit">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Your Ticket History
              </h3>
              <p className="text-xs font-medium text-slate-400 mt-1">
                Sorted by priority and recent activity
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500">
              {sortedTickets.length} Total
            </div>
          </div>

          <div className="overflow-x-auto">
            {fetching ? (
              <div className="p-20 text-center animate-pulse">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
                <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">
                  Loading History...
                </p>
              </div>
            ) : sortedTickets.length === 0 ? (
              <div className="p-20 text-center">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <Clock className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-600 font-bold text-lg">
                  No tickets found
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Your submitted requests will appear here.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      Request Info
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Evidence
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sortedTickets.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-800 mb-1.5 text-sm line-clamp-1">
                          {t.title}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                t.priority === "CRITICAL"
                                  ? "bg-rose-500 animate-pulse"
                                  : t.priority === "HIGH"
                                    ? "bg-orange-500"
                                    : t.priority === "MEDIUM"
                                      ? "bg-amber-400"
                                      : "bg-blue-400"
                              }`}
                            ></span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              {t.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <CalendarDays className="w-3 h-3" />
                            {formatDate(t.createdAt)}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[10px] font-black border ring-1 uppercase tracking-widest whitespace-nowrap ${getStatusStyle(t.status)}`}
                        >
                          {t.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          {t.images && t.images.length > 0 ? (
                            <div className="flex -space-x-2 overflow-hidden hover:space-x-0 transition-all duration-300">
                              {t.images.slice(0, 3).map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img.startsWith("http") ? img : `/${img}`}
                                  alt="Attachment"
                                  className="inline-block h-9 w-9 rounded-lg ring-2 ring-white object-cover shadow-sm bg-slate-100"
                                />
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-300 bg-slate-50 px-2 py-1 rounded-md">
                              None
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => {
                            setCommentTicketId(t.id);
                            setCommentOpen(true);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 bg-white border border-indigo-100 shadow-sm rounded-xl hover:bg-indigo-50 hover:border-indigo-200 font-bold text-xs transition-all active:scale-95 whitespace-nowrap"
                        >
                          <MessageSquare className="w-4 h-4" />
                          View Log
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* COMMENT MODAL */}
      <TicketComments
        ticketId={commentTicketId}
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
      />
    </div>
  );
}

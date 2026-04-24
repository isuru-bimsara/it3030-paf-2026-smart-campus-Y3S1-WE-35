import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ticketsApi } from "../../api/tickets";
import { bookingsApi } from "../../api/bookings";
import TicketComments from "../TicketComments";
import {
  PlusCircle,
  Ticket,
  MessageSquare,
  Layers,
  Image as ImageIcon,
  Send,
  Loader2,
  Info,
  X,
  CheckCircle2,
  Eye,
  XCircle,
  ShieldAlert,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  History,
  ArrowRight
} from "lucide-react";

export default function UserTickets() {
  const [tickets, setTickets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
    contactDetails: "",
    isOther: false,
    bookingId: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [commentOpen, setCommentOpen] = useState(false);
  const [commentTicketId, setCommentTicketId] = useState(null);

  const [detailModal, setDetailModal] = useState({
    open: false,
    ticket: null,
    ackLoading: false,
  });

  const [highlightTicketId, setHighlightTicketId] = useState(null);

  const rowRefs = useRef({});
  const [searchParams, setSearchParams] = useSearchParams();
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

  const fetchBookings = async () => {
    try {
      const res = await bookingsApi.getMyBookings();
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (fetching || !ticketIdFromQuery) return;

    const ticketIdNum = Number(ticketIdFromQuery);
    if (Number.isNaN(ticketIdNum)) return;

    const target = tickets.find((t) => Number(t.id) === ticketIdNum);
    if (!target) return;

    setHighlightTicketId(ticketIdNum);

    if (openCommentsFromQuery) {
      setCommentTicketId(ticketIdNum);
      setCommentOpen(true);
    } else {
      openTicketDetails(target);
    }

    setTimeout(() => {
      rowRefs.current[ticketIdNum]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);

    const timeout = setTimeout(() => setSearchParams({}, { replace: true }), 0);
    const clearHighlight = setTimeout(() => setHighlightTicketId(null), 3500);

    return () => {
      clearTimeout(timeout);
      clearTimeout(clearHighlight);
    };
  }, [fetching, ticketIdFromQuery, openCommentsFromQuery, tickets, setSearchParams]);

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
      resolved: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    let result = [...tickets];
    
    if (filterStatus !== "ALL") {
      result = result.filter(t => t.status === filterStatus);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(lower) || 
        t.description.toLowerCase().includes(lower) ||
        t.id.toString().includes(lower)
      );
    }

    const statusPriority = {
      OPEN: 1,
      IN_PROGRESS: 2,
      RESOLVED: 3,
      REJECTED: 4,
      CLOSED: 5,
    };

    return result.sort((a, b) => {
      const pa = statusPriority[a.status] || 6;
      const pb = statusPriority[b.status] || 6;
      if (pa !== pb) return pa - pb;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tickets, searchTerm, filterStatus]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files || []);
    setImages((prev) => {
      const next = [...prev, ...files];
      if (next.length > 3) {
        alert("Maximum 3 images allowed. Keeping first 3.");
        return next.slice(0, 3);
      }
      return next;
    });
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const ticketData = { ...form };

    if (form.isOther) {
      ticketData.bookingId = null;
      ticketData.resourceId = null;
    } else if (form.bookingId) {
      const selectedBooking = bookings.find((b) => b.id === Number(form.bookingId));
      ticketData.resourceId = selectedBooking?.resourceId;
    }

    const fd = new FormData();
    fd.append("ticket", new Blob([JSON.stringify(ticketData)], { type: "application/json" }));
    images.forEach((img) => fd.append("images", img));

    try {
      await ticketsApi.create(fd);
      setForm({
        title: "",
        description: "",
        category: "",
        priority: "MEDIUM",
        contactDetails: "",
        isOther: false,
        bookingId: "",
      });
      setImages([]);
      await fetchTickets();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }

  const normalizeImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads")) return img;
    if (img.startsWith("uploads")) return `/${img}`;
    return `/uploads/${img}`;
  };

  const openTicketDetails = async (ticket) => {
    if (ticket.status === "RESOLVED") {
      try {
        await ticketsApi.markResolutionViewed(ticket.id);
      } catch (e) {
        console.error(e);
      }
    }
    setDetailModal({ open: true, ticket, ackLoading: false });
  };

  const closeTicketByUser = async () => {
    const t = detailModal.ticket;
    if (!t) return;
    if (t.status === "CLOSED") return;

    if (!window.confirm("Are you sure you want to close this ticket?")) return;

    setDetailModal((p) => ({ ...p, ackLoading: true }));
    try {
      await ticketsApi.acknowledgeResolution(t.id);
      setDetailModal({ open: false, ticket: null, ackLoading: false });
      await fetchTickets();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Failed to close ticket"));
      setDetailModal((p) => ({ ...p, ackLoading: false }));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-rose-500/10 text-rose-600 border-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.1)]";
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-600 border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.1)]";
      case "RESOLVED":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
      case "REJECTED":
        return "bg-orange-500/10 text-orange-600 border-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.1)]";
      case "CLOSED":
        return "bg-slate-500/10 text-slate-500 border-slate-200 shadow-[0_0_15px_rgba(100,116,139,0.1)]";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "LOW": return "text-emerald-500 bg-emerald-50";
      case "MEDIUM": return "text-blue-500 bg-blue-50";
      case "HIGH": return "text-orange-500 bg-orange-50";
      case "CRITICAL": return "text-rose-500 bg-rose-50";
      default: return "text-slate-500 bg-slate-50";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffHrs < 48) return "Yesterday";
    
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 p-4 md:p-8 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-200 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Ticket className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Support Hub</h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Manage your support tickets and resolutions.
            </p>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="flex gap-4">
          {[
            { label: 'Active', value: stats.open, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Resolved', value: stats.resolved, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Total', value: stats.total, color: 'text-slate-600', bg: 'bg-slate-50' }
          ].map((s, i) => (
            <div key={i} className={`${s.bg} px-6 py-3 rounded-2xl border border-white shadow-sm`}>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: CREATE FORM */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-8 sticky top-8">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Open a Ticket</h2>
              <p className="text-slate-400 text-sm mt-1 font-medium">Describe your issue and we'll help you out.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Issue Summary</label>
                <input
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none text-sm font-semibold"
                  required
                  name="title"
                  placeholder="What's the problem?"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-100/50 transition-colors">
                  <input
                    type="checkbox"
                    name="isOther"
                    className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    checked={form.isOther}
                    onChange={handleChange}
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-700">General Inquiry</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Not linked to a specific booking</p>
                  </div>
                </label>

                {!form.isOther && (
                  <div className="mt-3 space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Select Booking</label>
                    <select
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none text-sm font-semibold appearance-none cursor-pointer"
                      name="bookingId"
                      required={!form.isOther}
                      value={form.bookingId}
                      onChange={handleChange}
                    >
                      <option value="">Choose a recent booking...</option>
                      {bookings.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.resourceName} • {formatDate(b.startTime)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Details</label>
                <textarea
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none text-sm font-semibold resize-none"
                  required
                  rows={3}
                  name="description"
                  placeholder="Provide as much detail as possible..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
                  <select
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none text-sm font-semibold appearance-none cursor-pointer"
                    name="category"
                    required
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">Type</option>
                    <option value="ELECTRICAL">Electrical</option>
                    <option value="PLUMBING">Plumbing</option>
                    <option value="HVAC">HVAC</option>
                    <option value="IT">IT</option>
                    <option value="CLEANING">Cleaning</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Priority</label>
                  <select
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none text-sm font-semibold appearance-none cursor-pointer"
                    name="priority"
                    required
                    value={form.priority}
                    onChange={handleChange}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Contact Info</label>
                <input
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none text-sm font-semibold"
                  required
                  name="contactDetails"
                  placeholder="Email or phone"
                  value={form.contactDetails}
                  onChange={handleChange}
                />
              </div>

              <div className="pt-2">
                <label className="group flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-indigo-500 transition-colors mb-2" />
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                      {images.length > 0 ? `${images.length} Selected` : "Attach Evidence"}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter font-medium">Max 3 images</p>
                  </div>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>

                {images.length > 0 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group shrink-0">
                        <img
                          src={URL.createObjectURL(img)}
                          alt="preview"
                          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg scale-0 group-hover:scale-100 transition-transform"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 mt-6"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Submit Ticket <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: LIST */}
        <div className="lg:col-span-8 space-y-6">
          {/* FILTERS & SEARCH */}
          <div className="bg-white p-4 md:p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search tickets by ID, title or description..."
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-50 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-300 transition-all outline-none text-sm font-semibold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative w-full">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <select 
                  className="w-full md:w-40 pl-10 pr-6 py-4 bg-slate-50 border border-slate-50 rounded-2xl focus:bg-white transition-all outline-none text-sm font-bold appearance-none cursor-pointer"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">Processing</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* TICKET LIST */}
          <div className="space-y-4">
            {fetching ? (
              <div className="py-32 text-center bg-white rounded-[2.5rem] border border-slate-100">
                <div className="relative inline-block">
                  <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                  <Ticket className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] mt-6 animate-pulse">Syncing Support Data...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-[2.5rem] border border-slate-100">
                <div className="p-6 bg-slate-50 inline-block rounded-full mb-6">
                  <Info className="w-12 h-12 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-800">No tickets found</h3>
                <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto font-medium">We couldn't find any tickets matching your current filters or search terms.</p>
                {(searchTerm || filterStatus !== "ALL") && (
                  <button 
                    onClick={() => { setSearchTerm(""); setFilterStatus("ALL"); }}
                    className="mt-6 text-indigo-600 font-bold text-sm hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isHighlighted = Number(highlightTicketId) === Number(t.id);
                const statusStyle = getStatusStyle(t.status);
                const priorityStyle = getPriorityStyle(t.priority);

                return (
                  <div
                    key={t.id}
                    ref={(el) => { rowRefs.current[t.id] = el; }}
                    onClick={() => openTicketDetails(t)}
                    className={`group relative bg-white rounded-3xl border transition-all duration-500 cursor-pointer p-6 flex flex-col md:flex-row gap-6 items-start md:items-center ${
                      isHighlighted 
                      ? "border-amber-300 ring-4 ring-amber-100 shadow-xl shadow-amber-100/50" 
                      : "border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/40"
                    }`}
                  >
                    {/* Status Accent Line */}
                    {!t.read && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-600 rounded-r-full" />
                    )}

                    {/* Left: Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-transparent ${statusStyle}`}>
                          {t.status.replace("_", " ")}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${priorityStyle}`}>
                          {t.priority}
                        </span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">#{t.id}</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-800 tracking-tight mb-1 truncate group-hover:text-indigo-600 transition-colors">{t.title}</h3>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> {formatDate(t.createdAt)}
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" /> {t.isOther ? "General" : t.resourceName}
                        </span>
                      </div>

                      {t.status === "REJECTED" && t.rejectionReason && (
                        <div className="mt-4 flex items-start gap-3 p-3 bg-rose-50 rounded-2xl border border-rose-100">
                          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-rose-700 font-semibold line-clamp-1">Rejected: {t.rejectionReason}</p>
                        </div>
                      )}

                      {t.resolutionExplanation && (
                        <div className="mt-4 flex items-start gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-emerald-700 font-semibold">Resolution available — click to view</p>
                        </div>
                      )}
                    </div>

                    {/* Middle: Assignee */}
                    <div className="flex flex-col items-center md:items-end md:text-right shrink-0">
                      <div className="flex -space-x-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-indigo-600">
                          {t.assigneeName ? t.assigneeName.charAt(0) : "?"}
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Technician</span>
                      <span className="text-xs font-bold text-slate-600 mt-0.5">{t.assigneeName || "Awaiting Assignment"}</span>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-50" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setCommentTicketId(t.id);
                          setCommentOpen(true);
                        }}
                        className="flex-1 md:flex-none p-4 md:p-3 bg-white border border-slate-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm group/btn"
                        title="Conversation Log"
                      >
                        <MessageSquare className="w-5 h-5 text-slate-400 group-hover/btn:text-indigo-600 transition-colors mx-auto" />
                      </button>
                      <button
                        onClick={() => openTicketDetails(t)}
                        className="flex-1 md:flex-none p-4 md:p-3 bg-indigo-600 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 group/btn"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5 text-white mx-auto" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* TICKET DETAIL MODAL */}
      {detailModal.open && detailModal.ticket && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity" onClick={() => setDetailModal({ open: false, ticket: null, ackLoading: false })} />
          
          <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="p-8 md:p-10 border-b border-slate-100 flex items-start justify-between bg-slate-50/30">
              <div className="flex gap-6 items-center">
                <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-50">
                   <Ticket className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">
                      Ticket #{detailModal.ticket.id}
                    </span>
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-transparent ${getStatusStyle(detailModal.ticket.status)}`}>
                      {detailModal.ticket.status.replace("_", " ")}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">{detailModal.ticket.title}</h2>
                </div>
              </div>
              <button
                onClick={() => setDetailModal({ open: false, ticket: null, ackLoading: false })}
                className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 md:p-10 space-y-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <section>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Original Description</h3>
                    <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-[2rem] font-medium whitespace-pre-wrap">
                      {detailModal.ticket.description}
                    </div>
                  </section>

                  {/* Resolution & Internal Notes Section */}
                  {(detailModal.ticket.resolutionExplanation || detailModal.ticket.internalNotes) && (
                    <div className="grid grid-cols-1 gap-6">
                      {detailModal.ticket.resolutionExplanation && (
                        <div className="p-8 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-500 rounded-xl">
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-sm font-black text-emerald-800 uppercase tracking-widest">Resolution Summary</h3>
                          </div>
                          <p className="text-sm text-emerald-900/80 leading-relaxed font-medium whitespace-pre-wrap">
                            {detailModal.ticket.resolutionExplanation}
                          </p>
                        </div>
                      )}

                      {detailModal.ticket.internalNotes && (
                        <div className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-500 rounded-xl">
                              <ShieldAlert className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-sm font-black text-indigo-800 uppercase tracking-widest">Technician Notes</h3>
                          </div>
                          <p className="text-sm text-indigo-900/80 leading-relaxed font-medium whitespace-pre-wrap">
                            {detailModal.ticket.internalNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Ticket Metadata</h3>
                    <div className="space-y-4">
                      {[
                        { icon: Calendar, label: 'Created', value: formatDate(detailModal.ticket.createdAt) },
                        { icon: Layers, label: 'Category', value: detailModal.ticket.category },
                        { icon: Info, label: 'Priority', value: detailModal.ticket.priority },
                        { icon: Search, label: 'Technician', value: detailModal.ticket.assigneeName || 'Unassigned' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <item.icon className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{item.label}</p>
                            <p className="text-xs font-bold text-slate-700 mt-0.5">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Evidence Gallery</h3>
                    {detailModal.ticket.images && detailModal.ticket.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {detailModal.ticket.images.map((img, idx) => (
                          <a key={idx} href={normalizeImageUrl(img)} target="_blank" rel="noreferrer" className="group relative block aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                            <img src={normalizeImageUrl(img)} alt="attached" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <ImageIcon className="text-white w-6 h-6" />
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 text-center bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed">
                        <ImageIcon className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No Images</p>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 md:p-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/30">
               <div className="flex items-center gap-4">
                  <button 
                     onClick={() => { setCommentTicketId(detailModal.ticket.id); setCommentOpen(true); }}
                     className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:translate-x-2 transition-transform"
                  >
                     <MessageSquare className="w-4 h-4" /> View Full Conversation <ArrowRight className="w-4 h-4" />
                  </button>
               </div>

               <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => setDetailModal({ open: false, ticket: null, ackLoading: false })}
                  className="flex-1 md:flex-none px-8 py-4 rounded-[2rem] border-2 border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                  Dismiss
                </button>

                {detailModal.ticket.status !== "CLOSED" && (
                  <button
                    onClick={closeTicketByUser}
                    disabled={detailModal.ackLoading}
                    className="flex-1 md:flex-none px-8 py-4 rounded-[2rem] bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-200 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {detailModal.ackLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <History className="w-4 h-4" />
                    )}
                    Close Request
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <TicketComments
        ticketId={commentTicketId}
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
      />
    </div>
  );
}
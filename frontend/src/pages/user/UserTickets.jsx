import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Layers,
  Loader2,
  MessageSquare,
  PlusCircle,
  Send,
  Ticket,
} from "lucide-react";
import { ticketsApi } from "../../api/tickets";
import { useAuth } from "../../context/AuthContext";
import TicketComments from "../TicketComments";
import { resolveMediaUrl } from "../../utils/media";

export default function UserTickets() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    contactDetails: "",
    category: "",
    priority: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentTicketId, setCommentTicketId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

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

  useEffect(() => {
    if (!user?.email) return;

    setForm((prev) =>
      prev.contactDetails ? prev : { ...prev, contactDetails: user.email },
    );
  }, [user]);

  useEffect(() => {
    if (fetching || !ticketIdFromQuery) return;

    const ticketIdNum = Number(ticketIdFromQuery);
    if (Number.isNaN(ticketIdNum)) return;

    const exists = tickets.some((t) => Number(t.id) === ticketIdNum);
    if (exists && openCommentsFromQuery) {
      setCommentTicketId(ticketIdNum);
      setCommentOpen(true);
    }

    const timeout = setTimeout(() => {
      setSearchParams({}, { replace: true });
    }, 0);

    return () => clearTimeout(timeout);
  }, [
    fetching,
    openCommentsFromQuery,
    setSearchParams,
    ticketIdFromQuery,
    tickets,
  ]);

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

  const ticketStats = useMemo(() => {
    const openCount = tickets.filter((ticket) => ticket.status === "OPEN").length;
    const inProgressCount = tickets.filter(
      (ticket) => ticket.status === "IN_PROGRESS",
    ).length;
    const resolvedCount = tickets.filter((ticket) =>
      ["RESOLVED", "CLOSED"].includes(ticket.status),
    ).length;
    const criticalCount = tickets.filter(
      (ticket) => ticket.priority === "CRITICAL",
    ).length;

    return [
      {
        label: "Open Requests",
        value: openCount,
        detail: "Active issues waiting for action",
        icon: AlertCircle,
      },
      {
        label: "In Progress",
        value: inProgressCount,
        detail: "Currently being reviewed by the team",
        icon: Clock,
      },
      {
        label: "Resolved",
        value: resolvedCount,
        detail: "Completed or closed support requests",
        icon: CheckCircle2,
      },
      {
        label: "Critical",
        value: criticalCount,
        detail: "High-priority incidents flagged urgently",
        icon: Layers,
      },
    ];
  }, [tickets]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

    for (let i = 0; i < images.length; i += 1) {
      fd.append("images", images[i]);
    }

    try {
      await ticketsApi.create(fd);
      alert("Ticket created successfully!");
      setForm({
        title: "",
        description: "",
        contactDetails: user?.email || "",
        category: "",
        priority: "",
      });
      setImages([]);
      fetchTickets();
    } catch (err) {
      const fieldErrors = err.response?.data?.data;
      const firstFieldError =
        fieldErrors && typeof fieldErrors === "object"
          ? Object.values(fieldErrors)[0]
          : null;

      alert(firstFieldError || err.response?.data?.message || err.message);
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

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "HIGH":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-sky-50 text-sky-700 border-sky-200";
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
    <div className="max-w-7xl mx-auto space-y-8 pb-20 p-6 md:p-0">
      <style>{`
        @keyframes ticketFadeUp {
          0% { opacity: 0; transform: translate3d(0, 16px, 0); }
          100% { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        @keyframes ticketFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -8px, 0); }
        }

        @keyframes ticketGradientStream {
          0% { transform: translateX(-20%); opacity: 0.55; }
          50% { transform: translateX(18%); opacity: 1; }
          100% { transform: translateX(-20%); opacity: 0.55; }
        }

        .ticket-fade-up {
          animation: ticketFadeUp 700ms ease-out both;
        }

        .ticket-float {
          animation: ticketFloat 8s ease-in-out infinite;
        }

        .ticket-gradient-line {
          animation: ticketGradientStream 8.5s ease-in-out infinite;
        }
      `}</style>

      <section className="relative overflow-hidden rounded-[38px] border border-white/60 bg-[linear-gradient(135deg,#faf5ff_0%,#f3e8ff_40%,#eef2ff_100%)] px-6 py-8 shadow-[0_30px_95px_rgba(124,58,237,0.14)] md:px-8 xl:px-10">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-purple-300/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-1/3 h-56 w-56 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="pointer-events-none absolute right-24 bottom-0 h-44 w-44 rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div className="ticket-fade-up space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-violet-700 shadow-sm backdrop-blur-xl">
                <Ticket className="h-3.5 w-3.5" />
                 Support Center
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-violet-700 shadow-[0_14px_34px_rgba(124,58,237,0.10)] backdrop-blur-xl">
                SMART SUPPORT
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold tracking-[0.08em] text-violet-600">
                Fast help for every campus issue
              </p>
              <h1 className="max-w-3xl text-4xl font-black tracking-[-0.06em] text-slate-950 md:text-5xl xl:text-6xl">
                Submit smarter requests,
                <span className="block bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_42%,#8B5CF6_72%,#A855F7_100%)] bg-clip-text tracking-[-0.05em] text-transparent">
                  track every update beautifully
                </span>
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Send maintenance or support requests with clear details,
                attachments, and contact info, then follow each status change
                from one polished workspace.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {ticketStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-white/50 bg-white/70 p-5 shadow-[0_20px_60px_rgba(124,58,237,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(124,58,237,0.18)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="rounded-2xl bg-[linear-gradient(135deg,#ede9fe_0%,#f5f3ff_100%)] p-3 text-violet-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-600">
                        Live
                      </span>
                    </div>
                    <p className="mt-5 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                      {stat.detail}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="h-[6px] overflow-hidden rounded-full bg-white/60 shadow-inner">
              <div className="ticket-gradient-line h-full w-[55%] rounded-full bg-[linear-gradient(90deg,#6D28D9_0%,#7C3AED_35%,#8B5CF6_70%,#A855F7_100%)] shadow-[0_0_30px_rgba(124,58,237,0.35)]" />
            </div>
          </div>

          <div className="ticket-float ticket-fade-up rounded-[36px] border border-white/60 bg-white/70 p-5 shadow-[0_28px_80px_rgba(124,58,237,0.14)] backdrop-blur-2xl" style={{ animationDelay: "120ms" }}>
            <div className="rounded-[30px] bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_42%,#8B5CF6_74%,#A855F7_100%)] p-6 text-white shadow-[0_22px_56px_rgba(124,58,237,0.28)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-100">
                    Support Snapshot
                  </p>
                  <h2 className="mt-3 text-2xl font-black tracking-tight">
                    {sortedTickets.length > 0
                      ? "Your requests are organized and visible"
                      : "Start your first support request in seconds"}
                  </h2>
                </div>
                <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                  <Ticket className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/15 px-4 py-4 backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-100">
                    Contact
                  </p>
                  <p className="mt-2 text-sm font-bold text-white/95 break-all">
                    {form.contactDetails || user?.email || "Not provided"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/15 px-4 py-4 backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-100">
                    Latest Activity
                  </p>
                  <p className="mt-2 text-sm font-bold text-white/95">
                    {sortedTickets[0]?.createdAt
                      ? formatDate(sortedTickets[0].createdAt)
                      : "No requests yet"}
                  </p>
                </div>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white/90">
                Everything stays synced with your technician updates
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 xl:items-start">
        <div className="xl:col-span-4 overflow-hidden rounded-[32px] border border-white/60 bg-white/72 shadow-[0_20px_60px_rgba(124,58,237,0.10)] backdrop-blur-xl sticky top-6">
          <div className="border-b border-violet-100 bg-[linear-gradient(135deg,#ffffff_0%,#faf5ff_100%)] px-6 py-6">
            <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
              <PlusCircle className="h-5 w-5 text-violet-600" />
              New Support Request
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Share the issue clearly and our team can move faster.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                Subject
              </label>
              <input
                className="w-full rounded-[24px] border border-white/60 bg-white/75 px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition-all duration-300 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-200/80 focus:shadow-[0_18px_34px_rgba(124,58,237,0.12)]"
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
                className="w-full resize-none rounded-[24px] border border-white/60 bg-white/75 px-4 py-3.5 text-sm font-medium leading-relaxed text-slate-700 outline-none transition-all duration-300 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-200/80 focus:shadow-[0_18px_34px_rgba(124,58,237,0.12)]"
                required
                name="description"
                placeholder="Describe the problem in detail..."
                rows={5}
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                Contact Details
              </label>
              <input
                className="w-full rounded-[24px] border border-white/60 bg-white/75 px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition-all duration-300 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-200/80 focus:shadow-[0_18px_34px_rgba(124,58,237,0.12)]"
                required
                name="contactDetails"
                placeholder="Email or phone number for follow-up"
                value={form.contactDetails}
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
                    className="w-full appearance-none rounded-[24px] border border-white/60 bg-white/75 py-3 pl-9 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all duration-300 cursor-pointer focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-200/80 focus:shadow-[0_18px_34px_rgba(124,58,237,0.12)]"
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
                    className="w-full appearance-none rounded-[24px] border border-white/60 bg-white/75 py-3 pl-9 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all duration-300 cursor-pointer focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-200/80 focus:shadow-[0_18px_34px_rgba(124,58,237,0.12)]"
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
              <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-[26px] border-2 border-dashed border-violet-200 bg-[linear-gradient(135deg,#faf5ff_0%,#ffffff_100%)] transition-all duration-300 hover:border-violet-300 hover:bg-violet-50/50 hover:shadow-[0_16px_34px_rgba(124,58,237,0.10)]">
                <div className="flex flex-col items-center justify-center pt-2">
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <ImageIcon className="h-6 w-6 text-violet-500" />
                  </div>
                  <p className="mt-3 text-xs font-medium text-slate-500">
                    {images.length > 0 ? (
                      <span className="font-bold text-violet-600">
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
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_45%,#8B5CF6_75%,#A855F7_100%)] py-3.5 font-bold text-white shadow-[0_18px_40px_rgba(124,58,237,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_24px_55px_rgba(124,58,237,0.34)] active:scale-[0.99] disabled:bg-slate-300 disabled:shadow-none"
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

        <div className="xl:col-span-8 overflow-hidden rounded-[32px] border border-white/60 bg-white/72 shadow-[0_20px_60px_rgba(124,58,237,0.10)] backdrop-blur-xl h-fit">
          <div className="flex flex-col gap-4 border-b border-violet-100 bg-[linear-gradient(135deg,#ffffff_0%,#faf5ff_100%)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-black text-slate-900">
                <Layers className="h-5 w-5 text-violet-600" />
                Your Ticket History
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Premium timeline of your recent requests, priorities, and updates.
              </p>
            </div>
            <div className="w-fit rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-violet-600">
              {sortedTickets.length} Total
            </div>
          </div>

          <div>
            {fetching ? (
              <div className="p-20 text-center animate-pulse">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
                  <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Loading History...
                </p>
              </div>
            ) : sortedTickets.length === 0 ? (
              <div className="p-20 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-violet-100 bg-violet-50">
                  <Clock className="h-8 w-8 text-violet-300" />
                </div>
                <p className="text-lg font-bold text-slate-700">
                  No tickets found
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Your submitted requests will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4 p-6">
                {sortedTickets.map((t) => (
                  <article
                    key={t.id}
                    className="group rounded-[28px] border border-white/60 bg-[linear-gradient(135deg,#ffffff_0%,#faf5ff_100%)] p-5 shadow-[0_14px_40px_rgba(124,58,237,0.08)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.005] hover:border-violet-200 hover:shadow-[0_24px_55px_rgba(124,58,237,0.14)]"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start gap-3">
                          <div className="rounded-2xl bg-[linear-gradient(135deg,#ede9fe_0%,#f5f3ff_100%)] p-3 text-violet-700">
                            <Ticket className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="truncate text-lg font-black tracking-tight text-slate-900">
                                {t.title}
                              </h4>
                              <span
                                className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${getPriorityStyle(t.priority)}`}
                              >
                                {t.priority}
                              </span>
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                              {t.description || "No additional description provided."}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 backdrop-blur">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                              Status
                            </p>
                            <div className="mt-2">
                              <span
                                className={`inline-flex items-center justify-center rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] ring-1 ${getStatusStyle(t.status)}`}
                              >
                                {t.status.replace("_", " ")}
                              </span>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 backdrop-blur">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                              Created
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                              <CalendarDays className="h-4 w-4 text-violet-500" />
                              {formatDate(t.createdAt)}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 backdrop-blur">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                              Evidence
                            </p>
                            <div className="mt-2">
                              {t.images && t.images.length > 0 ? (
                                <div className="flex -space-x-2 overflow-hidden">
                                  {t.images.slice(0, 3).map((img, idx) => (
                                    <img
                                      key={idx}
                                      src={resolveMediaUrl(img)}
                                      alt="Attachment"
                                      className="inline-block h-10 w-10 rounded-xl bg-slate-100 object-cover ring-2 ring-white shadow-sm"
                                    />
                                  ))}
                                </div>
                              ) : (
                                <span className="inline-flex rounded-full bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-400">
                                  No attachments
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center">
                        <button
                          onClick={() => {
                            setCommentTicketId(t.id);
                            setCommentOpen(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm font-bold text-violet-700 shadow-[0_12px_30px_rgba(124,58,237,0.10)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-violet-200 hover:bg-violet-50 hover:shadow-[0_18px_40px_rgba(124,58,237,0.18)] active:scale-[0.99] whitespace-nowrap"
                        >
                          <MessageSquare className="h-4 w-4" />
                          View Log
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <TicketComments
        ticketId={commentTicketId}
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
      />
    </div>
  );
}

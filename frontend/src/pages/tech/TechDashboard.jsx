import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Flame,
  Loader2,
  ShieldAlert,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { ticketsApi } from "../../api/tickets";
import { useAuth } from "../../context/AuthContext";

const TICKET_TYPES = ["ALL", "ELECTRICAL", "PLUMBING", "HVAC", "IT", "CLEANING", "OTHER"];

const PRIORITY_STYLES = {
  CRITICAL: "border-rose-200 bg-rose-50 text-rose-700",
  HIGH: "border-orange-200 bg-orange-50 text-orange-700",
  MEDIUM: "border-violet-200 bg-violet-50 text-violet-700",
  LOW: "border-slate-200 bg-slate-50 text-slate-600",
};

const STATUS_STYLES = {
  OPEN: "border-violet-200 bg-violet-50 text-violet-700",
  IN_PROGRESS: "border-purple-200 bg-purple-50 text-purple-700",
  RESOLVED: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  CLOSED: "border-violet-100 bg-violet-50/80 text-violet-500",
  REJECTED: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
};

const HERO_IMAGE_BY_CATEGORY = {
  ELECTRICAL:
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=80",
  PLUMBING:
    "https://images.unsplash.com/photo-1621905252472-e8f6f2f7d7b9?auto=format&fit=crop&w=1400&q=80",
  HVAC:
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=80",
  IT:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
  CLEANING:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=80",
  OTHER:
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1400&q=80",
  DEFAULT:
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
};

const extractPayload = (response) => {
  if (Array.isArray(response?.data)) return response.data;
  return response?.data?.data ?? response?.data ?? [];
};

const formatCategoryLabel = (value) =>
  String(value || "GENERAL")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatStatusLabel = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatShortDate = (value) =>
  new Date(value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

const formatDateTime = (value) =>
  new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getTechHeroImage = (category) =>
  HERO_IMAGE_BY_CATEGORY[category] || HERO_IMAGE_BY_CATEGORY.DEFAULT;

function TechTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-3xl border border-violet-100 bg-white/95 px-4 py-3 shadow-[0_18px_50px_rgba(109,40,217,0.12)] backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-500">
        {label}
      </p>
      <div className="mt-2 space-y-1.5">
        {payload.map((entry) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-6 text-sm font-semibold"
          >
            <span className="text-slate-500">{entry.name}</span>
            <span style={{ color: entry.color || entry.fill }}>{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechGlassPanel({
  imageUrl,
  title,
  subtitle,
  eyebrow,
  badge,
  heightClass,
  bottomContent,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[30px] border border-violet-100 bg-white shadow-[0_22px_60px_rgba(109,40,217,0.12)] ${heightClass}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#faf5ff_0%,#ede9fe_42%,#ddd6fe_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_26%,rgba(124,58,237,0.18),transparent_24%),radial-gradient(circle_at_78%_72%,rgba(168,85,247,0.2),transparent_28%)]" />
      <div className="absolute -left-6 top-8 h-28 w-28 rounded-full bg-violet-300/30 blur-2xl" />
      <div className="absolute right-5 top-8 h-24 w-24 rounded-full bg-fuchsia-300/25 blur-2xl" />
      <div className="absolute bottom-6 left-8 h-16 w-16 rounded-[24px] border border-white/60 bg-white/40 shadow-sm" />
      <div className="absolute right-8 top-10 h-14 w-28 rounded-full border border-violet-200/70 bg-white/55 shadow-sm" />

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(124,58,237,0.08)_34%,rgba(91,33,182,0.84)_100%)]" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 md:p-5">
        <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-700 shadow-sm backdrop-blur">
          {eyebrow}
        </span>
        <span className="rounded-full bg-[linear-gradient(135deg,#6D28D9_0%,#8B5CF6_100%)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-[0_8px_20px_rgba(109,40,217,0.24)]">
          {badge}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-100/95">
          {eyebrow}
        </p>
        <p className="mt-2 text-2xl font-black md:text-3xl">{title}</p>
        <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-violet-50/95">
          {subtitle}
        </p>
        {bottomContent}
      </div>
    </div>
  );
}

export default function TechDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("ALL");
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let active = true;
    const saved = localStorage.getItem("techType") || "ALL";

    const loadDashboard = async (category) => {
      setLoading(true);

      try {
        const response =
          category === "ALL"
            ? await ticketsApi.getAll()
            : await ticketsApi.getByCategory(category);

        if (!active) return;

        setSelectedType(category);
        setTickets(extractPayload(response));
      } catch (error) {
        if (!active) return;
        console.error("Technician dashboard data fetch failed", error);
        setTickets([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboard(saved);

    return () => {
      active = false;
    };
  }, []);

  const handleChange = async (nextType) => {
    setSelectedType(nextType);
    localStorage.setItem("techType", nextType);
    setLoading(true);

    try {
      const response =
        nextType === "ALL"
          ? await ticketsApi.getAll()
          : await ticketsApi.getByCategory(nextType);

      setTickets(extractPayload(response));
    } catch (error) {
      console.error("Technician dashboard data fetch failed", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const myId = Number(user?.id);
  const myTickets = useMemo(
    () => tickets.filter((ticket) => Number(ticket.assigneeId) === myId),
    [tickets, myId],
  );

  const myActive = useMemo(
    () => myTickets.filter((ticket) => ticket.status === "IN_PROGRESS"),
    [myTickets],
  );

  const availableTickets = useMemo(
    () => tickets.filter((ticket) => !ticket.assigneeId && ticket.status === "OPEN"),
    [tickets],
  );

  const urgentTickets = useMemo(
    () =>
      [...tickets]
        .filter(
          (ticket) =>
            (ticket.priority === "CRITICAL" || ticket.priority === "HIGH") &&
            (ticket.status === "OPEN" || ticket.status === "IN_PROGRESS"),
        )
        .sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 4),
    [tickets],
  );

  const recentlyUpdated = useMemo(
    () =>
      [...tickets]
        .sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 4),
    [tickets],
  );

  const latestResolved = useMemo(
    () =>
      [...myTickets]
        .filter((ticket) => ticket.status === "RESOLVED" || ticket.status === "CLOSED")
        .sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0],
    [myTickets],
  );

  const completionRate = useMemo(() => {
    if (!myTickets.length) return 0;
    const completed = myTickets.filter(
      (ticket) => ticket.status === "RESOLVED" || ticket.status === "CLOSED",
    ).length;
    return Math.round((completed / myTickets.length) * 100);
  }, [myTickets]);

  const weeklyFlow = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - (6 - index));

      const opened = tickets.filter((ticket) => {
        const ticketDay = new Date(ticket.createdAt);
        ticketDay.setHours(0, 0, 0, 0);
        return ticketDay.getTime() === day.getTime();
      }).length;

      const urgent = tickets.filter((ticket) => {
        const ticketDay = new Date(ticket.createdAt);
        ticketDay.setHours(0, 0, 0, 0);
        return (
          ticketDay.getTime() === day.getTime() &&
          (ticket.priority === "CRITICAL" || ticket.priority === "HIGH")
        );
      }).length;

      return {
        day: day.toLocaleDateString([], { weekday: "short" }),
        opened,
        urgent,
      };
    });
  }, [tickets]);

  const statusMix = useMemo(
    () => [
      {
        name: "Open",
        total: tickets.filter((ticket) => ticket.status === "OPEN").length,
      },
      {
        name: "Active",
        total: tickets.filter((ticket) => ticket.status === "IN_PROGRESS").length,
      },
      {
        name: "Resolved",
        total: tickets.filter((ticket) => ticket.status === "RESOLVED").length,
      },
      {
        name: "Closed",
        total: tickets.filter((ticket) => ticket.status === "CLOSED").length,
      },
    ],
    [tickets],
  );

  const specializationLabel = formatCategoryLabel(selectedType);
  const heroTicket = urgentTickets[0] || myActive[0] || tickets[0] || null;

  const statCards = [
    {
      label: "My Active Jobs",
      value: myActive.length,
      detail: myActive.length ? "Tickets currently on your bench" : "No jobs in progress",
      icon: Wrench,
    },
    {
      label: "Open Queue",
      value: availableTickets.length,
      detail: availableTickets.length ? "Unassigned work ready to claim" : "Queue is clear",
      icon: ClipboardList,
    },
    {
      label: "Critical Now",
      value: urgentTickets.filter((ticket) => ticket.priority === "CRITICAL").length,
      detail: urgentTickets.length ? "Immediate attention recommended" : "No critical alarms",
      icon: ShieldAlert,
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      detail: myTickets.length ? "Across your assigned tickets" : "Starts once work is assigned",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      <style>{`
        @keyframes techDashboardFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -10px, 0); }
        }

        .tech-dashboard-float {
          animation: techDashboardFloat 7s ease-in-out infinite;
        }
      `}</style>

      <section
        className={`relative overflow-hidden rounded-[38px] border border-violet-100 bg-white px-6 py-10 shadow-[0_30px_90px_rgba(109,40,217,0.16)] transition-all duration-700 md:px-8 xl:px-10 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(250,245,255,0.9)_40%,rgba(124,58,237,0.2)_100%)]" />
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-fuchsia-300/18 blur-3xl" />

        <div className="relative z-10 grid items-center gap-8 xl:grid-cols-[1.04fr_0.96fr]">
          <div className="space-y-8">
            <div
              className={`transition-all duration-700 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/85 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-violet-700 shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Technician Command Center
              </div>

              <p className="text-sm font-semibold text-violet-600">
                Welcome back{user?.name ? `, ${user.name}` : ""}
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl xl:text-6xl">
                Keep every repair queue
                <span className="block bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_54%,#8B5CF6_100%)] bg-clip-text text-transparent">
                  sharp, visible, and moving
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Track urgent tickets, focus by specialization, and move faster through
                the workbench with a dashboard designed for technicians on live duty.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <button
                onClick={() => navigate("/tech/tickets")}
                className="group rounded-3xl bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_55%,#8B5CF6_100%)] px-5 py-4 text-left text-white shadow-[0_18px_40px_rgba(109,40,217,0.24)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(109,40,217,0.28)]"
              >
                <Wrench className="h-5 w-5" />
                <p className="mt-4 text-base font-black">Open Workbench</p>
                <p className="mt-1 text-sm text-white/80">
                  Jump into active and available tickets.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">
                  Enter
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>

              <div className="rounded-3xl border border-violet-100 bg-white/85 px-5 py-4 text-left shadow-[0_14px_38px_rgba(109,40,217,0.08)] backdrop-blur">
                <Zap className="h-5 w-5 text-violet-600" />
                <p className="mt-4 text-base font-black text-slate-950">Specialization</p>
                <select
                  value={selectedType}
                  onChange={(event) => handleChange(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-violet-100 bg-violet-50/70 px-3 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white"
                >
                  {TICKET_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type === "ALL" ? "All Specializations" : formatCategoryLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => navigate("/tech/notifications")}
                className="rounded-3xl border border-violet-100 bg-white/85 px-5 py-4 text-left shadow-[0_14px_38px_rgba(109,40,217,0.08)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_45px_rgba(109,40,217,0.14)]"
              >
                <BellRing className="h-5 w-5 text-violet-600" />
                <p className="mt-4 text-base font-black text-slate-950">Alerts</p>
                <p className="mt-1 text-sm text-slate-500">
                  Review assignment updates and system signals.
                </p>
              </button>
            </div>
          </div>

          <div
            className={`tech-dashboard-float relative mx-auto w-full max-w-[520px] transition-all duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="rounded-[32px] border border-white/80 bg-white/75 p-4 shadow-[0_28px_70px_rgba(109,40,217,0.12)] backdrop-blur-xl">
              <TechGlassPanel
                imageUrl={getTechHeroImage(heroTicket?.category || selectedType)}
                title={heroTicket?.title || "Queues are ready for the next fix"}
                subtitle={
                  heroTicket
                    ? `${formatCategoryLabel(heroTicket.category)} ticket - ${
                        heroTicket.reporterName || "Campus request"
                      }`
                    : "Focus by specialization, stay ahead of urgent jobs, and keep every assignment visible from one polished workspace."
                }
                eyebrow="Priority Focus"
                badge={heroTicket?.priority || specializationLabel}
                heightClass="h-[340px] md:h-[380px]"
                bottomContent={
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-white/18 px-3 py-3 backdrop-blur">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-100/95">
                        Scope
                      </p>
                      <p className="mt-1 text-lg font-black text-white">{specializationLabel}</p>
                    </div>
                    <div className="rounded-2xl bg-white/18 px-3 py-3 backdrop-blur">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-100/95">
                        Active
                      </p>
                      <p className="mt-1 text-lg font-black text-white">{myActive.length}</p>
                    </div>
                    <div className="rounded-2xl bg-white/18 px-3 py-3 backdrop-blur">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-100/95">
                        Urgent
                      </p>
                      <p className="mt-1 text-lg font-black text-white">{urgentTickets.length}</p>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`rounded-3xl border border-violet-100 bg-white p-6 shadow-[0_14px_34px_rgba(109,40,217,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_20px_48px_rgba(109,40,217,0.12)] ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-2xl bg-[linear-gradient(135deg,#ede9fe_0%,#f5f3ff_100%)] p-3 text-violet-700">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-600">
                  Live
                </span>
              </div>

              <p className="mt-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                {card.label}
              </p>
              <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                {card.value}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-500">{card.detail}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div
          className={`rounded-3xl border border-violet-100 bg-white p-6 shadow-[0_16px_40px_rgba(109,40,217,0.06)] transition-all duration-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "120ms" }}
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-500">
                Activity
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Queue intake and urgency
              </h2>
            </div>
            <div className="rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-violet-700">
              Last 7 Days
            </div>
          </div>

          {loading ? (
            <div className="flex h-[320px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            </div>
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyFlow} margin={{ left: -18, right: 12, top: 12 }}>
                  <defs>
                    <linearGradient id="openedFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#6D28D9" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#6D28D9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="urgentFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.24} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" vertical={false} />
                  <XAxis dataKey="day" stroke="#a78bfa" tickLine={false} axisLine={false} />
                  <YAxis
                    allowDecimals={false}
                    stroke="#a78bfa"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<TechTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="opened"
                    stroke="#6D28D9"
                    strokeWidth={3}
                    fill="url(#openedFill)"
                    name="Opened"
                  />
                  <Area
                    type="monotone"
                    dataKey="urgent"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fill="url(#urgentFill)"
                    name="Urgent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div
          className={`rounded-3xl border border-violet-100 bg-white p-6 shadow-[0_16px_40px_rgba(109,40,217,0.06)] transition-all duration-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-500">
                Workflow
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Status distribution
              </h2>
            </div>
            <BellRing className="h-5 w-5 text-violet-600" />
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusMix} margin={{ left: -20, right: 4, top: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" vertical={false} />
                <XAxis dataKey="name" stroke="#a78bfa" tickLine={false} axisLine={false} />
                <YAxis
                  allowDecimals={false}
                  stroke="#a78bfa"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<TechTooltip />} />
                <Bar
                  dataKey="total"
                  name="Tickets"
                  radius={[12, 12, 0, 0]}
                  fill="#7C3AED"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr_0.95fr]">
        <div
          className={`rounded-3xl border border-violet-100 bg-white p-6 shadow-[0_16px_40px_rgba(109,40,217,0.06)] transition-all duration-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "120ms" }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-500">
                Urgent Queue
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-950">Priority tickets</h3>
            </div>
            <button
              onClick={() => navigate("/tech/tickets")}
              className="text-sm font-black text-violet-700 transition hover:text-violet-800"
            >
              Open Queue
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex h-[220px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
              </div>
            ) : urgentTickets.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-violet-200 bg-violet-50/50 p-8 text-center">
                <ShieldAlert className="mx-auto h-8 w-8 text-violet-300" />
                <p className="mt-4 text-lg font-black text-slate-900">No urgent tickets</p>
                <p className="mt-2 text-sm text-slate-500">
                  Critical and high priority requests will surface here automatically.
                </p>
              </div>
            ) : (
              urgentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-3xl border border-violet-100 bg-[linear-gradient(135deg,#ffffff_0%,#faf5ff_100%)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_40px_rgba(109,40,217,0.1)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-black text-slate-950">{ticket.title}</p>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {ticket.reporterName || "Campus reporter"} -{" "}
                        {formatCategoryLabel(ticket.category)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${
                        PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.LOW
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${
                        STATUS_STYLES[ticket.status] || STATUS_STYLES.OPEN
                      }`}
                    >
                      {formatStatusLabel(ticket.status)}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-violet-700">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatShortDate(ticket.createdAt)}
                    </span>
                  </div>

                  {ticket.description ? (
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                      {ticket.description}
                    </p>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>

        <div
          className={`rounded-3xl border border-violet-100 bg-white p-6 shadow-[0_16px_40px_rgba(109,40,217,0.06)] transition-all duration-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-500">
                Recent Activity
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-950">Latest tickets</h3>
            </div>
            <Flame className="h-5 w-5 text-violet-600" />
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex h-[220px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
              </div>
            ) : recentlyUpdated.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-violet-200 bg-violet-50/50 p-8 text-center">
                <ClipboardList className="mx-auto h-8 w-8 text-violet-300" />
                <p className="mt-4 text-lg font-black text-slate-900">No ticket activity yet</p>
                <p className="mt-2 text-sm text-slate-500">
                  Once requests come in, the latest activity appears here.
                </p>
              </div>
            ) : (
              recentlyUpdated.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-3xl border border-violet-100 bg-white p-5 shadow-[0_10px_28px_rgba(109,40,217,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_38px_rgba(109,40,217,0.1)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${
                        STATUS_STYLES[ticket.status] || STATUS_STYLES.OPEN
                      }`}
                    >
                      {formatStatusLabel(ticket.status)}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {formatShortDate(ticket.createdAt)}
                    </span>
                  </div>

                  <p className="mt-4 text-lg font-black text-slate-950">{ticket.title}</p>
                  <p className="mt-2 text-sm font-medium text-slate-500">
                    {formatCategoryLabel(ticket.category)} -{" "}
                    {ticket.assigneeName || "Unassigned"}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-500 line-clamp-2">
                    {ticket.description || "No description provided."}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div
          className={`rounded-3xl border border-violet-100 bg-white p-6 shadow-[0_16px_40px_rgba(109,40,217,0.06)] transition-all duration-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "240ms" }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-500">
                Performance
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-950">Bench summary</h3>
            </div>
            <Zap className="h-5 w-5 text-violet-600" />
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-violet-100 bg-[linear-gradient(135deg,#faf5ff_0%,#ffffff_100%)] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-500">
                Selected Scope
              </p>
              <p className="mt-3 text-3xl font-black text-slate-950">{specializationLabel}</p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Filter stays saved for your next session.
              </p>
            </div>

            <div className="rounded-3xl border border-violet-100 bg-[linear-gradient(135deg,#f5f3ff_0%,#ffffff_100%)] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-500">
                Latest Completion
              </p>
              <p className="mt-3 text-lg font-black text-slate-950 line-clamp-2">
                {latestResolved?.title || "No completed tickets yet"}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {latestResolved
                  ? formatDateTime(latestResolved.createdAt)
                  : "Resolved work will appear here once your queue moves."}
              </p>
            </div>

            <button
              onClick={() => navigate("/tech/tickets")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_58%,#8B5CF6_100%)] px-4 py-4 text-sm font-black text-white shadow-[0_14px_28px_rgba(109,40,217,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(109,40,217,0.24)]"
            >
              Review Ticket Pipeline
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

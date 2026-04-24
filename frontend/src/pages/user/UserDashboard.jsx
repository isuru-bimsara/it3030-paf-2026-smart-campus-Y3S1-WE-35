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
  CalendarClock,
  CheckCircle2,
  Clock3,
  Compass,
  FolderClock,
  Layers3,
  Loader2,
  Sparkles,
  Ticket,
} from "lucide-react";
import api from "../../api/axios";
import { bookingsApi } from "../../api/bookings";
import { resourcesApi } from "../../api/resources";
import { ticketsApi } from "../../api/tickets";
import { useAuth } from "../../context/AuthContext";

const extractPayload = (response) => {
  if (Array.isArray(response?.data)) return response.data;
  return response?.data?.data ?? response?.data ?? [];
};

const formatDateTime = (value) =>
  new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatCompactDate = (value) =>
  new Date(value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

const isFuture = (value) => new Date(value).getTime() > Date.now();

const imageUrlFor = (resource) => {
  if (!resource?.imageUrl) return null;
  return resource.imageUrl.startsWith("http")
    ? resource.imageUrl
    : `http://localhost:8083${resource.imageUrl}`;
};

const STATUS_STYLES = {
  APPROVED: "border-violet-200 bg-violet-50 text-violet-700",
  PENDING: "border-purple-200 bg-purple-50 text-purple-700",
  REJECTED: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  CANCELLED: "border-violet-100 bg-violet-50/80 text-violet-500",
  OPEN: "border-violet-200 bg-violet-50 text-violet-700",
  IN_PROGRESS: "border-purple-200 bg-purple-50 text-purple-700",
  RESOLVED: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  CLOSED: "border-violet-100 bg-violet-50/80 text-violet-500",
};

function PurpleTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-3xl border border-violet-100 bg-white/95 px-4 py-3 shadow-[0_18px_50px_rgba(109,40,217,0.12)] backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-400">
        {label}
      </p>
      <div className="mt-2 space-y-1.5">
        {payload.map((entry) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-6 text-sm font-semibold"
          >
            <span className="text-slate-500">{entry.name}</span>
            <span style={{ color: entry.color }}>{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GradientPlaceholder({ compact = false }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#faf5ff_0%,#ede9fe_42%,#ddd6fe_100%)] ${
        compact ? "" : "min-h-full"
      }`}
    >
      <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-violet-300/35 blur-2xl" />
      <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-fuchsia-300/25 blur-2xl" />
      <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-purple-300/30 blur-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(124,58,237,0.18),transparent_24%),radial-gradient(circle_at_32%_72%,rgba(139,92,246,0.14),transparent_28%)]" />
      <div className="absolute left-6 top-6 h-20 w-20 rounded-[28px] border border-white/60 bg-white/45 shadow-sm" />
      <div className="absolute right-8 top-10 h-14 w-28 rounded-full border border-violet-200/70 bg-white/55 shadow-sm" />
      <div className="absolute bottom-8 left-8 h-16 w-16 rounded-full border border-violet-200/70 bg-white/45 shadow-sm" />
    </div>
  );
}

function PremiumImagePanel({
  imageUrl,
  title,
  subtitle,
  eyebrow,
  badge,
  heightClass,
  compact = false,
  bottomContent,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-violet-100 bg-white shadow-[0_20px_55px_rgba(109,40,217,0.08)] ${heightClass}`}
    >
      <GradientPlaceholder compact={compact} />

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(124,58,237,0.08)_34%,rgba(91,33,182,0.78)_100%)]" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 md:p-5">
        <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-700 shadow-sm backdrop-blur">
          {eyebrow}
        </span>
        <span className="rounded-full bg-[linear-gradient(135deg,#6D28D9_0%,#8B5CF6_100%)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-[0_8px_20px_rgba(109,40,217,0.2)]">
          {badge}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-100/90">
          {eyebrow}
        </p>
        <p className="mt-2 text-2xl font-black md:text-3xl">{title}</p>
        <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-violet-50/90">
          {subtitle}
        </p>
        {bottomContent}
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    myBookings: 0,
    pendingBookings: 0,
    tickets: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);

      const [statsRes, bookingsRes, ticketsRes, resourcesRes] =
        await Promise.allSettled([
          api.get("/users/stats"),
          bookingsApi.getMyBookings(),
          ticketsApi.getMyTickets(),
          resourcesApi.getAvailable(),
        ]);

      if (!active) return;

      if (statsRes.status === "fulfilled") {
        const payload = extractPayload(statsRes.value);
        setStats({
          myBookings: payload?.myBookings ?? 0,
          pendingBookings: payload?.pendingBookings ?? 0,
          tickets: payload?.tickets ?? 0,
        });
      }

      if (bookingsRes.status === "fulfilled") {
        setBookings(extractPayload(bookingsRes.value));
      } else {
        setBookings([]);
      }

      if (ticketsRes.status === "fulfilled") {
        setTickets(extractPayload(ticketsRes.value));
      } else {
        setTickets([]);
      }

      if (resourcesRes.status === "fulfilled") {
        setResources(extractPayload(resourcesRes.value));
      } else {
        setResources([]);
      }

      setLoading(false);
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const upcomingBookings = useMemo(
    () =>
      [...bookings]
        .filter((booking) => isFuture(booking.startTime))
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        )
        .slice(0, 4),
    [bookings],
  );

  const spotlightResources = useMemo(() => [...resources].slice(0, 3), [resources]);

  const heroResource = useMemo(
    () => resources.find((resource) => imageUrlFor(resource)) || resources[0] || null,
    [resources],
  );

  const activeTickets = useMemo(
    () =>
      tickets.filter(
        (ticketItem) =>
          ticketItem.status === "OPEN" || ticketItem.status === "IN_PROGRESS",
      ),
    [tickets],
  );

  const latestTicket = useMemo(
    () =>
      [...tickets].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0],
    [tickets],
  );

  const bookingApprovalRate = useMemo(() => {
    if (!bookings.length) return 0;
    const approved = bookings.filter((booking) => booking.status === "APPROVED").length;
    return Math.round((approved / bookings.length) * 100);
  }, [bookings]);

  const weeklyActivity = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - (6 - index));

      const dailyBookings = bookings.filter((booking) => {
        const bookingDay = new Date(booking.createdAt || booking.startTime);
        bookingDay.setHours(0, 0, 0, 0);
        return bookingDay.getTime() === day.getTime();
      }).length;

      const dailyTickets = tickets.filter((ticketItem) => {
        const ticketDay = new Date(ticketItem.createdAt);
        ticketDay.setHours(0, 0, 0, 0);
        return ticketDay.getTime() === day.getTime();
      }).length;

      return {
        day: day.toLocaleDateString([], { weekday: "short" }),
        bookings: dailyBookings,
        tickets: dailyTickets,
      };
    });

    return days;
  }, [bookings, tickets]);

  const statusMix = useMemo(
    () => [
      {
        name: "Approved",
        total: bookings.filter((booking) => booking.status === "APPROVED").length,
      },
      {
        name: "Pending",
        total: bookings.filter((booking) => booking.status === "PENDING").length,
      },
      {
        name: "Open",
        total: tickets.filter((ticketItem) => ticketItem.status === "OPEN").length,
      },
      {
        name: "Active",
        total: tickets.filter((ticketItem) => ticketItem.status === "IN_PROGRESS").length,
      },
    ],
    [bookings, tickets],
  );

  const statCards = [
    {
      label: "My Bookings",
      value: stats.myBookings,
      detail: bookingApprovalRate ? `${bookingApprovalRate}% approval rate` : "No approvals yet",
      icon: CalendarClock,
    },
    {
      label: "Pending Requests",
      value: stats.pendingBookings,
      detail: stats.pendingBookings ? "Awaiting review" : "No requests in queue",
      icon: Clock3,
    },
    {
      label: "Active Tickets",
      value: activeTickets.length,
      detail: activeTickets.length ? "Support is in motion" : "Everything is quiet",
      icon: Ticket,
    },
    {
      label: "Available Resources",
      value: resources.length,
      detail: resources.length ? "Open for reservation" : "No live inventory",
      icon: Layers3,
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      <style>{`
        @keyframes dashboardFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -8px, 0); }
        }

        .dashboard-float {
          animation: dashboardFloat 7s ease-in-out infinite;
        }
      `}</style>

      <section
        className={`relative overflow-hidden rounded-[38px] border border-violet-100 bg-white px-6 py-10 shadow-[0_30px_90px_rgba(109,40,217,0.16)] transition-all duration-700 md:px-8 xl:px-10 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80"
          alt="Student Dashboard Background"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.94)_0%,rgba(250,245,255,0.88)_45%,rgba(124,58,237,0.28)_100%)]" />

        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-400/25 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl" />

        <div className="relative z-10 grid items-center gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div
              className={`transition-all duration-700 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-violet-600 shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Premium Student Dashboard
              </div>

              <p className="text-sm font-semibold text-violet-500">
                Welcome back{user?.name ? `, ${user.name}` : ""}
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl xl:text-6xl">
                Everything you need,
                <span className="block bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_52%,#8B5CF6_100%)] bg-clip-text text-transparent">
                  beautifully organized
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Monitor reservations, support requests, and open campus resources from a single
                elegant workspace built for speed, clarity, and confidence.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <button
                onClick={() => navigate("/user/resources")}
                className="group rounded-3xl bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_55%,#8B5CF6_100%)] px-5 py-4 text-left text-white shadow-[0_18px_40px_rgba(109,40,217,0.24)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(109,40,217,0.28)]"
              >
                <Compass className="h-5 w-5" />
                <p className="mt-4 text-base font-black">Book Resource</p>
                <p className="mt-1 text-sm text-white/80">Find an available space now.</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold">
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>

              <button
                onClick={() => navigate("/user/bookings")}
                className="rounded-3xl border border-violet-100 bg-white/80 px-5 py-4 text-left shadow-[0_14px_38px_rgba(109,40,217,0.06)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_45px_rgba(109,40,217,0.12)]"
              >
                <CalendarClock className="h-5 w-5 text-violet-600" />
                <p className="mt-4 text-base font-black text-slate-950">My Bookings</p>
                <p className="mt-1 text-sm text-slate-500">Track every reservation and approval.</p>
              </button>

              <button
                onClick={() => navigate("/user/tickets")}
                className="rounded-3xl border border-violet-100 bg-white/80 px-5 py-4 text-left shadow-[0_14px_38px_rgba(109,40,217,0.06)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_45px_rgba(109,40,217,0.12)]"
              >
                <Ticket className="h-5 w-5 text-violet-600" />
                <p className="mt-4 text-base font-black text-slate-950">Submit Ticket</p>
                <p className="mt-1 text-sm text-slate-500">Report issues without leaving the flow.</p>
              </button>
            </div>
          </div>

          <div
            className={`dashboard-float relative mx-auto w-full max-w-[520px] transition-all duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="rounded-[32px] border border-white/80 bg-white/75 p-4 shadow-[0_28px_70px_rgba(109,40,217,0.12)] backdrop-blur-xl">
              <PremiumImagePanel
                imageUrl={heroResource ? imageUrlFor(heroResource) : null}
                title={heroResource?.name || "Campus spaces, ready when you are"}
                subtitle={
                  heroResource
                    ? `${heroResource.location || "Campus location"} - Capacity ${
                        heroResource.capacity || 0
                      }`
                    : "Discover premium rooms, labs, and equipment with fast booking flow and elegant campus organization."
                }
                eyebrow="Featured Resource"
                badge={heroResource?.type || "Campus Ready"}
                heightClass="h-[340px] md:h-[380px]"
                bottomContent={
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-white/18 px-3 py-3 backdrop-blur">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-100/90">
                        Resources
                      </p>
                      <p className="mt-1 text-lg font-black text-white">{resources.length}</p>
                    </div>
                    <div className="rounded-2xl bg-white/18 px-3 py-3 backdrop-blur">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-100/90">
                        Tickets
                      </p>
                      <p className="mt-1 text-lg font-black text-white">
                        {activeTickets.length}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/18 px-3 py-3 backdrop-blur">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-100/90">
                        Approval
                      </p>
                      <p className="mt-1 text-lg font-black text-white">
                        {bookingApprovalRate}%
                      </p>
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
                <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-500">
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
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400">
                Activity
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Booking and support rhythm
              </h2>
            </div>
            <div className="rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-violet-600">
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
                <AreaChart data={weeklyActivity} margin={{ left: -18, right: 12, top: 12 }}>
                  <defs>
                    <linearGradient id="bookingFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#6D28D9" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6D28D9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ticketFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.26} />
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
                  <Tooltip content={<PurpleTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="#6D28D9"
                    strokeWidth={3}
                    fill="url(#bookingFill)"
                    name="Bookings"
                  />
                  <Area
                    type="monotone"
                    dataKey="tickets"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fill="url(#ticketFill)"
                    name="Tickets"
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
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400">
                Queue Mix
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Attention overview
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
                <Tooltip content={<PurpleTooltip />} />
                <Bar dataKey="total" name="Count" radius={[12, 12, 0, 0]} fill="#7C3AED" />
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
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400">
                Upcoming
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-950">Upcoming bookings</h3>
            </div>
            <button
              onClick={() => navigate("/user/bookings")}
              className="text-sm font-black text-violet-600 transition hover:text-violet-700"
            >
              See All
            </button>
          </div>

          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-violet-200 bg-violet-50/50 p-8 text-center">
                <CalendarClock className="mx-auto h-8 w-8 text-violet-300" />
                <p className="mt-4 text-lg font-black text-slate-900">No future bookings yet</p>
                <p className="mt-2 text-sm text-slate-500">
                  Reserve a room or resource and it will appear here instantly.
                </p>
              </div>
            ) : (
              upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-3xl border border-violet-100 bg-[linear-gradient(135deg,#ffffff_0%,#faf5ff_100%)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_40px_rgba(109,40,217,0.1)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-black text-slate-950">
                        {booking.resourceName || `Booking #${booking.id}`}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {formatDateTime(booking.startTime)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${
                        STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl border border-violet-100 bg-white/80 px-4 py-3">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-400">
                      Schedule
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-600">
                      {formatDateTime(booking.startTime)} to {formatDateTime(booking.endTime)}
                    </p>
                  </div>

                  {booking.purpose ? (
                    <p className="mt-4 text-sm leading-6 text-slate-500">{booking.purpose}</p>
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
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400">
                Support
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-950">Ticket snapshot</h3>
            </div>
            <button
              onClick={() => navigate("/user/tickets")}
              className="text-sm font-black text-violet-600 transition hover:text-violet-700"
            >
              Open Tickets
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-violet-100 bg-[linear-gradient(135deg,#f5f3ff_0%,#ffffff_100%)] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-400">
                Active Tickets
              </p>
              <p className="mt-3 text-4xl font-black text-slate-950">{activeTickets.length}</p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                currently in review or progress
              </p>
            </div>

            <div className="rounded-3xl border border-violet-100 bg-[linear-gradient(135deg,#faf5ff_0%,#ffffff_100%)] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-400">
                Latest Ticket
              </p>
              <p className="mt-3 line-clamp-2 text-lg font-black text-slate-950">
                {latestTicket?.title || "No tickets yet"}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {latestTicket
                  ? formatCompactDate(latestTicket.createdAt)
                  : "Create your first support request"}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-violet-100 bg-violet-50/70 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-[linear-gradient(135deg,#6D28D9_0%,#8B5CF6_100%)] p-3 text-white shadow-[0_14px_28px_rgba(109,40,217,0.18)]">
                <FolderClock className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-black text-slate-950">
                  {latestTicket?.title || "Need maintenance support?"}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {latestTicket?.description ||
                    "Create a support request for classroom, equipment, or facility issues."}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              {latestTicket ? (
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${
                    STATUS_STYLES[latestTicket.status] || STATUS_STYLES.OPEN
                  }`}
                >
                  {latestTicket.status.replace("_", " ")}
                </span>
              ) : (
                <span className="rounded-full border border-violet-100 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-violet-500">
                  Ready
                </span>
              )}

              <button
                onClick={() => navigate("/user/tickets")}
                className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_58%,#8B5CF6_100%)] px-4 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(109,40,217,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(109,40,217,0.24)]"
              >
                {latestTicket ? "View Timeline" : "Submit Ticket"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
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
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400">
                Spotlight
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-950">Resource spotlight</h3>
            </div>
            <Layers3 className="h-5 w-5 text-violet-600" />
          </div>

          <div className="space-y-4">
            {spotlightResources.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-violet-200 bg-violet-50/50 p-8 text-center">
                <Layers3 className="mx-auto h-8 w-8 text-violet-300" />
                <p className="mt-4 text-lg font-black text-slate-950">No live resources</p>
                <p className="mt-2 text-sm text-slate-500">
                  Available spaces will show up here as soon as they are ready.
                </p>
              </div>
            ) : (
              spotlightResources.map((resource) => (
                <div
                  key={resource.id}
                  className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-[0_10px_28px_rgba(109,40,217,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_38px_rgba(109,40,217,0.1)]"
                >
                  <PremiumImagePanel
                    imageUrl={imageUrlFor(resource)}
                    title={resource.name}
                    subtitle={`${resource.location || "Campus location"} - Capacity ${
                      resource.capacity || 0
                    }`}
                    eyebrow="Resource"
                    badge={resource.type}
                    heightClass="h-[180px]"
                    compact
                  />

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-violet-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Available
                      </span>
                      <button
                        onClick={() => navigate(`/user/book/${resource.id}`)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_58%,#8B5CF6_100%)] px-4 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(109,40,217,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(109,40,217,0.24)]"
                      >
                        Book Now
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

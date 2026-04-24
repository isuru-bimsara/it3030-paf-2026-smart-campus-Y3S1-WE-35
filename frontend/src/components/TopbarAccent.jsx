import { CalendarDays, Sparkles } from "lucide-react";

const toneClasses = {
  emerald: {
    shell:
      "border-emerald-100/80 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.2),_rgba(255,255,255,0.96)_58%)] shadow-emerald-100/70",
    iconWrap: "bg-emerald-500 text-white shadow-lg shadow-emerald-200/80",
    pill: "bg-emerald-50 text-emerald-700",
    sparkle: "text-emerald-400",
  },
  indigo: {
    shell:
      "border-indigo-100/80 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_rgba(255,255,255,0.96)_58%)] shadow-indigo-100/70",
    iconWrap: "bg-indigo-500 text-white shadow-lg shadow-indigo-200/80",
    pill: "bg-indigo-50 text-indigo-700",
    sparkle: "text-indigo-400",
  },
};

export default function TopbarAccent({
  tone = "indigo",
  label = "Today",
}) {
  const colors = toneClasses[tone] || toneClasses.indigo;
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <div
      className={`hidden sm:flex items-center gap-3 rounded-2xl border px-3.5 py-2 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur ${colors.shell}`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${colors.iconWrap}`}
      >
        <CalendarDays className="h-5 w-5" />
      </div>

      <div className="leading-tight">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          {label}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-700">{formattedDate}</p>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${colors.pill}`}
          >
            <Sparkles className={`h-3.5 w-3.5 ${colors.sparkle}`} />
            Fresh
          </span>
        </div>
      </div>
    </div>
  );
}

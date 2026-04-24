import { useMemo } from "react";
import { AlertTriangle, LogOut } from "lucide-react";

export default function BannedPage() {
  const reason = useMemo(
    () => localStorage.getItem("bannedReason") || "Your account has been banned by admin.",
    []
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("bannedReason");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Warning stripes style */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-16 -left-20 w-[140%] rotate-[-12deg] bg-yellow-400 text-black font-black text-3xl py-4 text-center">
          WARNING WARNING WARNING WARNING
        </div>
        <div className="absolute top-56 -left-20 w-[140%] rotate-[10deg] bg-yellow-400 text-black font-black text-3xl py-4 text-center">
          WARNING WARNING WARNING WARNING
        </div>
        <div className="absolute top-[28rem] -left-20 w-[140%] rotate-[-8deg] bg-yellow-400 text-black font-black text-3xl py-4 text-center">
          WARNING WARNING WARNING WARNING
        </div>
      </div>

      <div className="relative z-10 max-w-xl w-full bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-8 h-8 text-yellow-300" />
          <h1 className="text-3xl font-black">Account Banned</h1>
        </div>

        <p className="text-white/80 mb-2">You can log in, but you cannot use system features.</p>

        <div className="mt-5 rounded-xl bg-rose-500/20 border border-rose-300/40 p-4">
          <p className="text-xs uppercase tracking-widest text-rose-200 font-bold mb-1">Ban Reason</p>
          <p className="text-rose-50 font-semibold">{reason}</p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black font-bold hover:bg-gray-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
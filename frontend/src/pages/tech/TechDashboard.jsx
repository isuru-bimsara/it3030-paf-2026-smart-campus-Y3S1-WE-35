// // // // //frontend/src/pages/tech/TechDashboard.jsx
// // // // import { useEffect, useState } from 'react';
// // // // import api from '../../api/axios';

// // // // export default function TechDashboard() {
// // // //   const [stats, setStats] = useState({
// // // //     assignedTickets: 0,
// // // //     completedTickets: 0
// // // //   });

// // // //   useEffect(() => {
// // // //     api.get('/tech/stats').then(res => setStats(res.data)).catch(() => {});
// // // //   }, []);

// // // //   return (
// // // //     <div>
// // // //       <h1 className="text-2xl font-bold mb-4">Technician Dashboard</h1>
// // // //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // //         <div className="card p-4 bg-white shadow">
// // // //           <p className="text-sm text-gray-500">Assigned Tickets</p>
// // // //           <p className="text-xl font-bold">{stats.assignedTickets}</p>
// // // //         </div>
// // // //         <div className="card p-4 bg-white shadow">
// // // //           <p className="text-sm text-gray-500">Completed Tickets</p>
// // // //           <p className="text-xl font-bold">{stats.completedTickets}</p>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }


// // // import { useEffect } from "react";

// // // const TICKET_TYPES = [
// // //   "ELECTRICAL",
// // //   "PLUMBING",
// // //   "HVAC",
// // //   "IT",
// // //   "CLEANING",
// // //   "OTHER"
// // // ];

// // // export default function TechDashboard({ selectedType, setSelectedType }) {

// // //   // 🔥 Load saved type from localStorage
// // //   useEffect(() => {
// // //     const savedType = localStorage.getItem("techType");
// // //     if (savedType) {
// // //       setSelectedType(savedType);
// // //     }
// // //   }, []);

// // //   // 🔥 Save when changed
// // //   const handleChange = (value) => {
// // //     setSelectedType(value);
// // //     localStorage.setItem("techType", value);
// // //   };

// // //   return (
// // //     <div>
// // //       <h1 className="text-2xl font-bold mb-6">Technician Dashboard</h1>

// // //       <div className="mb-6">
// // //         <label className="block mb-2 font-semibold">
// // //           Please select your technician type:
// // //         </label>

// // //         <select
// // //           value={selectedType}
// // //           onChange={(e) => handleChange(e.target.value)}
// // //           className="border p-2 rounded"
// // //         >
// // //           <option value="">-- Select Type --</option>
// // //           {TICKET_TYPES.map(type => (
// // //             <option key={type} value={type}>{type}</option>
// // //           ))}
// // //         </select>
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // import { useEffect, useState } from "react";

// // const TICKET_TYPES = [
// //   "ELECTRICAL",
// //   "PLUMBING",
// //   "HVAC",
// //   "IT",
// //   "CLEANING",
// //   "OTHER"
// // ];

// // export default function TechDashboard() {
// //   const [selectedType, setSelectedType] = useState("");

// //   useEffect(() => {
// //     const saved = localStorage.getItem("techType");
// //     if (saved) setSelectedType(saved);
// //   }, []);

// //   const handleChange = (type) => {
// //     setSelectedType(type);
// //     localStorage.setItem("techType", type); // ✅ SAVE
// //   };

// //   return (
// //     <div>
// //       <h1 className="text-2xl font-bold mb-6">Technician Dashboard</h1>

// //       <label className="block mb-2 font-semibold">
// //         Please select your technician type:
// //       </label>

// //       <select
// //         value={selectedType}
// //         onChange={(e) => handleChange(e.target.value)}
// //         className="border p-2 rounded"
// //       >
// //         <option value="">-- Select Type --</option>
// //         {TICKET_TYPES.map((type) => (
// //           <option key={type} value={type}>{type}</option>
// //         ))}
// //       </select>
// //     </div>
// //   );
// // }

// // frontend/src/pages/tech/TechDashboard.jsx
// import { useEffect, useState } from "react";

// const TICKET_TYPES = ["ELECTRICAL", "PLUMBING", "HVAC", "IT", "CLEANING", "OTHER"];

// export default function TechDashboard() {
//   const [selectedType, setSelectedType] = useState("");

//   useEffect(() => {
//     const saved = localStorage.getItem("techType");
//     if (saved) setSelectedType(saved);
//   }, []);

//   const handleChange = (type) => {
//     setSelectedType(type);
//     localStorage.setItem("techType", type);
//   };

//   return (
//     <div className="max-w-4xl">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Technician Dashboard</h1>

//       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
//         <label className="block mb-3 font-medium text-gray-700">
//           Primary Specialization
//         </label>
//         <select
//           value={selectedType}
//           onChange={(e) => handleChange(e.target.value)}
//           className="w-full max-w-xs border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//         >
//           <option value="">-- Select Type --</option>
//           {TICKET_TYPES.map((type) => (
//             <option key={type} value={type}>{type}</option>
//           ))}
//         </select>
//         <p className="mt-2 text-sm text-gray-500">Your tickets will be filtered based on this selection.</p>
//       </div>
//     </div>
//   );
// }



// frontend/src/pages/tech/TechDashboard.jsx
import { useEffect, useState, useMemo } from "react";
import { ticketsApi } from "../../api/tickets";
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from "recharts";
import { AlertCircle, CheckCircle2, Clock, Wrench } from "lucide-react";

const TICKET_TYPES = ["ELECTRICAL", "PLUMBING", "HVAC", "IT", "CLEANING", "OTHER"];

// Colors matching your blue-600 theme and status types
const COLORS = {
  OPEN: "#3b82f6",        // Blue-500
  IN_PROGRESS: "#f59e0b", // Amber-500
  RESOLVED: "#10b981",    // Emerald-500
  CLOSED: "#6b7280",      // Gray-500
  CRITICAL: "#ef4444",    // Red-500
  HIGH: "#f97316",        // Orange-500
  MEDIUM: "#3b82f6",      // Blue-500
  LOW: "#9ca3af"          // Gray-400
};

export default function TechDashboard() {
  const [selectedType, setSelectedType] = useState("");
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("techType");
    if (saved) setSelectedType(saved);
    fetchData(saved || "ALL");
  }, []);

  const fetchData = async (category) => {
    try {
      const res = await (category === "ALL" || !category 
        ? ticketsApi.getAll() 
        : ticketsApi.getByCategory(category));
      setTickets(res.data.data || []);
    } catch (err) {
      console.error("Dashboard data fetch failed", err);
    }
  };

  const handleChange = (type) => {
    setSelectedType(type);
    localStorage.setItem("techType", type);
    fetchData(type);
  };

  // --- DATA TRANSFORMATION FOR CHARTS ---

  const stats = useMemo(() => {
    const statusData = [
      { name: "Open", value: tickets.filter(t => t.status === "OPEN").length, color: COLORS.OPEN },
      { name: "In Progress", value: tickets.filter(t => t.status === "IN_PROGRESS").length, color: COLORS.IN_PROGRESS },
      { name: "Resolved", value: tickets.filter(t => t.status === "RESOLVED").length, color: COLORS.RESOLVED },
      { name: "Closed", value: tickets.filter(t => t.status === "CLOSED").length, color: COLORS.CLOSED },
    ].filter(d => d.value > 0);

    const priorityData = [
      { name: "Critical", count: tickets.filter(t => t.priority === "CRITICAL").length, fill: COLORS.CRITICAL },
      { name: "High", count: tickets.filter(t => t.priority === "HIGH").length, fill: COLORS.HIGH },
      { name: "Medium", count: tickets.filter(t => t.priority === "MEDIUM").length, fill: COLORS.MEDIUM },
      { name: "Low", count: tickets.filter(t => t.priority === "LOW").length, fill: COLORS.LOW },
    ];

    return { statusData, priorityData };
  }, [tickets]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tech Overview</h1>
          <p className="text-gray-500">Monitoring your {selectedType || 'general'} performance</p>
        </div>
        
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
          <Wrench size={18} className="text-blue-600" />
          <select
            value={selectedType}
            onChange={(e) => handleChange(e.target.value)}
            className="text-sm font-bold bg-transparent outline-none cursor-pointer text-gray-700"
          >
            <option value="ALL">All Specializations</option>
            {TICKET_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>

      {/* QUICK STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Assigned" value={tickets.length} icon={<Clock className="text-blue-500" />} />
        <StatCard title="Active Work" value={tickets.filter(t => t.status === 'IN_PROGRESS').length} icon={<AlertCircle className="text-amber-500" />} />
        <StatCard title="Critical" value={tickets.filter(t => t.priority === 'CRITICAL').length} icon={<AlertCircle className="text-red-500" />} />
        <StatCard title="Completed" value={tickets.filter(t => t.status === 'RESOLVED').length} icon={<CheckCircle2 className="text-emerald-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PIE CHART: STATUS DISTRIBUTION */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Ticket Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BAR CHART: PRIORITY LEVELS */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Volume by Priority</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500}} />
                <YAxis axisLine={false} tickLine={false} hide />
                <Tooltip cursor={{fill: '#f9fafb'}} />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
      </div>
      <div className="p-2 bg-gray-50 rounded-xl">{icon}</div>
    </div>
  );
}
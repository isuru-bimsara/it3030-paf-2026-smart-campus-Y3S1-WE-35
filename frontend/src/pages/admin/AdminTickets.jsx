// // import { useState, useEffect } from 'react';
// // import { ticketsApi } from '../../api/tickets';

// // export default function AdminTickets() {
// //   const [tickets, setTickets] = useState([]);
// //   useEffect(() => {
// //     ticketsApi.getAll().then(res => setTickets(res.data.data)).catch(() => {});
// //   }, []);

// //   return (
// //     <div>
// //       <h1 className="text-2xl font-bold mb-4">Tickets</h1>
// //       <table className="w-full border">
// //         <thead>
// //           <tr className="bg-gray-100">
// //             <th className="p-2">Title</th>
// //             <th className="p-2">User</th>
// //             <th className="p-2">Status</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {tickets.map(t => (
// //             <tr key={t.id} className="border-t">
// //               <td className="p-2">{t.title}</td>
// //               <td className="p-2">{t.userName}</td>
// //               <td className="p-2">{t.status}</td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   )
// // }

// import { useState, useEffect } from 'react';
// import { ticketsApi } from '../../api/tickets';

// export default function AdminTickets() {
//   const [tickets, setTickets] = useState([]);

//   useEffect(() => {
//     ticketsApi.getAll()
//       .then(res => setTickets(res.data.data))
//       .catch(() => {});
//   }, []);

//   const fmt = (d) => d ? new Date(d).toLocaleString() : '—';

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Tickets</h1>
//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="p-2">Owner</th>
//             <th className="p-2">Created At</th>
//             <th className="p-2">Resolved At</th>
//             <th className="p-2">Category</th>
//             <th className="p-2">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tickets.map(t => (
//             <tr key={t.id} className="border-t">
//               <td className="p-2">{t.reporterName}</td>
//               <td className="p-2">{fmt(t.createdAt)}</td>
//               <td className="p-2">{fmt(t.resolvedAt)}</td>
//               <td className="p-2">{t.category}</td>
//               <td className="p-2">{t.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { ticketsApi } from '../../api/tickets';
import { 
  Ticket, 
  Clock, 
  CheckCircle2, 
  CircleDot, 
  User, 
  Tag, 
  ChevronRight,
  Filter
} from 'lucide-react';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Priority weights for sorting
  const statusPriority = {
    'OPEN': 1,
    'IN_PROGRESS': 2,
    'RESOLVED': 3,
    'CLOSED': 4
  };

  useEffect(() => {
    ticketsApi.getAll()
      .then(res => {
        const rawTickets = res.data.data || [];
        
        // SORTING LOGIC: Priority based on status, then newest first
        const sorted = [...rawTickets].sort((a, b) => {
          if (statusPriority[a.status] !== statusPriority[b.status]) {
            return statusPriority[a.status] - statusPriority[b.status];
          }
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        setTickets(sorted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => {
    if (!d) return '—';
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(d));
  };

  // Badge Styling Logic
  const getStatusStyle = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-rose-100 text-rose-700 border-rose-200 ring-rose-500/20';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200 ring-blue-500/20';
      case 'RESOLVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN': return <CircleDot className="w-3.5 h-3.5" />;
      case 'IN_PROGRESS': return <Clock className="w-3.5 h-3.5 animate-pulse" />;
      case 'RESOLVED': return <CheckCircle2 className="w-3.5 h-3.5" />;
      default: return <Ticket className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <Ticket className="w-8 h-8 text-indigo-600" />
              Support Tickets
            </h1>
            <p className="text-gray-500 mt-1">Manage and resolve university resource issues.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
             <div className="px-4 py-2 text-sm font-bold text-gray-600 border-r border-gray-100">
               {tickets.length} Total
             </div>
             <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
               <Filter className="w-4 h-4" /> Filter
             </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-gray-400 font-medium">Loading ticket database...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Reporter</th>
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Timeline</th>
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Issue Type</th>
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none text-center">Status</th>
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tickets.map(t => (
                    <tr key={t.id} className="group hover:bg-gray-50/50 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                            {t.reporterName?.charAt(0) || <User className="w-4 h-4" />}
                          </div>
                          <span className="font-bold text-gray-800 text-sm tracking-tight">{t.reporterName}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                            Created: {formatDate(t.createdAt)}
                          </div>
                          {t.resolvedAt && (
                            <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              Closed: {formatDate(t.resolvedAt)}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{t.category}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ring-1 transition-all ${getStatusStyle(t.status)}`}>
                            {getStatusIcon(t.status)}
                            {t.status.replace('_', ' ')}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-300 group-hover:text-indigo-600 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!loading && tickets.length === 0 && (
            <div className="p-20 text-center">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-bold">No tickets found</p>
              <p className="text-sm text-gray-400">All systems are currently running smoothly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
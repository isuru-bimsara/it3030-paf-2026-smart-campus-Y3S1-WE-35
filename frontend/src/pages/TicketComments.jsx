// // frontend/src/pages/TicketComments.jsx
// import { useState, useEffect, useRef } from "react";
// import { ticketsApi } from "../api/tickets";
// import { Send, X, MessageSquare, Trash2, Edit3, Check, RotateCcw } from "lucide-react";

// export default function TicketComments({ ticketId, open, onClose, currentUserName }) {
//   const [comments, setComments] = useState([]);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [editMessage, setEditMessage] = useState("");
//   const bottomRef = useRef();

//   const currentUser = currentUserName || "User";

//   useEffect(() => {
//     if (open && ticketId) {
//       loadComments();
//     }
//   }, [ticketId, open]);

//   const loadComments = async () => {
//     setLoading(true);
//     try {
//       const res = await ticketsApi.getComments(ticketId);
//       setComments(res.data.data || []);
//     } catch (err) {
//       console.error("Failed to load messages");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [comments, open]);

//   const sendComment = async (e) => {
//     e.preventDefault();
//     if (!message.trim()) return;
//     try {
//       await ticketsApi.addComment(ticketId, message);
//       setMessage("");
//       loadComments(); 
//     } catch (err) {
//       alert("Failed to send message");
//     }
//   };

//   const startEdit = (c) => {
//     setEditingId(c.id);
//     setEditMessage(c.content);
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!editMessage.trim()) return;
//     try {
//       await ticketsApi.updateComment(editingId, editMessage);
//       setEditingId(null);
//       loadComments();
//     } catch (err) {
//       alert("Failed to update comment");
//     }
//   };

//   const handleDelete = async (commentId) => {
//     if (!window.confirm("Are you sure you want to delete this comment?")) return;
//     try {
//       await ticketsApi.deleteComment(commentId);
//       loadComments();
//     } catch (err) {
//       alert("Failed to delete comment");
//     }
//   };

//   const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

//   const getRoleColor = (role) => {
//     switch (role) {
//       case "ADMIN": return "bg-rose-500";
//       case "OPERATION_MANAGER": return "bg-orange-500";
//       case "TECHNICIAN": return "bg-emerald-500";
//       default: return "bg-slate-400";
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
//       <div className="bg-[#f0f2f5] w-full max-w-xl rounded-3xl shadow-2xl relative flex flex-col h-[650px] overflow-hidden border border-slate-200">
        
//         {/* HEADER */}
//         <div className="p-4 bg-white border-b flex justify-between items-center z-10 shadow-sm">
//           <div className="flex items-center gap-3">
//             <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-100">
//               <MessageSquare className="text-white w-5 h-5" />
//             </div>
//             <div>
//               <h3 className="font-bold text-slate-800 text-base leading-none">Activity Log & Chat</h3>
//               <p className="text-[11px] font-bold text-blue-500 uppercase mt-1 tracking-wider">Ticket #{ticketId}</p>
//             </div>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* CHAT AREA */}
//         <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
//           {loading && comments.length === 0 ? (
//             <div className="flex justify-center items-center h-full">
//               <div className="animate-pulse text-slate-400 font-medium text-sm">Synchronizing...</div>
//             </div>
//           ) : comments.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 opacity-50">
//                <MessageSquare className="w-10 h-10" />
//                <p className="text-sm font-bold">No comments yet</p>
//             </div>
//           ) : (
//             comments.map((c, index) => {
//               const isMe = c.userName === currentUser;
//               const isSameAsPrev = index > 0 && comments[index - 1].userName === c.userName;

//               return (
//                 <div key={c.id} className={`flex w-full items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  
//                   {!isMe ? (
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm transition-opacity ${isSameAsPrev ? "opacity-0" : "opacity-100"} ${getRoleColor(c.userRole)}`}>
//                       {getInitials(c.userName)}
//                     </div>
//                   ) : (
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm transition-opacity ${isSameAsPrev ? "opacity-0" : "opacity-100"} bg-blue-600`}>
//                       ME
//                     </div>
//                   )}

//                   <div className={`max-w-[80%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
//                     {!isMe && !isSameAsPrev && (
//                       <div className="flex items-center gap-1.5 ml-1 mb-1">
//                         <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{c.userName}</span>
//                         <span className={`text-[8px] px-1 py-0.5 rounded text-white font-black tracking-widest ${getRoleColor(c.userRole)}`}>
//                           {c.userRole?.split("_").join(" ")}
//                         </span>
//                       </div>
//                     )}

//                     {/* MESSAGE BUBBLE */}
//                     <div className={`group relative px-4 py-2.5 shadow-sm text-sm ${
//                       isMe 
//                       ? "bg-blue-600 text-white rounded-2xl rounded-br-none shadow-blue-100" 
//                       : "bg-white text-slate-700 rounded-2xl rounded-bl-none border border-slate-200"
//                     }`}>
//                       {editingId === c.id ? (
//                         <form onSubmit={handleUpdate} className="flex flex-col gap-2 min-w-[200px]">
//                            <textarea 
//                              className="w-full bg-blue-700 text-white border-none rounded-lg p-2 text-sm focus:ring-1 focus:ring-white/50 outline-none resize-none"
//                              value={editMessage}
//                              onChange={e => setEditMessage(e.target.value)}
//                              rows={2}
//                              autoFocus
//                            />
//                            <div className="flex justify-end gap-1">
//                               <button type="button" onClick={() => setEditingId(null)} className="p-1 hover:bg-white/10 rounded">
//                                 <RotateCcw className="w-3.5 h-3.5" />
//                               </button>
//                               <button type="submit" className="p-1 hover:bg-white/10 rounded">
//                                 <Check className="w-3.5 h-3.5" />
//                               </button>
//                            </div>
//                         </form>
//                       ) : (
//                         <>
//                           {c.content}
//                           {isMe && (
//                             <div className="absolute top-1 -left-12 hidden group-hover:flex gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-md z-20">
//                                <button onClick={() => startEdit(c)} className="p-1 hover:bg-slate-50 text-slate-500 rounded transition-colors">
//                                   <Edit3 className="w-3.5 h-3.5" />
//                                </button>
//                                <button onClick={() => handleDelete(c.id)} className="p-1 hover:bg-rose-50 text-rose-500 rounded transition-colors">
//                                   <Trash2 className="w-3.5 h-3.5" />
//                                </button>
//                             </div>
//                           )}
//                         </>
//                       )}
//                     </div>

//                     <div className="text-[9px] mt-1 text-slate-400 font-semibold px-1">
//                       {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//           <div ref={bottomRef}></div>
//         </div>

//         {/* INPUT AREA */}
//         <div className="p-4 bg-white border-t border-slate-100">
//           <form onSubmit={sendComment} className="flex gap-2 items-center bg-slate-100 p-1.5 rounded-[24px] focus-within:ring-2 ring-blue-500/20 transition-all">
//             <input
//               value={message}
//               onChange={e => setMessage(e.target.value)}
//               type="text"
//               placeholder="Write a message..."
//               className="flex-1 bg-transparent border-none px-4 py-2 text-sm outline-none text-slate-700 placeholder:text-slate-400"
//               disabled={loading}
//             />
//             <button
//               type="submit"
//               disabled={loading || !message.trim()}
//               className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-2.5 rounded-full shadow-md shadow-blue-100 transition-all active:scale-90"
//             >
//               <Send className="w-4 h-4" />
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { ticketsApi } from "../api/tickets";
import { useAuth } from "../context/AuthContext";
import { Send, X, MessageSquare, Trash2, Edit3, Check, RotateCcw } from "lucide-react";

export default function TicketComments({ ticketId, open, onClose }) {
  const { user } = useAuth();
  const currentUserId = Number(user?.id);

  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState("");

  const bottomRef = useRef();

  useEffect(() => {
    if (open && ticketId) {
      loadComments();
    }
  }, [ticketId, open]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await ticketsApi.getComments(ticketId);
      setComments(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments, open]);

  const sendComment = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await ticketsApi.addComment(ticketId, message.trim());
      setMessage("");
      loadComments();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send message");
    }
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditMessage(c.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editMessage.trim()) return;
    try {
      await ticketsApi.updateComment(editingId, editMessage.trim());
      setEditingId(null);
      setEditMessage("");
      loadComments();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update comment");
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await ticketsApi.deleteComment(commentId);
      loadComments();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete comment");
    }
  };

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-rose-500";
      case "OPERATION_MANAGER":
        return "bg-orange-500";
      case "TECHNICIAN":
        return "bg-emerald-500";
      default:
        return "bg-slate-400";
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#f0f2f5] w-full max-w-xl rounded-3xl shadow-2xl relative flex flex-col h-[650px] overflow-hidden border border-slate-200">
        {/* HEADER */}
        <div className="p-4 bg-white border-b flex justify-between items-center z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-100">
              <MessageSquare className="text-white w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-none">Activity Log & Chat</h3>
              <p className="text-[11px] font-bold text-blue-500 uppercase mt-1 tracking-wider">
                Ticket #{ticketId}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {loading && comments.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-pulse text-slate-400 font-medium text-sm">Synchronizing...</div>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 opacity-50">
              <MessageSquare className="w-10 h-10" />
              <p className="text-sm font-bold">No comments yet</p>
            </div>
          ) : (
            comments.map((c, index) => {
              const isMe = Number(c.userId) === currentUserId;
              const isSameAsPrev = index > 0 && comments[index - 1].userId === c.userId;

              return (
                <div key={c.id} className={`flex w-full items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  {!isMe ? (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm transition-opacity ${
                        isSameAsPrev ? "opacity-0" : "opacity-100"
                      } ${getRoleColor(c.userRole)}`}
                    >
                      {getInitials(c.userName)}
                    </div>
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm transition-opacity ${
                        isSameAsPrev ? "opacity-0" : "opacity-100"
                      } bg-blue-600`}
                    >
                      ME
                    </div>
                  )}

                  <div className={`max-w-[80%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    {!isMe && !isSameAsPrev && (
                      <div className="flex items-center gap-1.5 ml-1 mb-1">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{c.userName}</span>
                        <span className={`text-[8px] px-1 py-0.5 rounded text-white font-black tracking-widest ${getRoleColor(c.userRole)}`}>
                          {c.userRole?.split("_").join(" ")}
                        </span>
                      </div>
                    )}

                    <div
                      className={`group relative px-4 py-2.5 shadow-sm text-sm ${
                        isMe
                          ? "bg-blue-600 text-white rounded-2xl rounded-br-none shadow-blue-100"
                          : "bg-white text-slate-700 rounded-2xl rounded-bl-none border border-slate-200"
                      }`}
                    >
                      {editingId === c.id ? (
                        <form onSubmit={handleUpdate} className="flex flex-col gap-2 min-w-[200px]">
                          <textarea
                            className="w-full bg-blue-700 text-white border-none rounded-lg p-2 text-sm focus:ring-1 focus:ring-white/50 outline-none resize-none"
                            value={editMessage}
                            onChange={(e) => setEditMessage(e.target.value)}
                            rows={2}
                            autoFocus
                          />
                          <div className="flex justify-end gap-1">
                            <button type="button" onClick={() => setEditingId(null)} className="p-1 hover:bg-white/10 rounded">
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button type="submit" className="p-1 hover:bg-white/10 rounded">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          {c.content}
                          {isMe && (
                            <div className="absolute top-1 -left-12 hidden group-hover:flex gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-md z-20">
                              <button
                                onClick={() => startEdit(c)}
                                className="p-1 hover:bg-slate-50 text-slate-500 rounded transition-colors"
                                title="Edit comment"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(c.id)}
                                className="p-1 hover:bg-rose-50 text-rose-500 rounded transition-colors"
                                title="Delete comment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="text-[9px] mt-1 text-slate-400 font-semibold px-1">
                      {new Date(c.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef}></div>
        </div>

        {/* INPUT */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form
            onSubmit={sendComment}
            className="flex gap-2 items-center bg-slate-100 p-1.5 rounded-[24px] focus-within:ring-2 ring-blue-500/20 transition-all"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Write a message..."
              className="flex-1 bg-transparent border-none px-4 py-2 text-sm outline-none text-slate-700 placeholder:text-slate-400"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-2.5 rounded-full shadow-md shadow-blue-100 transition-all active:scale-90"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
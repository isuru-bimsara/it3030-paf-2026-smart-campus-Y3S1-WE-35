// // //frontend/src/pages/user/UserResources.jsx
// // import { useEffect, useState } from "react";
// // import { resourcesApi } from "../../api/resources";
// // import { useNavigate } from "react-router-dom";
// // import { Box, Users, Tag, ArrowRight, Search } from "lucide-react";

// // export default function UserResources() {
// //   const [resources, setResources] = useState([]);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     resourcesApi
// //       .getAvailable()
// //       .then((res) => {
// //         setResources(res.data);
// //       })
// //       .catch((err) => console.error(err));
// //   }, []);

// //   return (
// //     <div className="space-y-8">
// //       {/* Header Section */}
// //       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
// //         <div>
// //           <h1 className="text-3xl font-black text-slate-800 tracking-tight">
// //             Available Resources
// //           </h1>
// //           <p className="text-slate-500 mt-1 font-medium">
// //             Select a workspace or equipment to begin your reservation.
// //           </p>
// //         </div>

// //         {/* Search Bar Placeholder (Visual only) */}
// //         <div className="relative">
// //           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
// //           <input
// //             type="text"
// //             placeholder="Search resources..."
// //             className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-64 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
// //           />
// //         </div>
// //       </div>

// //       {/* Grid Section */}
// //       {resources.length === 0 ? (
// //         <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
// //           <Box className="w-16 h-16 text-slate-200 mx-auto mb-4" />
// //           <p className="text-slate-500 font-bold text-xl">
// //             No resources available right now.
// //           </p>
// //         </div>
// //       ) : (
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //           {resources.map((r) => (
// //             <div
// //               key={r.id}
// //               className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300"
// //             >
// //               {/* Image Container */}
// //               <div className="relative h-52 overflow-hidden">
// //                 <img
// //                   src={`http://localhost:8083${r.imageUrl}`}
// //                   alt={r.name}
// //                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
// //                 />
// //                 <div className="absolute top-4 left-4">
// //                   <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-indigo-600 shadow-sm flex items-center gap-1.5 uppercase tracking-wider">
// //                     <Tag className="w-3.5 h-3.5" />
// //                     {r.type}
// //                   </span>
// //                 </div>
// //               </div>

// //               {/* Content Section */}
// //               <div className="p-6">
// //                 <h2 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
// //                   {r.name}
// //                 </h2>

// //                 <div className="mt-4 flex items-center gap-6 text-slate-500">
// //                   <div className="flex items-center gap-2">
// //                     <Users className="w-4 h-4 text-indigo-500" />
// //                     <span className="text-sm font-medium">
// //                       Capacity: <b className="text-slate-700">{r.capacity}</b>
// //                     </span>
// //                   </div>
// //                 </div>

// //                 <button
// //                   onClick={() => navigate(`/user/book/${r.id}`)}
// //                   className="mt-6 w-full group/btn relative flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold transition-all overflow-hidden"
// //                 >
// //                   <span className="relative z-10 flex items-center gap-2">
// //                     Book Now
// //                     <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
// //                   </span>
// //                 </button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// // frontend/src/pages/user/UserResources.jsx
// import { useEffect, useState } from "react";
// import { resourcesApi } from "../../api/resources";
// import { useNavigate } from "react-router-dom";
// import { 
//   Box, 
//   Users, 
//   Tag, 
//   ArrowRight, 
//   Search, 
//   Layers, 
//   SortAsc,
//   FilterX
// } from "lucide-react";

// export default function UserResources() {
//   const [resources, setResources] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState("default");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     resourcesApi
//       .getAvailable()
//       .then((res) => {
//         setResources(res.data);
//       })
//       .catch((err) => console.error(err))
//       .finally(() => setLoading(false));
//   }, []);

//   // Filter and Sort Logic
//   const filteredResources = resources
//     .filter((r) => 
//       r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       r.type.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     .sort((a, b) => {
//       if (sortBy === "name") return a.name.localeCompare(b.name);
//       if (sortBy === "quantity") {
//         // Sort by quantity for equipment, capacity for others
//         const valA = a.type.toLowerCase() === "equipment" ? a.quantity : a.capacity;
//         const valB = b.type.toLowerCase() === "equipment" ? b.quantity : b.capacity;
//         return valB - valA; // Higher numbers first
//       }
//       return 0;
//     });

//   return (
//     <div className="space-y-8 pb-10">
//       {/* Header Section */}
//       <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
//         <div className="max-w-2xl">
//           <h1 className="text-4xl font-black text-slate-900 tracking-tight">
//             Explore Resources
//           </h1>
//           <p className="text-slate-500 mt-2 text-lg font-medium">
//             Find and reserve the perfect equipment or workspace for your next project.
//           </p>
//         </div>

//         {/* Controls Section */}
//         <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
//           {/* Search Bar */}
//           <div className="relative w-full sm:w-80">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search by name or type..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm font-medium"
//             />
//           </div>

//           {/* Sort Dropdown */}
//           <div className="relative w-full sm:w-48">
//             <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm font-bold text-slate-700 cursor-pointer"
//             >
//               <option value="default">Sort By</option>
//               <option value="name">Name (A-Z)</option>
//               <option value="quantity">Availability</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <hr className="border-slate-200" />

//       {/* Grid Section */}
//       {loading ? (
//         <div className="flex justify-center py-20">
//           <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
//         </div>
//       ) : filteredResources.length === 0 ? (
//         <div className="bg-slate-50 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200">
//           <FilterX className="w-20 h-20 text-slate-300 mx-auto mb-6" />
//           <h3 className="text-2xl font-bold text-slate-800">No matches found</h3>
//           <p className="text-slate-500 mt-2 font-medium">
//             Try adjusting your search or filters to find what you're looking for.
//           </p>
//           <button 
//             onClick={() => {setSearchQuery(""); setSortBy("default");}}
//             className="mt-6 text-indigo-600 font-bold hover:underline"
//           >
//             Clear all filters
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {filteredResources.map((r) => {
//             const isEquipment = r.type?.toLowerCase() === "equipment";
            
//             return (
//               <div
//                 key={r.id}
//                 className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] hover:-translate-y-2 transition-all duration-500"
//               >
//                 {/* Image Container */}
//                 <div className="relative h-60 overflow-hidden">
//                   <img
//                     src={`http://localhost:8083${r.imageUrl}`}
//                     alt={r.name}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//                   />
//                   <div className="absolute top-5 left-5">
//                     <span className="bg-white/95 backdrop-blur px-4 py-1.5 rounded-xl text-[10px] font-black text-indigo-600 shadow-xl flex items-center gap-2 uppercase tracking-widest">
//                       <Tag className="w-3.5 h-3.5" />
//                       {r.type}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Content Section */}
//                 <div className="p-8">
//                   <h2 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
//                     {r.name}
//                   </h2>

//                   <div className="mt-5 flex items-center gap-6 text-slate-500 bg-slate-50 p-4 rounded-2xl">
//                     <div className="flex items-center gap-3">
//                       {isEquipment ? (
//                         <Layers className="w-5 h-5 text-indigo-500" />
//                       ) : (
//                         <Users className="w-5 h-5 text-indigo-500" />
//                       )}
//                       <span className="text-sm font-bold">
//                         {isEquipment ? "Quantity" : "Capacity"}: 
//                         <span className="ml-1 text-slate-900 text-base">
//                           {isEquipment ? r.quantity : r.capacity}
//                         </span>
//                       </span>
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => navigate(`/user/book/${r.id}`)}
//                     className="mt-8 w-full group/btn flex items-center justify-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-2xl font-black transition-all shadow-lg hover:shadow-indigo-200"
//                   >
//                     Reserve Now
//                     <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { resourcesApi } from "../../api/resources";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Users,
  Tag,
  ArrowRight,
  Search,
  Layers,
  SortAsc,
  FilterX,
  MapPin,
  AlignLeft,
  CalendarDays,
  CircleCheck,
} from "lucide-react";

export default function UserResources() {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    resourcesApi
      .getAvailable()
      .then((res) => {
        const data = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
        setResources(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredResources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = resources.filter((r) => {
      const name = String(r.name || "").toLowerCase();
      const type = String(r.type || "").toLowerCase();
      const location = String(r.location || "").toLowerCase();
      const status = String(r.status || "").toLowerCase();
      const description = String(r.description || "").toLowerCase();

      return (
        name.includes(q) ||
        type.includes(q) ||
        location.includes(q) ||
        status.includes(q) ||
        description.includes(q)
      );
    });

    list.sort((a, b) => {
      const nameA = String(a.name || "");
      const nameB = String(b.name || "");
      const typeA = String(a.type || "");
      const typeB = String(b.type || "");
      const valueA = Number(a.capacity ?? 0);
      const valueB = Number(b.capacity ?? 0);
      const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      switch (sortBy) {
        case "name-asc":
          return nameA.localeCompare(nameB);
        case "name-desc":
          return nameB.localeCompare(nameA);
        case "type-asc":
          return typeA.localeCompare(typeB);
        case "type-desc":
          return typeB.localeCompare(typeA);
        case "value-desc":
          return valueB - valueA;
        case "value-asc":
          return valueA - valueB;
        case "newest":
          return createdB - createdA;
        case "oldest":
          return createdA - createdB;
        default:
          return 0;
      }
    });

    return list;
  }, [resources, searchQuery, sortBy]);

  const fmtType = (type) => String(type || "OTHER").replaceAll("_", " ");
  const fmtStatus = (status) => String(status || "UNKNOWN").replaceAll("_", " ");
  const fmtDate = (date) => (date ? new Date(date).toLocaleDateString() : "N/A"); // date only

  const isBookDisabled = (status) => {
    const s = String(status || "").toUpperCase();
    return s === "UNAVAILABLE" || s === "MAINTENANCE";
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Explore Resources
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">
            Find and reserve the perfect equipment or workspace for your next project.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search name, type, location, status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm font-medium"
            />
          </div>

          <div className="relative w-full sm:w-56">
            <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm font-bold text-slate-700 cursor-pointer"
            >
              <option value="default">Sort By</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="type-asc">Type (A-Z)</option>
              <option value="type-desc">Type (Z-A)</option>
              <option value="value-desc">Availability (High-Low)</option>
              <option value="value-asc">Availability (Low-High)</option>
              <option value="newest">Newest Added</option>
              <option value="oldest">Oldest Added</option>
            </select>
          </div>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="bg-slate-50 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200">
          <FilterX className="w-20 h-20 text-slate-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-slate-800">No matches found</h3>
          <p className="text-slate-500 mt-2 font-medium">
            Try adjusting your search or filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSortBy("default");
            }}
            className="mt-6 text-indigo-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((r) => {
            const isEquipment = String(r.type || "").toUpperCase() === "EQUIPMENT";
            const disabled = isBookDisabled(r.status);

            const imageSrc = r.imageUrl
              ? `http://localhost:8083${r.imageUrl}`
              : "https://via.placeholder.com/800x500?text=No+Image";

            return (
              <div
                key={r.id}
                className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] hover:-translate-y-2 transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img
                    src={imageSrc}
                    alt={r.name}
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/800x500?text=No+Image";
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-5 left-5">
                    <span className="bg-white/95 backdrop-blur px-4 py-1.5 rounded-xl text-[10px] font-black text-indigo-600 shadow-xl flex items-center gap-2 uppercase tracking-widest">
                      <Tag className="w-3.5 h-3.5" />
                      {fmtType(r.type)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h2 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {r.name || "Unnamed Resource"}
                  </h2>

                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-start gap-3 text-slate-600">
                      <AlignLeft className="w-4 h-4 mt-0.5 text-indigo-500" />
                      <span className="font-medium">
                        {r.description?.trim() || "No description available."}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                      <MapPin className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium">
                        Location: <b className="text-slate-800">{r.location || "N/A"}</b>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                      <CircleCheck className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium">
                        Status: <b className="text-slate-800">{fmtStatus(r.status)}</b>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                      {isEquipment ? (
                        <Layers className="w-4 h-4 text-indigo-500" />
                      ) : (
                        <Users className="w-4 h-4 text-indigo-500" />
                      )}
                      <span className="font-medium">
                        {isEquipment ? "Quantity" : "Capacity"}:{" "}
                        <b className="text-slate-800">{r.capacity ?? 0}</b>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                      <CalendarDays className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium">
                        Added: <b className="text-slate-800">{fmtDate(r.createdAt)}</b>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => !disabled && navigate(`/user/book/${r.id}`)}
                    disabled={disabled}
                    className={`mt-8 w-full group/btn flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all shadow-lg
                      ${
                        disabled
                          ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                          : "bg-slate-900 hover:bg-indigo-600 text-white hover:shadow-indigo-200"
                      }`}
                    title={disabled ? "This resource is not available for booking right now." : "Reserve this resource"}
                  >
                    {disabled ? "Not Available" : "Reserve Now"}
                    {!disabled && (
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  MapPin,
  Users,
  Layers,
  Box,
  Search,
  ImageIcon,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8083";

const EMPTY_FORM = {
  id: null,
  name: "",
  type: "",
  capacity: "",
  status: "AVAILABLE",
  description: "",
  location: "",
  imageUrl: "",
};

const TYPE_LABELS = {
  LECTURE_HALL: "Lecture Hall",
  LAB: "Lab",
  MEETING_ROOM: "Meeting Room",
  EQUIPMENT: "Equipment",
};

const STATUS_STYLES = {
  AVAILABLE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  UNAVAILABLE: "bg-rose-100 text-rose-700 border-rose-200",
  MAINTENANCE: "bg-amber-100 text-amber-700 border-amber-200",
};

export default function OpsResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [preview, setPreview] = useState({ open: false, src: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fullImg = (path) =>
    !path ? null : path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await api.get("/resources");
      setResources(res.data);
    } catch {
      setError("Failed to load resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFile(null);
    setError("");
    setDrawerOpen(true);
  };

  const openEdit = (r) => {
    setForm({
      id: r.id,
      name: r.name || "",
      type: r.type || "",
      capacity: r.capacity ?? "",
      status: r.status || "AVAILABLE",
      description: r.description || "",
      location: r.location || "",
      imageUrl: r.imageUrl || "",
    });
    setFile(null);
    setError("");
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setError("");
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const uploadImage = async () => {
    if (!file) return form.imageUrl || "";
    const fd = new FormData();
    fd.append("file", file);
    const res = await api.post("/resources/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const imageUrl = await uploadImage();
      const isEquip = form.type === "EQUIPMENT";
      const payload = {
        ...form,
        imageUrl,
        capacity: Number(form.capacity) || 0,
        location: isEquip ? null : form.location || null,
      };

      if (form.id) {
        await api.put(`/resources/${form.id}`, payload);
      } else {
        await api.post("/resources", payload);
      }
      closeDrawer();
      fetchResources();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save resource.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource? This cannot be undone.")) return;
    try {
      await api.delete(`/resources/${id}`);
      fetchResources();
    } catch {
      setError("Failed to delete resource.");
    }
  };

  const filtered = resources.filter((r) => {
    const matchSearch =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "ALL" || r.type === filterType;
    return matchSearch && matchType;
  });

  const isEquip = form.type === "EQUIPMENT";

  return (
    <div className="space-y-6 pb-20 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200">
            <Box className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">Resource Management</h1>
            <p className="text-slate-500">Add, edit and manage university resources</p>
          </div>
        </div>
        <button
          id="ops-add-resource-btn"
          onClick={openCreate}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-200"
        >
          <Plus className="w-5 h-5" /> Add Resource
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-300"
        >
          <option value="ALL">All Types</option>
          {Object.entries(TYPE_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 h-64 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 py-24 text-center">
          <Box className="w-14 h-14 text-slate-200 mx-auto mb-4" />
          <p className="font-bold text-slate-500">No resources found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* IMAGE */}
              <div
                className="h-44 bg-slate-50 overflow-hidden cursor-pointer"
                onClick={() => r.imageUrl && setPreview({ open: true, src: fullImg(r.imageUrl) })}
              >
                {r.imageUrl ? (
                  <img
                    src={fullImg(r.imageUrl)}
                    alt={r.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 gap-2">
                    <ImageIcon className="w-10 h-10" />
                    <span className="text-xs font-medium">No Image</span>
                  </div>
                )}
              </div>

              {/* BODY */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-800 truncate">{r.name}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {TYPE_LABELS[r.type] || r.type}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ml-2 flex-shrink-0 ${STATUS_STYLES[r.status] || ""}`}
                  >
                    {r.status}
                  </span>
                </div>

                <div className="flex gap-3 text-xs text-slate-500 mb-3">
                  {r.type !== "EQUIPMENT" && r.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {r.location}
                    </span>
                  )}
                  {r.capacity != null && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {r.type === "EQUIPMENT" ? `Qty: ${r.capacity}` : `Cap: ${r.capacity}`}
                    </span>
                  )}
                </div>

                {r.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">{r.description}</p>
                )}

                <div className="flex gap-2 pt-2 border-t border-slate-50">
                  <button
                    onClick={() => openEdit(r)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DRAWER — Add/Edit */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={closeDrawer} />
          <div className="w-full max-w-md bg-white flex flex-col shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Layers className="w-5 h-5 text-emerald-700" />
                </div>
                <h2 className="text-lg font-black text-slate-800">
                  {form.id ? "Edit Resource" : "Add New Resource"}
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-semibold">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  Resource Name *
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Lecture Hall A"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  Resource Type *
                </label>
                <select
                  required
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
                >
                  <option value="">Select type…</option>
                  {Object.entries(TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  {isEquip ? "Quantity *" : "Capacity (seats) *"}
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder={isEquip ? "Number of units" : "Seating capacity"}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>

              {/* Location (hidden for equipment) */}
              {!isEquip && (
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Building / Room"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of the resource…"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
                {(file || form.imageUrl) && (
                  <div className="mt-3 relative w-24 h-24">
                    <img
                      src={file ? URL.createObjectURL(file) : fullImg(form.imageUrl)}
                      alt="preview"
                      className="w-24 h-24 object-cover rounded-xl border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => { setFile(null); setForm((f) => ({ ...f, imageUrl: "" })); }}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors"
                >
                  {saving ? "Saving…" : form.id ? "Update Resource" : "Create Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW MODAL */}
      {preview.open && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview({ open: false, src: "" })}
        >
          <img
            src={preview.src}
            alt="full"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

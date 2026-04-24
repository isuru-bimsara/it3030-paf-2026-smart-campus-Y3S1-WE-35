import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Box,
  MapPin,
  Search,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";
import { resourcesApi } from "../../api/resources";

const ONLINE_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80";

function resourceImageUrl(resource) {
  if (!resource?.imageUrl) return null;
  return resource.imageUrl.startsWith("http")
    ? resource.imageUrl
    : `http://localhost:8083${resource.imageUrl}`;
}

function GradientPlaceholder({ label = "Campus Resource" }) {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_48%,#A78BFA_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_34%)]" />
      <div className="absolute -right-10 top-8 h-36 w-36 rounded-full border border-white/20 bg-white/10 backdrop-blur" />
      <div className="absolute left-6 top-8 h-20 w-20 rounded-full border border-white/15 bg-white/10 backdrop-blur" />
      <div className="absolute bottom-20 right-8 h-24 w-24 rounded-3xl border border-white/15 bg-white/10 rotate-12 backdrop-blur" />
      <div className="relative flex h-full items-end p-6">
        <div className="rounded-2xl border border-white/25 bg-white/15 px-4 py-3 backdrop-blur">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-100">
            Featured Space
          </p>
          <p className="mt-2 text-lg font-black text-white">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function UserResources() {
  const [resources, setResources] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    resourcesApi
      .getAvailable()
      .then((res) => {
        setResources(Array.isArray(res.data) ? res.data : (res.data?.data || []));
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return resources;

    return resources.filter((resource) =>
      [resource.name, resource.location, resource.type, resource.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
    );
  }, [query, resources]);

  const heroResource = useMemo(
    () =>
      filteredResources.find((resource) => resourceImageUrl(resource)) ||
      filteredResources[0] ||
      null,
    [filteredResources],
  );

  return (
    <div className="space-y-8 pb-16">
      <style>{`
        @keyframes resourceFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -8px, 0); }
        }

        @keyframes resourcePan {
          0% { transform: scale(1.02); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1.02); }
        }

        .resource-hero-float {
          animation: resourceFloat 8s ease-in-out infinite;
        }

        .resource-image-pan {
          animation: resourcePan 18s ease-in-out infinite;
          transform-origin: center center;
        }
      `}</style>

      <section className="relative overflow-hidden rounded-[36px] border border-violet-100 bg-[linear-gradient(135deg,#ffffff_0%,#faf5ff_44%,#f5f3ff_100%)] px-6 py-8 shadow-[0_24px_70px_rgba(109,40,217,0.10)] md:px-8 xl:px-10">
        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-violet-700 shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Premium Resource Gallery
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold text-violet-600">
                Book premium spaces across campus
              </p>
              <h1 className="max-w-3xl text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl">
                Discover the right room,
                <span className="block bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_52%,#8B5CF6_100%)] bg-clip-text text-transparent">
                  beautifully presented
                </span>
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Explore lecture halls, labs, and campus spaces in a cleaner,
                faster booking experience with elegant previews, search, and
                quick actions.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-[0_18px_40px_rgba(109,40,217,0.08)] backdrop-blur">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Available
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                  {resources.length}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Ready-to-book campus resources
                </p>
              </div>

              <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-[0_18px_40px_rgba(109,40,217,0.08)] backdrop-blur">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Showing
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                  {filteredResources.length}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Matching your current search
                </p>
              </div>

              <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-[0_18px_40px_rgba(109,40,217,0.08)] backdrop-blur">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Top Type
                </p>
                <p className="mt-3 line-clamp-1 text-2xl font-black tracking-tight text-slate-950">
                  {heroResource?.type?.replaceAll("_", " ") || "Campus Space"}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Highlighted for quicker discovery
                </p>
              </div>
            </div>

            <div className="relative max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, type, location, or details..."
                className="w-full rounded-2xl border border-violet-100 bg-white/90 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-700 shadow-[0_12px_30px_rgba(109,40,217,0.06)] outline-none transition-all placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>

          <div className="resource-hero-float mx-auto w-full max-w-[540px]">
            <div className="rounded-[34px] border border-white/80 bg-white/75 p-4 shadow-[0_28px_70px_rgba(109,40,217,0.12)] backdrop-blur-xl">
              <div className="relative h-[380px] overflow-hidden rounded-[28px] md:h-[420px]">
                <GradientPlaceholder label={heroResource?.name || "Campus Resource"} />
                <img
                  src={ONLINE_FALLBACK_IMAGE}
                  alt="Premium campus resource"
                  className="resource-image-pan absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {heroResource && resourceImageUrl(heroResource) ? (
                  <img
                    src={resourceImageUrl(heroResource)}
                    alt={heroResource.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.06)_0%,rgba(76,29,149,0.18)_28%,rgba(46,16,101,0.86)_100%)]" />
                <div className="absolute left-5 top-5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured Pick
                  </span>
                </div>
                <div className="absolute right-5 top-5 rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-right backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-100">
                    Capacity
                  </p>
                  <p className="mt-1 text-lg font-black text-white">
                    {heroResource?.capacity || 0}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="rounded-[26px] border border-white/20 bg-white/12 p-5 backdrop-blur-xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-violet-100 backdrop-blur">
                      <Tag className="h-3.5 w-3.5" />
                      {heroResource?.type?.replaceAll("_", " ") || "Campus Ready"}
                    </div>

                    <h2 className="text-3xl font-black tracking-tight text-white">
                      {heroResource?.name || "Premium Campus Space"}
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-white/90">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 backdrop-blur">
                        <MapPin className="h-4 w-4" />
                        {heroResource?.location || "Campus location"}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 backdrop-blur">
                        <Users className="h-4 w-4" />
                        Capacity {heroResource?.capacity || 0}
                      </span>
                    </div>
                    <p className="mt-4 line-clamp-2 max-w-lg text-sm leading-6 text-white/80">
                      {heroResource?.description ||
                        "A polished campus-ready space designed for lectures, collaboration, and faster booking decisions."}
                    </p>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="grid flex-1 grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-white/12 px-4 py-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-100">
                            Resource
                          </p>
                          <p className="mt-1 text-sm font-bold text-white">
                            {heroResource?.type?.replaceAll("_", " ") || "Space"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white/12 px-4 py-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-100">
                            Ready To Book
                          </p>
                          <p className="mt-1 text-sm font-bold text-white">
                            Available now
                          </p>
                        </div>
                      </div>

                      {heroResource ? (
                        <button
                          onClick={() => navigate(`/user/book/${heroResource.id}`)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-[0_12px_30px_rgba(15,23,42,0.16)] transition-all hover:-translate-y-0.5 hover:bg-violet-50"
                        >
                          Book Featured
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {filteredResources.length === 0 ? (
        <div className="rounded-[32px] border-2 border-dashed border-violet-100 bg-white px-8 py-20 text-center shadow-[0_16px_40px_rgba(109,40,217,0.06)]">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-violet-50">
            <Box className="h-10 w-10 text-violet-300" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            No matching resources found
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Try a different search term or clear the filter to see all available
            spaces and equipment.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map((resource) => (
            <article
              key={resource.id}
              className="group overflow-hidden rounded-[30px] border border-violet-100 bg-white shadow-[0_16px_40px_rgba(109,40,217,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_24px_55px_rgba(109,40,217,0.14)]"
            >
              <div className="relative h-[250px] overflow-hidden">
                <GradientPlaceholder label={resource.name} />
                <img
                  src={ONLINE_FALLBACK_IMAGE}
                  alt="Campus resource preview"
                  className="resource-image-pan absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {resourceImageUrl(resource) ? (
                  <img
                    src={resourceImageUrl(resource)}
                    alt={resource.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.06)_0%,rgba(76,29,149,0.18)_40%,rgba(46,16,101,0.80)_100%)]" />

                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur">
                    <Tag className="h-3.5 w-3.5" />
                    {resource.type?.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-bold text-white/90 backdrop-blur">
                    <MapPin className="h-3.5 w-3.5" />
                    {resource.location || "Campus location"}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950 transition-colors group-hover:text-violet-700">
                      {resource.name}
                    </h2>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                      {resource.description || "Ready for your next booking with a clean, streamlined reservation flow."}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Capacity
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                      <Users className="h-4 w-4 text-violet-500" />
                      {resource.capacity || 0} people
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Type
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                      <Box className="h-4 w-4 text-violet-500" />
                      {resource.type?.replaceAll("_", " ") || "Resource"}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/user/book/${resource.id}`)}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_55%,#8B5CF6_100%)] px-4 py-3.5 text-sm font-bold text-white shadow-[0_18px_40px_rgba(109,40,217,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(109,40,217,0.32)] active:scale-[0.99]"
                >
                  Book Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

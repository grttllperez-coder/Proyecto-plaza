import { useState, useMemo, useRef } from "react";
import {
  stores,
  promotions,
  localSpaces,
  restaurants,
  services,
  categoryLabels,
  categoryColors,
  categoryIcons,
  type Store,
  type Promotion,
  type LocalSpace,
  type Restaurant,
  type ServiceItem,
  type Category,
} from "./data";

// ─── Types ────────────────────────────────────────────────────────────────────
type Page =
  | "home"
  | "stores"
  | "store-detail"
  | "map"
  | "promotions"
  | "promotion-detail"
  | "locales"
  | "local-detail"
  | "restaurants"
  | "services"
  | "directory"
  | "contact";

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Badge({
  category,
  small,
}: {
  category: Category;
  small?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${small ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"}`}
      style={{
        backgroundColor: categoryColors[category] + "18",
        color: categoryColors[category],
      }}
    >
      <span>{categoryIcons[category]}</span>
      {categoryLabels[category]}
    </span>
  );
}

function DiscountBadge({ text }: { text: string }) {
  return (
    <span className="bg-[#C1440E] text-white text-xs font-bold px-2 py-1 rounded-full">
      {text}
    </span>
  );
}

function StatusBadge({ status }: { status: LocalSpace["status"] }) {
  const map = {
    disponible: { label: "Disponible", cls: "bg-green-100 text-green-700" },
    "en-negociacion": { label: "En Negociación", cls: "bg-yellow-100 text-yellow-700" },
    ocupado: { label: "Ocupado", cls: "bg-red-100 text-red-600" },
  };
  const s = map[status];
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  );
}

function SectionTitle({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2
          className="font-display text-3xl md:text-4xl text-[#1C1410] mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
        {subtitle && <p className="text-[#8A7468] text-base">{subtitle}</p>}
      </div>
      {action && onAction && (
        <button
          onClick={onAction}
          className="text-[#C1440E] font-semibold text-sm hover:underline flex items-center gap-1 shrink-0"
        >
          {action} →
        </button>
      )}
    </div>
  );
}

function SearchBar({
  value,
  onChange,
  placeholder = "¿Qué estás buscando?",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7468]"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#E0D5CC] bg-white text-[#1C1410] placeholder-[#8A7468] focus:outline-none focus:border-[#C1440E] focus:ring-2 focus:ring-[#C1440E]/10 transition-all text-sm"
      />
    </div>
  );
}

function ImageWithFallback({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&auto=format";
      }}
    />
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({
  currentPage,
  navigate,
}: {
  currentPage: Page;
  navigate: (p: Page) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { label: string; page: Page }[] = [
    { label: "Inicio", page: "home" },
    { label: "Tiendas", page: "stores" },
    { label: "Restaurantes", page: "restaurants" },
    { label: "Servicios", page: "services" },
    { label: "Promociones", page: "promotions" },
    { label: "Locales", page: "locales" },
    { label: "Mapa", page: "map" },
    { label: "Directorio", page: "directory" },
    { label: "Contacto", page: "contact" },
  ];

  const go = (p: Page) => {
    navigate(p);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E0D5CC] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2.5 shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-[#C1440E] flex items-center justify-center shadow-sm">
            <span className="text-white text-base font-bold">PT</span>
          </div>
          <div className="leading-tight hidden sm:block">
            <div
              className="text-[#1C1410] font-bold text-sm"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Parque Tezontle
            </div>
            <div className="text-[#8A7468] text-[10px] tracking-wide uppercase">
              Iztapalapa · CDMX
            </div>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => go(item.page)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.page
                  ? "bg-[#C1440E]/10 text-[#C1440E]"
                  : "text-[#3D2B22] hover:bg-[#F2ECE5]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => go("locales")}
            className="bg-[#C1440E] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#9E3509] transition-colors"
          >
            Rentar Local
          </button>
        </div>

        <button
          className="lg:hidden p-2 text-[#3D2B22]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#E0D5CC] p-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => go(item.page)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                  currentPage === item.page
                    ? "bg-[#C1440E]/10 text-[#C1440E]"
                    : "text-[#3D2B22] hover:bg-[#F2ECE5]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => go("locales")}
            className="mt-3 w-full bg-[#C1440E] text-white text-sm font-semibold px-4 py-3 rounded-xl"
          >
            Rentar un Local
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({
  navigate,
  onSelectStore,
  onSelectPromotion,
}: {
  navigate: (p: Page) => void;
  onSelectStore: (id: string) => void;
  onSelectPromotion: (id: string) => void;
}) {
  const [search, setSearch] = useState("");

  const categories: { id: Category; label: string; icon: string; bg: string }[] = [
    { id: "moda", label: "Moda", icon: "👗", bg: "#FFF0EB" },
    { id: "restaurantes", label: "Restaurantes", icon: "🍽️", bg: "#FFF5F0" },
    { id: "tecnologia", label: "Tecnología", icon: "💻", bg: "#EBF3FF" },
    { id: "entretenimiento", label: "Entretenimiento", icon: "🎬", bg: "#F5EBFF" },
    { id: "belleza", label: "Belleza", icon: "💄", bg: "#FFEAF3" },
    { id: "servicios", label: "Servicios", icon: "🏦", bg: "#EBFFF5" },
    { id: "hogar", label: "Hogar", icon: "🏠", bg: "#FFF5E8" },
    { id: "supermercado", label: "Supermercado", icon: "🛒", bg: "#EDFAE8" },
  ];

  const handleSearch = () => {
    if (search.trim()) navigate("stores");
  };

  const featuredStores = stores.filter((s) => s.featured).slice(0, 6);
  const featuredPromos = promotions.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[560px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1781910239473-457e11ef44de?w=1600&h=900&fit=crop&auto=format"
          alt="Parque Tezontle interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1410]/80 via-[#1C1410]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/60 via-transparent to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#E3A139] animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                Abierto hoy · 10:00 – 21:00
              </span>
            </div>
            <h1
              className="text-5xl md:text-7xl text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Descubre
              <br />
              <span className="text-[#E3A139]">Parque Tezontle</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
              El centro comercial más completo de Iztapalapa. Más de 200 tiendas, restaurantes y entretenimiento en un solo lugar.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("stores")}
                className="bg-[#C1440E] hover:bg-[#9E3509] text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-lg"
              >
                Explorar Tiendas
              </button>
              <button
                onClick={() => navigate("promotions")}
                className="bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white font-semibold px-7 py-3.5 rounded-xl border border-white/30 transition-colors"
              >
                Ver Promociones
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-white/30" />
        </div>
      </section>

      {/* Searchbar */}
      <section className="bg-white py-6 shadow-sm sticky top-16 z-40 border-b border-[#E0D5CC]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7468]"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#E0D5CC] bg-white text-[#1C1410] placeholder-[#8A7468] focus:outline-none focus:border-[#C1440E] focus:ring-2 focus:ring-[#C1440E]/10 transition-all text-sm"
      />
    </div>
  );
}

function ImageWithFallback({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&auto=format";
      }}
    />
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({
  currentPage,
  navigate,
}: {
  currentPage: Page;
  navigate: (p: Page) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { label: string; page: Page }[] = [
    { label: "Inicio", page: "home" },
    { label: "Tiendas", page: "stores" },
    { label: "Restaurantes", page: "restaurants" },
    { label: "Servicios", page: "services" },
    { label: "Promociones", page: "promotions" },
    { label: "Locales", page: "locales" },
    { label: "Mapa", page: "map" },
    { label: "Directorio", page: "directory" },
    { label: "Contacto", page: "contact" },
  ];

  const go = (p: Page) => {
    navigate(p);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E0D5CC] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2.5 shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-[#C1440E] flex items-center justify-center shadow-sm">
            <span className="text-white text-base font-bold">PT</span>
          </div>
          <div className="leading-tight hidden sm:block">
            <div
              className="text-[#1C1410] font-bold text-sm"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Parque Tezontle
            </div>
            <div className="text-[#8A7468] text-[10px] tracking-wide uppercase">
              Iztapalapa · CDMX
            </div>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => go(item.page)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.page
                  ? "bg-[#C1440E]/10 text-[#C1440E]"
                  : "text-[#3D2B22] hover:bg-[#F2ECE5]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => go("locales")}
            className="bg-[#C1440E] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#9E3509] transition-colors"
          >
            Rentar Local
          </button>
        </div>

        <button
          className="lg:hidden p-2 text-[#3D2B22]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#E0D5CC] p-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => go(item.page)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                  currentPage === item.page
                    ? "bg-[#C1440E]/10 text-[#C1440E]"
                    : "text-[#3D2B22] hover:bg-[#F2ECE5]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => go("locales")}
            className="mt-3 w-full bg-[#C1440E] text-white text-sm font-semibold px-4 py-3 rounded-xl"
          >
            Rentar un Local
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({
  navigate,
  onSelectStore,
  onSelectPromotion,
}: {
  navigate: (p: Page) => void;
  onSelectStore: (id: string) => void;
  onSelectPromotion: (id: string) => void;
}) {
  const [search, setSearch] = useState("");

  const categories: { id: Category; label: string; icon: string; bg: string }[] = [
    { id: "moda", label: "Moda", icon: "👗", bg: "#FFF0EB" },
    { id: "restaurantes", label: "Restaurantes", icon: "🍽️", bg: "#FFF5F0" },
    { id: "tecnologia", label: "Tecnología", icon: "💻", bg: "#EBF3FF" },
    { id: "entretenimiento", label: "Entretenimiento", icon: "🎬", bg: "#F5EBFF" },
    { id: "belleza", label: "Belleza", icon: "💄", bg: "#FFEAF3" },
    { id: "servicios", label: "Servicios", icon: "🏦", bg: "#EBFFF5" },
    { id: "hogar", label: "Hogar", icon: "🏠", bg: "#FFF5E8" },
    { id: "supermercado", label: "Supermercado", icon: "🛒", bg: "#EDFAE8" },
  ];

  const handleSearch = () => {
    if (search.trim()) navigate("stores");
  };

  const featuredStores = stores.filter((s) => s.featured).slice(0, 6);
  const featuredPromos = promotions.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[560px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1781910239473-457e11ef44de?w=1600&h=900&fit=crop&auto=format"
          alt="Parque Tezontle interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1410]/80 via-[#1C1410]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/60 via-transparent to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#E3A139] animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                Abierto hoy · 10:00 – 21:00
              </span>
            </div>
            <h1
              className="text-5xl md:text-7xl text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Descubre
              <br />
              <span className="text-[#E3A139]">Parque Tezontle</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
              El centro comercial más completo de Iztapalapa. Más de 200 tiendas, restaurantes y entretenimiento en un solo lugar.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("stores")}
                className="bg-[#C1440E] hover:bg-[#9E3509] text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-lg"
              >
                Explorar Tiendas
              </button>
              <button
                onClick={() => navigate("promotions")}
                className="bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white font-semibold px-7 py-3.5 rounded-xl border border-white/30 transition-colors"
              >
                Ver Promociones
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-white/30" />
        </div>
      </section>

      {/* Searchbar */}
      <section className="bg-white py-6 shadow-sm sticky top-16 z-40 border-b border-[#E0D5CC]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7468]"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="¿Qué estás buscando? Busca tiendas, restaurantes, servicios..."
              className="w-full pl-12 pr-32 py-4 rounded-2xl border-2 border-[#E0D5CC] bg-white text-[#1C1410] placeholder-[#8A7468] focus:outline-none focus:border-[#C1440E] transition-colors text-sm"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#C1440E] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#9E3509] transition-colors"
            >
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionTitle title="Categorías" subtitle="Encuentra lo que necesitas por categoría" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate("stores")}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-[#E0D5CC] hover:border-[#C1440E]/30 hover:shadow-md transition-all bg-white"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                style={{ backgroundColor: cat.bg }}
              >
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-[#3D2B22] text-center">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured stores */}
      <section className="bg-[#F2ECE5] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Tiendas Destacadas"
            subtitle="Las tiendas más populares de Parque Tezontle"
            action="Ver todas"
            onAction={() => navigate("stores")}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStores.map((store) => (
              <button
                key={store.id}
                onClick={() => onSelectStore(store.id)}
                className="text-left bg-white rounded-2xl overflow-hidden shadow-sm hover-lift border border-[#E0D5CC]/50"
              >
                <div className="h-48 overflow-hidden bg-[#E8DDD2]">
                  <ImageWithFallback
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-[#1C1410] text-lg">{store.name}</h3>
                    <Badge category={store.category} small />
                  </div>
                  <p className="text-[#8A7468] text-sm mb-3 line-clamp-2">
                    {store.description}
                  </p>
                  <div className="flex items-center gap-1 text-[#8A7468] text-xs">
                    <span>📍</span>
                    <span>{store.local} · {store.floor}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions preview */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <SectionTitle
          title="Promociones Activas"
          subtitle="No te pierdas estas ofertas exclusivas"
          action="Ver todas"
          onAction={() => navigate("promotions")}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPromos.map((promo) => (
            <button
              key={promo.id}
              onClick={() => onSelectPromotion(promo.id)}
              className="text-left bg-white rounded-2xl overflow-hidden border border-[#E0D5CC] hover-lift"
            >
              <div className="relative h-44 bg-[#E8DDD2] overflow-hidden">
                <ImageWithFallback
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <DiscountBadge text={promo.discount} />
                </div>
              </div>
              <div className="p-4">
                <p className="text-[#8A7468] text-xs mb-1">{promo.storeName}</p>
                <h3 className="font-bold text-[#1C1410] text-sm line-clamp-2 mb-2">
                  {promo.title}
                </h3>
                <p className="text-[#8A7468] text-xs">Vigente hasta: {promo.validUntil}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1C1410] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "200+", label: "Tiendas y Locales" },
              { value: "8", label: "Categorías" },
              { value: "2,000+", label: "Lugares de Estacionamiento" },
              { value: "10M+", label: "Visitantes al Año" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-4xl md:text-5xl text-[#E3A139] font-bold mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.value}
                </div>
                <div className="text-white/60 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available spaces CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-[#C1440E] to-[#9E3509] rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2
              className="text-3xl md:text-4xl text-white mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ¿Buscas abrir tu negocio?
            </h2>
            <p className="text-white/80 text-lg max-w-lg">
              Tenemos locales disponibles de distintos tamaños en ubicaciones estratégicas. Haz crecer tu marca en Parque Tezontle.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => navigate("locales")}
              className="bg-white text-[#C1440E] font-bold px-7 py-3.5 rounded-xl hover:bg-[#F2ECE5] transition-colors"
            >
              Ver Locales
            </button>
            <button
              onClick={() => navigate("contact")}
              className="border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              Contactar
            </button>
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="bg-[#F2ECE5] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2
                className="text-3xl md:text-4xl text-[#1C1410] mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Cómo llegar
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">📍</span>
                  <div>
                    <p className="font-semibold text-[#1C1410]">Dirección</p>
                    <p className="text-[#8A7468] text-sm">
                      Calz. de la Viga s/n esq. Av. Javier Rojo Gómez,<br />
                      Col. Agrícola Pantitlán, Iztapalapa, CDMX C.P. 08100
                    </p>
                    <p className="text-[#8A7468] text-xs mt-1 italic">*Datos de demostración</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🕐</span>
                  <div>
                    <p className="font-semibold text-[#1C1410]">Horarios</p>
                    <p className="text-[#8A7468] text-sm">Lunes a Domingo: 10:00 – 21:00</p>
                    <p className="text-[#8A7468] text-sm">Walmart: 07:00 – 22:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🚇</span>
                  <div>
                    <p className="font-semibold text-[#1C1410]">Transporte</p>
                    <p className="text-[#8A7468] text-sm">Metro Iztapalapa (Línea 8)</p>
                    <p className="text-[#8A7468] text-sm">Trolebús, Microbús y estacionamiento propio</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">📞</span>
                  <div>
                    <p className="font-semibold text-[#1C1410]">Contacto General</p>
                    <p className="text-[#8A7468] text-sm">55 5600 0000 · info@parquetezontle.mx</p>
                    <p className="text-[#8A7468] text-xs mt-1 italic">*Datos de demostración</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#E8DDD2] rounded-2xl overflow-hidden h-72 relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1777229567995-40d60f843d02?w=800&h=500&fit=crop&auto=format"
                alt="Parque Tezontle"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1C1410]/20" />
              <div className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-3 shadow-lg">
                <p className="text-xs text-[#8A7468]">Centro Comercial</p>
                <p className="font-bold text-[#1C1410]">Parque Tezontle</p>
                <p className="text-xs text-[#C1440E]">Iztapalapa, CDMX</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1410] text-white/60 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#C1440E] rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PT</span>
                </div>
                <span className="text-white font-bold text-sm">Parque Tezontle</span>
              </div>
              <p className="text-xs leading-relaxed">
                El centro comercial más completo de Iztapalapa, CDMX.
              </p>
            </div>
            {[
              {
                title: "Visitantes",
                links: ["Tiendas", "Restaurantes", "Entretenimiento", "Promociones"],
              },
              {
                title: "Comerciantes",
                links: ["Locales Disponibles", "Solicitar Información", "Directorio", "Contacto"],
              },
              {
                title: "Información",
                links: ["Horarios", "Cómo Llegar", "Estacionamiento", "Mapa del Mall"],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-white font-semibold text-sm mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-xs hover:text-white transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs">
            <p>© 2026 Parque Tezontle · Todos los derechos reservados</p>
            <p className="text-white/40">Datos de demostración — Prototipo web</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Stores Page ──────────────────────────────────────────────────────────────

function StoresPage({
  onSelectStore,
  initialSearch = "",
}: {
  onSelectStore: (id: string) => void;
  initialSearch?: string;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [cat, setCat] = useState<Category | "all">("all");
  const [floor, setFloor] = useState<"all" | "Planta Baja" | "Planta Alta">("all");
  const [sort, setSort] = useState<"name" | "category">("name");

  const filtered = useMemo(() => {
    return stores
      .filter((s) => {
        const matchSearch =
          !search ||
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.description.toLowerCase().includes(search.toLowerCase()) ||
          s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        const matchCat = cat === "all" || s.category === cat;
        const matchFloor = floor === "all" || s.floor === floor;
        return matchSearch && matchCat && matchFloor;
      })
      .sort((a, b) =>
        sort === "name"
          ? a.name.localeCompare(b.name)
          : a.category.localeCompare(b.category)
      );
  }, [search, cat, floor, sort]);

  const allCategories: Category[] = [
    "moda", "restaurantes", "tecnologia", "entretenimiento", "belleza", "servicios", "hogar", "supermercado",
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="bg-white border-b border-[#E0D5CC]">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1
            className="text-4xl text-[#1C1410] mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tiendas
          </h1>
          <p className="text-[#8A7468]">Explora todas las tiendas de Parque Tezontle</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-[#E0D5CC] p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} placeholder="Buscar tienda..." />
            </div>
            <select
              value={floor}
              onChange={(e) => setFloor(e.target.value as typeof floor)}
              className="px-4 py-3.5 rounded-2xl border border-[#E0D5CC] text-sm text-[#3D2B22] bg-white focus:outline-none focus:border-[#C1440E] min-w-[160px]"
            >
              <option value="all">Todos los niveles</option>
              <option value="Planta Baja">Planta Baja</option>
              <option value="Planta Alta">Planta Alta</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="px-4 py-3.5 rounded-2xl border border-[#E0D5CC] text-sm text-[#3D2B22] bg-white focus:outline-none focus:border-[#C1440E] min-w-[160px]"
            >
              <option value="name">Ordenar: A–Z</option>
              <option value="category">Ordenar: Categoría</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setCat("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                cat === "all"
                  ? "bg-[#C1440E] text-white border-[#C1440E]"
                  : "bg-white text-[#3D2B22] border-[#E0D5CC] hover:border-[#C1440E]/50"
              }`}
            >
              Todas
            </button>
            {allCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  cat === c
                    ? "text-white border-transparent"

  : "bg-white text-[#3D2B22] border-[#E0D5CC] hover:border-opacity-50"
                }`}
                style={
                  cat === c
                    ? { backgroundColor: categoryColors[c], borderColor: categoryColors[c] }
                    : {}
                }
              >
                {categoryIcons[c]} {categoryLabels[c]}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[#8A7468] text-sm mb-6">{filtered.length} tiendas encontradas</p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-[#8A7468] text-lg">No encontramos tiendas con ese criterio</p>
            <button
              onClick={() => { setSearch(""); setCat("all"); setFloor("all"); }}
              className="mt-4 text-[#C1440E] font-medium hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((store) => (
              <button
                key={store.id}
                onClick={() => onSelectStore(store.id)}
                className="text-left bg-white rounded-2xl overflow-hidden border border-[#E0D5CC] hover-lift group"
              >
                <div className="h-44 bg-[#E8DDD2] overflow-hidden">
                  <ImageWithFallback
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-[#1C1410]">{store.name}</h3>
                    <Badge category={store.category} small />
                  </div>
                  <p className="text-[#8A7468] text-xs mb-3 line-clamp-2">{store.description}</p>
                  <div className="flex items-center justify-between text-xs text-[#8A7468]">
                    <span>📍 {store.local}</span>
                    <span className="bg-[#F2ECE5] px-2 py-0.5 rounded-full">{store.floor}</span>
                  </div>
                  <p className="text-xs text-[#8A7468] mt-1">🕐 {store.hours}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Store Detail ─────────────────────────────────────────────────────────────

function StoreDetailPage({
  store,
  onBack,
  navigateToMap,
  onSelectPromotion,
}: {
  store: Store;
  onBack: () => void;
  navigateToMap: () => void;
  onSelectPromotion: (id: string) => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const allImages = [store.image, ...store.gallery];
  const storePromos = promotions.filter((p) => p.storeId === store.id);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#8A7468] hover:text-[#1C1410] mb-6 transition-colors"
        >
          ← Regresar
        </button>

        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="rounded-2xl overflow-hidden bg-[#E8DDD2] h-80 mb-3">
              <ImageWithFallback
                src={allImages[activeImage]}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      i === activeImage ? "border-[#C1440E]" : "border-transparent"
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <Badge category={store.category} />
            <h1
              className="text-4xl text-[#1C1410] mt-3 mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {store.name}
            </h1>
            <p className="text-[#8A7468] text-base leading-relaxed mb-6">{store.description}</p>

            <div className="space-y-4 bg-white rounded-2xl p-5 border border-[#E0D5CC]">
              {[
                { icon: "📍", label: "Ubicación", value: `${store.local} · ${store.floor}` },
                { icon: "🕐", label: "Horario", value: store.hours },
                { icon: "📞", label: "Teléfono", value: store.phone },
                ...(store.website
                  ? [{ icon: "🌐", label: "Web", value: store.website }]
                  : []),
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-xs text-[#8A7468] font-medium">{item.label}</p>
                    <p className="text-sm text-[#1C1410]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {store.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-[#F2ECE5] text-[#7A5C4E] px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={navigateToMap}
                className="flex-1 bg-[#C1440E] text-white font-semibold py-3.5 rounded-xl hover:bg-[#9E3509] transition-colors"
              >
                Ver en el Mapa
              </button>
              <a
                href={`tel:${store.phone}`}
                className="flex-1 border-2 border-[#C1440E] text-[#C1440E] font-semibold py-3.5 rounded-xl text-center hover:bg-[#C1440E]/5 transition-colors"
              >
                Llamar
              </a>
            </div>
          </div>
        </div>

        {storePromos.length > 0 && (
          <div className="mt-14">
            <SectionTitle title="Promociones de esta Tienda" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {storePromos.map((promo) => (
                <button
                  key={promo.id}
                  onClick={() => onSelectPromotion(promo.id)}
                  className="text-left bg-white rounded-2xl overflow-hidden border border-[#E0D5CC] hover-lift"
                >
                  <div className="relative h-36 bg-[#E8DDD2] overflow-hidden">
                    <ImageWithFallback src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <DiscountBadge text={promo.discount} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#1C1410] text-sm mb-1">{promo.title}</h3>
                    <p className="text-[#8A7468] text-xs">Hasta: {promo.validUntil}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Promotions Page ──────────────────────────────────────────────────────────

function PromotionsPage({
  onSelectPromotion,
}: {
  onSelectPromotion: (id: string) => void;
}) {
  const [cat, setCat] = useState<Category | "all">("all");
  const [storeFilter, setStoreFilter] = useState("all");

  const storeNames = [...new Set(promotions.map((p) => p.storeName))];
  const allCategories: Category[] = [
    "moda", "tecnologia", "entretenimiento", "belleza", "supermercado",
  ];

  const filtered = promotions.filter((p) => {
    const matchCat = cat === "all" || p.category === cat;
    const matchStore = storeFilter === "all" || p.storeName === storeFilter;
    return matchCat && matchStore;
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="bg-white border-b border-[#E0D5CC]">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1
            className="text-4xl text-[#1C1410] mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Promociones
          </h1>
          <p className="text-[#8A7468]">Ofertas y descuentos exclusivos en Parque Tezontle</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-[#E0D5CC] p-5 mb-8 flex flex-wrap gap-4">
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value as typeof cat)}
            className="px-4 py-3 rounded-xl border border-[#E0D5CC] text-sm text-[#3D2B22] bg-white focus:outline-none focus:border-[#C1440E]"
          >
            <option value="all">Todas las categorías</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {categoryLabels[c]}
              </option>
            ))}
          </select>
          <select
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-[#E0D5CC] text-sm text-[#3D2B22] bg-white focus:outline-none focus:border-[#C1440E]"
          >
            <option value="all">Todas las tiendas</option>
            {storeNames.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((promo) => (
            <button
              key={promo.id}
              onClick={() => onSelectPromotion(promo.id)}
              className="text-left bg-white rounded-2xl overflow-hidden border border-[#E0D5CC] hover-lift group"
            >
              <div className="relative h-52 bg-[#E8DDD2] overflow-hidden">
                <ImageWithFallback
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/50 to-transparent" />
                <div className="absolute top-3 left-3">
                  <DiscountBadge text={promo.discount} />
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge category={promo.category} small />
                </div>
              </div>
              <div className="p-4">
                <p className="text-[#8A7468] text-xs font-medium mb-1">{promo.storeName}</p>
                <h3 className="font-bold text-[#1C1410] text-sm mb-2 line-clamp-2">{promo.title}</h3>
                <p className="text-[#8A7468] text-xs mb-3 line-clamp-2">{promo.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#C1440E] font-medium">
                    Vigente: {promo.validUntil}
                  </span>
                  <span className="text-xs text-[#8A7468] hover:text-[#C1440E]">Ver →</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Promotion Detail ─────────────────────────────────────────────────────────

function PromotionDetailPage({
  promo,
  onBack,
  onSelectStore,
}: {
  promo: Promotion;
  onBack: () => void;
  onSelectStore: (id: string) => void;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-[#8A7468] hover:text-[#1C1410] mb-6">
          ← Regresar a Promociones
        </button>
        <div className="bg-white rounded-3xl overflow-hidden border border-[#E0D5CC]">
          <div className="relative h-72 bg-[#E8DDD2]">
            <ImageWithFallback src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/60 to-transparent" />
            <div className="absolute top-5 left-5">
              <DiscountBadge text={promo.discount} />
            </div>
          </div>
          <div className="p-8">
            <Badge category={promo.category} />
            <h1
              className="text-3xl text-[#1C1410] mt-3 mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {promo.title}
            </h1>
            <p className="text-[#8A7468] text-base leading-relaxed mb-6">{promo.description}</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#F2ECE5] rounded-xl p-4">
                <p className="text-xs text-[#8A7468] mb-1">Tienda</p>
                <p className="font-bold text-[#1C1410]">{promo.storeName}</p>
              </div>
              <div className="bg-[#F2ECE5] rounded-xl p-4">
                <p className="text-xs text-[#8A7468] mb-1">Vigencia</p>
                <p className="font-bold text-[#1C1410]">Hasta el {promo.validUntil}</p>
              </div>
            </div>
            <div className="border-t border-[#E0D5CC] pt-5 mb-6">
              <p className="text-xs font-semibold text-[#8A7468] mb-2 uppercase tracking-wide">Términos y Condiciones</p>
              <p className="text-sm text-[#8A7468]">{promo.terms}</p>
            </div>
            <button
              onClick={() => onSelectStore(promo.storeId)}
              className="w-full bg-[#C1440E] text-white font-semibold py-4 rounded-xl hover:bg-[#9E3509] transition-colors"
            >
              Ver Tienda: {promo.storeName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mall Map ─────────────────────────────────────────────────────────────────

function MallMapPage({
  onSelectStore,
}: {
  onSelectStore: (id: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<Category | "all">("all");
  const [activeFloor, setActiveFloor] = useState<"baja" | "alta">("baja");

  const floorBajaStores = stores.filter((s) => s.floor === "Planta Baja");
  const floorAltaStores = stores.filter((s) => s.floor === "Planta Alta");
  const currentFloorStores = activeFloor === "baja" ? floorBajaStores : floorAltaStores;

  const displayStores = currentFloorStores.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || s.category === filterCat;
    return matchSearch && matchCat;
  });

  const selectedStore = selectedId ? stores.find((s) => s.id === selectedId) : null;

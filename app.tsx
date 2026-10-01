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

  const handleSelect = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
  };

  // Map zones for Planta Baja
  const bajazones = [
    // North row
    { id: "samsung", x: 120, y: 60, w: 110, h: 70, label: "Samsung Store" },
    { id: "liverpool", x: 260, y: 60, w: 110, h: 70, label: "Liverpool" },
    { id: "walmart", x: 400, y: 60, w: 110, h: 70, label: "Walmart" },
    { id: "sears", x: 540, y: 60, w: 110, h: 70, label: "Sears" },
    // West col
    { id: "mac", x: 40, y: 180, w: 60, h: 90, label: "MAC" },
    // East col
    { id: "pullbear", x: 700, y: 180, w: 60, h: 90, label: "Pull&Bear" },
    // South row food court area
    { id: "zara", x: 120, y: 370, w: 110, h: 60, label: "Zara" },
    { id: "hm", x: 260, y: 370, w: 110, h: 60, label: "H&M" },
    { id: "nike", x: 400, y: 370, w: 110, h: 60, label: "Nike" },
    { id: "cinepolis", x: 540, y: 370, w: 110, h: 60, label: "Cinépolis" },
  ];

  const altaZones = [
    { id: "zara", x: 120, y: 60, w: 110, h: 70, label: "Zara" },
    { id: "hm", x: 260, y: 60, w: 110, h: 70, label: "H&M" },
    { id: "pullbear", x: 400, y: 60, w: 110, h: 70, label: "Pull&Bear" },
    { id: "nike", x: 540, y: 60, w: 110, h: 70, label: "Nike" },
    { id: "cinepolis", x: 120, y: 370, w: 240, h: 60, label: "Cinépolis VIP" },
    { id: "mac", x: 400, y: 370, w: 110, h: 60, label: "MAC Cosmetics" },
    { id: "samsung", x: 540, y: 370, w: 110, h: 60, label: "Samsung" },
  ];

  const zones = activeFloor === "baja" ? bajazones : altaZones;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="bg-white border-b border-[#E0D5CC]">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1
            className="text-4xl text-[#1C1410] mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Mapa de Parque Tezontle
          </h1>
          <p className="text-[#8A7468]">Encuentra la ubicación de cada tienda en el mall</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Buscar local..." />
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value as typeof filterCat)}
              className="w-full px-4 py-3 rounded-xl border border-[#E0D5CC] text-sm text-[#3D2B22] bg-white focus:outline-none focus:border-[#C1440E]"
            >
              <option value="all">Todas las categorías</option>
              {(["moda", "tecnologia", "entretenimiento", "belleza", "supermercado", "hogar"] as Category[]).map((c) => (
                <option key={c} value={c}>{categoryLabels[c]}</option>
              ))}
            </select>

            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
              {displayStores.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 ${
                    selectedId === s.id
                      ? "bg-[#C1440E] text-white"
                      : "hover:bg-[#F2ECE5] text-[#3D2B22]"
                  }`}
                >
                  <span>{categoryIcons[s.category]}</span>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{s.name}</p>
                    <p className={`text-xs truncate ${selectedId === s.id ? "text-white/70" : "text-[#8A7468]"}`}>
                      {s.local}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {selectedStore && (
              <div className="bg-white border border-[#E0D5CC] rounded-2xl p-4 animate-fade-in">
                <Badge category={selectedStore.category} small />
                <h3 className="font-bold text-[#1C1410] mt-2 mb-1">{selectedStore.name}</h3>
                <p className="text-xs text-[#8A7468] mb-1">📍 {selectedStore.local}</p>
                <p className="text-xs text-[#8A7468] mb-3">🕐 {selectedStore.hours}</p>
                <button
                  onClick={() => onSelectStore(selectedStore.id)}
                  className="w-full bg-[#C1440E] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#9E3509] transition-colors"
                >
                  Ver Detalles
                </button>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            {/* Floor selector */}
            <div className="flex gap-2 mb-4">
              {(["baja", "alta"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => { setActiveFloor(f); setSelectedId(null); }}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                    activeFloor === f
                      ? "bg-[#C1440E] text-white border-[#C1440E]"
                      : "bg-white text-[#3D2B22] border-[#E0D5CC] hover:border-[#C1440E]/50"
                  }`}
                >
                  {f === "baja" ? "Planta Baja" : "Planta Alta"}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#E0D5CC] overflow-hidden">
              <svg
                viewBox="0 0 800 480"
                className="w-full"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {/* Background */}
                <rect x="0" y="0" width="800" height="480" fill="#F5F0EB" />
-
                {/* Mall outer boundary */}
                <rect x="30" y="30" width="740" height="420" rx="12" fill="#EDE5DC" stroke="#C8B4A6" strokeWidth="2" />

                {/* Corridors */}
                <rect x="100" y="150" width="600" height="30" fill="#DDD3C8" rx="4" />
                <rect x="100" y="300" width="600" height="30" fill="#DDD3C8" rx="4" />
                <rect x="100" y="150" width="30" height="180" fill="#DDD3C8" rx="4" />
                <rect x="670" y="150" width="30" height="180" fill="#DDD3C8" rx="4" />

                {/* Central atrium */}
                <rect x="250" y="195" width="300" height="90" rx="8" fill="#E8E0D8" stroke="#C8B4A6" strokeWidth="1.5" strokeDasharray="4,2" />
                <text x="400" y="232" textAnchor="middle" fill="#8A7468" fontSize="11" fontWeight="600">ATRIO CENTRAL</text>
                <text x="400" y="248" textAnchor="middle" fill="#8A7468" fontSize="9">Área de descanso y exhibiciones</text>

                {/* Entrances */}
                {[
                  { x: 370, y: 30, w: 60, label: "ENTRADA NORTE" },
                  { x: 370, y: 422, w: 60, label: "ENTRADA SUR" },
                  { x: 30, y: 215, w: 0, label: "ENTRADA\nOESTE", rot: true },
                  { x: 740, y: 215, w: 0, label: "ENTRADA\nESTE", rot: true },
                ].map((e, i) => (
                  <g key={i}>
                    {i < 2 ? (
                      <>
                        <rect x={e.x} y={e.y} width={60} height={20} rx="4" fill="#C1440E" />
                        <text x={e.x + 30} y={e.y + 14} textAnchor="middle" fill="white" fontSize="7" fontWeight="700">
                          {e.label}
                        </text>
                      </>
                    ) : (
                      <>
                        <rect
                          x={i === 2 ? 30 : 740}
                          y={215}
                          width={20}
                          height={50}
                          rx="4"
                          fill="#C1440E"
                        />
                        <text
                          x={i === 2 ? 40 : 750}
                          y={235}
                          textAnchor="middle"
                          fill="white"
                          fontSize="6"
                          fontWeight="700"
                          transform={`rotate(-90, ${i === 2 ? 40 : 750}, 240)`}
                        >
                          {e.label?.replace("\n", " ")}
                        </text>
                      </>
                    )}
                  </g>
                ))}

                {/* Store zones */}
                {zones.map((zone) => {
                  const store = stores.find((s) => s.id === zone.id);
                  const isSelected = selectedId === zone.id;
                  const isHighlighted =
                    displayStores.some((s) => s.id === zone.id) &&
                    (filterCat !== "all" || search);
                  const isFiltered =
                    filterCat !== "all" || search
                      ? !displayStores.some((s) => s.id === zone.id)
                      : false;
                  const color = store ? categoryColors[store.category] : "#8A7468";

                  return (
                    <g key={zone.id} onClick={() => handleSelect(zone.id)} className="map-store cursor-pointer" style={{ cursor: "pointer" }}>
                      <rect
                        x={zone.x}
                        y={zone.y}
                        width={zone.w}
                        height={zone.h}
                        rx="6"
                        fill={isSelected ? color : color + "25"}
                        stroke={isSelected ? color : color + "80"}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        opacity={isFiltered ? 0.3 : 1}
                      />
                      {isSelected && (
                        <rect
                          x={zone.x - 3}
                          y={zone.y - 3}
                          width={zone.w + 6}
                          height={zone.h + 6}
                          rx="8"
                          fill="none"
                          stroke={color}
                          strokeWidth="2"
                          opacity="0.4"
                          strokeDasharray="4,2"
                        />
                      )}
                      <text
                        x={zone.x + zone.w / 2}
                        y={zone.y + zone.h / 2 - 4}
                        textAnchor="middle"
                        fill={isSelected ? "white" : color}
                        fontSize="9"
                        fontWeight="700"
                      >
                        {zone.label.length > 12 ? zone.label.slice(0, 12) + "…" : zone.label}
                      </text>
                      {store && (
                        <text
                          x={zone.x + zone.w / 2}
                          y={zone.y + zone.h / 2 + 9}
                          textAnchor="middle"
                          fill={isSelected ? "white" : "#8A7468"}
                          fontSize="7"
                        >
                          {store.local}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Legend */}
                <g transform="translate(30, 435)">
                  <text x="0" y="10" fill="#8A7468" fontSize="8" fontWeight="600">
                    LEYENDA:
                  </text>
                  {(["moda", "tecnologia", "entretenimiento", "belleza"] as Category[]).map(
                    (c, i) => (
                      <g key={c} transform={`translate(${60 + i * 120}, 0)`}>
                        <rect x="0" y="0" width="10" height="10" rx="2" fill={categoryColors[c]} />
                        <text x="13" y="9" fill="#8A7468" fontSize="8">
                          {categoryLabels[c]}
                        </text>
                      </g>
                    )
                  )}
                </g>
              </svg>
            </div>

            <p className="text-xs text-[#8A7468] text-center mt-3 italic">
              * Mapa conceptual representativo. Datos de demostración.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Locales Page ─────────────────────────────────────────────────────────────

function LocalesPage({
  onSelectLocal,
}: {
  onSelectLocal: (id: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "disponible">("all");
  const [floorFilter, setFloorFilter] = useState<"all" | "Planta Baja" | "Planta Alta">("all");

  const filtered = localSpaces.filter((l) => {
    const matchStatus = filter === "all" || l.status === "disponible";
    const matchFloor = floorFilter === "all" || l.floor === floorFilter;
    return matchStatus && matchFloor;
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="bg-[#1C1410] text-white">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <p className="text-[#E3A139] text-sm font-semibold uppercase tracking-widest mb-3">
            Oportunidades Comerciales
          </p>
          <h1
            className="text-4xl md:text-5xl mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Locales Disponibles
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Encuentra el espacio ideal para tu negocio en uno de los centros comerciales más concurridos de la CDMX.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          {(["all", "disponible"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                filter === f
                  ? "bg-[#C1440E] text-white border-[#C1440E]"
                  : "bg-white text-[#3D2B22] border-[#E0D5CC] hover:border-[#C1440E]/50"
              }`}
            >
              {f === "all" ? "Todos los Locales" : "Solo Disponibles"}
            </button>
          ))}
          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value as typeof floorFilter)}
            className="px-4 py-2 rounded-xl border border-[#E0D5CC] text-sm text-[#3D2B22] bg-white focus:outline-none focus:border-[#C1440E]"
          >
            <option value="all">Todos los niveles</option>
            <option value="Planta Baja">Planta Baja</option>
            <option value="Planta Alta">Planta Alta</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((local) => (
            <button
              key={local.id}
              onClick={() => onSelectLocal(local.id)}
              className="text-left bg-white rounded-2xl overflow-hidden border border-[#E0D5CC] hover-lift group"
            >
              <div className="relative h-52 bg-[#E8DDD2] overflow-hidden">
                <ImageWithFallback
                  src={local.image}
                  alt={`Local ${local.code}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={local.status} />
                </div>
                <div className="absolute top-3 right-3 bg-[#1C1410]/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                  Local {local.code}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-[#1C1410] text-lg">{local.area} m²</p>
                    <p className="text-[#8A7468] text-xs">{local.dimensions}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#C1440E] font-bold text-sm">{local.price}</p>
                    <p className="text-[#8A7468] text-xs">{local.floor}</p>
                  </div>
                </div>
                <p className="text-[#8A7468] text-xs mb-3">📍 {local.zone}</p>
                <div className="flex flex-wrap gap-1">
                  {local.features.slice(0, 2).map((f) => (
                    <span key={f} className="text-xs bg-[#F2ECE5] text-[#7A5C4E] px-2 py-0.5 rounded-full">
                      {f}
                    </span>
                  ))}
                  {local.features.length > 2 && (
                    <span className="text-xs text-[#8A7468]">+{local.features.length - 2} más</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Local Detail ─────────────────────────────────────────────────────────────

function LocalDetailPage({
  local,
  onBack,
}: {
  local: LocalSpace;
  onBack: () => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [formSent, setFormSent] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    telefono: "",
    correo: "",
    negocio: "",
    mensaje: "",
  });

  const allImages = [local.image, ...local.gallery];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-[#8A7468] hover:text-[#1C1410] mb-6">
          ← Regresar a Locales
        </button>

        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="rounded-2xl overflow-hidden bg-[#E8DDD2] h-80 mb-3">
              <ImageWithFallback
                src={allImages[activeImage]}
                alt={`Local ${local.code}`}
                className="w-full h-full object-cover"
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      i === activeImage ? "border-[#C1440E]" : "border-transparent"
                    }`}
                  >
                    <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-[#E0D5CC] p-5 mt-5">
              <h3 className="font-bold text-[#1C1410] mb-4">Información Comercial</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "ID Local", value: local.code },
                  { label: "Superficie", value: `${local.area} m²` },
                  { label: "Dimensiones", value: local.dimensions },
                  { label: "Nivel", value: local.floor },
                  { label: "Zona", value: local.zone },
                  { label: "Estado", value: local.status === "disponible" ? "✅ Disponible" : "🔶 En Negociación" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-[#8A7468] mb-0.5">{item.label}</p>
                    <p className="text-sm font-semibold text-[#1C1410]">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-xs text-[#8A7468] mb-2">Características</p>
                <div className="flex flex-wrap gap-2">
                  {local.features.map((f) => (
                    <span key={f} className="text-xs bg-[#F2ECE5] text-[#7A5C4E] px-3 py-1 rounded-full">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 p-3 bg-[#C1440E]/5 border border-[#C1440E]/20 rounded-xl">
                <p className="text-xs text-[#8A7468] mb-1">Precio estimado</p>
                <p className="font-bold text-[#C1440E] text-lg">{local.price}</p>
                <p className="text-xs text-[#8A7468] italic">*Datos de demostración</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <StatusBadge status={local.status} />
              <span className="text-[#8A7468] text-sm">Local {local.code}</span>
            </div>
            <h1
              className="text-3xl text-[#1C1410] mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Local Comercial {local.area} m²
            </h1>
            <p className="text-[#8A7468] leading-relaxed mb-6">{local.description}</p>

            {formSent ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-fade-in">
                <p className="text-4xl mb-3">✅</p>
                <h3 className="font-bold text-green-700 text-xl mb-2">¡Solicitud enviada!</h3>
                <p className="text-green-600 text-sm">
                  Nuestro equipo comercial se pondrá en contacto contigo en un plazo de 24–48 horas hábiles.
                </p>
                <p className="text-green-500 text-xs mt-3 italic">*Datos de demostración — No se enviará ningún correo real.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E0D5CC] p-6">
                <h3
                  className="text-xl text-[#1C1410] mb-5"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Solicitar Información
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: "nombre", label: "Nombre completo", type: "text", required: true },
                      { key: "empresa", label: "Empresa / Marca", type: "text", required: false },
                      { key: "telefono", label: "Teléfono", type: "tel", required: true },
                      { key: "correo", label: "Correo electrónico", type: "email", required: true },
                    ].map((field) => (
                      <div key={field.key} className={field.key === "nombre" || field.key === "correo" ? "col-span-2 sm:col-span-1" : ""}>
                        <label className="text-xs text-[#8A7468] font-medium mb-1 block">
                          {field.label} {field.required && <span className="text-[#C1440E]">*</span>}
                        </label>
                        <input
                          type={field.type}
                          required={field.required}
                          value={(form as Record<string, string>)[field.key]}
                          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D5CC] text-sm text-[#1C1410] focus:outline-none focus:border-[#C1440E] bg-white"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-xs text-[#8A7468] font-medium mb-1 block">
                      Giro de negocio <span className="text-[#C1440E]">*</span>
                    </label>
                    <select
                      required
                      value={form.negocio}
                      onChange={(e) => setForm({ ...form, negocio: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D5CC] text-sm text-[#1C1410] focus:outline-none focus:border-[#C1440E] bg-white"
                    >
                      <option value="">Selecciona una opción</option>
                      {["Moda y Ropa", "Restaurante/Cafetería", "Tecnología", "Belleza y Estética", "Servicios", "Hogar", "Supermercado", "Otro"].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#8A7468] font-medium mb-1 block">Mensaje</label>
                    <textarea
                      rows={3}
                      value={form.mensaje}
                      onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                      placeholder="Cuéntanos más sobre tu proyecto..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D5CC] text-sm text-[#1C1410] focus:outline-none focus:border-[#C1440E] resize-none bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#C1440E] text-white font-bold py-4 rounded-xl hover:bg-[#9E3509] transition-colors"
                  >
                    Enviar Solicitud
                  </button>
                  <p className="text-xs text-center text-[#8A7468] italic">
                    *Prototipo de demostración — no se enviarán datos reales.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Restaurants Page ─────────────────────────────────────────────────────────

function RestaurantsPage() {
  const [filter, setFilter] = useState<"all" | "$" | "$$" | "$$$">("all");
  const filtered = restaurants.filter(
    (r) => filter === "all" || r.priceRange === filter
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div
        className="relative h-56 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1C1410 60%, #C1440E)",
        }}
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1700625916627-16ad4fb0553c?w=1200&h=400&fit=crop&auto=format"
          alt="Restaurantes"
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-40"
        />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div>
            <h1
              className="text-4xl md:text-5xl text-white mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Restaurantes
            </h1>
            <p className="text-white/70">Sabores del mundo en un solo lugar</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8">
          {(["all", "$", "$$", "$$$"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                filter === p
                  ? "bg-[#C1440E] text-white border-[#C1440E]"
                  : "bg-white text-[#3D2B22] border-[#E0D5CC] hover:border-[#C1440E]/50"
              }`}
            >
              {p === "all" ? "Todos" : p === "$" ? "$ Económico" : p === "$$" ? "$$ Medio" : "$$$ Premium"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E0D5CC] hover-lift"
            >
              <div className="relative h-52 bg-[#E8DDD2] overflow-hidden">
                <ImageWithFallback
                  src={r.image}
                  alt={r.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-sm font-bold text-[#C1440E]">
                  {r.priceRange}
                </div>
                {r.featured && (
                  <div className="absolute top-3 left-3 bg-[#E3A139] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    ⭐ Destacado
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="font-bold text-[#1C1410] text-lg">{r.name}</h3>
                  <p className="text-[#C1440E] text-xs font-medium">{r.subcategory}</p>
                </div>
                <p className="text-[#8A7468] text-sm mb-4 line-clamp-2">{r.description}</p>
                <div className="space-y-1 text-xs text-[#8A7468]">
                  <p>📍 {r.local} · {r.floor}</p>
                  <p>🕐 {r.hours}</p>
                  <p>📞 {r.phone}</p>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {r.tags.map((t) => (
                    <span key={t} className="text-xs bg-[#F2ECE5] text-[#7A5C4E] px-2 py-0.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Services Page ────────────────────────────────────────────────────────────

function ServicesPage() {
  const subcategories = [...new Set(services.map((s) => s.subcategory))];
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? services : services.filter((s) => s.subcategory === filter);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="bg-white border-b border-[#E0D5CC]">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1
            className="text-4xl text-[#1C1410] mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Servicios
          </h1>
          <p className="text-[#8A7468]">Todo lo que necesitas en un solo lugar</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
              filter === "all"
                ? "bg-[#C1440E] text-white border-[#C1440E]"
                : "bg-white text-[#3D2B22] border-[#E0D5CC]"
            }`}
          >
            Todos
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setFilter(sub)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                filter === sub
                  ? "bg-[#C1440E] text-white border-[#C1440E]"
                  : "bg-white text-[#3D2B22] border-[#E0D5CC] hover:border-[#C1440E]/50"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E0D5CC] hover-lift"
            >
              <div className="h-40 bg-[#E8DDD2] overflow-hidden">
                <ImageWithFallback
                  src={s.image}
                  alt={s.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-[#C1440E] text-xs font-semibold mb-1">{s.subcategory}</p>
                <h3 className="font-bold text-[#1C1410] mb-2">{s.name}</h3>
                <p className="text-[#8A7468] text-xs mb-3 line-clamp-2">{s.description}</p>
                <div className="space-y-0.5 text-xs text-[#8A7468]">
                  <p>📍 {s.local} · {s.floor}</p>
                  <p>🕐 {s.hours}</p>
                  <p>📞 {s.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Directory Page ───────────────────────────────────────────────────────────

function DirectoryPage({
  onSelectStore,
}: {
  onSelectStore: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");

  const allItems = [
    ...stores.map((s) => ({ ...s, type: "Tienda" as const })),
    ...restaurants.map((r) => ({
      id: r.id,
      name: r.name,
      category: "restaurantes" as Category,
      local: r.local,
      floor: r.floor,
      hours: r.hours,
      phone: r.phone,
      type: "Restaurante" as const,
      description: r.description,
    })),
    ...services.map((s) => ({
      id: s.id,
      name: s.name,
      category: "servicios" as Category,
      local: s.local,
      floor: s.floor,
      hours: s.hours,
      phone: s.phone,
      type: "Servicio" as const,
      description: s.description,
    })),
  ];

  const filtered = allItems.filter((item) => {
    const matchSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.local.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "all" || item.category === cat;
    return matchSearch && matchCat;
  }).sort((a, b) => a.name.localeCompare(b.name));

  const grouped: Record<string, typeof filtered> = {};
  filtered.forEach((item) => {
    const key = item.name[0].toUpperCase();
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="bg-white border-b border-[#E0D5CC]">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1
            className="text-4xl text-[#1C1410] mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Directorio
          </h1>
          <p className="text-[#8A7468]">Directorio completo de establecimientos de Parque Tezontle</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Buscar establecimiento..." />
          </div>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value as typeof cat)}
            className="px-4 py-3.5 rounded-2xl border border-[#E0D5CC] text-sm text-[#3D2B22] bg-white focus:outline-none focus:border-[#C1440E] min-w-[200px]"
          >
            <option value="all">Todas las categorías</option>
            {(Object.keys(categoryLabels) as Category[]).map((c) => (
              <option key={c} value={c}>{categoryLabels[c]}</option>
            ))}
          </select>
        </div>

        <p className="text-[#8A7468] text-sm mb-6">{filtered.length} establecimientos</p>

        {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([letter, items]) => (
          <div key={letter} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#C1440E] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">{letter}</span>
              </div>
              <div className="flex-1 h-px bg-[#E0D5CC]" />
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => item.type === "Tienda" && onSelectStore(item.id)}
                  className={`w-full text-left bg-white rounded-xl border border-[#E0D5CC] p-4 hover:border-[#C1440E]/40 transition-colors flex items-center gap-4 ${item.type !== "Tienda" ? "cursor-default" : "hover:shadow-sm"}`}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: categoryColors[item.category] + "18" }}>
                    <span className="text-lg">{categoryIcons[item.category]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#1C1410]">{item.name}</p>
                      <span className="text-xs bg-[#F2ECE5] text-[#7A5C4E] px-2 py-0.5 rounded-full shrink-0">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#8A7468] truncate">{item.description}</p>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-xs text-[#8A7468]">📍 {item.local}</p>
                    <p className="text-xs text-[#8A7468]">{item.floor}</p>
                  </div>
                  <div className="text-right shrink-0 hidden md:block">
                    <p className="text-xs text-[#8A7468]">{item.hours}</p>
                    <p className="text-xs text-[#8A7468]">{item.phone}</p>
                  </div>
                  {item.type === "Tienda" && (
                    <svg className="text-[#C1440E] shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────────────────

function ContactPage() {
  const [form, setForm] = useState({ nombre: "", correo: "", asunto: "", mensaje: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="bg-white border-b border-[#E0D5CC]">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1
            className="text-4xl text-[#1C1410] mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Contacto
          </h1>
          <p className="text-[#8A7468]">Estamos aquí para ayudarte</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2
              className="text-2xl text-[#1C1410] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Información de Contacto
            </h2>
            <div className="space-y-5 mb-8">
              {[
                {
                  icon: "📍",
                  title: "Dirección",
                  lines: [
                    "Calz. de la Viga s/n esq. Av. Javier Rojo Gómez",
                    "Col. Agrícola Pantitlán, Iztapalapa",
                    "CDMX C.P. 08100",
                    "*(Datos de demostración)",
                  ],
                },
                {
                  icon: "🕐",
                  title: "Horarios de Atención",
                  lines: ["Lunes a Domingo: 10:00 – 21:00", "Walmart: 07:00 – 22:00", "Cinépolis: 10:00 – 23:30"],
                },
                {
                  icon: "📞",
                  title: "Teléfonos",

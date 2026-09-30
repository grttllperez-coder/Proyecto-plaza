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

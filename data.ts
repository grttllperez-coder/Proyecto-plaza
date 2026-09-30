export type Category =
  | "moda"
  | "restaurantes"
  | "tecnologia"
  | "entretenimiento"
  | "belleza"
  | "servicios"
  | "hogar"
  | "supermercado";

export const categoryLabels: Record<Category, string> = {
  moda: "Moda",
  restaurantes: "Restaurantes",
  tecnologia: "Tecnología",
  entretenimiento: "Entretenimiento",
  belleza: "Belleza",
  servicios: "Servicios",
  hogar: "Hogar",
  supermercado: "Supermercado",
};

export const categoryColors: Record<Category, string> = {
  moda: "#E05520",
  restaurantes: "#D4432B",
  tecnologia: "#2D6BE4",
  entretenimiento: "#8B3DC4",
  belleza: "#D4638A",
  servicios: "#2D9E6E",
  hogar: "#B87333",
  supermercado: "#4E9E38",
};

export const categoryIcons: Record<Category, string> = {
  moda: "👗",
  restaurantes: "🍽️",
  tecnologia: "💻",
  entretenimiento: "🎬",
  belleza: "💄",
  servicios: "🏦",
  hogar: "🏠",
  supermercado: "🛒",
};

export type Store = {
  id: string;
  name: string;
  category: Category;
  description: string;
  local: string;
  floor: "Planta Baja" | "Planta Alta";
  image: string;
  gallery: string[];
  hours: string;
  phone: string;
  website?: string;
  tags: string[];
  mapX: number;
  mapY: number;
  featured: boolean;
};

export type Promotion = {
  id: string;
  title: string;
  storeId: string;
  storeName: string;
  category: Category;
  description: string;
  discount: string;
  validUntil: string;
  image: string;
  terms: string;
};

export type LocalSpace = {
  id: string;
  code: string;
  area: number;
  dimensions: string;
  floor: "Planta Baja" | "Planta Alta";
  zone: string;
  features: string[];
  price: string;
  status: "disponible" | "en-negociacion" | "ocupado";
  image: string;
  gallery: string[];
  description: string;
  mapX: number;
  mapY: number;
};

export type Restaurant = {
  id: string;
  name: string;
  subcategory: string;
  description: string;
  local: string;
  floor: "Planta Baja" | "Planta Alta";
  image: string;
  hours: string;
  phone: string;
  priceRange: "$" | "$$" | "$$$";
  tags: string[];
  featured: boolean;
};

export type ServiceItem = {
  id: string;
  name: string;
  subcategory: string;
  description: string;
  local: string;
  floor: "Planta Baja" | "Planta Alta";
  image: string;
  hours: string;
  phone: string;
  tags: string[];
};

export const stores: Store[] = [
  {
    id: "zara",
    name: "Zara",
    category: "moda",
    description: "Moda de tendencia para mujer, hombre y niños. Las últimas colecciones de la temporada con estilos que van desde lo casual hasta lo formal.",
    local: "Local A-12",
    floor: "Planta Alta",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=400&fit=crop&auto=format",
    ],
    hours: "Lun–Dom 11:00–21:00",
    phone: "55 5678 9012",
    website: "zara.com",
    tags: ["Ropa", "Mujer", "Hombre", "Niños", "Accesorios"],
    mapX: 580,
    mapY: 80,
    featured: true,
  },
  {
    id: "hm",
    name: "H&M",
    category: "moda",
    description: "Moda asequible y sustentable para toda la familia. Colecciones actuales, básicos atemporales y ediciones limitadas.",
    local: "Local A-08",
    floor: "Planta Alta",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format",
    ],
    hours: "Lun–Dom 11:00–21:00",
    phone: "55 5234 5678",
    website: "hm.com",
    tags: ["Ropa", "Básicos", "Sustentable", "Familia"],
    mapX: 480,
    mapY: 80,
    featured: true,
  },
  {
    id: "nike",
    name: "Nike",
    category: "moda",
    description: "Calzado, ropa y accesorios deportivos de la marca más icónica del mundo. Just Do It.",
    local: "Local A-15",
    floor: "Planta Alta",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=400&fit=crop&auto=format",
    ],
    hours: "Lun–Dom 11:00–21:00",
    phone: "55 5876 5432",
    website: "nike.com",
    tags: ["Deporte", "Calzado", "Ropa deportiva"],
    mapX: 680,
    mapY: 80,
    featured: true,
  },
  {
    id: "samsung",
    name: "Samsung Store",
    category: "tecnologia",
    description: "Smartphones, tablets, wearables y electrodomésticos Samsung. Experimenta la innovación de la mano de los expertos.",
    local: "Local B-04",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=400&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&auto=format",
    ],
    hours: "Lun–Dom 11:00–21:00",
    phone: "55 5987 6543",
    website: "samsung.com/mx",
    tags: ["Smartphones", "Tablets", "Wearables", "Smart TV"],
    mapX: 200,
    mapY: 150,
    featured: true,
  },
  {
    id: "liverpool",
    name: "Liverpool",
    category: "moda",
    description: "La tienda departamental más importante de México. Moda, hogar, electrónica y mucho más en un solo lugar.",
    local: "Local D-01",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&h=400&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=400&fit=crop&auto=format",
    ],
    hours: "Lun–Dom 10:00–21:00",
    phone: "55 5134 5500",
    website: "liverpool.com.mx",
    tags: ["Departamental", "Moda", "Hogar", "Electrónica", "Meses sin intereses"],
    mapX: 80,
    mapY: 250,
    featured: true,
  },
  {
    id: "cinepolis",
    name: "Cinépolis",
    category: "entretenimiento",
    description: "La cadena de cines más importante de México. Disfruta los últimos estrenos en salas con la mejor tecnología de proyección y sonido.",
    local: "Nivel 3 – Zona Norte",
    floor: "Planta Alta",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=600&h=400&fit=crop&auto=format",
    ],
    hours: "Lun–Dom 10:00–23:30",
    phone: "55 5071 8870",
    website: "cinepolis.com",
    tags: ["Cine", "IMAX", "4DX", "Estrenos", "Snacks"],
    mapX: 400,
    mapY: 80,
    featured: true,
  },
  {
    id: "mac",
    name: "MAC Cosmetics",
    category: "belleza",
    description: "Cosméticos profesionales de alta calidad. Maquillaje, cuidado de la piel y fragancias para todos los tonos y estilos.",
    local: "Local B-12",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=400&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&auto=format",
    ],
    hours: "Lun–Dom 11:00–21:00",
    phone: "55 5234 8765",
    website: "maccosmetics.com.mx",
    tags: ["Maquillaje", "Labiales", "Fundaciones", "Profesional"],
    mapX: 680,
    mapY: 250,
    featured: false,
  },
  {
    id: "sears",
    name: "Sears",
    category: "hogar",
    description: "Muebles, electrodomésticos, electrónica y artículos del hogar con las mejores marcas y facilidades de pago.",
    local: "Local E-01",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&h=400&fit=crop&auto=format",
    ],
    hours: "Lun–Dom 10:00–21:00",
    phone: "55 5512 7890",
    website: "sears.com.mx",
    tags: ["Electrodomésticos", "Muebles", "Electrónica", "Hogar"],
    mapX: 80,
    mapY: 350,
    featured: false,
  },
  {
    id: "pullbear",
    name: "Pull&Bear",
    category: "moda",
    description: "Moda urbana y casual para jóvenes. Ropa, calzado y accesorios con actitud street para el día a día.",
    local: "Local A-20",
    floor: "Planta Alta",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=400&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=600&h=400&fit=crop&auto=format",
    ],
    hours: "Lun–Dom 11:00–21:00",
    phone: "55 5876 2345",
    tags: ["Casual", "Urbano", "Jóvenes", "Street Style"],
    mapX: 330,
    mapY: 80,
    featured: false,
  },
  {
    id: "walmart",
    name: "Walmart Supercenter",
    category: "supermercado",
    description: "Supermercado completo con alimentos frescos, abarrotes, electrónica, ropa y más. Precios bajos garantizados todos los días.",
    local: "Local F-01",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=600&h=400&fit=crop&auto=format",
    ],
    hours: "Lun–Dom 07:00–22:00",
    phone: "55 5123 4567",
    website: "walmart.com.mx",
    tags: ["Abarrotes", "Frescos", "Electrónica", "Precios bajos"],
    mapX: 400,
    mapY: 380,
    featured: false,
  },
];

export const promotions: Promotion[] = [
  {
    id: "p1",
    title: "30% en toda la colección de temporada",
    storeId: "zara",
    storeName: "Zara",
    category: "moda",
    description: "Aprovecha hasta 30% de descuento en toda la colección otoño-invierno. Aplica en ropa, calzado y accesorios seleccionados.",
    discount: "30% OFF",
    validUntil: "2026-09-30",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format",
    terms: "Válido en artículos seleccionados con precio regular. No acumulable con otras promociones. Datos de demostración.",
  },
  {
    id: "p2",
    title: "2x1 en calzado selecto",
    storeId: "nike",
    storeName: "Nike",
    category: "moda",
    description: "Llévate dos pares de calzado deportivo al precio de uno en modelos seleccionados. ¡No dejes pasar esta oportunidad!",
    discount: "2x1",
    validUntil: "2026-09-15",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop&auto=format",
    terms: "Aplica en modelos seleccionados. El descuento se aplica al artículo de menor valor. Datos de demostración.",
  },
  {
    id: "p3",
    title: "Galaxy S25 + audífonos de regalo",
    storeId: "samsung",
    storeName: "Samsung Store",
    category: "tecnologia",
    description: "Compra cualquier Galaxy S25 y llévate los Galaxy Buds FE completamente gratis. Financiamiento disponible a 18 meses sin intereses.",
    discount: "REGALO",
    validUntil: "2026-09-20",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=400&fit=crop&auto=format",
    terms: "Un par de audífonos por compra de Galaxy S25. Sujeto a disponibilidad. Datos de demostración.",
  },
  {
    id: "p4",
    title: "Martes de cine 2x1",
    storeId: "cinepolis",
    storeName: "Cinépolis",
    category: "entretenimiento",
    description: "Todos los martes compra una entrada y la segunda es completamente gratis. Aplica en salas tradicionales y función regular.",
    discount: "2x1",
    validUntil: "2026-12-31",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop&auto=format",
    terms: "Solo martes. No aplica en salas VIP, IMAX o 4DX. No aplica en estrenos los primeros 7 días. Datos de demostración.",
  },
  {
    id: "p5",
    title: "40% en colección verano H&M",
    storeId: "hm",
    storeName: "H&M",
    category: "moda",
    description: "Gran liquidación de verano. Hasta 40% de descuento en ropa, accesorios de playa y mucho más de la colección primavera-verano.",
    discount: "40% OFF",
    validUntil: "2026-09-10",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop&auto=format",
    terms: "Solo artículos con etiqueta de liquidación. No aplica en colección nueva. Datos de demostración.",
  },
  {
    id: "p6",
    title: "18 meses sin intereses en Liverpool",
    storeId: "liverpool",
    storeName: "Liverpool",
    category: "moda",
    description: "Compras mayores a $3,000 en 18 meses sin intereses con tarjetas participantes. Aplica en toda la tienda.",
    discount: "18 MSI",
    validUntil: "2026-10-31",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&h=400&fit=crop&auto=format",
    terms: "Tarjetas bancarias participantes. Compra mínima $3,000. Datos de demostración.",
  },
  {
    id: "p7",
    title: "Kit de regalo en MAC Cosmetics",
    storeId: "mac",
    storeName: "MAC Cosmetics",
    category: "belleza",
    description: "Por compras mayores a $800 recibe un kit de muestras exclusivo con los más recientes lanzamientos de MAC.",
    discount: "GIFT",
    validUntil: "2026-09-25",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=400&fit=crop&auto=format",
    terms: "Un kit por compra calificada. Sujeto a disponibilidad. Datos de demostración.",
  },
  {
    id: "p8",
    title: "Descuento especial tarjeta Walmart",
    storeId: "walmart",
    storeName: "Walmart Supercenter",
    category: "supermercado",
    description: "5% de descuento adicional en toda tu compra pagando con tarjeta Walmart. Ahorra más en tu despensa mensual.",
    discount: "5% extra",
    validUntil: "2026-12-31",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop&auto=format",
    terms: "Solo con tarjeta de crédito o débito Walmart. Sin compra mínima. Datos de demostración.",
  },
];

export const localSpaces: LocalSpace[] = [
  {
    id: "l1",
    code: "A-05",
    area: 45,
    dimensions: "6m × 7.5m",
    floor: "Planta Alta",
    zone: "Zona Moda – Pasillo Norte",
    features: ["Alta afluencia de tráfico", "Frente al pasillo principal", "Instalaciones eléctricas", "Bodega incluida"],
    price: "Desde $35,000 MXN/mes",
    status: "disponible",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop&auto=format",
    ],
    description: "Excelente local en la zona de mayor afluencia de la Planta Alta. Ideal para moda, accesorios o calzado. Vista directa al pasillo principal con gran visibilidad.",
    mapX: 250,
    mapY: 80,
  },
  {
    id: "l2",
    code: "B-07",
    area: 80,
    dimensions: "8m × 10m",
    floor: "Planta Baja",
    zone: "Zona Central – Corredor Este",
    features: ["Doble frente", "Plomería instalada", "Extracción de humo", "Alta visibilidad"],
    price: "Desde $55,000 MXN/mes",
    status: "disponible",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&auto=format",
    ],
    description: "Local amplio en planta baja con doble frente. Apto para restaurante, servicios o retail especializado. Instalaciones completas para food service.",
    mapX: 680,
    mapY: 200,
  },
  {
    id: "l3",
    code: "C-03",
    area: 120,
    dimensions: "10m × 12m",
    floor: "Planta Baja",
    zone: "Zona Ancla – Corredor Central",
    features: ["Local esquina", "Alta visibilidad 360°", "Acceso por dos pasillos", "Bodega amplia 20m²"],
    price: "Desde $75,000 MXN/mes",
    status: "en-negociacion",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&auto=format",
    ],
    description: "Local esquina de grandes dimensiones en el corazón del centro comercial. Visibilidad excepcional, ideal para marca âncla o tienda departamental.",
    mapX: 300,
    mapY: 250,
  },
  {
    id: "l4",
    code: "D-02",
    area: 200,
    dimensions: "20m × 10m",
    floor: "Planta Baja",
    zone: "Zona Ancla – Entrada Norte",
    features: ["Frente a entrada principal", "Máximo tráfico", "Planta libre", "Instalaciones trifásicas"],
    price: "Consultar precio",
    status: "disponible",
    image: "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?w=600&h=400&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&auto=format",
    ],
    description: "Espacio de grandes dimensiones frente a la entrada principal norte. El local de mayor visibilidad del centro comercial. Ideal para marca âncla de alto tráfico.",
    mapX: 400,
    mapY: 30,
  },
  {
    id: "l5",
    code: "E-03",
    area: 35,
    dimensions: "5m × 7m",
    floor: "Planta Alta",
    zone: "Zona Belleza – Pasillo Sur",
    features: ["Junto a MAC y perfumerías", "Clientela especializada", "Instalación eléctrica reforzada"],
    price: "Desde $25,000 MXN/mes",
    status: "disponible",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&auto=format",
    gallery: [],
    description: "Local compacto en la zona de belleza y cuidado personal. Perfecto para spa, estética, joyería fina o accesorios de lujo.",
    mapX: 680,
    mapY: 300,
  },
  {
    id: "l6",
    code: "F-02",
    area: 160,
    dimensions: "16m × 10m",
    floor: "Planta Baja",
    zone: "Food Court – Zona Sur",
    features: ["En plaza de comida", "Plomería y extracción incluidas", "Frente a area de mesas", "Alta rotación de clientes"],
    price: "Desde $85,000 MXN/mes",
    status: "disponible",
    image: "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=600&h=400&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&h=400&fit=crop&auto=format",
    ],
    description: "Excelente local en la plaza de comida con frente directo al área de mesas. Instalaciones completas para operación de restaurante o cadena de comida.",
    mapX: 500,
    mapY: 380,
  },
];

export const restaurants: Restaurant[] = [
  {
    id: "r1",
    name: "Vips",
    subcategory: "Restaurante Familiar",
    description: "El restaurante familiar más querido de México. Desayunos, comidas y cenas con el menú clásico que todos amamos.",
    local: "Local C-01",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1700625916627-16ad4fb0553c?w=600&h=400&fit=crop&auto=format",
    hours: "Lun–Dom 07:00–22:00",
    phone: "55 5278 3300",
    priceRange: "$$",
    tags: ["Familiar", "Desayunos", "Comida mexicana", "Americano"],
    featured: true,
  },
  {
    id: "r2",
    name: "McDonald's",
    subcategory: "Comida Rápida",
    description: "Las hamburguesas, papas fritas y Happy Meals favoritos de todos. También disponible McCafé para tu café perfecto.",
    local: "Food Court – FC-01",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1619454016518-697bc231e7cb?w=600&h=400&fit=crop&auto=format",
    hours: "Lun–Dom 08:00–22:00",
    phone: "55 5800 0022",
    priceRange: "$",
    tags: ["Hamburguesas", "Papas fritas", "McCafé", "Rápido"],
    featured: true,
  },
  {
    id: "r3",
    name: "Sushi Roll",
    subcategory: "Comida Japonesa",
    description: "La cadena de sushi más popular de México. Rolls creativos, sashimi fresco y opciones para todos los gustos.",
    local: "Local C-05",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&h=400&fit=crop&auto=format",
    hours: "Lun–Dom 11:00–21:30",
    phone: "55 5678 9999",
    priceRange: "$$",
    tags: ["Sushi", "Japonesa", "Rolls", "Fresco"],
    featured: true,
  },
  {
    id: "r4",
    name: "KFC",
    subcategory: "Comida Rápida",
    description: "El pollo crujiente más famoso del mundo. Combos, cubo familiar y el legendario Original Recipe de KFC.",
    local: "Food Court – FC-03",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&h=400&fit=crop&auto=format",
    hours: "Lun–Dom 10:00–22:00",
    phone: "55 5800 5532",
    priceRange: "$",
    tags: ["Pollo", "Combos", "Familiar", "Crujiente"],
    featured: false,
  },
  {
    id: "r5",
    name: "Domino's Pizza",
    subcategory: "Pizzería",
    description: "Pizzas artesanales con los mejores ingredientes. Para comer en el lugar o llevarte a casa. Orden también en línea.",
    local: "Local C-07",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop&auto=format",
    hours: "Lun–Dom 10:00–23:00",
    phone: "55 5998 7000",
    priceRange: "$",
    tags: ["Pizza", "Italiana", "Para llevar", "Rápido"],
    featured: false,
  },
  {
    id: "r6",
    name: "El Portón",
    subcategory: "Comida Mexicana",
    description: "Auténtica cocina mexicana en un ambiente relajado. Antojitos, carnes asadas y los mejores mezcales de la casa.",
    local: "Local C-09",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1625166913168-9135c6ffddcb?w=600&h=400&fit=crop&auto=format",
    hours: "Lun–Dom 12:00–22:00",
    phone: "55 5345 6789",
    priceRange: "$$",
    tags: ["Mexicana", "Tacos", "Antojitos", "Mezcal"],
    featured: true,
  },
];

export const services: ServiceItem[] = [
  {
    id: "s1",
    name: "BBVA Bancomer",
    subcategory: "Banco y Cajeros",
    description: "Sucursal bancaria completa y cajeros automáticos disponibles 24/7. Atención personalizada de lunes a sábado.",
    local: "Local G-01",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=600&h=400&fit=crop&auto=format",
    hours: "Lun–Vie 09:00–17:00 | Cajeros 24hrs",
    phone: "55 5226 2663",
    tags: ["Banco", "Cajero", "Transferencias", "Créditos"],
  },
  {
    id: "s2",
    name: "Farmacias del Ahorro",
    subcategory: "Farmacia",
    description: "Medicamentos, vitaminas, productos de cuidado personal y consulta médica a bajo costo. Servicio a domicilio disponible.",
    local: "Local G-03",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=400&fit=crop&auto=format",
    hours: "Lun–Dom 08:00–22:00",
    phone: "55 5078 0000",
    tags: ["Medicamentos", "Farmacia", "Consulta médica", "Vitaminas"],
  },
  {
    id: "s3",
    name: "Telcel Centro de Atención",
    subcategory: "Telecomunicaciones",
    description: "Compra de equipos, planes de telefonía, recargas y atención al cliente Telcel. Todos los planes disponibles.",
    local: "Local B-02",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&h=400&fit=crop&auto=format",
    hours: "Lun–Dom 11:00–21:00",
    phone: "800 123 2020",
    tags: ["Celulares", "Planes", "Internet", "Recargas"],
  },
  {
    id: "s4",
    name: "Kumon Centro de Aprendizaje",
    subcategory: "Educación",
    description: "Método educativo japonés para desarrollar capacidades matemáticas y de lecto-escritura en niños y jóvenes.",
    local: "Local H-05",
    floor: "Planta Alta",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop&auto=format",
    hours: "Lun–Vie 15:00–20:00 | Sáb 10:00–14:00",
    phone: "55 5890 1234",
    tags: ["Educación", "Matemáticas", "Niños", "Lectura"],
  },
  {
    id: "s5",
    name: "Óptica Devlyn",
    subcategory: "Óptica y Salud Visual",
    description: "Exámenes de la vista, armazones, lentes de contacto y lentes de sol con las mejores marcas del mercado.",
    local: "Local G-07",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1607116782093-e6bd84e49932?w=600&h=400&fit=crop&auto=format",
    hours: "Lun–Dom 11:00–21:00",
    phone: "55 5345 9000",
    tags: ["Óptica", "Lentes", "Examen visual", "Salud visual"],
  },
  {
    id: "s6",
    name: "Estacionamiento Parque Tezontle",
    subcategory: "Estacionamiento",
    description: "Amplio estacionamiento techado con capacidad para más de 2,000 vehículos. Vigilancia 24/7 y acceso con ticket o tarjeta.",
    local: "Sótano y Exterior",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&h=400&fit=crop&auto=format",
    hours: "Lun–Dom 07:00–23:00",
    phone: "55 5678 1111",
    tags: ["Estacionamiento", "Seguridad", "24/7", "Techado"],
  },
  {
    id: "s7",
    name: "Salón Élite – Estética",
    subcategory: "Belleza y Estética",
    description: "Cortes, coloración, tratamientos capilares, uñas y maquillaje. Reservaciones disponibles en línea y por teléfono.",
    local: "Local B-18",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1560066984-138daaa5b620?w=600&h=400&fit=crop&auto=format",
    hours: "Lun–Sáb 10:00–20:00 | Dom 10:00–18:00",
    phone: "55 5780 2345",
    tags: ["Estética", "Cortes", "Coloración", "Uñas", "Maquillaje"],
  },
  {
    id: "s8",
    name: "Coppel",
    subcategory: "Crédito y Servicios Financieros",
    description: "Muebles, electrónica y ropa con crédito inmediato. Paga en parcialidades cómodas sin necesidad de tarjeta bancaria.",
    local: "Local F-05",
    floor: "Planta Baja",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&auto=format",
    hours: "Lun–Dom 10:00–21:00",
    phone: "800 800 2673",
    tags: ["Crédito", "Muebles", "Electrónica", "Ropa"],
  },
];

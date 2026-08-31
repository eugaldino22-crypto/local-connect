import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { cities } from "@/data/catalog";
import { distanceBetween } from "@/lib/format";
import type { CartItem, City } from "@/types";

export type LocationStatus =
  | "idle"
  | "loading"
  | "granted"
  | "denied"
  | "unsupported"
  | "unserved"
  | "manual";

type AppState = {
  /** Localização */
  locationStatus: LocationStatus;
  city: City | null;
  requestLocation: () => void;
  selectCity: (city: City) => void;
  /** Carrinho */
  cart: CartItem[];
  cartMerchantId: string | null;
  addToCart: (item: Omit<CartItem, "id">) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  /** Favoritos */
  favorites: string[];
  toggleFavorite: (key: string) => void;
  isFavorite: (key: string) => boolean;
};

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = "vitrine-local:state";
const MAX_DISTANCE_KM = 80;

type Persisted = {
  cityId?: string | null;
  cart?: CartItem[];
  favorites?: string[];
};

function readPersisted(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Persisted) : {};
  } catch {
    return {};
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [city, setCity] = useState<City | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hidratação a partir do armazenamento local (nunca no primeiro render/SSR).
  useEffect(() => {
    const saved = readPersisted();
    if (saved.cityId) {
      const found = cities.find((c) => c.id === saved.cityId);
      if (found) {
        setCity(found);
        setLocationStatus("manual");
      }
    }
    if (saved.cart) setCart(saved.cart);
    if (saved.favorites) setFavorites(saved.favorites);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: Persisted = { cityId: city?.id ?? null, cart, favorites };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* armazenamento indisponível */
    }
  }, [hydrated, city, cart, favorites]);

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const served = cities.filter((c) => c.served);
        let nearest: { city: City; km: number } | null = null;
        for (const candidate of served) {
          const km = distanceBetween(
            { latitude: coords.latitude, longitude: coords.longitude },
            candidate,
          );
          if (!nearest || km < nearest.km) nearest = { city: candidate, km };
        }
        if (nearest && nearest.km <= MAX_DISTANCE_KM) {
          setCity(nearest.city);
          setLocationStatus("granted");
        } else {
          setCity(null);
          setLocationStatus("unserved");
        }
      },
      () => setLocationStatus("denied"),
      { timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  const selectCity = useCallback((next: City) => {
    setCity(next);
    setLocationStatus("manual");
  }, []);

  const addToCart = useCallback((item: Omit<CartItem, "id">) => {
    setCart((prev) => {
      const differentMerchant =
        prev.length > 0 && prev[0]?.merchantId !== item.merchantId;
      const base = differentMerchant ? [] : prev;
      const signature = (i: Omit<CartItem, "id">) =>
        `${i.productId}|${i.options.map((o) => o.choiceId).sort().join(",")}|${i.note ?? ""}`;
      const existing = base.find((i) => signature(i) === signature(item));
      if (existing) {
        return base.map((i) =>
          i.id === existing.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [
        ...base,
        { ...item, id: `${item.productId}-${Date.now().toString(36)}` },
      ];
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== itemId)
        : prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
    );
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((key: string) => {
    setFavorites((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }, []);

  const value = useMemo<AppState>(() => {
    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    const cartSubtotal = cart.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0,
    );
    return {
      locationStatus,
      city,
      requestLocation,
      selectCity,
      cart,
      cartMerchantId: cart[0]?.merchantId ?? null,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartSubtotal,
      favorites,
      toggleFavorite,
      isFavorite: (key: string) => favorites.includes(key),
    };
  }, [
    locationStatus,
    city,
    requestLocation,
    selectCity,
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    favorites,
    toggleFavorite,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp deve ser usado dentro de AppProvider");
  return ctx;
}

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";

interface PWAContextType {
  isOffline: boolean;
  canUpdate: boolean;
  updateInfo: string | null;
  update: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

interface PWAProviderProps {
  children: ReactNode;
}

const VERSION_KEY = "app-version";
const VERSION_CHECK_INTERVAL = 30000;

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [canUpdate, setCanUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<string | null>(null);
  const currentBuildId = useRef<string | null>(null);

  // === Version management ===
  const getStoredVersion = (): string | null => {
    try {
      return localStorage.getItem(VERSION_KEY);
    } catch {
      return null;
    }
  };

  const updateStoredVersion = (version: string) => {
    try {
      localStorage.setItem(VERSION_KEY, version);
    } catch (e) {
      console.warn("[PWA] Failed to save version", e);
    }
  };

  const checkForUpdates = async () => {
    try {
      const response = await fetch("/_next/static/version.json", { cache: "no-store" });
      const { buildId } = await response.json();

      const storedBuildId = getStoredVersion();

      if (!currentBuildId.current) {
        currentBuildId.current = buildId;
        if (!storedBuildId) updateStoredVersion(buildId);
      } else if (buildId !== storedBuildId) {
        setCanUpdate(true);
        setUpdateInfo(buildId);
      }
    } catch (err) {
      console.warn("[PWA] Failed to fetch version", err);
    }
  };

  const update = () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((reg) => reg.unregister());
      if (updateInfo) updateStoredVersion(updateInfo);
      window.location.reload();
    });
  };

  // === Asset caching ===
  const cacheAssets = async (urlsToCache: string[]) => {
    try {
      const cache = await caches.open("dynamic-next-assets");
      await Promise.all(
        urlsToCache.map(async (url) => {
          const match = await cache.match(url);
          if (!match) await cache.add(url);
        })
      );
      console.log("[PWA] Assets cached");
    } catch (err) {
      console.warn("[PWA] Caching failed", err);
    }
  };

  // === Offline detection ===
  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // === SW registration & caching ===
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[SW] Registered");

          setTimeout(() => {
            const urlsToCache = Array.from(
              document.querySelectorAll("link[href], script[src]")
            )
              .map((el) => el.getAttribute("href") || el.getAttribute("src"))
              .filter(
                (src): src is string =>
                  !!src &&
                  (src.startsWith("/_next/") ||
                    src.includes("fonts") ||
                    src.includes(".css"))
              )
              .map((src) => new URL(src, location.origin).href);

            if (registration.active) {
              registration.active.postMessage({
                type: "CACHE_URLS",
                payload: urlsToCache,
              });
            }

            cacheAssets(urlsToCache);
          }, 2000);
        })
        .catch((err) => console.error("[SW] Registration failed", err));
    }

    checkForUpdates();
    const interval = setInterval(checkForUpdates, VERSION_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <PWAContext.Provider
      value={{
        isOffline,
        canUpdate,
        updateInfo,
        update,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = (): PWAContextType => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error("usePWA must be used within a PWAProvider");
  }
  return context;
};

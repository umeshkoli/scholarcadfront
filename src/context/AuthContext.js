import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { API_BASE_URL, APIENDPOINTS } from "../../apiconfig";
const AuthContext = createContext();
import Cookies from "js-cookie";

export const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  try {
    // 1. Search for any key starting with "twl_token"
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.toLowerCase().startsWith("twl_token")) {
        const val = localStorage.getItem(key);
        if (val && typeof val === "string" && val.trim().length > 10) {
          return val.trim();
        }
      }
    }
    // 2. Also check if key contains "twl_token" anywhere
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.toLowerCase().includes("twl_token")) {
        const val = localStorage.getItem(key);
        if (val && typeof val === "string" && val.trim().length > 10) {
          return val.trim();
        }
      }
    }
    // 3. Fallbacks
    const fallback =
      localStorage.getItem("access_token") ||
      localStorage.getItem("token") ||
      Cookies.get("access_token") ||
      null;
    return fallback ? String(fallback).trim() : null;
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      return getStoredToken();
    }
    return null;
  });
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !getStoredToken();
    }
    return true;
  });
  const [categories, setCategories] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [user, setUser] = useState(null);
  const [countryLists, setcoutryLists] = useState([]);
  const [promoList, setPromoList] = useState(null);

  const active_country = useMemo(() => {
    return userLocation?.raw?.country?.toLowerCase() || "in";
  }, [userLocation]);

  const DEFAULT_EMAIL = process.env.NEXT_PUBLIC_AUTH_EMAIL || "koli.umesh@gmail.com";
  const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_AUTH_PASSWORD || "Radha@Rani26";

  const loginUser = async (email = DEFAULT_EMAIL, password = DEFAULT_PASSWORD) => {
    try {
      setLoading(true);
      let res = null;
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
        };
        const xsrfToken = Cookies.get("XSRF-TOKEN");
        if (xsrfToken) {
          headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
        }

        res = await fetch(`${API_BASE_URL}${APIENDPOINTS.LOGIN}`, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        });

        // If CSRF mismatch (419), fetch /login once to capture session & XSRF cookie, then retry
        if (res && res.status === 419 && typeof window !== "undefined") {
          try {
            await fetch(`${API_BASE_URL}/login`, {
              method: "GET",
              credentials: "include",
            });
            const refreshedXsrf = Cookies.get("XSRF-TOKEN");
            if (refreshedXsrf) {
              headers["X-XSRF-TOKEN"] = decodeURIComponent(refreshedXsrf);
            }
            res = await fetch(`${API_BASE_URL}${APIENDPOINTS.LOGIN}`, {
              method: "POST",
              headers,
              credentials: "include",
              body: JSON.stringify({
                email,
                password,
              }),
            });
          } catch (csrfErr) {}
        }
      } catch (fetchErr) {
        console.warn("Login fetch network warning:", fetchErr?.message || fetchErr);
        return { success: false, error: fetchErr?.message || "Failed to fetch" };
      }

      if (!res || !res.ok) {
        const errorMsg = res
          ? `Login failed with status: ${res.status}`
          : "Network error: Unable to reach API server";
        console.warn(errorMsg);
        return { success: false, error: errorMsg };
      }
      const contentType = res?.headers?.get("content-type");

      if (contentType?.includes("application/json")) {
        const data = await res.json();
        const authToken = data?.token || data?.access_token || data?.data?.token;
        if (authToken) {
          const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
          Cookies.set("access_token", authToken, {
            expires: 7,
            secure: isHttps,
            sameSite: "Lax",
          });
          try {
            localStorage.setItem("twl_token", authToken);
            localStorage.setItem("twl_token_admin", authToken);
            localStorage.setItem("access_token", authToken);
          } catch (e) { }
          setToken(authToken);
          if (data?.user) {
            setUser(data.user);
            try {
              localStorage.setItem("auth_user", JSON.stringify(data.user));
            } catch (e) { }
          }
          return { success: true, user: data?.user, token: authToken };
        } else {
          console.warn("No access_token or token found in response", data);
          return { success: false, message: data?.message || "No token returned" };
        }
      }
      return { success: false, message: "Invalid response format" };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    Cookies.remove("access_token");
    try {
      localStorage.removeItem("twl_token");
      localStorage.removeItem("twl_token_admin");
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth_user");
    } catch (e) { }
    setToken(null);
    setUser(null);
  };

  // Sync state from cookies / storage after mount & only login if no token exists
  useEffect(() => {
    try {
      const savedCategories = localStorage.getItem("categories");
      if (savedCategories) setCategories(JSON.parse(savedCategories));
    } catch (e) { }

    try {
      const savedUser = localStorage.getItem("auth_user");
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (e) { }

    try {
      const savedLocation = sessionStorage.getItem("userLocation");
      if (savedLocation) setUserLocation(JSON.parse(savedLocation));
    } catch (e) { }

    try {
      const savedCountries = localStorage.getItem("country_lists");
      if (savedCountries) setcoutryLists(JSON.parse(savedCountries));
    } catch (e) { }

    try {
      const savedPromo = sessionStorage.getItem("promo_list");
      if (savedPromo) setPromoList(JSON.parse(savedPromo));
    } catch (e) { }

    const savedToken = getStoredToken();
    if (savedToken) {
      setToken(savedToken);
      setLoading(false);
    } else {
      loginUser();
    }
  }, []);

  // Fetch categories once token is ready
  useEffect(() => {
    let isCancelled = false;

    const fetchCategories = async (authToken = token, isRetry = false) => {
      if (!authToken) return;
      // Stale-while-revalidate: initial state is loaded from localStorage,
      // and background fetch refreshes course data and image URLs seamlessly.

      try {
        const res = await fetch(
          `${API_BASE_URL}${APIENDPOINTS.COURSE_CATEGORIES}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              country_id: active_country,
            }),
          },
        );

        // If rate-limited (429), gracefully abort without looping
        if (res.status === 429) {
          console.warn("Categories API rate-limited (429). Using cached data.");
          return;
        }

        // Handle expired or invalid token by refreshing and retrying once
        if (res.status === 401 && !isRetry) {
          console.warn(
            "Categories API returned 401 (token invalid or expired). Refreshing session..."
          );
          Cookies.remove("access_token");
          const loginRes = await loginUser();
          if (loginRes?.success && loginRes?.token && !isCancelled) {
            return fetchCategories(loginRes.token, true);
          }
          return;
        }

        if (!res.ok) {
          console.warn(`Categories API request returned status: ${res.status}`);
          return;
        }

        const data = await res.json();
        if (data?.data && Array.isArray(data.data) && !isCancelled) {
          setCategories(data.data);
          try {
            localStorage.setItem("categories", JSON.stringify(data.data));
          } catch (e) { }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();

    return () => {
      isCancelled = true;
    };
  }, [token, active_country]);

  useEffect(() => {
    if (!token) return;
    // Skip network request if already cached
    try {
      const saved = localStorage.getItem("country_lists");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (countryLists.length === 0) setcoutryLists(parsed);
          return;
        }
      }
    } catch (e) { }

    let isCancelled = false;
    const timer = setTimeout(() => {
      const FetchCountryList = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.COUNTRY_LIST}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.status === 401 || res.status === 429 || !res.ok) {
            return;
          }
          const data = await res.json();
          if (!isCancelled && data?.data) {
            setcoutryLists(data.data);
            try {
              localStorage.setItem("country_lists", JSON.stringify(data.data));
            } catch (e) { }
          }
        } catch (err) {
          console.error("Error fetching CountryList:", err);
        }
      };
      FetchCountryList();
    }, 150);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;
    // Skip network request if already checked/cached in session (even if empty/404)
    try {
      const saved = sessionStorage.getItem("promo_list");
      if (saved !== null) {
        if (promoList === null) setPromoList(JSON.parse(saved));
        return;
      }
    } catch (e) { }

    let isCancelled = false;
    const timer = setTimeout(() => {
      const Fetchpromo = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.PROMO_LIST}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.status === 401 || res.status === 429) {
            return;
          }
          if (!res.ok) {
            // Cache empty array on 404 so we don't re-hit a missing route on every page load
            setPromoList([]);
            try {
              sessionStorage.setItem("promo_list", "[]");
            } catch (e) { }
            return;
          }
          const data = await res.json();
          const list = Array.isArray(data?.data) ? data.data : [];
          if (!isCancelled) {
            setPromoList(list);
            try {
              sessionStorage.setItem("promo_list", JSON.stringify(list));
            } catch (e) { }
          }
        } catch (err) {
          console.error("Error fetching promoList:", err);
        }
      };
      Fetchpromo();
    }, 300);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login: loginUser,
        logout: logoutUser,
        categories,
        countryLists,
        promoList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { API_BASE_URL, APIENDPOINTS } from "../../apiconfig";
const AuthContext = createContext();
import Cookies from "js-cookie";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [user, setUser] = useState(null);
  const [countryLists, setcoutryLists] = useState([]);
  const [promoList, setPromoList] = useState(null);

  const active_country = useMemo(() => {
    return userLocation?.raw?.country?.toLowerCase() || "in";
  }, [userLocation]);

  // Sync state from cookies / storage after mount to prevent SSR hydration mismatch
  useEffect(() => {
    const savedToken = Cookies.get("access_token") || null;
    setToken(savedToken);
    setLoading(false);

    try {
      const savedCategories = localStorage.getItem("categories");
      if (savedCategories) setCategories(JSON.parse(savedCategories));
    } catch (e) {}

    try {
      const savedUser = localStorage.getItem("auth_user");
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (e) {}

    try {
      const savedLocation = sessionStorage.getItem("userLocation");
      if (savedLocation) setUserLocation(JSON.parse(savedLocation));
    } catch (e) {}

    try {
      const savedCountries = localStorage.getItem("country_lists");
      if (savedCountries) setcoutryLists(JSON.parse(savedCountries));
    } catch (e) {}

    try {
      const savedPromo = sessionStorage.getItem("promo_list");
      if (savedPromo) setPromoList(JSON.parse(savedPromo));
    } catch (e) {}
  }, []);

  const DEFAULT_EMAIL = process.env.NEXT_PUBLIC_AUTH_EMAIL || "admin@hotelres.com";
  const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_AUTH_PASSWORD || "12345678";

  const loginUser = async (email = DEFAULT_EMAIL, password = DEFAULT_PASSWORD) => {
    try {
      setLoading(true);
      let res = null;
      try {
        res = await fetch(`${API_BASE_URL}${APIENDPOINTS.LOGIN}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
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
            expires: 1,
            secure: isHttps,
            sameSite: "Lax",
          });
          setToken(authToken);
          if (data?.user) {
            setUser(data.user);
            try {
              localStorage.setItem("auth_user", JSON.stringify(data.user));
            } catch (e) {}
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
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("auth_user");
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (!token) {
      loginUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch categories once token is ready
  useEffect(() => {
    let isCancelled = false;

    const fetchCategories = async (authToken = token, isRetry = false) => {
      if (!authToken) return;
      // Skip fetch if categories already cached in memory or localStorage
      try {
        const cached = localStorage.getItem("categories");
        if (cached && categories.length > 0 && !isRetry) {
          return;
        }
      } catch (e) {}

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
          } catch (e) {}
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
    if (countryLists && countryLists.length > 0) return;

    let isCancelled = false;
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
        if (res.status === 401 || res.status === 429) {
          return;
        }
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        if (!isCancelled && data?.data) {
          setcoutryLists(data.data);
          try {
            localStorage.setItem("country_lists", JSON.stringify(data.data));
          } catch (e) {}
        }
      } catch (err) {
        console.error("Error fetching CountryList:", err);
      }
    };
    FetchCountryList();
    return () => {
      isCancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;
    // Skip network request if already cached in session
    if (promoList && promoList.length > 0) return;

    let isCancelled = false;
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
          console.warn("HTTP error! Status:", res.status);
          return;
        }
        const data = await res.json();
        if (!isCancelled && data?.data?.length > 0) {
          setPromoList(data.data);
          try {
            sessionStorage.setItem("promo_list", JSON.stringify(data.data));
          } catch (e) {}
        }
      } catch (err) {
        console.error("Error fetching promoList:", err);
      }
    };
    Fetchpromo();
    return () => {
      isCancelled = true;
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

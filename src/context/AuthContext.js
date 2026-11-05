import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { API_BASE_URL, APIENDPOINTS } from "../../apiconfig";
const AuthContext = createContext();
import Cookies from "js-cookie";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      return Cookies.get("access_token") || null;
    }
    return null;
  });
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !Cookies.get("access_token");
    }
    return false;
  });
  const [categories, setCategories] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("categories");
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });
   const [userLocation, setUserLocation] = useState(null);
    useEffect(() => {
      const saved = sessionStorage.getItem("userLocation");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUserLocation(parsed);
        } catch (e) {
          console.error(" Failed to parse userLocation JSON", e);
        }
      }
    }, []);
  
  const active_country = useMemo(() => {
    return userLocation?.raw?.country.toLowerCase() || "in";
  }, [userLocation]);

  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("auth_user");
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const DEFAULT_EMAIL = process.env.NEXT_PUBLIC_AUTH_EMAIL || "admin@hotelres.com";
  const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_AUTH_PASSWORD || "12345678";

  const loginUser = async (email = DEFAULT_EMAIL, password = DEFAULT_PASSWORD) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }).catch((err) => {
        console.error("Login fetch error:", err);
        return null;
      });

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

  const [countryLists, setcoutryLists] = useState([]);
  useEffect(() => {
    if (!token) return;
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
        if (res.status === 401) {
          return;
        }
        if (!res.ok) {
          setcoutryLists([]);
          return;
        }
        const data = await res.json();
        if (!isCancelled) {
          setcoutryLists(data?.data || []);
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

  const [promoList, setPromoList] = useState(null);
  useEffect(() => {
    if (!token) return;
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
        if (res.status === 401) {
          return;
        }
        if (!res.ok) {
          console.warn("HTTP error! Status:", res.status);
          setPromoList(null);
          return;
        }
        const data = await res.json();
        if (!isCancelled && data?.data?.length > 0) {
          setPromoList(data.data);
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

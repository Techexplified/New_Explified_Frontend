// usePageTracking.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (!window.gtag) return; // ensure GA is loaded

    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
    });
  }, [location]);
};

export default usePageTracking;

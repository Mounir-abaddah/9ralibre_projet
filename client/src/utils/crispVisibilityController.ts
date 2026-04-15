import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    $crisp?: Array<[string, string]>;
  }
}

export const CrispVisibilityController = () => {
  const location = useLocation();

  useEffect(() => {
    if (!window.$crisp) return;
    const isProfRoute = location.pathname.startsWith('/prof') || location.pathname.startsWith('/Chat/start/');
    window.$crisp.push(["do", isProfRoute ? "chat:hide" : "chat:show"]);
  }, [location.pathname]);

  return null;
};
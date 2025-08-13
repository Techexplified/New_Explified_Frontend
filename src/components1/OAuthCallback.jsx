import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract hash parameters like #access_token=XYZ&state=...
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hashParams.get("access_token");
    
    const state = hashParams.get("state");

    if (accessToken) {
      localStorage.setItem("yt_access_token", accessToken);
      console.log(accessToken)
    }

    const redirectTo = state || sessionStorage.getItem("postAuthRedirect") || "/";
    sessionStorage.removeItem("postAuthRedirect");
    navigate(redirectTo);
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default OAuthCallback;

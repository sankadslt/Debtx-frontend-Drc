import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("accessToken");
  if (token) {
    localStorage.setItem("accessToken", token);
      navigate("/");
    } else {
      navigate("/dashboard");
    }
  }, [location, navigate]);

  return <div>Logging you in...</div>;
};

export default GoogleRedirect;

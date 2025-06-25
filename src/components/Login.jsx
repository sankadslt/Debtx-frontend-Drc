import { useState } from "react";
import logo from "../assets/images/logo.png";
import backgroundImage from "../assets/images/loginbg.webp";
import rightPanelBg from "../assets/images/r-bg.png";
import leftPanelImg from "../assets/images/left.webp";

const Login = () => {
  const [error] = useState("");
  const [socialLoading, setSocialLoading] = useState("");

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    setSocialLoading("Google");
    window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google`;
  };
  
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-11/12 md:w-4/5 h-5/6 flex rounded-xl overflow-hidden shadow-2xl bg-white bg-opacity-90 backdrop-blur-sm">
        {/* Left Panel */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-gradient-to-b from-[#a075d2] to-[#45cbc7] p-6">
          <img
            src={leftPanelImg}
            alt="App illustration for login screen"
            className="w-[85%] h-[85%] object-cover rounded-lg"
          />
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 relative flex flex-col items-center justify-center">
          
          {/* Background layers */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${rightPanelBg})` }}
          />
          <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm" />

          {/* Logo */}
          <div className="relative z-10 mt-6">
            <img src={logo} alt="Company Logo" className="h-32" />
          </div>

          {/* Form */}
          <div className="w-full max-w-md px-5 py-8 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Welcome Back</h2>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <form className="space-y-4">
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={handleGoogleLogin}
                  disabled={socialLoading !== ""}
                >
                  {socialLoading === "Google" ? "Signing in..." : "Sign in with Google"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
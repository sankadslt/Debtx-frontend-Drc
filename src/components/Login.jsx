// import { useState } from "react";
// import logo from "../assets/images/logo.png";
// import backgroundImage from "../assets/images/loginbg.png";
// // import leftPanelImg from "../assets/images/left.webp";

// const Login = () => {
//   const [error] = useState("");
//   const [socialLoading, setSocialLoading] = useState("");

//   const handleGoogleLogin = (e) => {
//     e.preventDefault();
//     setSocialLoading("Google");
//     window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google`;
//   };

//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
//       style={{
//         backgroundImage: `url(${backgroundImage})`,
//         backgroundAttachment: "fixed",
//       }}
//     >
//       <div className="w-11/12 md:w-4/5 h-5/6 flex rounded-xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md border border-white/30">
//         {/* Left Panel */}
//         <div className="w-1/2 hidden md:flex items-center justify-center bg-white/10 backdrop-blur-sm">
//           <img
//             src={logo}
//             alt="App illustration"
//             className="w-[50%] h-[50%] object-contain rounded-lg drop-shadow-[0_0_12px_#ffffff]"
//           />
//         </div>

//         {/* Right Panel */}
//         <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-10 bg-white/10 backdrop-blur-xl border-l border-white/30">
//           {/* Logo */}
//           {/* <img src={logo} alt="Logo" className="h-24 mb-4" /> */}

//           {/* Form */}
//           <div className="w-full max-w-md">
//             <h2 className="text-3xl font-semibold text-white mb-6 text-center drop-shadow">
//               Welcome Back
//             </h2>

//             {error && <p className="text-red-400 text-center mb-4">{error}</p>}

//             <form className="space-y-5">
//               <button
//                 type="button"
//                 className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-200 disabled:opacity-50"
//                 onClick={handleGoogleLogin}
//                 disabled={socialLoading !== ""}
//               >
//                 {socialLoading === "Google"
//                   ? "Signing in..."
//                   : "Sign in with Google"}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import logo from "../assets/images/logo.png";
import backgroundImage from "../assets/images/loginbg.png";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../services/auth/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState("");
  const [socialLoading, setSocialLoading] = useState("");
  const [showTestLogin, setShowTestLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    setSocialLoading("Google");
    window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google`;
  };

  const handleTestLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-11/12 md:w-4/5 h-5/6 flex rounded-xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md border border-white/30">
        {/* Left Panel */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <img
            src={logo}
            alt="App illustration"
            className="w-[50%] h-[50%] object-contain rounded-lg drop-shadow-[0_0_12px_#ffffff]"
          />
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-10 bg-white/10 backdrop-blur-xl border-l border-white/30">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-semibold text-white mb-6 text-center drop-shadow">
              Welcome Back
            </h2>

            {error && <p className="text-red-400 text-center mb-4">{error}</p>}

            <form className="space-y-5">
              <button
                type="button"
                className="w-full py-2 bg-[#00256a] hover:bg-[#1f4289] text-white font-semibold rounded-lg shadow transition-all duration-200 disabled:opacity-50"
                onClick={handleGoogleLogin}
                disabled={socialLoading !== ""}
              >
                {socialLoading === "Google"
                  ? "Signing in..."
                  : "Sign in with Google"}
              </button>

{/*               <button
                type="button"
                className="w-full py-2 bg-white hover:bg-gray-100 text-blue-600 font-semibold rounded-lg border border-blue-600 transition-all duration-200"
                onClick={() => setShowTestLogin(true)}
              >
                Test Login
              </button> */}
            </form>
          </div>
        </div>
      </div>

      {/* Test Login Modal */}
      {showTestLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowTestLogin(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Logo" className="h-16" />
            </div>
            <h2 className="text-xl font-bold text-center mb-4">Test Login</h2>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <form onSubmit={handleTestLogin} className="space-y-4">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

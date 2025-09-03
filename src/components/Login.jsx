import { useState, useEffect } from "react";
import logo from "../assets/images/logo.png";
import backgroundImage from "../assets/images/loginbg.png";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaMobileAlt, FaKey, } from "react-icons/fa";
import { loginUser, sendOtp, verifyOtp } from "../services/auth/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState("");
  const [socialLoading, setSocialLoading] = useState("");
  const [showTestLogin, setShowTestLogin] = useState(false);
  const [showMobileLogin, setShowMobileLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Mobile login states
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

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

  // Send OTP
  const handleSendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await sendOtp(mobileNumber);
      setOtpSent(true);
      setTimer(60); // start 1-minute countdown
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await verifyOtp(mobileNumber, otp);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await sendOtp(mobileNumber);
      setTimer(60); // restart countdown
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

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

              <button
                type="button"
                className="w-full py-2 bg-white hover:bg-gray-100 text-blue-600 font-semibold rounded-lg border border-blue-600 transition-all duration-200"
                onClick={() => setShowTestLogin(true)}
              >
                Test Login
              </button>

              <button
                type="button"
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200"
                onClick={() => setShowMobileLogin(true)}
              >
                Mobile Login
              </button>
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

      {/* Mobile Login Modal */}
      {showMobileLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowMobileLogin(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Logo" className="h-16" />
            </div>
            <h2 className="text-xl font-bold text-center mb-4">Mobile Login</h2>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            {!otpSent ? (
              <div className="space-y-4">
                <div className="relative">
                  <FaMobileAlt className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setMobileNumber(value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        mobileNumber.length === 10 &&
                        !loading
                      ) {
                        handleSendOtp();
                      }
                    }}
                    maxLength={10}
                    required
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {mobileNumber.length > 0 && mobileNumber.length < 10 && (
                  <p className="text-red-500 text-sm text-center">
                    Enter a valid 10-digit mobile number
                  </p>
                )}

                <button
                  onClick={handleSendOtp}
                  disabled={loading || mobileNumber.length !== 10}
                  className={`w-full py-2 rounded-md text-white ${
                    mobileNumber.length === 10 && !loading
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <FaKey className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && otp && !loading) {
                        handleVerifyOtp();
                      }
                    }}
                    required
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || timer === 0}
                  className={`w-full py-2 text-white rounded-md ${
                    timer > 0
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="text-center mt-3">
                  {timer > 0 ? (
                    <p className="text-gray-600">
                      Code expires in{" "}
                      <span className="font-semibold">
                        {Math.floor(timer / 60)}:
                        {String(timer % 60).padStart(2, "0")}
                      </span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-blue-600 hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
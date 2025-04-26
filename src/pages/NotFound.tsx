import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden px-4">
      {/* Background Decorative Elements */}
      <div className="absolute w-80 h-80 bg-indigo-300 rounded-full opacity-20 blur-3xl top-0 -left-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-pink-300 rounded-full opacity-15 blur-3xl bottom-0 -right-20 animate-pulse-slow"></div>
      <div className="absolute w-64 h-64 bg-purple-200 rounded-full opacity-25 blur-2xl top-1/3 left-1/4 animate-pulse"></div>

      {/* 404 Card */}
      <div className="bg-white/30 backdrop-blur-xl shadow-xl border border-white/20 rounded-3xl p-8 max-w-md w-full text-center z-10 transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-6xl font-bold text-gray-900 mb-4 tracking-tight">404</h1>
        <p className="text-xl text-gray-600 mb-6 font-medium">Oops! The page you're looking for doesn't exist.</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
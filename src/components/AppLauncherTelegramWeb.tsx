const AppLauncherTelegramWeb = () => {
  const handleLaunch = () => {
    try {
      const baseUrl = import.meta.env.VITE_FRONTEND_URL + "/register";
      const currentParams = new URLSearchParams(window.location.search);

      const url = new URL(baseUrl);
      currentParams.forEach((value, key) => {
        url.searchParams.set(key, value);
        
      });
      window.open(url.toString(), "_blank");
    } catch (error) {
      window.open(window.location.host, "_blank");
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20" />

        <div className="relative px-6 pt-12 pb-20">
          {/* Logo & Brand */}
          <div className="text-center mb-12">
            <div className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
              Traderate
            </div>
            <p className="text-sm text-slate-400">Smart Trading Platform</p>
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Trade Smarter with
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Community Intelligence
              </span>
            </h1>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Join thousands of traders using blockchain-verified signals and
              collective wisdom to make better trading decisions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button
                // onClick={() =>
                //   window.open(
                //     import.meta.env.VITE_FRONTEND_URL,
                //     "_blank"
                //   )
                // }
                onClick={handleLaunch}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Launch
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-pink-500">92%</div>
                <div className="text-xs text-slate-400">Success Rate</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-purple-500">50K+</div>
                <div className="text-xs text-slate-400">Active Users</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-blue-500">$2M+</div>
                <div className="text-xs text-slate-400">Daily Volume</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLauncherTelegramWeb;

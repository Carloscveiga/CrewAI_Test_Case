// src/components/Header.tsx

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-6">
          {/* Logo & Title Section */}
          <div className="flex items-center gap-4">
            {/* Animated Logo Icon */}
            <div className="relative group">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500/50 flex items-center justify-center relative overflow-hidden">
                {/* Scanning line animation */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-[scanline_3s_linear_infinite]"></div>

                {/* Shield icon */}
                <svg
                  className="w-8 h-8 text-cyan-400 relative z-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400"></div>
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-[gradient-shift_3s_ease_infinite]">
                  ARC Raiders
                </span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="status-indicator active"></div>
                <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Damage Calculator v2.0</p>
              </div>
            </div>
          </div>

          {/* Right Section - Social Links & CTA */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Social Links - Technical Button Style */}
            <div className="flex items-center gap-2 pr-3 border-r border-slate-700/50">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2.5 rounded-lg bg-slate-800/50 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/50 transition-all duration-300"
                aria-label="YouTube Channel"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                {/* Hover glow */}
                <div className="absolute inset-0 bg-red-500/10 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <a
                href="https://twitch.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2.5 rounded-lg bg-slate-800/50 hover:bg-violet-500/20 border border-slate-700 hover:border-violet-500/50 transition-all duration-300"
                aria-label="Twitch Channel"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-violet-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
                <div className="absolute inset-0 bg-violet-500/10 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2.5 rounded-lg bg-slate-800/50 hover:bg-indigo-500/20 border border-slate-700 hover:border-indigo-500/50 transition-all duration-300"
                aria-label="Discord Server"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <div className="absolute inset-0 bg-indigo-500/10 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <a
                href="https://ko-fi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2.5 rounded-lg bg-slate-800/50 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300"
                aria-label="Ko-Fi Support"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-cyan-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.881 8.948c-.773-4.085-4.859-6.847-9.031-6.019-5.264 1.065-7.51 6.281-5.694 10.817.998 2.535 3.626 4.203 6.451 4.203 1.034 0 2.029-.199 2.954-.578l.821 2.486a.553.553 0 0 0 .525.382h2.753a.553.553 0 0 0 .525-.382l.821-2.486c.925.379 1.92.578 2.954.578 3.688 0 6.681-3.001 6.681-6.689v-3.539c0-1.804-1.081-3.378-2.71-4.018v-1.624a.553.553 0 0 0-.553-.553H18.77a.553.553 0 0 0-.553.553v1.624c-1.629.64-2.71 2.214-2.71 4.018v3.539c0 3.056-2.484 5.54-5.54 5.54-2.041 0-3.885-1.121-4.849-2.929-1.262-3.204.438-7.088 4.264-7.857 3.073-.622 5.836 1.515 6.374 4.349l-3.26.658a.553.553 0 0 0-.433.649l.488 2.424a.553.553 0 0 0 .649.433l6.632-1.339a.553.553 0 0 0 .433-.649l-.488-2.424a.553.553 0 0 0-.649-.433z"/>
                </svg>
                <div className="absolute inset-0 bg-cyan-500/10 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>

            {/* CTA Button - Holographic Style */}
            <a
              href="#how-it-works"
              className="group relative px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-lg font-semibold text-sm text-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105"
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shine_0.6s_ease-in-out]"></div>

              {/* Button content */}
              <span className="relative flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How it Works
              </span>

              {/* Tech border effect */}
              <div className="absolute inset-0 rounded-lg border border-cyan-400/30"></div>
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/50"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/50"></div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom accent line with animated gradient */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
    </header>
  );
}

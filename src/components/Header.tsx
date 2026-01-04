// src/components/Header.tsx

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-xl bg-card/50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
              ARC Raiders Damage Calculator
            </h1>
            <p className="text-slate-200 text-sm mt-1">Calculate shield and life damage for all weapons, gadgets, and deployables</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-red-400 transition-colors duration-200"
              title="YouTube"
            >
              <i className="fab fa-youtube text-xl"></i>
            </a>
            <a
              href="https://twitch.tv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-violet-400 transition-colors duration-200"
              title="Twitch"
            >
              <i className="fab fa-twitch text-xl"></i>
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-400 transition-colors duration-200"
              title="Discord"
            >
              <i className="fab fa-discord text-xl"></i>
            </a>
            <a
              href="https://ko-fi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-300 transition-colors duration-200"
              title="Ko-Fi"
            >
              <i className="fas fa-coffee text-xl"></i>
            </a>
            <a
              href="#how-it-works"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-600/30"
            >
              How it Works
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

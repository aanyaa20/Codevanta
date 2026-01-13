// This component is deprecated as it has been integrated directly into the DashboardPage for better layout control.
// Keeping it as a reference or for potential reuse in other pages.

import { useUser } from "@clerk/clerk-react";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 p-8 md:p-12 mb-10">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="size-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome back, {user?.firstName || "Developer"}!
            </h1>
          </div>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl pl-1">
            Ready to level up your coding skills? Start a new live pair programming session now.
          </p>
        </div>
        
        <button
          onClick={onCreateSession}
          className="btn-primary group text-lg px-8 py-4"
        >
          <Zap className="size-5" />
          <span>Start Live Session</span>
          <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default WelcomeSection;

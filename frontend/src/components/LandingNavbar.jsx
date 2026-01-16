import { Link } from "react-router";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

function LandingNavbar({ onGetStarted }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/logo.png" 
              alt="CodeVanta Logo" 
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">
              CodeVanta
            </span>
          </Link>

          {/* Right side - Conditional based on auth */}
          <div className="flex items-center gap-4">
            <SignedOut>
              {/* Not authenticated - show only Get Started */}
              <button
                onClick={onGetStarted}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
              >
                Get Started →
              </button>
            </SignedOut>

            <SignedIn>
              {/* Authenticated - show only user avatar */}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-9 rounded-full ring-2 ring-cyan-100 shadow-sm hover:ring-cyan-200 transition-all"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;

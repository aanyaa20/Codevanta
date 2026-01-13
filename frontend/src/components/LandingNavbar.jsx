import { Link } from "react-router";
import { Code2 } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

function LandingNavbar({ onGetStarted }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Code2 className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              CodeVanta
            </span>
          </Link>

          {/* Right side - Conditional based on auth */}
          <div className="flex items-center gap-4">
            <SignedOut>
              {/* Not authenticated - show Sign In and Get Started */}
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <button
                onClick={onGetStarted}
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
              >
                Get Started →
              </button>
            </SignedOut>

            <SignedIn>
              {/* Authenticated - show only user avatar */}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-9 rounded-full ring-2 ring-orange-100 shadow-sm hover:ring-orange-200 transition-all"
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

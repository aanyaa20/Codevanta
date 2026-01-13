import { Link } from "react-router";
import {
  ArrowRight,
  Code2,
  Video,
  Zap,
  Users,
  Shield,
  Globe,
  Mic,
  Phone,
  VideoIcon
} from "lucide-react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col">
      {/* NAVBAR */}
      <header className="h-16 bg-white border-b border-slate-100 flex items-center px-8 relative z-50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="size-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">in</span>
              </div>
            </Link>
          </div>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/solution" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
              Solution
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <button className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1">
              Products
              <span className="text-orange-500">▼</span>
            </button>
            <Link to="/resources" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
              Resources
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                  Sign in
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="px-5 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
                  Sign up
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className="px-5 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors">
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-center">
        {/* Background Shapes - Fixed positioning, no scroll */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" style={{ transform: 'rotate(-20deg)' }} />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-indigo-300/30 rounded-full blur-3xl pointer-events-none" style={{ transform: 'rotate(25deg)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-green-200/40 rounded-full blur-3xl pointer-events-none" style={{ transform: 'rotate(-15deg)' }} />

        <div className="max-w-7xl mx-auto px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT SIDE - Text Content */}
            <div className="space-y-8">
              <h1 className="text-6xl font-bold tracking-tight leading-tight text-slate-900">
                Code Together <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                  Succeed Together
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                CodeVanta provides the ultimate environment for pair programming and interview preparation. 
                Real-time collaboration, HD video, and a powerful IDE—all in your browser.
              </p>

              <div className="flex items-center gap-4">
                <SignInButton mode="modal">
                  <button className="px-8 py-3.5 rounded-xl bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                    Start Coding Free
                  </button>
                </SignInButton>
                
                <button className="text-base font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                  Watch Demo
                </button>
              </div>
            </div>

            {/* RIGHT SIDE - Video Call Card Mockup */}
            <div className="relative flex items-center justify-center lg:justify-end">
              {/* Floating Card */}
              <div className="relative w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                  {/* Card Header - Timer */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className="bg-slate-900 text-white px-4 py-2 rounded-full flex items-center gap-2">
                      <div className="size-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-mono">00:32</span>
                    </div>
                  </div>

                  {/* Card Header - Chart */}
                  <div className="absolute top-6 right-6 z-20">
                    <div className="bg-blue-600 p-4 rounded-2xl">
                      <div className="flex items-end gap-1.5 h-12">
                        <div className="w-2 bg-blue-300 rounded-full h-6"></div>
                        <div className="w-2 bg-blue-300 rounded-full h-8"></div>
                        <div className="w-2 bg-blue-200 rounded-full h-10"></div>
                        <div className="w-2 bg-orange-400 rounded-full h-12"></div>
                        <div className="w-2 bg-orange-300 rounded-full h-7"></div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content - Video Preview */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 relative">
                    {/* Placeholder for user image - REPLACE THIS */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="size-32 rounded-full bg-slate-200 mx-auto mb-4"></div>
                        <div className="text-slate-400 text-sm">
                          {/* Replace image here */}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar Overlay */}
                    <div className="absolute bottom-32 left-6 right-6 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-slate-300/50 backdrop-blur-sm" />
                        <div className="flex-1 space-y-2">
                          <div className="h-2 bg-slate-300/50 backdrop-blur-sm rounded-full overflow-hidden">
                            <div className="h-full bg-slate-400 rounded-full" style={{ width: '60%' }} />
                          </div>
                          <div className="h-2 bg-indigo-400/50 backdrop-blur-sm rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '40%' }} />
                          </div>
                          <div className="h-2 bg-violet-400/50 backdrop-blur-sm rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500 rounded-full" style={{ width: '80%' }} />
                          </div>
                        </div>
                        <div className="text-slate-500 text-xs font-mono">2:48</div>
                      </div>
                    </div>

                    {/* Name Label */}
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                      <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                        <p className="text-sm font-semibold text-slate-900">Kohaku</p>
                      </div>
                    </div>
                  </div>

                  {/* Call Controls */}
                  <div className="bg-white border-t border-slate-100 px-8 py-6 flex items-center justify-center gap-4">
                    <button className="size-12 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center">
                      <Mic className="size-5 text-slate-600" />
                    </button>
                    <button className="size-14 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors flex items-center justify-center">
                      <Phone className="size-6 text-white" />
                    </button>
                    <button className="size-12 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center">
                      <VideoIcon className="size-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Floating dots decoration */}
                <div className="absolute -top-8 -right-8 size-4 rounded-full bg-indigo-400" />
                <div className="absolute -bottom-6 -left-6 size-3 rounded-full bg-orange-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Logos Section */}
      <div className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between opacity-40 grayscale">
            <div className="text-2xl font-bold text-slate-400">Google</div>
            <div className="text-2xl font-bold text-slate-400">NETFLIX</div>
            <div className="text-2xl font-bold text-slate-400">Spotify</div>
            <div className="text-2xl font-bold text-slate-400">amazon</div>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Developers", value: "10k+", icon: Users },
              { label: "Code Executions", value: "5M+", icon: Code2 },
              { label: "Uptime", value: "99.99%", icon: Shield },
              { label: "Countries", value: "150+", icon: Globe },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-2">
                <stat.icon className="size-6 text-orange-500 mb-2" />
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">
              Everything you need to <span className="text-orange-500">excel</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We've built the most comprehensive toolset for technical interview preparation, designed for speed and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "HD Video & Audio",
                description: "Crystal clear communication with integrated video calling. No external apps needed.",
                icon: Video,
                color: "text-blue-500",
                bg: "bg-blue-50"
              },
              {
                title: "Collaborative IDE",
                description: "Write, run, and debug code together in real-time with syntax highlighting for 20+ languages.",
                icon: Code2,
                color: "text-purple-500",
                bg: "bg-purple-50"
              },
              {
                title: "Instant Feedback",
                description: "Get immediate results on your code execution and test cases to learn faster.",
                icon: Zap,
                color: "text-amber-500",
                bg: "bg-amber-50"
              }
            ].map((feature, i) => (
              <div key={i} className="card p-8 hover:border-orange-200 hover:shadow-lg transition-all group bg-white">
                <div className={`size-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`size-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;

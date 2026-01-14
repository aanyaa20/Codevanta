import { Link, useNavigate } from "react-router";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Code2,
  Video,
  Zap,
  Users,
  Shield,
  Sparkles,
  Rocket,
  Terminal,
  GitBranch,
  MessageSquare,
  Globe
} from "lucide-react";
import { SignInButton, SignedIn, SignedOut, useUser, UserButton } from "@clerk/clerk-react";
import { AUTH_INTENTS, setAuthIntent } from "../lib/authIntent";

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Floating Blob Component
function FloatingBlob({ className, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -40, 30, 0],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

// Animated Section Wrapper
function AnimatedSection({ children, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Problem data for flip animation
const problems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}`,
    streak: "7 days",
    runtime: "52ms"
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    code: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let char of s) {
    if (!map[char]) stack.push(char);
    else if (stack.pop() !== map[char]) 
      return false;
  }
  return stack.length === 0;
}`,
    streak: "12 days",
    runtime: "48ms"
  },
  {
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    code: `function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let current = dummy;
  while (l1 && l2) {
    if (l1.val < l2.val) {
      current.next = l1; l1 = l1.next;
    } else {
      current.next = l2; l2 = l2.next;
    }
    current = current.next;
  }
  current.next = l1 || l2;
  return dummy.next;
}`,
    streak: "5 days",
    runtime: "64ms"
  }
];

function HomePage() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  
  // Flip between problems every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProblemIndex((prev) => (prev + 1) % problems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle CTA clicks with intent tracking
  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate('/dashboard');
    } else {
      setAuthIntent(AUTH_INTENTS.GET_STARTED);
    }
  };

  const handleStartCoding = () => {
    if (isSignedIn) {
      navigate('/dashboard');
    } else {
      setAuthIntent(AUTH_INTENTS.START_CODING);
    }
  };

  const handleExploreProblems = () => {
    if (isSignedIn) {
      navigate('/problems');
    } else {
      setAuthIntent(AUTH_INTENTS.EXPLORE_PROBLEMS);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Base Background with Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40 -z-10" />
      
      {/* Gradient Overlays */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/12 via-teal-400/10 to-cyan-400/8" />
        <div className="absolute inset-0 bg-gradient-to-bl from-teal-400/10 via-cyan-300/8 to-teal-400/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEwMCwgMTAwLCAxMDAsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
      </div>

      {/* Floating Background Blobs */}
      <FloatingBlob className="w-96 h-96 bg-cyan-400/20 top-20 -left-20" delay={0} />
      <FloatingBlob className="w-[500px] h-[500px] bg-cyan-300/15 top-40 right-10" delay={2} />
      <FloatingBlob className="w-80 h-80 bg-teal-400/20 bottom-40 left-1/4" delay={4} />
      <FloatingBlob className="w-96 h-96 bg-green-300/15 bottom-20 right-1/4" delay={6} />

      {/* NAVBAR */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/40 border-b border-white/60"
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all duration-300 group-hover:scale-105">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
              CodeVanta
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <motion.button
                  onClick={handleGetStarted}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-600 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-9 rounded-full ring-2 ring-cyan-100 shadow-sm hover:ring-cyan-200 transition-all"
                  }
                }}
              />
            </SignedIn>
          </div>
        </nav>
      </motion.header>

      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen overflow-hidden">
        {/* HERO BACKGROUND - Full Width */}
        <div className="absolute inset-0 w-full h-full">
          {/* Base Gradient - Cyan/Teal Blend */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-teal-50/70 to-cyan-50/60" />
          
          {/* Layered Radial Gradients - Blue/Cyan Spirals */}
          <motion.div
            animate={{
              x: [0, 80, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[-30%] left-[-15%] w-[1000px] h-[1000px] rounded-full bg-gradient-radial from-cyan-400/30 via-teal-400/15 to-transparent blur-[100px]"
          />
          
          <motion.div
            animate={{
              x: [0, -60, 0],
              y: [0, 70, 0],
              scale: [1, 1.3, 1],
              rotate: [360, 0]
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            className="absolute top-[15%] right-[-10%] w-[1100px] h-[1100px] rounded-full bg-gradient-radial from-teal-400/30 via-cyan-400/15 to-transparent blur-[100px]"
          />
          
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -60, 0],
              scale: [1, 1.25, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 7,
            }}
            className="absolute bottom-[10%] left-[15%] w-[900px] h-[900px] rounded-full bg-gradient-radial from-teal-400/25 via-cyan-300/12 to-transparent blur-[100px]"
          />
          
          <motion.div
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 12,
            }}
            className="absolute top-[40%] right-[20%] w-[750px] h-[750px] rounded-full bg-gradient-radial from-cyan-400/20 via-teal-300/10 to-transparent blur-[80px]"
          />
          
          {/* Flowing Curved Arcs - SVG with Blue/Cyan Spirals */}
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="arcGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="arcGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="arcGradient3" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
              </linearGradient>
              <filter id="arcBlur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
              </filter>
            </defs>
            
            {/* Spiral Curve 1 */}
            <motion.path
              d="M -200 600 Q 200 200, 600 400 Q 1000 600, 1400 300 Q 1800 0, 2200 400"
              stroke="url(#arcGradient1)"
              strokeWidth="4"
              fill="none"
              filter="url(#arcBlur)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                x: [0, 120, 0],
              }}
              transition={{ 
                pathLength: { duration: 2, ease: "easeInOut" },
                opacity: { duration: 1 },
                x: { duration: 50, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            
            {/* Spiral Curve 2 */}
            <motion.path
              d="M 2000 100 Q 1500 350, 1100 200 Q 700 50, 300 300 Q -100 550, -300 200"
              stroke="url(#arcGradient2)"
              strokeWidth="5"
              fill="none"
              filter="url(#arcBlur)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                x: [0, -100, 0],
                y: [0, 50, 0],
              }}
              transition={{ 
                pathLength: { duration: 2.5, ease: "easeInOut", delay: 0.5 },
                opacity: { duration: 1, delay: 0.5 },
                x: { duration: 45, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 40, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            
            {/* Spiral Curve 3 */}
            <motion.path
              d="M 300 -100 Q 500 200, 700 100 Q 900 0, 1100 200 Q 1300 400, 1500 300 Q 1700 200, 1900 500"
              stroke="url(#arcGradient3)"
              strokeWidth="3.5"
              fill="none"
              filter="url(#arcBlur)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                x: [0, 80, 0],
                y: [0, -40, 0],
              }}
              transition={{ 
                pathLength: { duration: 3, ease: "easeInOut", delay: 1 },
                opacity: { duration: 1, delay: 1 },
                x: { duration: 55, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 48, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            
            {/* Additional Spiral Curves */}
            <motion.path
              d="M 100 800 Q 400 600, 700 750 Q 1000 900, 1300 700 Q 1600 500, 1900 700"
              stroke="url(#arcGradient1)"
              strokeWidth="3"
              fill="none"
              filter="url(#arcBlur)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                x: [0, -70, 0],
              }}
              transition={{ 
                pathLength: { duration: 3.5, ease: "easeInOut", delay: 1.5 },
                opacity: { duration: 1, delay: 1.5 },
                x: { duration: 60, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            
            <motion.path
              d="M 1800 500 Q 1400 300, 1000 450 Q 600 600, 200 400 Q -200 200, -400 450"
              stroke="url(#arcGradient2)"
              strokeWidth="4"
              fill="none"
              filter="url(#arcBlur)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                x: [0, 90, 0],
                y: [0, -50, 0],
              }}
              transition={{ 
                pathLength: { duration: 4, ease: "easeInOut", delay: 2 },
                opacity: { duration: 1, delay: 2 },
                x: { duration: 52, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 46, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          </svg>
          
          {/* Noise / Grain Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />
        </div>

        {/* HERO CONTENT - Constrained */}
        <div className="relative z-10 w-full flex items-start px-6 lg:px-8 pt-20 pb-4">
          <div className="max-w-7xl mx-auto w-full">
            {/* Mobile: Centered, Desktop: 2-Column Grid */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* LEFT COLUMN - Text Content */}
              <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm mb-8"
                >
<Users className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-medium text-slate-700">Revolutionizing collaborative coding</span>
                </motion.div>

                {/* Headline */}
                <div className="mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                  >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15]">
                      <span className="bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                        Code Together,
                      </span>
                      <br />
                      <span className="text-slate-800">
                        Succeed Together.
                      </span>
                    </h1>
                  </motion.div>
                </div>

                {/* Subheading */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                  className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl leading-relaxed"
                >
                 A unified environment for real-time collaborative coding with integrated video chat, live code execution, and seamless pair programming.
                 <br />
One Workspace. One Team. Live Code.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
                  className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
                >
                  <SignedOut>
                    <SignInButton mode="modal">
                      <motion.button
                        onClick={handleStartCoding}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-600 text-white font-semibold text-lg shadow-2xl shadow-cyan-500/40 overflow-hidden group"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500"
                          initial={{ x: "100%" }}
                          whileHover={{ x: "0%" }}
                          transition={{ duration: 0.5 }}
                        />
                        <span className="relative flex items-center gap-2">
                          Start Coding Now
                        </span>
                        
                        {/* Glow Effect */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 -z-10"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 0.6 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.button>
                    </SignInButton>

                    <SignInButton mode="modal">
                      <motion.button
                        onClick={handleExploreProblems}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-4 rounded-2xl backdrop-blur-md bg-white/60 border border-white/80 text-slate-700 font-semibold text-lg shadow-lg hover:bg-white/80 hover:shadow-xl transition-all duration-300"
                      >
                        Explore Problems
                      </motion.button>
                    </SignInButton>
                  </SignedOut>

                  <SignedIn>
                    <Link to="/dashboard">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-600 text-white font-semibold text-lg shadow-2xl shadow-cyan-500/40 overflow-hidden group"
                      >
                        <span className="relative flex items-center gap-2">
                          Go to Dashboard
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </motion.button>
                    </Link>

                    <Link to="/problems">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-4 rounded-2xl backdrop-blur-md bg-white/60 border border-white/80 text-slate-700 font-semibold text-lg shadow-lg hover:bg-white/80 hover:shadow-xl transition-all duration-300"
                      >
                        Browse Problems
                      </motion.button>
                    </Link>
                  </SignedIn>
                </motion.div>
              </div>

              {/* RIGHT COLUMN - Code Editor Component with Flip Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                className="hidden lg:flex items-center justify-center"
              >
                <motion.div
                  key={currentProblemIndex}
                  initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.8, rotate: 10, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-400 rounded-full" />
                      <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                      <span className="w-3 h-3 bg-green-400 rounded-full" />
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold">✓ 3/3 tests passed</span>
                  </div>

                  {/* Title */}
                  <div className="px-5 py-3 flex items-center gap-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-50 text-emerald-600">
                      {problems[currentProblemIndex].difficulty}
                    </span>
                    <span className="font-semibold text-slate-900">{problems[currentProblemIndex].title}</span>
                  </div>

                  {/* Code */}
                  <pre className="px-5 py-4 text-sm font-mono bg-slate-50 text-slate-800 overflow-hidden">
{problems[currentProblemIndex].code}
                  </pre>

                  {/* Footer */}
                  <div className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6 text-xs text-slate-500">
                      <span>🔥 Streak: {problems[currentProblemIndex].streak}</span>
                      <span>⏱ Runtime: {problems[currentProblemIndex].runtime}</span>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-500 text-white text-sm rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                      Run Code
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-slate-300 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-slate-400"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <AnimatedSection className="relative py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 tracking-tight"
            >
              Everything you need to
              <span className="bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent"> collaborate</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto"
            >
              Powerful features designed for modern development teams
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Code2,
                title: "Real-time Code Editor",
                description: "Collaborate seamlessly with Monaco editor integration and live cursor tracking",
                gradient: "from-cyan-500 to-teal-400",
              },
              {
                icon: Video,
                title: "HD Video Chat",
                description: "Crystal-clear video and audio powered by Stream for natural communication",
                gradient: "from-cyan-500 to-teal-400",
              },
              {
                icon: Terminal,
                title: "Live Code Execution",
                description: "Run code in 40+ languages instantly with Piston API integration",
                gradient: "from-cyan-500 to-teal-400",
              },
              {
                icon: MessageSquare,
                title: "Integrated Chat",
                description: "Text chat with file sharing and code snippet support built right in",
                gradient: "from-cyan-500 to-teal-400",
              },
              {
                icon: GitBranch,
                title: "Session Management",
                description: "Create, join, and manage coding sessions with full history tracking",
                gradient: "from-cyan-400 to-teal-300",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized performance with WebSocket connections and efficient rendering",
                gradient: "from-cyan-400 to-teal-300",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="h-full p-8 rounded-3xl backdrop-blur-md bg-white/60 border border-white/80 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-teal-300 to-orange-300 opacity-0 group-hover:opacity-[0.12] transition-opacity duration-500" />
                  
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Border Glow on Hover */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-[0.15] transition-opacity duration-500 bg-gradient-to-br from-cyan-400 via-teal-300 to-orange-300 blur-2xl -z-10" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* VISUAL/DEMO SECTION */}
      <AnimatedSection className="relative py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 tracking-tight"
            >
              See it in <span className="bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">action</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -10, transition: { duration: 0.4 } }}
            className="relative"
          >
            {/* Glow Effect Behind */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 rounded-3xl blur-3xl opacity-20" />
            
            <div className="relative rounded-3xl backdrop-blur-md bg-white/70 border border-white/90 shadow-2xl overflow-hidden p-8">
              <div className="aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden relative">
                {/* Mock Editor Interface */}
                <div className="h-full flex flex-col">
                  <div className="bg-slate-800/50 border-b border-slate-700/50 px-4 py-3 flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-slate-400 text-sm font-mono">main.py</span>
                  </div>
                  <div className="flex-1 p-6 font-mono text-sm">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      <div className="text-purple-400">def <span className="text-yellow-400">collaborative_coding</span>():</div>
                      <div className="pl-8 text-slate-300">
                        <div className="text-blue-400">"""Experience the future of pair programming"""</div>
                        <div className="mt-2">
                          <span className="text-cyan-400">print</span>
                          <span className="text-slate-300">(</span>
                          <span className="text-green-400">"Code together, anywhere"</span>
                          <span className="text-slate-300">)</span>
                        </div>
                        <div className="mt-1">
                          <span className="text-purple-400">return</span>
                          <span className="text-orange-400"> True</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Floating Cursor Simulation */}
                <motion.div
                  animate={{
                    x: [100, 300, 200, 400, 100],
                    y: [100, 150, 200, 120, 100],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-4 h-4"
                >
                  <div className="w-full h-full bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
                </motion.div>
              </div>

              {/* Feature Tags */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                {["Real-time Sync", "Video Chat", "Code Execution", "Session History"].map((tag, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                    className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white text-sm font-medium text-slate-700"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* STATS SECTION */}
      <AnimatedSection className="relative py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: 40, suffix: "+", label: "Programming Languages" },
              { number: 1000, suffix: "+", label: "Active Users" },
              { number: 99, suffix: "%", label: "Uptime" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center p-12 rounded-3xl backdrop-blur-md bg-white/60 border border-white/80 shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-4">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-lg font-medium text-slate-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* FINAL CTA SECTION */}
      <AnimatedSection className="relative py-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2.5rem] overflow-hidden"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-orange-500 to-orange-600">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-tr from-orange-400 via-cyan-500 to-orange-600 opacity-60"
                style={{ backgroundSize: "200% 200%" }}
              />
            </div>

            {/* Mesh Glow Effect */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-br from-orange-500/40 via-transparent to-cyan-500/40 blur-3xl"
            />

            <div className="relative px-12 py-20 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
              >
                Ready to transform your
                <br />
                coding experience?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-white/90 mb-10 max-w-2xl mx-auto"
              >
                Join thousands of developers collaborating in real-time
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 rounded-2xl bg-white text-slate-900 font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      Start Your Free Session
                      <ArrowRight className="w-6 h-6" />
                    </span>
                  </motion.button>
                </SignInButton>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* FOOTER */}
      <footer className="relative py-16 px-6 lg:px-8 border-t border-white/60 backdrop-blur-sm bg-white/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-500 flex items-center justify-center shadow-lg">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-800">CodeVanta</span>
              </Link>
              <p className="text-slate-600 leading-relaxed max-w-md">
                The modern platform for collaborative coding. Build together, learn together, grow together.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link to="/problems" className="text-slate-600 hover:text-slate-900 transition-colors">Problems</Link></li>
                <li><Link to="/sessions" className="text-slate-600 hover:text-slate-900 transition-colors">Sessions</Link></li>
                <li><Link to="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">About</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/60 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm">
              © 2026 CodeVanta. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Privacy</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Terms</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;

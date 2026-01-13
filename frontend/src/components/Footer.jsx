import { Link } from "react-router";
import { SparklesIcon, GithubIcon, TwitterIcon, LinkedinIcon, MailIcon } from "lucide-react";
import { useState } from "react";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          {/* Left Section - Logo & Tagline */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-4 w-fit">
              <div className="size-10 rounded-xl bg-gradient-to-r from-[#FF8A00] via-[#FF5F6D] to-[#E91E63] flex items-center justify-center shadow-md">
                <SparklesIcon className="size-6 text-white" />
              </div>
              <span className="font-black text-2xl bg-gradient-to-r from-[#FF8A00] via-[#FF5F6D] to-[#E91E63] bg-clip-text text-transparent font-mono">
                CodeVanta
              </span>
            </Link>
            <p className="text-[#4B5563] text-sm leading-relaxed max-w-xs">
              Prepare smarter, code together. The ultimate platform for collaborative coding interviews.
            </p>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-[#1F2937] mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-[#4B5563] hover:text-[#FF8A00] transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-[#4B5563] hover:text-[#FF8A00] transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-[#4B5563] hover:text-[#FF8A00] transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#4B5563] hover:text-[#FF8A00] transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-[#1F2937] mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/problems" className="text-[#4B5563] hover:text-[#FF8A00] transition-colors text-sm">
                  Problems
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-[#4B5563] hover:text-[#FF8A00] transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-[#4B5563] hover:text-[#FF8A00] transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-[#4B5563] hover:text-[#FF8A00] transition-colors text-sm">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-[#1F2937] mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/docs" className="text-[#4B5563] hover:text-[#FF8A00] transition-colors text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-[#4B5563] hover:text-[#FF8A00] transition-colors text-sm">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-[#4B5563] hover:text-[#FF8A00] transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-[#4B5563] hover:text-[#FF8A00] transition-colors text-sm">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-[#1F2937] mb-4">Stay Updated</h3>
            <p className="text-[#4B5563] text-sm mb-4">
              Get the latest coding tips and news.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#4B5563]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF8A00] to-[#E91E63] text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider with Gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#FF8A00] to-transparent mb-8"></div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <p className="text-[#4B5563] text-sm">
            © {new Date().getFullYear()} CodeVanta. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-full bg-gray-100 hover:bg-gradient-to-r hover:from-[#FF8A00] hover:to-[#FF5F6D] flex items-center justify-center transition-all duration-200 group"
              aria-label="GitHub"
            >
              <GithubIcon className="size-5 text-[#4B5563] group-hover:text-white transition-colors" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-full bg-gray-100 hover:bg-gradient-to-r hover:from-[#FF8A00] hover:to-[#FF5F6D] flex items-center justify-center transition-all duration-200 group"
              aria-label="Twitter"
            >
              <TwitterIcon className="size-5 text-[#4B5563] group-hover:text-white transition-colors" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="size-10 rounded-full bg-gray-100 hover:bg-gradient-to-r hover:from-[#FF8A00] hover:to-[#FF5F6D] flex items-center justify-center transition-all duration-200 group"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="size-5 text-[#4B5563] group-hover:text-white transition-colors" />
            </a>
            <a
              href="mailto:hello@codevanta.com"
              className="size-10 rounded-full bg-gray-100 hover:bg-gradient-to-r hover:from-[#FF8A00] hover:to-[#FF5F6D] flex items-center justify-center transition-all duration-200 group"
              aria-label="Email"
            >
              <MailIcon className="size-5 text-[#4B5563] group-hover:text-white transition-colors" />
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-[#4B5563] hover:text-[#FF8A00] transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-[#4B5563] hover:text-[#FF8A00] transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

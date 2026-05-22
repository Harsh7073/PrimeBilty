"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Truck, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.getElementById(id.replace("#", ""));
    if (element) {
      const offset = 80; // navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-dark-950/80 backdrop-blur-md border-b border-white/10 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left side: Logo */}
            <Link href="#home" onClick={(e) => handleScrollTo(e, "#home")} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
                <Truck className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-lg tracking-tight">
                  Truck<span className="gradient-text">Bilty</span>
                </span>
                <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand-500/10 border border-brand-500/20 text-brand-300">
                  v2.0
                </span>
              </div>
            </Link>

            {/* Middle: Navigation Links (Desktop only) */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="text-white/60 hover:text-white text-sm font-medium transition-colors relative group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-400 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* Right side: Hamburger and CTAs */}
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger menu trigger button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden flex items-center justify-center p-2 rounded-lg border border-white/10 bg-white/3 hover:bg-white/7 transition-colors text-white/70 hover:text-white"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
              </button>

              {/* Login & Sign Up buttons (always visible on the right side) */}
              <Link
                href="/login"
                className="px-3.5 py-2 text-xs sm:text-sm font-medium text-white/75 hover:text-white transition-colors hover:bg-white/5 rounded-lg sm:px-4 sm:py-2 border border-white/5 hover:border-white/10"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 rounded-lg shadow-md shadow-brand-500/10 hover:shadow-brand-500/25 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1.5 sm:px-4.5 sm:py-2"
              >
                <span>Sign Up</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Expandable Menu) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 bg-dark-950/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="md:hidden fixed top-20 left-0 right-0 z-40 p-6 bg-dark-900 border-b border-white/10 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className="px-4 py-3 rounded-lg hover:bg-white/5 text-white/70 hover:text-white font-medium transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

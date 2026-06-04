"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Truck, Menu, X, ArrowRight, Phone } from "lucide-react";
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
      {/* Top Bar for Contacts */}
      <div className="fixed top-0 left-0 right-0 bg-slate-900 text-slate-300 py-1.5 px-4 text-[10px] sm:text-xs font-semibold border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="tel:+919680706799" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="w-3 h-3 text-indigo-400" />
              <span>Sales: +91 96807 06799</span>
            </a>
            <a href="tel:+919998060916" className="hidden sm:flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="w-3 h-3 text-indigo-400" />
              <span>Support: +91 99980 60916</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold uppercase tracking-wider">7-Day Free Trial</span>
          </div>
        </div>
      </div>

      <header
        className={`fixed top-7 sm:top-8 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200 py-3.5 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left side: Logo */}
            <Link href="#home" onClick={(e) => handleScrollTo(e, "#home")} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
                <Truck className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                  Truck<span className="text-indigo-600">Bilty</span>
                </span>
                <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
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
                  className="text-slate-600 hover:text-indigo-600 text-sm font-semibold transition-colors relative group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* Right side: Hamburger and CTAs */}
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger menu trigger button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden flex items-center justify-center p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
              </button>

              {/* Login & Sign Up buttons (always visible on the right side) */}
              <Link
                href="/login"
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors hover:bg-slate-50 rounded-lg sm:px-4 sm:py-2 border border-slate-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1.5 sm:px-4.5 sm:py-2"
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
              className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="md:hidden fixed top-24 left-0 right-0 z-40 p-6 bg-white border-b border-slate-200 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className="px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-indigo-600 font-semibold transition-colors text-sm"
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

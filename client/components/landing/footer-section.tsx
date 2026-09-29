"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { AnimatedWave } from "./animated-wave";

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Integrations", href: "#integrations" },
  ],
  Developers: [
    { name: "Documentation", href: "#developers" },
    { name: "API Reference", href: "#" },
    { name: "SDK", href: "#developers" },
    { name: "Status", href: "#" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#", badge: "Hiring" },
    { name: "Contact", href: "#" },
  ],
  Legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Security", href: "#security" },
  ],
};

const socialLinks = [
  { name: "Twitter", href: "#" },
  { name: "GitHub", href: "#" },
  { name: "LinkedIn", href: "#" },
];

const themeColors = [
  { name: "Default (Slate)", hex: "#ffffff", hsl: "" },
  { name: "Orange", hex: "#f97316", hsl: "hsl(24.6, 95%, 53.1%)" },
  { name: "Blue", hex: "#3b82f6", hsl: "hsl(221.2, 83.2%, 53.3%)" },
  { name: "Green", hex: "#22c55e", hsl: "hsl(142.1, 76.2%, 36.3%)" },
  { name: "Purple", hex: "#a855f7", hsl: "hsl(262.1, 83.3%, 57.8%)" },
  { name: "Yellow", hex: "#eab308", hsl: "hsl(47.9, 95.8%, 53.1%)" },
];

export function FooterSection() {
  const [activeColor, setActiveColor] = useState(themeColors[0].hex);

  const changeThemeColor = (color: typeof themeColors[0]) => {
    setActiveColor(color.hex);
    if (color.name === "Default (Slate)") {
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-foreground');
    } else {
      document.documentElement.style.setProperty('--primary', color.hsl);
      document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');
    }
  };

  return (
    <footer className="relative border-t border-foreground/10">
      {/* Animated wave background */}
      <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href="#" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display">ClaimClear</span>
                <span className="text-xs text-muted-foreground font-mono">Beta</span>
              </a>

              <p className="text-muted-foreground leading-relaxed mb-8 max-w-xs">
                The intelligent engine for HackMatrix 5.0. Understand insurance policies instantly.
              </p>

              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                      >
                        {link.name}
                        {"badge" in link && link.badge && (
                          <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2026 ClaimClear Prototype. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {/* Custom Interactive Color Picker */}
            <div className="flex items-center gap-3 bg-foreground/5 px-4 py-2 rounded-full border border-foreground/10">
              <span className="text-[10px] uppercase font-mono text-muted-foreground mr-2">Theme Color:</span>
              {themeColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => changeThemeColor(color)}
                  className="relative group w-5 h-5 flex items-center justify-center transition-transform hover:scale-125"
                  title={color.name}
                >
                  <span
                    className={`w-3 h-3 rounded-full transition-all duration-300 z-10 ${color.name === 'Default (Slate)' ? 'bg-foreground' : ''}`}
                    style={color.name !== 'Default (Slate)' ? { backgroundColor: color.hex } : undefined}
                  />
                  <span
                    className={`absolute inset-0 border rounded-full transition-all duration-300 ${activeColor === color.hex ? 'scale-100 opacity-100' : 'scale-50 opacity-0 group-hover:scale-90 group-hover:opacity-50'}`}
                    style={color.name !== 'Default (Slate)' ? { borderColor: activeColor === color.hex ? color.hex : 'var(--foreground)' } : { borderColor: 'var(--foreground)' }}
                  />
                </button>
              ))}
            </div>

            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

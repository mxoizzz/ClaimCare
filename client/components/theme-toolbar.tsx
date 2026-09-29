"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

const themeColors = [
    { name: "Orange", hex: "#f97316", hsl: "24.6 95% 53.1%" },
    { name: "Blue", hex: "#3b82f6", hsl: "221.2 83.2% 53.3%" },
    { name: "Green", hex: "#22c55e", hsl: "142.1 76.2% 36.3%" },
    { name: "Purple", hex: "#a855f7", hsl: "262.1 83.3% 57.8%" },
    { name: "Yellow", hex: "#eab308", hsl: "47.9 95.8% 53.1%" },
];

export function ThemeToolbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [activeColor, setActiveColor] = useState(themeColors[0].hex);

    useEffect(() => {
        setMounted(true);
    }, []);

    const changeThemeColor = (color: typeof themeColors[0]) => {
        setActiveColor(color.hex);
        document.documentElement.style.setProperty('--primary', color.hsl);
        // Force the orange/primary tailwind classes to visually update properly across backgrounds
        document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');
    };

    if (!mounted) return null;

    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 p-4 border-l border-foreground/10 bg-background/50 backdrop-blur-xl z-50 rounded-l-2xl shadow-2xl">
            {/* Light / Dark Mode switch */}
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-3 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                title="Toggle Theme"
            >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-foreground/70" /> : <Moon className="w-4 h-4 text-foreground/70" />}
            </button>

            {/* Separator */}
            <div className="w-full relative flex flex-col items-center justify-center pt-2">
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-muted-foreground mb-4">Color</span>

                <div className="flex flex-col gap-4">
                    {themeColors.map(color => (
                        <button
                            key={color.name}
                            onClick={() => changeThemeColor(color)}
                            className="relative group w-6 h-6 flex items-center justify-center transition-transform hover:scale-125"
                            title={color.name}
                        >
                            <span
                                className="w-3 h-3 rounded-full transition-transform duration-300 z-10 block"
                                style={{ backgroundColor: color.hex }}
                            />
                            {/* Micro-interaction selection ring */}
                            <span
                                className={`absolute inset-0 border border-foreground/30 rounded-full transition-all duration-300 ${activeColor === color.hex ? 'scale-100 opacity-100 border-primary' : 'scale-50 opacity-0 group-hover:scale-90 group-hover:opacity-50'}`}
                                style={{ borderColor: activeColor === color.hex ? color.hex : undefined }}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Selected Action Indicator (Large) */}
            <div className="mt-4 pt-6 border-t border-foreground/10 w-full flex justify-center">
                <div
                    className="w-10 h-10 rounded-full border-2 border-foreground/20 flex items-center justify-center transition-all duration-500 animate-pulse"
                    style={{ borderColor: activeColor }}
                >
                    <div className="w-4 h-4 rounded-full transition-colors duration-500" style={{ backgroundColor: activeColor }} />
                </div>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState, useRef } from "react";

function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div ref={ref} className="text-6xl lg:text-8xl font-display tracking-tight">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

const metrics = [
  {
    value: 2847392,
    suffix: "",
    prefix: "",
    label: "API requests today",
  },
  {
    value: 99,
    suffix: ".99%",
    prefix: "",
    label: "Uptime this quarter",
  },
  {
    value: 23,
    suffix: "ms",
    prefix: "",
    label: "Average response time",
  },
  {
    value: 184,
    suffix: "",
    prefix: "",
    label: "Countries served",
  },
];

export function MetricsSection() {
  const [time, setTime] = useState<Date | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="studio" ref={sectionRef} className="relative py-24 lg:py-32 border-y border-white/10 bg-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-24">
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-orange-500 uppercase tracking-widest mb-6">
              <span className="w-8 h-px bg-orange-500/50" />
              Live Metrics
            </span>
            <h2
              className={`text-4xl lg:text-5xl font-mono uppercase tracking-[0.1em] text-white transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
            >
              System Performance
            </h2>
          </div>
          <div className="flex items-center gap-4 font-mono text-sm text-white/50 bg-[#111111] px-4 py-2 border border-white/10">
            <span className="flex items-center gap-2 text-orange-500">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              LIVE
            </span>
            <span className="text-white/30">|</span>
            <span>{time ? time.toLocaleTimeString() : "--:--:--"}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/10">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`bg-[#0D0D0D] p-8 lg:p-12 hover:bg-[#111111] transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-orange-500">
                <AnimatedCounter
                  end={typeof metric.value === 'number' ? metric.value : 0}
                  suffix={metric.suffix}
                  prefix={metric.prefix}
                />
              </div>
              <div className="mt-4 text-xs font-mono tracking-widest uppercase text-white/50">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

export default function DropCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (n) => String(n).padStart(2, '0');

  return (
    <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#121722] border border-[#FF1E27]/40">
      <div className="flex items-center gap-1.5 text-[#FF1E27] text-xs font-mono font-bold uppercase tracking-wider">
        <Flame className="w-3.5 h-3.5 animate-bounce" />
        <span>Drop Eksklusif Pro Kit:</span>
      </div>
      <div className="flex items-center gap-1 font-mono text-xs font-black text-white">
        <span className="px-2 py-0.5 rounded bg-[#0A0D14] border border-[#20293A] text-[#FFD000]">
          {format(timeLeft.hours)}j
        </span>
        <span className="text-gray-500">:</span>
        <span className="px-2 py-0.5 rounded bg-[#0A0D14] border border-[#20293A] text-[#FFD000]">
          {format(timeLeft.minutes)}m
        </span>
        <span className="text-gray-500">:</span>
        <span className="px-2 py-0.5 rounded bg-[#0A0D14] border border-[#20293A] text-[#FF1E27]">
          {format(timeLeft.seconds)}s
        </span>
      </div>
    </div>
  );
}

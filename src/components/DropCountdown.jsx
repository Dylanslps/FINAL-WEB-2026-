'use client';

import { useState, useEffect } from 'react';
import { Flame, Clock } from 'lucide-react';

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
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#151A23]/90 border border-[#FF5E00]/40 backdrop-blur-md">
      <div className="flex items-center gap-1.5 text-[#FF5E00] text-xs font-mono font-bold uppercase tracking-wider">
        <Flame className="w-4 h-4 animate-bounce" />
        <span>Drop Eksklusif Berakhir:</span>
      </div>
      <div className="flex items-center gap-1 font-mono text-xs font-extrabold text-white">
        <span className="px-2 py-1 rounded bg-[#0B0E14] border border-[#262E3D] text-[#00F0FF]">
          {format(timeLeft.hours)}j
        </span>
        <span className="text-gray-500">:</span>
        <span className="px-2 py-1 rounded bg-[#0B0E14] border border-[#262E3D] text-[#00F0FF]">
          {format(timeLeft.minutes)}m
        </span>
        <span className="text-gray-500">:</span>
        <span className="px-2 py-1 rounded bg-[#0B0E14] border border-[#262E3D] text-[#FF5E00]">
          {format(timeLeft.seconds)}s
        </span>
      </div>
    </div>
  );
}

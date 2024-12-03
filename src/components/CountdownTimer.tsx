import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  months: number;
  days: number;
  hours: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { months: 0, days: 0, hours: 0 };
  }

  // Calculate months difference
  let months = (target.getFullYear() - now.getFullYear()) * 12;
  months += target.getMonth() - now.getMonth();
  
  // Calculate remaining days
  const monthStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const daysDiff = Math.floor((targetDay.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
  const days = daysDiff % 30;

  // Calculate remaining hours
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return { months, days, hours };
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000 * 60); // Update every minute

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.months === 0 && timeLeft.days === 0 && timeLeft.hours === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-1 bg-gray-800 px-4 py-2 rounded-lg border border-lime-500/30">
      <div className="text-xs text-gray-400 flex items-center space-x-1">
        <Timer className="w-4 h-4 text-lime-500" />
        <span>End of registrations in:</span>
      </div>
      <div className="flex items-center space-x-4 text-gray-200">
        {timeLeft.months > 0 && (
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-bold text-lime-500">{timeLeft.months}</span>
            <span className="text-sm text-gray-400">months</span>
          </div>
        )}
        {timeLeft.days > 0 && (
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-bold text-lime-500">{timeLeft.days}</span>
            <span className="text-sm text-gray-400">days</span>
          </div>
        )}
        <div className="flex items-baseline space-x-1">
          <span className="text-xl font-bold text-lime-500">{timeLeft.hours}</span>
          <span className="text-sm text-gray-400">hours</span>
        </div>
      </div>
    </div>
  );
}
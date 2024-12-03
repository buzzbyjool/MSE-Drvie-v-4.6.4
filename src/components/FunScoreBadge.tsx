import { Trophy } from 'lucide-react';
import { getFunScoreRating } from '../utils/funScore';

interface FunScoreBadgeProps {
  score: number;
  className?: string;
}

export default function FunScoreBadge({ score, className = '' }: FunScoreBadgeProps) {
  const rating = getFunScoreRating(score);

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${rating.color} 
                    shadow-lg group transition-transform hover:scale-105`}>
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-white" />
          <div className="text-white">
            <span className="font-bold">{rating.label}</span>
            <span className="mx-2">•</span>
            <span className="font-medium">{score}</span>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-400 hidden sm:block">
        {rating.description}
      </div>
    </div>
  );
}
interface RouteMetrics {
  curveCount: number;
  distance: number;
  elevationGain: number;
  elevationLoss: number;
  maxElevation: number;
}

export function calculateFunScore(metrics: RouteMetrics): number {
  // Normalize each metric to a 0-100 scale
  const normalizedCurves = Math.min((metrics.curveCount / 50) * 100, 100); // Assuming 50 curves is "maximum fun"
  const normalizedElevationGain = Math.min((metrics.elevationGain / 2000) * 100, 100); // 2000m as max
  const normalizedElevationLoss = Math.min((metrics.elevationLoss / 2000) * 100, 100);
  const normalizedMaxElevation = Math.min((metrics.maxElevation / 3000) * 100, 100); // 3000m as max
  
  // Weighted scoring formula
  const weights = {
    curves: 0.4,        // 40% weight for curves
    elevationGain: 0.2, // 20% weight for elevation gain
    elevationLoss: 0.2, // 20% weight for elevation loss
    maxElevation: 0.2   // 20% weight for max elevation
  };

  const score = (
    normalizedCurves * weights.curves +
    normalizedElevationGain * weights.elevationGain +
    normalizedElevationLoss * weights.elevationLoss +
    normalizedMaxElevation * weights.maxElevation
  );

  return Math.round(score);
}

export function getFunScoreRating(score: number): {
  label: string;
  color: string;
  description: string;
} {
  if (score >= 90) {
    return {
      label: 'Epic',
      color: 'from-purple-500 to-pink-500',
      description: 'Exceptional driving experience'
    };
  } else if (score >= 75) {
    return {
      label: 'Thrilling',
      color: 'from-red-500 to-orange-500',
      description: 'Highly engaging route'
    };
  } else if (score >= 60) {
    return {
      label: 'Exciting',
      color: 'from-lime-500 to-green-500',
      description: 'Very enjoyable drive'
    };
  } else if (score >= 45) {
    return {
      label: 'Fun',
      color: 'from-cyan-500 to-blue-500',
      description: 'Good driving experience'
    };
  } else {
    return {
      label: 'Casual',
      color: 'from-gray-500 to-slate-500',
      description: 'Relaxed driving experience'
    };
  }
}
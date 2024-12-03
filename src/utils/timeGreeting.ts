interface TimeInfo {
  greeting: string;
  bgClass: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export function getTimeBasedGreeting(): {
  greeting: string;
  bgClass: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
} {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Good Morning',
      bgClass: 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 border border-lime-500/20',
      timeOfDay: 'morning'
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: 'Good Afternoon',
      bgClass: 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 border border-lime-500/20',
      timeOfDay: 'afternoon'
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: 'Good Evening',
      bgClass: 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 border border-lime-500/20',
      timeOfDay: 'evening'
    };
  } else {
    return {
      greeting: 'Good Night',
      bgClass: 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 border border-lime-500/20',
      timeOfDay: 'night'
    };
  }
}
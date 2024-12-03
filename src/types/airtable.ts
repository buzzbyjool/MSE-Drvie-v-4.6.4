// Mobile App Users Table Types
export interface MobileUser {
  id: string;
  username: string;
  role: 'Administrateur' | 'User';
  region: Region;
  status: 'Active' | 'Inactive';
}

// Events Table Types
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  status: 'Active' | 'Inactive';
  privacy: 'Public' | 'Admin' | Region;
}

// GPX Route Types
export interface GPXRoute {
  id: string;
  gpxFileUrl?: string;
  title: string;
  startLocation: string;
  endLocation: string;
  distance?: string;
  duration?: string;
  maxElevation?: string;
  status: 'Active' | 'Pending' | 'Inactive';
  user: string;
}

// Valid regions
export type Region = 
  | 'France-Nord'
  | 'France-Sud'
  | 'France-Est'
  | 'France-Ouest'
  | 'Luxembourg'
  | 'Belgique'
  | 'Andorre';
export interface Event {
  id: string;
  name: string;
  description: string;
  image?: string;
  status: 'Active' | 'Inactive';
  startDate: string;
  endDate: string;
  price: number;
  registered: string[];
  maxCars: number;
  reservedCount: number;
}

export interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

export interface RegistrationStatus {
  isRegistered: boolean;
  isFull: boolean;
  currentCount: number;
  maxCars: number;
}
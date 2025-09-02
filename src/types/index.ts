export interface Driver {
  id: string;
  name: string;
  license: string;
  createdAt: string;
}

export interface Truck {
  id: string;
  plateNumber: string;
  model: string;
  year: number;
  tankCapacity: number;
  createdAt: string;
}

export interface FuelTank {
  id: string;
  type: 'gasoil' | 'adblue';
  capacity: number;
  currentLevel: number;
  pricePerLiter: number;
  lastRefill: string;
  totalValue: number;
}

export interface FuelTransaction {
  id: string;
  type: 'refill' | 'consumption';
  fuelType: 'gasoil' | 'adblue';
  amount: number;
  pricePerLiter: number;
  totalCost: number;
  driverId?: string;
  truckId?: string;
  date: string;
  notes?: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  isAuthenticated: boolean;
}
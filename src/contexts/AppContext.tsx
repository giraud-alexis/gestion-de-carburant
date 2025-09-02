import React, { createContext, useContext, useEffect, useState } from "react";
import { Driver, Truck, FuelTank, FuelTransaction, User } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface AppContextType {
  // Auth
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // Data
  drivers: Driver[];
  trucks: Truck[];
  fuelTanks: FuelTank[];
  transactions: FuelTransaction[];

  // Actions
  addDriver: (driver: Omit<Driver, "id" | "createdAt">) => void;
  deleteDriver: (id: string) => void;
  addTruck: (truck: Omit<Truck, "id" | "createdAt">) => void;
  deleteTruck: (id: string) => void;
  updateFuelTank: (id: string, updates: Partial<FuelTank>) => void;
  addTransaction: (transaction: Omit<FuelTransaction, "id">) => void;

  // Tank management
  updateTankCapacity: (id: string, newCapacity: number) => void;

  // Security
  preventClose: boolean;
  setPreventClose: (prevent: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [drivers, setDrivers] = useLocalStorage<Driver[]>("drivers", []);
  const [trucks, setTrucks] = useLocalStorage<Truck[]>("trucks", []);
  const [fuelTanks, setFuelTanks] = useLocalStorage<FuelTank[]>("fuelTanks", [
    {
      id: "1",
      type: "gasoil",
      capacity: 5000,
      currentLevel: 0,
      pricePerLiter: 1.0,
      lastRefill: new Date().toISOString(),
      totalValue: 0,
    },
    {
      id: "2",
      type: "adblue",
      capacity: 1000,
      currentLevel: 0,
      pricePerLiter: 0.8,
      lastRefill: new Date().toISOString(),
      totalValue: 0,
    },
  ]);
  const [transactions, setTransactions] = useLocalStorage<FuelTransaction[]>(
    "transactions",
    []
  );
  const [preventClose, setPreventClose] = useState(true);

  const login = (username: string, password: string): boolean => {
    // Simple authentication - in production, use proper authentication
    if (username === "mathieu" && password === "mathieu5442") {
      const newUser: User = {
        id: "1",
        username,
        role: "admin",
        isAuthenticated: true,
      };
      setUser(newUser);
      return true;
    } else if (username === "employee") {
      const newUser: User = {
        id: "2",
        username: "Employé",
        role: "user",
        isAuthenticated: true,
      };
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addDriver = (driverData: Omit<Driver, "id" | "createdAt">) => {
    const newDriver: Driver = {
      ...driverData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setDrivers((prev) => [...prev, newDriver]);
  };

  const deleteDriver = (id: string) => {
    setDrivers((prev) => prev.filter(driver => driver.id !== id));
  };

  const addTruck = (truckData: Omit<Truck, "id" | "createdAt">) => {
    const newTruck: Truck = {
      ...truckData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTrucks((prev) => [...prev, newTruck]);
  };

  const deleteTruck = (id: string) => {
    setTrucks((prev) => prev.filter(truck => truck.id !== id));
  };

  const updateFuelTank = (id: string, updates: Partial<FuelTank>) => {
    setFuelTanks((prev) =>
      prev.map((tank) => (tank.id === id ? { ...tank, ...updates } : tank))
    );
  };

  const addTransaction = (transactionData: Omit<FuelTransaction, "id">) => {
    const newTransaction: FuelTransaction = {
      ...transactionData,
      id: Date.now().toString(),
    };

    // Update fuel tank levels
    if (transactionData.type === "refill") {
      setFuelTanks((prev) =>
        prev.map((tank) => {
          if (tank.type === transactionData.fuelType) {
            const newLevel = Math.min(
              tank.capacity,
              tank.currentLevel + transactionData.amount
            );
            return {
              ...tank,
              currentLevel: newLevel,
              totalValue: newLevel * transactionData.pricePerLiter,
              pricePerLiter: transactionData.pricePerLiter,
              lastRefill: transactionData.date,
            };
          }
          return tank;
        })
      );
    } else if (transactionData.type === "consumption") {
      setFuelTanks((prev) =>
        prev.map((tank) => {
          if (tank.type === transactionData.fuelType) {
            const newLevel = Math.max(
              0,
              tank.currentLevel - transactionData.amount
            );
            return {
              ...tank,
              currentLevel: newLevel,
              totalValue: newLevel * tank.pricePerLiter,
            };
          }
          return tank;
        })
      );
    }

    setTransactions((prev) => [...prev, newTransaction]);
  };

  const updateTankCapacity = (id: string, newCapacity: number) => {
    setFuelTanks((prev) =>
      prev.map((tank) => {
        if (tank.id === id) {
          // Ensure current level doesn't exceed new capacity
          const adjustedLevel = Math.min(tank.currentLevel, newCapacity);
          return {
            ...tank,
            capacity: newCapacity,
            currentLevel: adjustedLevel,
            totalValue: adjustedLevel * tank.pricePerLiter,
          };
        }
        return tank;
      })
    );
  };

  // Prevent browser close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (preventClose && user?.isAuthenticated) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [preventClose, user]);

  const value: AppContextType = {
    user,
    login,
    logout,
    drivers,
    trucks,
    fuelTanks,
    transactions,
    addDriver,
    deleteDriver,
    addTruck,
    deleteTruck,
    updateFuelTank,
    addTransaction,
    updateTankCapacity,
    preventClose,
    setPreventClose,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

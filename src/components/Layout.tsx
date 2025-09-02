import React, { useState } from "react";
import {
  Truck,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Fuel,
  Home,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { logout, user } = useApp();

  const allNavigation = [
    { name: "Tableau de bord", icon: Home, id: "dashboard" },
    { name: "Pleins", icon: Fuel, id: "fuel" },
    { name: "Camions", icon: Truck, id: "trucks" },
    { name: "Chauffeurs", icon: Users, id: "drivers" },
    { name: "Rapports", icon: BarChart3, id: "reports" },
    { name: "Paramètres", icon: Settings, id: "settings" },
  ];

  // Filter navigation based on user role
  const navigation =
    user?.role === "admin"
      ? allNavigation
      : allNavigation.filter((item) => ["dashboard", "fuel"].includes(item.id));

  const handleLogout = () => {
    if (user?.role === "user") {
      // Pour les employés, ouvrir la modal
      setShowLogoutModal(true);
      setAdminPassword("");
      setPasswordError("");
    } else {
      // Pour les admins, confirmation simple
      if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
        logout();
      }
    }
  };

  const handleModalLogout = () => {
    if (adminPassword === "mathieu5442") {
      setShowLogoutModal(false);
      logout();
    } else {
      setPasswordError("Mot de passe administrateur incorrect");
    }
  };

  const handleModalCancel = () => {
    setShowLogoutModal(false);
    setAdminPassword("");
    setPasswordError("");
  };

  const handlePasswordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleModalLogout();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-slate-900">
          <div className="flex items-center space-x-2">
            <Truck className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">FuelManager</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          {navigation.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white border-r-2 border-blue-400"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-slate-700 rounded-lg p-3 mb-4">
            <div className="text-sm text-gray-300">Connecté en tant que:</div>
            <div className="text-white font-medium">
              {user?.username}
              {user?.role === "user" && (
                <span className="ml-2 text-xs bg-green-600 px-2 py-1 rounded-full">
                  Employé
                </span>
              )}
              {user?.role === "admin" && (
                <span className="ml-2 text-xs bg-blue-600 px-2 py-1 rounded-full">
                  Admin
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>

            <h1 className="text-xl font-semibold text-gray-900 capitalize">
              {navigation.find((nav) => nav.id === currentPage)?.name ||
                "Dashboard"}
            </h1>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          {children}
        </main>
      </div>

      {/* Logout Modal for Employees */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4 text-center">
              Déconnexion Employé
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Mot de passe administrateur requis pour la déconnexion
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe administrateur
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setPasswordError("");
                  }}
                  onKeyPress={handlePasswordKeyPress}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Entrez le mot de passe admin"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-600 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleModalCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleModalLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

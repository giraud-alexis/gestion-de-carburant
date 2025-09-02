import React, { useState } from 'react';
import { Plus, Fuel } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function FuelPage() {
  const { drivers, trucks, fuelTanks, addTransaction, user } = useApp();
  const [showRefillForm, setShowRefillForm] = useState(false);
  const [showConsumptionForm, setShowConsumptionForm] = useState(false);
  
  const [refillForm, setRefillForm] = useState({
    fuelType: 'gasoil' as 'gasoil' | 'adblue',
    amount: '',
    pricePerLiter: '',
    notes: ''
  });
  
  const [consumptionForm, setConsumptionForm] = useState({
    fuelType: 'gasoil' as 'gasoil' | 'adblue',
    amount: '',
    driverId: '',
    truckId: '',
    notes: ''
  });

  // Force focus on modal inputs after render
  React.useEffect(() => {
    if (showRefillForm || showConsumptionForm) {
      const timer = setTimeout(() => {
        const firstInput = document.querySelector('input[type="number"], select') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showRefillForm, showConsumptionForm]);

  const handleRefill = (e: React.FormEvent) => {
    e.preventDefault();
    const tank = fuelTanks.find(t => t.type === refillForm.fuelType);
    if (!tank) return;

    addTransaction({
      type: 'refill',
      fuelType: refillForm.fuelType,
      amount: parseFloat(refillForm.amount),
      pricePerLiter: parseFloat(refillForm.pricePerLiter),
      totalCost: parseFloat(refillForm.amount) * parseFloat(refillForm.pricePerLiter),
      date: new Date().toISOString(),
      notes: refillForm.notes
    });

    setRefillForm({ fuelType: 'gasoil', amount: '', pricePerLiter: '', notes: '' });
    setShowRefillForm(false);
  };

  const handleConsumption = (e: React.FormEvent) => {
    e.preventDefault();
    const tank = fuelTanks.find(t => t.type === consumptionForm.fuelType);
    if (!tank) return;

    addTransaction({
      type: 'consumption',
      fuelType: consumptionForm.fuelType,
      amount: parseFloat(consumptionForm.amount),
      pricePerLiter: tank.pricePerLiter,
      totalCost: parseFloat(consumptionForm.amount) * tank.pricePerLiter,
      driverId: consumptionForm.driverId,
      truckId: consumptionForm.truckId,
      date: new Date().toISOString(),
      notes: consumptionForm.notes
    });

    setConsumptionForm({ fuelType: 'gasoil', amount: '', driverId: '', truckId: '', notes: '' });
    setShowConsumptionForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowRefillForm(true)}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Remplir Cuve
          </button>
        )}
        <button
          onClick={() => setShowConsumptionForm(true)}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Fuel className="h-5 w-5 mr-2" />
          Enregistrer Plein
        </button>
      </div>

      {/* Tank Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fuelTanks.map((tank) => {
          const percentage = (tank.currentLevel / tank.capacity) * 100;
          const isLow = percentage < 20;
          
          return (
            <div key={tank.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold capitalize flex items-center">
                  <Fuel className="h-6 w-6 mr-2 text-blue-600" />
                  Cuve {tank.type === 'gasoil' ? 'Gasoil' : 'AdBlue'}
                </h3>
                {isLow && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    Stock faible
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Capacité:</span>
                    <div className="font-semibold">{tank.capacity}L</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Niveau actuel:</span>
                    <div className="font-semibold">{tank.currentLevel.toFixed(0)}L</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Prix/Litre:</span>
                    <div className="font-semibold">{tank.pricePerLiter.toFixed(3)}€</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Valeur totale:</span>
                    <div className="font-semibold text-green-600">{tank.totalValue.toFixed(2)}€</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Niveau</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${
                        isLow ? 'bg-red-500' : percentage < 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Refill Form Modal */}
      {showRefillForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Remplir Cuve</h3>
            <form onSubmit={handleRefill} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de carburant
                </label>
                <select
                  value={refillForm.fuelType}
                  onChange={(e) => setRefillForm(prev => ({ ...prev, fuelType: e.target.value as 'gasoil' | 'adblue' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gasoil">Gasoil</option>
                  <option value="adblue">AdBlue</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité (Litres)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={refillForm.amount}
                  onChange={(e) => setRefillForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix par litre (€)
                </label>
                <input
                  type="number"
                  step="0.001"
                  required
                  value={refillForm.pricePerLiter}
                  onChange={(e) => setRefillForm(prev => ({ ...prev, pricePerLiter: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optionnel)
                </label>
                <textarea
                  value={refillForm.notes}
                  onChange={(e) => setRefillForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              {refillForm.amount && refillForm.pricePerLiter && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="text-sm text-blue-800">
                    Coût total: <span className="font-bold">
                      {(parseFloat(refillForm.amount) * parseFloat(refillForm.pricePerLiter)).toFixed(2)}€
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRefillForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Consumption Form Modal */}
      {showConsumptionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Enregistrer un Plein</h3>
            <form onSubmit={handleConsumption} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de carburant
                </label>
                <select
                  value={consumptionForm.fuelType}
                  onChange={(e) => setConsumptionForm(prev => ({ ...prev, fuelType: e.target.value as 'gasoil' | 'adblue' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gasoil">Gasoil</option>
                  <option value="adblue">AdBlue</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantité (Litres)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={consumptionForm.amount}
                  onChange={(e) => setConsumptionForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chauffeur
                </label>
                <select
                  value={consumptionForm.driverId}
                  onChange={(e) => setConsumptionForm(prev => ({ ...prev, driverId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un chauffeur</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>{driver.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Camion
                </label>
                <select
                  value={consumptionForm.truckId}
                  onChange={(e) => setConsumptionForm(prev => ({ ...prev, truckId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un camion</option>
                  {trucks.map(truck => (
                    <option key={truck.id} value={truck.id}>
                      {truck.plateNumber} - {truck.model}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optionnel)
                </label>
                <textarea
                  value={consumptionForm.notes}
                  onChange={(e) => setConsumptionForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              {consumptionForm.amount && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="text-sm text-blue-800">
                    Coût: <span className="font-bold">
                      {(parseFloat(consumptionForm.amount) * (fuelTanks.find(t => t.type === consumptionForm.fuelType)?.pricePerLiter || 0)).toFixed(2)}€
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConsumptionForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
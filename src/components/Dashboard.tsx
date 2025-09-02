import React from 'react';
import { Fuel, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function Dashboard() {
  const { fuelTanks, transactions, drivers, trucks } = useApp();

  const recentTransactions = transactions
    .slice(-5)
    .reverse();

  const totalValue = fuelTanks.reduce((sum, tank) => sum + tank.totalValue, 0);
  
  const todayTransactions = transactions.filter(t => 
    new Date(t.date).toDateString() === new Date().toDateString()
  );

  const todayConsumption = todayTransactions
    .filter(t => t.type === 'consumption')
    .reduce((sum, t) => sum + t.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valeur Stock Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalValue.toFixed(2)}€</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Fuel className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consommation Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">{todayConsumption.toFixed(2)}€</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chauffeurs Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Camions Enregistrés</p>
              <p className="text-2xl font-bold text-gray-900">{trucks.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Fuel className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Fuel Tanks Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fuelTanks.map((tank) => {
          const percentage = (tank.currentLevel / tank.capacity) * 100;
          const isLow = percentage < 20;
          
          return (
            <div key={tank.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold capitalize">
                  Cuve {tank.type === 'gasoil' ? 'Gasoil' : 'AdBlue'}
                </h3>
                {isLow && (
                  <div className="flex items-center text-red-600">
                    <AlertTriangle className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Stock faible</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Niveau actuel</span>
                  <span>{tank.currentLevel.toFixed(0)}L / {tank.capacity}L</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isLow ? 'bg-red-500' : percentage < 50 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Prix/L: {tank.pricePerLiter.toFixed(2)}€</span>
                  <span className="font-medium text-gray-900">
                    Valeur: {tank.totalValue.toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Dernières Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carburant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coût
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'refill' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.type === 'refill' ? 'Remplissage' : 'Consommation'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {transaction.fuelType === 'gasoil' ? 'Gasoil' : 'AdBlue'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.amount}L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.totalCost.toFixed(2)}€
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Aucune transaction enregistrée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
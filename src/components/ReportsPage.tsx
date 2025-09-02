import React, { useState } from 'react';
import { BarChart3, Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function ReportsPage() {
  const { transactions, drivers, trucks, fuelTanks } = useApp();
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    return transactionDate >= startDate && transactionDate <= endDate;
  });

  const stats = {
    totalConsumption: filteredTransactions
      .filter(t => t.type === 'consumption')
      .reduce((sum, t) => sum + t.totalCost, 0),
    totalRefills: filteredTransactions
      .filter(t => t.type === 'refill')
      .reduce((sum, t) => sum + t.totalCost, 0),
    gasoilConsumption: filteredTransactions
      .filter(t => t.type === 'consumption' && t.fuelType === 'gasoil')
      .reduce((sum, t) => sum + t.amount, 0),
    adblueConsumption: filteredTransactions
      .filter(t => t.type === 'consumption' && t.fuelType === 'adblue')
      .reduce((sum, t) => sum + t.amount, 0)
  };

  const driverStats = drivers.map(driver => {
    const driverTransactions = filteredTransactions.filter(t => t.driverId === driver.id);
    return {
      driver,
      totalConsumption: driverTransactions.reduce((sum, t) => sum + t.totalCost, 0),
      totalLiters: driverTransactions.reduce((sum, t) => sum + t.amount, 0),
      transactionCount: driverTransactions.length
    };
  }).filter(stat => stat.transactionCount > 0);

  const truckStats = trucks.map(truck => {
    const truckTransactions = filteredTransactions.filter(t => t.truckId === truck.id);
    return {
      truck,
      totalConsumption: truckTransactions.reduce((sum, t) => sum + t.totalCost, 0),
      totalLiters: truckTransactions.reduce((sum, t) => sum + t.amount, 0),
      transactionCount: truckTransactions.length
    };
  }).filter(stat => stat.transactionCount > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Rapports et Statistiques</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            />
            <span className="text-gray-500">à</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Coût Total Consommation</p>
              <p className="text-2xl font-bold text-red-600">{stats.totalConsumption.toFixed(2)}€</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Coût Total Remplissage</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalRefills.toFixed(2)}€</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gasoil Consommé</p>
              <p className="text-2xl font-bold text-blue-600">{stats.gasoilConsumption.toFixed(0)}L</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AdBlue Consommé</p>
              <p className="text-2xl font-bold text-purple-600">{stats.adblueConsumption.toFixed(0)}L</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Driver Statistics */}
      {driverStats.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Statistiques par Chauffeur</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chauffeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pleins
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Litres
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coût Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coût Moyen/Plein
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {driverStats.map((stat) => (
                  <tr key={stat.driver.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.driver.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.transactionCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.totalLiters.toFixed(0)}L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.totalConsumption.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.transactionCount > 0 ? (stat.totalConsumption / stat.transactionCount).toFixed(2) : '0.00'}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Truck Statistics */}
      {truckStats.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Statistiques par Camion</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Camion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pleins
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Litres
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coût Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consommation/100km*
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {truckStats.map((stat) => (
                  <tr key={stat.truck.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.truck.plateNumber} - {stat.truck.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.transactionCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.totalLiters.toFixed(0)}L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.totalConsumption.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      N/A**
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
            * Nécessite le suivi kilométrique pour calcul précis<br/>
            ** Fonctionnalité à développer
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Transactions de la Période</h3>
          <button className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            <Download className="h-4 w-4 mr-1" />
            Exporter
          </button>
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
                  Prix/L
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coût Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chauffeur
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => {
                    const driver = drivers.find(d => d.id === transaction.driverId);
                    return (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.pricePerLiter.toFixed(3)}€
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.totalCost.toFixed(2)}€
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {driver?.name || '-'}
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Aucune transaction pour cette période
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
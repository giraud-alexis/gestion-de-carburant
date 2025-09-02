import React, { useState } from 'react';
import { Plus, Truck, Calendar, Fuel } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useModalFocus } from '../hooks/useModalFocus';

export function TrucksPage() {
  const { trucks, addTruck } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    plateNumber: '',
    model: '',
    year: new Date().getFullYear(),
    tankCapacity: 200
  });

  // Use custom hook for modal focus
  useModalFocus(showForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTruck({
      ...form,
      year: parseInt(form.year.toString()),
      tankCapacity: parseInt(form.tankCapacity.toString())
    });
    setForm({
      plateNumber: '',
      model: '',
      year: new Date().getFullYear(),
      tankCapacity: 200
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Camions</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter Camion
        </button>
      </div>

      {/* Trucks Grid */}
      {trucks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trucks.map((truck) => (
            <div key={truck.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Truck className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{truck.plateNumber}</h3>
                  <p className="text-gray-600">{truck.model}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">Année: {truck.year}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Fuel className="h-4 w-4 mr-2" />
                  <span className="text-sm">Réservoir: {truck.tankCapacity}L</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    Ajouté le: {new Date(truck.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun camion enregistré</h3>
          <p className="text-gray-600 mb-6">Commencez par ajouter votre premier camion.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter le premier camion
          </button>
        </div>
      )}

      {/* Add Truck Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Ajouter un Camion</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plaque d'immatriculation
                </label>
                <input
                  type="text"
                  required
                  value={form.plateNumber}
                  onChange={(e) => setForm(prev => ({ ...prev, plateNumber: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: AB-123-CD"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modèle
                </label>
                <input
                  type="text"
                  required
                  value={form.model}
                  onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Mercedes Actros"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Année
                </label>
                <input
                  type="number"
                  required
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={form.year}
                  onChange={(e) => setForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacité réservoir (Litres)
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  max="2000"
                  value={form.tankCapacity}
                  onChange={(e) => setForm(prev => ({ ...prev, tankCapacity: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
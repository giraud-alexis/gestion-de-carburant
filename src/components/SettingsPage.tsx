import React, { useState } from 'react';
import { Shield, Database, Bell, User, Save } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function SettingsPage() {
  const { preventClose, setPreventClose, user, fuelTanks, updateTankCapacity } = useApp();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [settings, setSettings] = useState({
    preventClose,
    lowStockAlert: 20,
    notifications: true,
    autoBackup: true
  });
  const [tankCapacities, setTankCapacities] = useState(() => {
    const capacities: { [key: string]: number } = {};
    fuelTanks.forEach(tank => {
      capacities[tank.id] = tank.capacity;
    });
    return capacities;
  });

  const handleSave = () => {
    setPreventClose(settings.preventClose);
    
    // Update tank capacities
    Object.entries(tankCapacities).forEach(([tankId, capacity]) => {
      const currentTank = fuelTanks.find(t => t.id === tankId);
      if (currentTank && currentTank.capacity !== capacity) {
        updateTankCapacity(tankId, capacity);
      }
    });
    
    // In a real app, you'd save other settings too
    setShowSaveModal(true);
  };

  const handleSaveConfirm = () => {
    setShowSaveModal(false);
  };

  const handleExport = () => {
    const data = {
      drivers: JSON.parse(localStorage.getItem('drivers') || '[]'),
      trucks: JSON.parse(localStorage.getItem('trucks') || '[]'),
      fuelTanks: JSON.parse(localStorage.getItem('fuelTanks') || '[]'),
      transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fuel-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (window.confirm('Cette action remplacera toutes les données actuelles. Continuer ?')) {
          if (data.drivers) localStorage.setItem('drivers', JSON.stringify(data.drivers));
          if (data.trucks) localStorage.setItem('trucks', JSON.stringify(data.trucks));
          if (data.fuelTanks) localStorage.setItem('fuelTanks', JSON.stringify(data.fuelTanks));
          if (data.transactions) localStorage.setItem('transactions', JSON.stringify(data.transactions));
          
          alert('Données importées avec succès ! Rechargez la page pour voir les changements.');
        }
      } catch (error) {
        alert('Erreur lors de l\'importation du fichier. Vérifiez le format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold">Sécurité</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Empêcher la fermeture accidentelle</h4>
              <p className="text-sm text-gray-600">
                Active une confirmation avant fermeture de l'application
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.preventClose}
                onChange={(e) => setSettings(prev => ({ ...prev, preventClose: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex items-center">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              <div className="text-sm">
                <span className="font-medium text-blue-800">Utilisateur connecté:</span>
                <span className="text-blue-700 ml-2">{user?.username}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold">Alertes</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seuil d'alerte stock faible (%)
            </label>
            <input
              type="number"
              min="5"
              max="50"
              value={settings.lowStockAlert}
              onChange={(e) => setSettings(prev => ({ ...prev, lowStockAlert: parseInt(e.target.value) }))}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 mt-1">
              Alerte déclenchée quand le niveau descend sous ce pourcentage
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Notifications actives</h4>
              <p className="text-sm text-gray-600">
                Afficher les alertes de stock et confirmations
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Tank Capacity Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold">Capacité des Cuves</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {fuelTanks.map((tank) => (
            <div key={tank.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 ${
                  tank.type === 'gasoil' ? 'bg-blue-500' : 'bg-purple-500'
                }`} />
                <div>
                  <h4 className="font-medium text-gray-900">
                    Cuve {tank.type === 'gasoil' ? 'Gasoil' : 'AdBlue'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Niveau actuel: {tank.currentLevel.toFixed(0)}L
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1000"
                  max="50000"
                  step="100"
                  value={tankCapacities[tank.id] || tank.capacity}
                  onChange={(e) => setTankCapacities(prev => ({
                    ...prev,
                    [tank.id]: parseInt(e.target.value)
                  }))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
                <span className="text-sm text-gray-600">Litres</span>
              </div>
            </div>
          ))}
          
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Attention :</strong> Si vous réduisez la capacité en dessous du niveau actuel, 
              le niveau sera automatiquement ajusté à la nouvelle capacité maximale.
            </p>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold">Gestion des Données</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleExport}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Database className="h-4 w-4 mr-2" />
              Exporter les données
            </button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Database className="h-4 w-4 mr-2" />
                Importer des données
              </button>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> L'importation remplacera toutes les données actuelles. 
              Assurez-vous d'avoir fait une sauvegarde avant d\'importer.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder les paramètres
        </button>
      </div>

      {/* Save Confirmation Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Save className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Paramètres sauvegardés
              </h3>
              <p className="text-gray-600 mb-6">
                Vos paramètres ont été sauvegardés avec succès !
              </p>
              <button
                type="button"
                onClick={handleSaveConfirm}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
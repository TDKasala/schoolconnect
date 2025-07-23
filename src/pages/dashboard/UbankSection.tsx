import React from 'react';
import { DollarSign, Clock } from 'lucide-react';

const UbankSection: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Module Finances</h1>
        <p className="mt-2 text-gray-600">
          Gestion financière et comptabilité scolaire
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <DollarSign className="h-12 w-12 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Module Finances
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Le module de gestion financière sera bientôt disponible. Il permettra de gérer 
          les frais scolaires, les paiements, et la comptabilité de votre établissement.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-blue-600 mr-2" />
            <span className="font-medium text-blue-900">Bientôt disponible</span>
          </div>
          
          <div className="text-left space-y-3 text-blue-800">
            <h3 className="font-semibold mb-3">Fonctionnalités à venir :</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Gestion des frais scolaires et minerval
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Génération automatique de reçus
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Tableaux de bord financiers
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Suivi des dépenses de l'école
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Rapports comptables détaillés
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Vous serez notifié dès que ce module sera disponible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UbankSection;

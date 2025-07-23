import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';

const MessagerieSection: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messagerie</h1>
        <p className="mt-2 text-gray-600">
          Communication en temps réel entre tous les acteurs
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="h-12 w-12 text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Messagerie Intégrée
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Le système de messagerie en temps réel sera bientôt disponible pour faciliter 
          la communication entre enseignants, parents et administration.
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
                Chat en temps réel
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Conversations de groupe
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Partage de fichiers
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Notifications push
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagerieSection;

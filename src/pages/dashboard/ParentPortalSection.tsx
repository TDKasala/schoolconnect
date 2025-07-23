import React from 'react';
import { Users, Clock } from 'lucide-react';

const ParentPortalSection: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Portail Parents</h1>
        <p className="mt-2 text-gray-600">
          Communication et suivi avec les parents d'élèves
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="h-12 w-12 text-purple-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Portail Parents
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Le portail de communication avec les parents sera bientôt disponible. 
          Il permettra un suivi en temps réel et une communication fluide.
        </p>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-purple-600 mr-2" />
            <span className="font-medium text-purple-900">Bientôt disponible</span>
          </div>
          
          <div className="text-left space-y-3 text-purple-800">
            <h3 className="font-semibold mb-3">Fonctionnalités à venir :</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Accès parents aux notes en temps réel
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Suivi des présences et absences
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Messagerie directe avec les enseignants
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Notifications d'événements importants
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Consultation de l'emploi du temps
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

export default ParentPortalSection;

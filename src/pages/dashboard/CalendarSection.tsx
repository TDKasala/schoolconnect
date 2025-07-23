import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const CalendarSection: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Calendrier</h1>
        <p className="mt-2 text-gray-600">
          Gestion des événements et planning scolaire
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="h-12 w-12 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Calendrier Scolaire
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Le module de calendrier sera bientôt disponible pour gérer tous les événements 
          et le planning de votre établissement scolaire.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-green-600 mr-2" />
            <span className="font-medium text-green-900">Bientôt disponible</span>
          </div>
          
          <div className="text-left space-y-3 text-green-800">
            <h3 className="font-semibold mb-3">Fonctionnalités à venir :</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Calendrier mensuel interactif
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Gestion des événements scolaires
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Planning des examens
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Jours fériés et vacances
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Notifications d'événements
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

export default CalendarSection;

import React from 'react';
import { Clock, Mail, Phone, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PendingAccountMessage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-yellow-100 mb-6">
          <Clock className="h-12 w-12 text-yellow-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Compte en attente d'activation
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Votre compte a été créé avec succès ! Un administrateur de votre école 
          doit maintenant valider votre accès avant que vous puissiez utiliser la plateforme.
        </p>

        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informations de votre compte
          </h2>
          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Nom :</span>
              <span className="font-medium text-gray-900">{user?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email :</span>
              <span className="font-medium text-gray-900">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Rôle demandé :</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {user?.role === 'teacher' ? 'Enseignant' : 
                 user?.role === 'parent' ? 'Parent' : 'En attente'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Étape 1 : Terminée</h3>
            <p className="text-sm text-gray-600">Votre compte a été créé avec succès</p>
          </div>
          
          <div className="text-center p-6 bg-yellow-50 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Étape 2 : En cours</h3>
            <p className="text-sm text-gray-600">Validation par l'administrateur de l'école</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Étape 3 : En attente</h3>
            <p className="text-sm text-gray-600">Accès complet à SchoolConnect</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Que se passe-t-il maintenant ?
          </h3>
          <div className="text-left space-y-3 text-blue-800">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>L'administrateur de votre école a reçu une notification de votre demande d'accès</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Il va vérifier vos informations et valider votre rôle dans l'établissement</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Vous recevrez un email de confirmation dès que votre compte sera activé</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Le processus prend généralement 24 à 48 heures</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Besoin d'aide ou d'accélérer le processus ?
          </h3>
          <p className="text-gray-600 mb-6">
            Contactez directement l'administrateur de votre école ou notre équipe support.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Email Support</p>
                <p className="text-sm text-gray-600">support@schoolconnect.cd</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Téléphone</p>
                <p className="text-sm text-gray-600">+243 123 456 789</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingAccountMessage;

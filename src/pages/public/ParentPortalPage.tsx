import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  User, 
  GraduationCap, 
  Settings, 
  MessageSquare, 
  Calendar, 
  CreditCard, 
  Bell,
  CheckCircle,
  ArrowRight,
  Eye,
  Clock
} from 'lucide-react';

const ParentPortalPage: React.FC = () => {
  const portals = [
    {
      icon: User,
      title: 'Portail Parent',
      description: 'Accès complet aux informations de votre enfant avec suivi en temps réel.',
      features: [
        'Consultation des notes en temps réel',
        'Suivi des paiements et factures',
        'Réception d\'annonces importantes',
        'Consultation de l\'emploi du temps',
        'Historique des présences',
        'Communication directe avec les enseignants'
      ],
      color: 'bg-purple-500',
      benefits: [
        'Suivi quotidien des progrès',
        'Communication facilitée',
        'Transparence financière',
        'Notifications importantes'
      ]
    },
    {
      icon: GraduationCap,
      title: 'Portail Enseignant',
      description: 'Outils dédiés pour optimiser l\'enseignement et la communication.',
      features: [
        'Gestion du carnet de notes numérique',
        'Pointage des présences simplifié',
        'Communication avec parents et admin',
        'Planification des cours',
        'Suivi des devoirs et évaluations',
        'Rapports de performance'
      ],
      color: 'bg-blue-500',
      benefits: [
        'Gain de temps considérable',
        'Suivi personnalisé des élèves',
        'Communication efficace',
        'Organisation optimisée'
      ]
    },
    {
      icon: Settings,
      title: 'Portail Administrateur',
      description: 'Centre de commande pour la gestion globale de l\'établissement.',
      features: [
        'Gestion du personnel et des rôles',
        'Configuration de l\'école',
        'Supervision des activités',
        'Rapports et statistiques globales',
        'Gestion des classes et matières',
        'Contrôle des accès et permissions'
      ],
      color: 'bg-green-500',
      benefits: [
        'Contrôle total de l\'école',
        'Vue d\'ensemble complète',
        'Gestion simplifiée',
        'Décisions éclairées'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold">
              Portails pour Enseignants, Parents et Administrateurs
            </h1>
            <p className="text-xl lg:text-2xl text-purple-100 leading-relaxed">
              Trois portails spécialisés pour répondre aux besoins spécifiques de chaque acteur 
              de votre établissement scolaire.
            </p>
            <Link
              to="/contact"
              className="btn bg-secondary-500 text-white hover:bg-secondary-600 px-8 py-4 text-lg font-semibold inline-flex items-center"
            >
              Demander une démo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Portals Overview */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Portails Spécialisés pour chaque Acteur
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enseignants, Parents et Administrateurs disposent chacun d'un portail dédié
            </p>
          </div>

          <div className="space-y-16">
            {portals.map((portal, index) => (
              <div key={index} className={`${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} flex flex-col lg:flex-row gap-12 items-center`}>
                <div className="lg:w-1/2 space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 ${portal.color} rounded-xl flex items-center justify-center`}>
                      <portal.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{portal.title}</h3>
                  </div>
                  
                  <p className="text-lg text-gray-600">{portal.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {portal.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="lg:w-1/2">
                  <div className="card p-8 bg-gray-50">
                    <h4 className="text-xl font-bold text-gray-900 mb-6">Fonctionnalités principales</h4>
                    <ul className="space-y-3">
                      {portal.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communication Features */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Communication Renforcée
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des outils de communication modernes pour maintenir le lien entre tous les acteurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Messagerie intégrée</h3>
              <p className="text-gray-600 text-sm">Communication directe entre parents, enseignants et administration.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Bell className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications en temps réel</h3>
              <p className="text-gray-600 text-sm">Alertes instantanées pour les événements importants.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Calendrier partagé</h3>
              <p className="text-gray-600 text-sm">Synchronisation des événements et rendez-vous importants.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <Eye className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Transparence totale</h3>
              <p className="text-gray-600 text-sm">Accès aux informations en temps réel pour tous.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Parent Portal Preview */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Exemple : Portail Parent
              </h2>
              <p className="text-lg text-gray-600">
                Découvrez comment les parents peuvent suivre facilement les progrès de leur enfant 
                et rester connectés avec l'école.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">Accès 24h/24, 7j/7 depuis n'importe quel appareil</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">Notifications automatiques pour les événements importants</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">Suivi des paiements et historique financier</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Marie Kabongo</h3>
                    <p className="text-gray-600">6ème A - Élève</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Moyenne générale</span>
                      <span className="text-green-600 font-bold">15.2/20</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Présences ce mois</span>
                      <span className="text-blue-600 font-bold">18/20 jours</span>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Frais scolaires</span>
                      <span className="text-yellow-600 font-bold">À jour</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 mb-2">Dernières annonces</h4>
                  <p className="text-sm text-gray-600">Réunion parents-professeurs le 15 mars à 14h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Connectez Enseignants, Parents et Administrateurs
            </h2>
            <p className="text-xl text-purple-100">
              Découvrez comment nos trois portails spécialisés peuvent transformer la communication dans votre école.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn bg-secondary-500 text-white hover:bg-secondary-600 px-8 py-4 text-lg font-semibold"
              >
                Demander une démo
              </Link>
              <Link
                to="/tarifs"
                className="btn border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold"
              >
                Voir les tarifs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ParentPortalPage;

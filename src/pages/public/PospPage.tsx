import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  ClipboardCheck, 
  Calculator, 
  BarChart3, 
  Award,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const PospPage: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Suivi de présence numérique',
      description: 'Pointage électronique des élèves avec historique complet et statistiques de présence.',
      benefits: [
        'Pointage rapide et précis',
        'Historique détaillé par élève',
        'Alertes automatiques d\'absence',
        'Rapports de présence personnalisables'
      ]
    },
    {
      icon: BookOpen,
      title: 'Carnet de notes en ligne',
      description: 'Gestion complète des évaluations avec saisie simplifiée et consultation en temps réel.',
      benefits: [
        'Saisie intuitive des notes',
        'Organisation par matières',
        'Consultation temps réel',
        'Historique des évaluations'
      ]
    },
    {
      icon: ClipboardCheck,
      title: 'Gestion des examens et devoirs',
      description: 'Planification et suivi des évaluations avec calendrier intégré.',
      benefits: [
        'Calendrier des examens',
        'Planification des devoirs',
        'Notifications automatiques',
        'Suivi des corrections'
      ]
    },
    {
      icon: Calculator,
      title: 'Calcul automatique des moyennes',
      description: 'Calculs automatisés avec pondération personnalisable selon vos critères.',
      benefits: [
        'Moyennes automatiques',
        'Pondération flexible',
        'Classements automatiques',
        'Bulletins générés'
      ]
    },
    {
      icon: Award,
      title: 'Suivi disciplinaire',
      description: 'Gestion des sanctions et récompenses avec historique comportemental.',
      benefits: [
        'Registre disciplinaire',
        'Suivi comportemental',
        'Alertes parents',
        'Rapports de conduite'
      ]
    },
    {
      icon: BarChart3,
      title: 'Statistiques de réussite',
      description: 'Tableaux de bord avec analyses détaillées des performances scolaires.',
      benefits: [
        'Analyses par classe',
        'Évolution des performances',
        'Comparaisons temporelles',
        'Rapports visuels'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold">
              Module Pédagogie
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
              Gérez l'ensemble de vos activités pédagogiques avec des outils modernes 
              et intuitifs, conçus pour simplifier le quotidien des enseignants.
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

      {/* Features Grid */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Complètes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tous les outils nécessaires pour une gestion pédagogique efficace et moderne
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 hover:shadow-lg transition-shadow">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  </div>
                  
                  <p className="text-gray-600">{feature.description}</p>
                  
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Simplifiez votre gestion pédagogique
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Gain de temps considérable</h3>
                    <p className="text-gray-600">Automatisez les tâches répétitives et concentrez-vous sur l'enseignement.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Suivi personnalisé</h3>
                    <p className="text-gray-600">Suivez les progrès de chaque élève avec des outils d'analyse avancés.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Communication améliorée</h3>
                    <p className="text-gray-600">Partagez facilement les informations avec les parents et l'administration.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Tableau de bord enseignant</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-900">6ème A - Mathématiques</span>
                    <span className="text-blue-600 font-semibold">28/30 présents</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-900">Moyenne générale</span>
                    <span className="text-green-600 font-semibold">14.2/20</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                    <span className="font-medium text-gray-900">Devoirs à corriger</span>
                    <span className="text-yellow-600 font-semibold">12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Prêt à révolutionner votre pédagogie ?
            </h2>
            <p className="text-xl text-blue-100">
              Découvrez comment le module Pédagogie peut transformer la gestion de vos classes.
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
                className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
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

export default PospPage;

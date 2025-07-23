import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  DollarSign, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Star,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

const HomePage: React.FC = () => {
  const modules = [
    {
      icon: BookOpen,
      title: 'Pédagogie',
      description: 'Gestion complète des notes, présences et évaluations avec carnet numérique.',
      features: ['Carnet de notes en ligne', 'Suivi des présences', 'Gestion des examens'],
      link: '/pedagogie',
      color: 'bg-blue-500'
    },
    {
      icon: DollarSign,
      title: 'Finances',
      description: 'Suivi des frais scolaires, génération de reçus et tableaux de bord financiers.',
      features: ['Gestion des inscriptions', 'Suivi des paiements', 'Reçus automatiques'],
      link: '/finances',
      color: 'bg-green-500'
    },
    {
      icon: Users,
      title: 'Portails Connectés',
      description: 'Communication renforcée entre parents, enseignants et administration.',
      features: ['Portail Parents', 'Portail Enseignants', 'Portail Admin'],
      link: '/portails',
      color: 'bg-purple-500'
    }
  ];

  const advantages = [
    {
      icon: Zap,
      title: 'Simplicité d\'utilisation',
      description: 'Interface intuitive conçue pour tous les niveaux de compétence technique.'
    },
    {
      icon: Globe,
      title: 'Optimisé pour la RDC',
      description: 'Fonctionne parfaitement même avec des connexions internet de faible débit.'
    },
    {
      icon: Shield,
      title: 'Support technique local',
      description: 'Équipe de support basée en RDC, disponible dans votre fuseau horaire.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  La gestion scolaire,{' '}
                  <span className="text-secondary-300">simplifiée</span>{' '}
                  pour la RDC
                </h1>
                <p className="text-xl lg:text-2xl text-primary-100 leading-relaxed">
                  Plateforme moderne de gestion scolaire, optimisée pour les écoles congolaises. 
                  Gérez vos élèves, finances et communications en toute simplicité.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="btn bg-secondary-500 text-white hover:bg-secondary-600 px-8 py-4 text-lg font-semibold"
                >
                  Demander une démo gratuite
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/tarifs"
                  className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold"
                >
                  Voir les tarifs
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-primary-100">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-secondary-300" />
                  <span>Installation gratuite</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-secondary-300" />
                  <span>Support 24/7</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">SC</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">École Primaire Exemple</h3>
                        <p className="text-sm text-gray-500">Tableau de bord</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">247</div>
                      <div className="text-sm text-gray-600">Élèves inscrits</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">98%</div>
                      <div className="text-sm text-gray-600">Taux de présence</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why SchoolConnect Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi SchoolConnect ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une solution pensée spécifiquement pour répondre aux défis des écoles congolaises
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <advantage.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Overview */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Modules Principaux
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trois modules intégrés pour une gestion complète de votre établissement
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <div key={index} className="card p-8 hover:shadow-lg transition-shadow">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}>
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{module.title}</h3>
                  </div>
                  
                  <p className="text-gray-600">{module.description}</p>
                  
                  <ul className="space-y-2">
                    {module.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to={module.link}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    En savoir plus
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Prêt à moderniser votre école ?
            </h2>
            <p className="text-xl text-primary-100">
              Rejoignez les écoles qui ont déjà choisi SchoolConnect pour simplifier leur gestion quotidienne.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn bg-secondary-500 text-white hover:bg-secondary-600 px-8 py-4 text-lg font-semibold"
              >
                Demander une démo
              </Link>
              <Link
                to="/connexion"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

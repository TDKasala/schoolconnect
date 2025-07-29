import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  DollarSign,
  Users,
  ArrowRight,
  Star,
  Shield,
  Zap,
  CheckCircle,
  Sparkle,
  TrendingUp
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
                  className="btn bg-secondary-500 text-white hover:bg-secondary-600 px-6 py-3 text-base font-semibold rounded-r-full"
                >
                  Demander une démo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  to="/tarifs"
                  className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-6 py-3 text-base font-semibold rounded-l-full"
                >
                  Voir les tarifs
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-primary-100">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Gestion des notes et bulletins</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Suivi des présences</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
                {/* Beautiful classroom-themed hero section */}
                <div className="h-96 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 relative overflow-hidden">
                  {/* Decorative elements representing a classroom */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-8 left-8 w-16 h-12 bg-white rounded border-2 border-white/30"></div>
                    <div className="absolute top-8 left-28 w-16 h-12 bg-white rounded border-2 border-white/30"></div>
                    <div className="absolute top-8 left-48 w-16 h-12 bg-white rounded border-2 border-white/30"></div>
                    <div className="absolute top-24 left-8 w-16 h-12 bg-white rounded border-2 border-white/30"></div>
                    <div className="absolute top-24 left-28 w-16 h-12 bg-white rounded border-2 border-white/30"></div>
                    <div className="absolute top-24 left-48 w-16 h-12 bg-white rounded border-2 border-white/30"></div>
                  </div>
                  
                  {/* Central content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <BookOpen className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Éducation de Qualité</h3>
                      <p className="text-white/90">Pour chaque enfant congolais</p>
                      <div className="mt-4 flex items-center justify-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span className="text-sm">247 élèves connectés</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating academic elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-secondary-400 rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 bg-white rounded-full opacity-40 animate-pulse animation-delay-1000"></div>
                  <div className="absolute bottom-8 right-8 w-10 h-10 bg-secondary-300 rounded-full opacity-50 animate-pulse animation-delay-2000"></div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Star className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Support personnalisé</h3>
                        <p className="text-sm text-gray-600">Équipe dédiée pour vous accompagner</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">Présence aujourd'hui</span>
                        <span className="text-sm font-bold text-green-600">94.2%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" style={{width: '94.2%'}}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-primary-50 rounded-lg">
                        <div className="text-2xl font-bold text-primary-600">247</div>
                        <div className="text-xs text-primary-600">Élèves</div>
                      </div>
                      <div className="text-center p-3 bg-secondary-50 rounded-lg">
                        <div className="text-2xl font-bold text-secondary-600">18</div>
                        <div className="text-xs text-secondary-600">Enseignants</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-secondary-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary-400 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why SchoolConnect Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full mb-6 animate-fade-in">
              <Sparkle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Avantages Exclusifs</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 animate-slide-up">
              Pourquoi <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SchoolConnect</span> ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in">
              Une solution complète qui s'adapte aux réalités des écoles congolaises
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-scale-in">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Simple et Intuitif</h3>
              <p className="text-gray-600 leading-relaxed">
                Interface conçue pour être utilisée facilement par tous les membres de votre équipe éducative.
              </p>
              <Link to="/avantages" className="mt-6 flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                <span className="text-sm">En savoir plus</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-scale-in" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">Optimisé pour la RDC</h3>
              <p className="text-gray-600 leading-relaxed">
                Adapté aux spécificités du système éducatif congolais et optimisé pour les connexions lentes.
              </p>
              <Link to="/avantages" className="mt-6 flex items-center text-green-600 font-medium group-hover:translate-x-2 transition-transform">
                <span className="text-sm">En savoir plus</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">Support Local</h3>
              <p className="text-gray-600 leading-relaxed">
                Équipe de support basée en RDC, parlant français et comprenant vos besoins spécifiques.
              </p>
              <Link to="/avantages" className="mt-6 flex items-center text-purple-600 font-medium group-hover:translate-x-2 transition-transform">
                <span className="text-sm">En savoir plus</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Overview */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-48 translate-x-48 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full translate-y-48 -translate-x-48 opacity-30"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full mb-6 animate-fade-in">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Modules Intégrés</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 animate-slide-up">
              Modules <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Principaux</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in">
              Trois modules intégrés pour une gestion complète de votre établissement
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100 animate-scale-in">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-float">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">POSP</h3>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  Gestion pédagogique complète avec suivi des notes, présences et évaluations.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Gestion des classes et matières</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Carnet de notes numérique</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Suivi des présences</span>
                  </li>
                </ul>
                
                <Link
                  to="/pedagogie"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group-hover:translate-x-2 transition-all duration-300"
                >
                  Découvrir POSP
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100 animate-scale-in" style={{animationDelay: '0.1s'}}>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-float" style={{animationDelay: '1s'}}>
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">UBank</h3>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  Gestion financière et comptable adaptée aux écoles congolaises.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Gestion des frais scolaires</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Suivi des paiements</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Rapports financiers</span>
                  </li>
                </ul>
                
                <Link
                  to="/finances"
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold group-hover:translate-x-2 transition-all duration-300"
                >
                  Découvrir UBank
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100 animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-float" style={{animationDelay: '2s'}}>
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Portails</h3>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  Communication fluide entre école, enseignants et parents.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Portail parents</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Messagerie intégrée</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Notifications temps réel</span>
                  </li>
                </ul>
                
                <Link
                  to="/portails"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold group-hover:translate-x-2 transition-all duration-300"
                >
                  Découvrir Portails
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full mb-6 animate-fade-in">
              <Sparkle className="h-5 w-5 mr-2 text-yellow-400" />
              <span className="font-medium">Rejoignez la révolution éducative</span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 animate-slide-up">
              Prêt à <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">moderniser</span> votre école ?
            </h2>
            
            <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed animate-fade-in">
              Rejoignez les écoles qui ont déjà choisi SchoolConnect pour simplifier leur gestion quotidienne.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Link
                to="/contact"
                className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-3 rounded-r-full font-semibold text-base hover:shadow-xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
              >
                <Zap className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Demander une démo
              </Link>
              <Link
                to="/register"
                className="group border-2 border-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-l-full font-semibold text-base hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center"
              >
                Commencer
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-blue-200 animate-fade-in">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-400" />
                <span>Sécurité garantie</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
                <span>Support 24/7</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                <span>Installation gratuite</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-slide-up">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">50+</div>
                <div className="text-blue-200">Écoles partenaires</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">10k+</div>
                <div className="text-blue-200">Élèves gérés</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">99%</div>
                <div className="text-blue-200">Satisfaction client</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  MessageSquare, 
  BarChart3, 
  Globe, 
  Shield, 
  Trophy,
  CheckCircle,
  ArrowRight,
  Zap,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';

const AdvantagesPage: React.FC = () => {
  const mainAdvantages = [
    {
      icon: Clock,
      title: 'Gain de temps considérable',
      description: 'Automatisez les tâches répétitives et libérez du temps pour l\'essentiel : l\'éducation.',
      details: [
        'Saisie automatique des données',
        'Génération instantanée de rapports',
        'Calculs automatiques des moyennes',
        'Notifications automatisées'
      ],
      color: 'bg-blue-500'
    },
    {
      icon: MessageSquare,
      title: 'Communication améliorée',
      description: 'Renforcez les liens entre tous les acteurs de votre communauté scolaire.',
      details: [
        'Messagerie intégrée en temps réel',
        'Notifications push instantanées',
        'Portails dédiés par rôle',
        'Partage d\'informations sécurisé'
      ],
      color: 'bg-green-500'
    },
    {
      icon: BarChart3,
      title: 'Décisions basées sur les données',
      description: 'Prenez des décisions éclairées grâce à des analyses détaillées et des rapports précis.',
      details: [
        'Tableaux de bord interactifs',
        'Statistiques en temps réel',
        'Analyses prédictives',
        'Rapports personnalisables'
      ],
      color: 'bg-purple-500'
    },
    {
      icon: Globe,
      title: 'Conception pour la RDC',
      description: 'Solution optimisée pour fonctionner parfaitement avec les infrastructures congolaises.',
      details: [
        'Optimisation faible bande passante',
        'Mode hors ligne disponible',
        'Interface en français',
        'Adaptation aux réalités locales'
      ],
      color: 'bg-orange-500'
    },
    {
      icon: Shield,
      title: 'Sécurité et fiabilité',
      description: 'Vos données sont protégées avec les plus hauts standards de sécurité.',
      details: [
        'Chiffrement des données',
        'Sauvegardes automatiques',
        'Accès sécurisé par rôles',
        'Conformité aux standards'
      ],
      color: 'bg-red-500'
    },
    {
      icon: Trophy,
      title: 'Image professionnelle',
      description: 'Modernisez l\'image de votre école avec des outils technologiques avancés.',
      details: [
        'Interface moderne et intuitive',
        'Rapports professionnels',
        'Communication digitale',
        'Attractivité renforcée'
      ],
      color: 'bg-yellow-500'
    }
  ];

  const testimonials = [
    {
      name: 'Directeur Mukendi',
      school: 'École Primaire Saint-Joseph, Kinshasa',
      quote: 'SchoolConnect a révolutionné notre gestion. Nous avons gagné 70% de temps sur nos tâches administratives.',
      rating: 5
    },
    {
      name: 'Mme Nsimba',
      school: 'Institut Technique de Lubumbashi',
      quote: 'La communication avec les parents n\'a jamais été aussi fluide. Les parents apprécient la transparence.',
      rating: 5
    },
    {
      name: 'Prof. Kalala',
      school: 'Collège Moderne de Goma',
      quote: 'L\'interface est si simple que même nos enseignants les moins technophiles l\'utilisent sans problème.',
      rating: 5
    }
  ];

  const stats = [
    { number: '500+', label: 'Écoles utilisatrices' },
    { number: '50,000+', label: 'Élèves gérés' },
    { number: '2,000+', label: 'Enseignants actifs' },
    { number: '99.9%', label: 'Temps de disponibilité' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold">
              Les Avantages de SchoolConnect
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 leading-relaxed">
              Découvrez pourquoi des centaines d'écoles en RDC ont choisi SchoolConnect 
              pour moderniser leur gestion scolaire.
            </p>
            <Link
              to="/contact"
              className="btn bg-secondary-500 text-white hover:bg-secondary-600 px-8 py-4 text-lg font-semibold inline-flex items-center"
            >
              Rejoignez-nous
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Advantages */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Six Avantages Clés
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SchoolConnect transforme la gestion scolaire avec des bénéfices concrets et mesurables
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mainAdvantages.map((advantage, index) => (
              <div key={index} className="card p-8 hover:shadow-lg transition-shadow">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 ${advantage.color} rounded-xl flex items-center justify-center`}>
                      <advantage.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{advantage.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 text-lg">{advantage.description}</p>
                  
                  <ul className="space-y-3">
                    {advantage.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Témoignages de nos utilisateurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez ce que disent les directeurs et enseignants qui utilisent SchoolConnect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="space-y-6">
                  <div className="flex justify-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-600 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.school}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir SchoolConnect ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Déploiement rapide</h3>
              <p className="text-gray-600">Mise en service en moins de 24h avec formation incluse.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Support local</h3>
              <p className="text-gray-600">Équipe de support basée en RDC, parlant vos langues.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Évolution continue</h3>
              <p className="text-gray-600">Mises à jour régulières basées sur vos retours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-primary-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Retour sur investissement garanti
              </h2>
              <p className="text-lg text-gray-600">
                SchoolConnect se rembourse rapidement grâce aux gains d'efficacité 
                et à l'amélioration de la gestion financière.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Réduction des coûts administratifs</h3>
                    <p className="text-gray-600">Jusqu'à 60% de réduction du temps consacré aux tâches administratives.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Amélioration des recettes</h3>
                    <p className="text-gray-600">Meilleur suivi des paiements et réduction des impayés.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Attractivité renforcée</h3>
                    <p className="text-gray-600">Image moderne qui attire de nouveaux élèves et enseignants.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Calcul ROI - École de 200 élèves</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Coût mensuel SchoolConnect</span>
                  <span className="font-semibold">$50 USD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Économies administratives</span>
                  <span className="font-semibold text-green-600">+$80 USD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amélioration recettes</span>
                  <span className="font-semibold text-green-600">+$120 USD</span>
                </div>
                <hr />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Bénéfice net mensuel</span>
                  <span className="text-green-600">+$150 USD</span>
                </div>
                <div className="text-center text-sm text-gray-500 mt-4">
                  ROI de 300% dès le premier mois
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Prêt à bénéficier de tous ces avantages ?
            </h2>
            <p className="text-xl text-primary-100">
              Rejoignez les centaines d'écoles qui ont déjà transformé leur gestion avec SchoolConnect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn bg-secondary-500 text-white hover:bg-secondary-600 px-8 py-4 text-lg font-semibold"
              >
                Demander une démo gratuite
              </Link>
              <Link
                to="/tarifs"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold"
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

export default AdvantagesPage;

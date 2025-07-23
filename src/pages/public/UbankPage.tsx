import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  CreditCard, 
  Receipt, 
  TrendingUp, 
  PieChart, 
  FileText,
  CheckCircle,
  ArrowRight,
  Calculator
} from 'lucide-react';

const UbankPage: React.FC = () => {
  const features = [
    {
      icon: CreditCard,
      title: 'Gestion des inscriptions',
      description: 'Processus d\'inscription simplifié avec suivi automatique des frais d\'entrée.',
      benefits: [
        'Inscription en ligne',
        'Validation automatique',
        'Suivi des documents',
        'Confirmation par SMS/Email'
      ]
    },
    {
      icon: DollarSign,
      title: 'Suivi des frais scolaires (Minerval)',
      description: 'Gestion complète des paiements mensuels avec échéanciers personnalisables.',
      benefits: [
        'Échéanciers flexibles',
        'Rappels automatiques',
        'Historique des paiements',
        'Gestion des retards'
      ]
    },
    {
      icon: Receipt,
      title: 'Génération de reçus automatiques',
      description: 'Création instantanée de reçus officiels avec numérotation automatique.',
      benefits: [
        'Reçus instantanés',
        'Numérotation automatique',
        'Format officiel',
        'Envoi par email/SMS'
      ]
    },
    {
      icon: Calculator,
      title: 'Suivi des dépenses de l\'école',
      description: 'Gestion budgétaire complète avec catégorisation des dépenses.',
      benefits: [
        'Catégories de dépenses',
        'Budgets prévisionnels',
        'Contrôle des coûts',
        'Rapports détaillés'
      ]
    },
    {
      icon: PieChart,
      title: 'Tableaux de bord financiers',
      description: 'Visualisation en temps réel de la santé financière de l\'établissement.',
      benefits: [
        'Graphiques interactifs',
        'Indicateurs clés',
        'Prévisions financières',
        'Analyses comparatives'
      ]
    },
    {
      icon: FileText,
      title: 'Rapports financiers',
      description: 'Génération automatique de rapports comptables et financiers.',
      benefits: [
        'Bilans automatiques',
        'Rapports personnalisés',
        'Export Excel/PDF',
        'Conformité comptable'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold">
              Module Finances
            </h1>
            <p className="text-xl lg:text-2xl text-green-100 leading-relaxed">
              Maîtrisez parfaitement vos finances scolaires avec des outils de gestion 
              comptable adaptés aux réalités des écoles congolaises.
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
              Gestion Financière Complète
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              De l'inscription au suivi budgétaire, gérez toutes vos finances en toute transparence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 hover:shadow-lg transition-shadow">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-green-600" />
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

      {/* Financial Dashboard Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Tableau de bord financier en temps réel
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Suivi en temps réel</h3>
                    <p className="text-gray-600">Visualisez instantanément l'état de vos finances avec des indicateurs mis à jour automatiquement.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <PieChart className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Analyses détaillées</h3>
                    <p className="text-gray-600">Comprenez vos flux financiers avec des graphiques et analyses approfondies.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Rapports automatiques</h3>
                    <p className="text-gray-600">Générez des rapports financiers professionnels en un clic.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Aperçu financier</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">2,450,000</div>
                    <div className="text-sm text-gray-600">FC Recettes ce mois</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">89%</div>
                    <div className="text-sm text-gray-600">Taux de paiement</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Frais scolaires</span>
                    <span className="font-semibold">1,800,000 FC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Inscriptions</span>
                    <span className="font-semibold">650,000 FC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dépenses</span>
                    <span className="font-semibold text-red-600">-420,000 FC</span>
                  </div>
                  <hr />
                  <div className="flex justify-between items-center font-bold">
                    <span>Solde net</span>
                    <span className="text-green-600">2,030,000 FC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Avantages du Module Finances
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Calculator className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Transparence totale</h3>
              <p className="text-gray-600">Toutes les transactions sont tracées et documentées pour une transparence maximale.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Amélioration des recettes</h3>
              <p className="text-gray-600">Optimisez vos recettes grâce à un suivi rigoureux des paiements.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Conformité comptable</h3>
              <p className="text-gray-600">Respectez les normes comptables avec des rapports conformes aux standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Maîtrisez vos finances scolaires
            </h2>
            <p className="text-xl text-green-100">
              Découvrez comment le module Finances peut améliorer la gestion financière de votre école.
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
                className="btn border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold"
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

export default UbankPage;

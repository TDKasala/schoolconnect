import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  X, 
  ArrowRight, 
  Users, 
  Infinity,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      name: 'Plan Flex',
      description: 'Parfait pour les écoles de toute taille',
      icon: Users,
      pricing: {
        monthly: { amount: 5, unit: 'USD/élève/mois' },
        yearly: { amount: 54, unit: 'USD/élève/an (-10% remise)' }
      },
      features: [
        'Tous les modules inclus',
        'Support technique 24/7',
        'Formation du personnel',
        'Mises à jour automatiques',
        'Sauvegarde quotidienne',
        'Accès mobile et web',
        'Rapports illimités',
        'Intégration SMS/Email'
      ],
      limitations: [],
      popular: true,
      cta: 'Commencer l\'essai gratuit'
    },
    {
      name: 'Plan Forfait',
      description: 'Tarif fixe, élèves illimités',
      icon: Infinity,
      pricing: {
        monthly: { amount: 50, unit: 'USD/école/mois' },
        yearly: { amount: 540, unit: 'USD/école/an (-10% remise)' }
      },
      features: [
        'Élèves illimités',
        'Tous les modules inclus',
        'Support technique prioritaire',
        'Formation avancée',
        'Personnalisation interface',
        'Intégrations avancées',
        'Rapports personnalisés',
        'Gestionnaire de compte dédié'
      ],
      limitations: [],
      popular: false,
      cta: 'Demander un devis'
    }
  ];

  const faqs = [
    {
      question: 'Y a-t-il une période d\'essai gratuite ?',
      answer: 'Oui, nous offrons 30 jours d\'essai gratuit avec accès complet à toutes les fonctionnalités. Aucune carte de crédit requise.'
    },
    {
      question: 'Puis-je changer de plan à tout moment ?',
      answer: 'Absolument ! Vous pouvez passer d\'un plan à l\'autre à tout moment. Les changements prennent effet immédiatement.'
    },
    {
      question: 'Quels moyens de paiement acceptez-vous ?',
      answer: 'Nous acceptons les virements bancaires, Mobile Money (M-Pesa, Orange Money, Airtel Money) et les paiements en espèces via nos partenaires locaux.'
    },
    {
      question: 'Le support technique est-il inclus ?',
      answer: 'Oui, le support technique est inclus dans tous nos plans. Nous avons une équipe basée en RDC disponible par téléphone, email et chat.'
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Vos données sont chiffrées et sauvegardées quotidiennement. Nous respectons les standards internationaux de sécurité et de confidentialité.'
    },
    {
      question: 'Puis-je annuler mon abonnement ?',
      answer: 'Vous pouvez annuler votre abonnement à tout moment. Aucun frais d\'annulation. Vous gardez l\'accès jusqu\'à la fin de votre période payée.'
    },
    {
      question: 'Y a-t-il des frais d\'installation ?',
      answer: 'Non, l\'installation et la configuration initiale sont entièrement gratuites. Nous nous occupons de tout pour vous.'
    },
    {
      question: 'Proposez-vous des réductions pour les groupes d\'écoles ?',
      answer: 'Oui, nous offrons des tarifs préférentiels pour les réseaux d\'écoles et les organisations gérant plusieurs établissements.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold">
              Tarifs Transparents et Abordables
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 leading-relaxed">
              Choisissez le plan qui convient le mieux à votre école. 
              Pas de frais cachés, pas de surprises.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={billingCycle === 'monthly' ? 'text-white' : 'text-primary-200'}>
                Mensuel
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                <span
                  className={`${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
              <span className={billingCycle === 'yearly' ? 'text-white' : 'text-primary-200'}>
                Annuel
              </span>
              {billingCycle === 'yearly' && (
                <span className="bg-secondary-500 text-white px-2 py-1 rounded-full text-sm">
                  -17%
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`card p-8 relative ${
                  plan.popular ? 'ring-2 ring-primary-500 shadow-xl' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Le plus populaire
                    </span>
                  </div>
                )}
                
                <div className="space-y-8">
                  {/* Plan Header */}
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                      <plan.icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">
                      {plan.pricing[billingCycle].amount.toLocaleString()} FC
                    </div>
                    <div className="text-gray-600 mt-2">
                      {plan.pricing[billingCycle].unit}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    to="/contact"
                    className={`btn w-full py-3 text-center ${
                      plan.popular
                        ? 'btn-primary'
                        : 'btn-outline'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comparaison détaillée
            </h2>
            <p className="text-xl text-gray-600">
              Tous les détails pour vous aider à choisir
            </p>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                      Fonctionnalités
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      Plan Flex
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      Plan Forfait
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { feature: 'Nombre d\'élèves', flex: 'Illimité', forfait: 'Illimité' },
                    { feature: 'Module Pédagogie', flex: true, forfait: true },
                    { feature: 'Module Finances', flex: true, forfait: true },
                    { feature: 'Portails Connectés', flex: true, forfait: true },
                    { feature: 'Support 24/7', flex: true, forfait: true },
                    { feature: 'Formation incluse', flex: 'Basique', forfait: 'Avancée' },
                    { feature: 'Rapports personnalisés', flex: false, forfait: true },
                    { feature: 'Gestionnaire dédié', flex: false, forfait: true },
                    { feature: 'Personnalisation interface', flex: false, forfait: true }
                  ].map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.flex === 'boolean' ? (
                          row.flex ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm text-gray-700">{row.flex}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.forfait === 'boolean' ? (
                          row.forfait ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm text-gray-700">{row.forfait}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Tout ce que vous devez savoir sur nos tarifs
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Prêt à commencer ?
            </h2>
            <p className="text-xl text-primary-100">
              Essayez SchoolConnect gratuitement pendant 30 jours. 
              Aucune carte de crédit requise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn bg-secondary-500 text-white hover:bg-secondary-600 px-8 py-4 text-lg font-semibold"
              >
                Commencer l'essai gratuit
              </Link>
              <Link
                to="/contact"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold"
              >
                Parler à un expert
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;

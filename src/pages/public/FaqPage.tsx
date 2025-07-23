import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const FaqPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      category: 'Général',
      faqs: [
        {
          question: 'Qu\'est-ce que SchoolConnect ?',
          answer: 'SchoolConnect est une plateforme complète de gestion scolaire conçue spécifiquement pour les écoles de la République Démocratique du Congo. Elle comprend des modules pour la pédagogie, les finances, et la communication entre tous les acteurs de l\'école.'
        },
        {
          question: 'Pour quels types d\'écoles SchoolConnect est-il adapté ?',
          answer: 'SchoolConnect convient à tous les types d\'établissements : écoles primaires, secondaires, instituts techniques, universités, et centres de formation. La plateforme s\'adapte à la taille et aux besoins spécifiques de chaque établissement.'
        },
        {
          question: 'SchoolConnect fonctionne-t-il hors ligne ?',
          answer: 'Oui, SchoolConnect dispose d\'un mode hors ligne qui permet de continuer à travailler même sans connexion internet. Les données se synchronisent automatiquement dès que la connexion est rétablie.'
        }
      ]
    },
    {
      category: 'Tarifs et Abonnement',
      faqs: [
        {
          question: 'Quels sont les tarifs de SchoolConnect ?',
          answer: 'Nous proposons deux plans : le Plan Flex à 250 FC par élève/mois et le Plan Forfait à 75,000 FC par école/mois avec élèves illimités. Tous les plans incluent tous les modules et le support technique.'
        },
        {
          question: 'Y a-t-il des frais d\'installation ou de configuration ?',
          answer: 'Non, l\'installation, la configuration initiale et la formation de base sont entièrement gratuites. Nous nous occupons de tout pour que vous puissiez commencer rapidement.'
        },
        {
          question: 'Puis-je annuler mon abonnement à tout moment ?',
          answer: 'Oui, vous pouvez annuler votre abonnement à tout moment sans frais d\'annulation. Vous gardez l\'accès à la plateforme jusqu\'à la fin de votre période payée.'
        },
        {
          question: 'Proposez-vous des réductions pour les groupes d\'écoles ?',
          answer: 'Oui, nous offrons des tarifs préférentiels pour les réseaux d\'écoles et les organisations gérant plusieurs établissements. Contactez-nous pour un devis personnalisé.'
        }
      ]
    },
    {
      category: 'Fonctionnalités',
      faqs: [
        {
          question: 'Quels modules sont inclus dans SchoolConnect ?',
          answer: 'SchoolConnect inclut trois modules principaux : Pédagogie (gestion des notes, présences, examens), Finances (frais scolaires, reçus, budgets), et Portails Connectés (communication parents-école-administration).'
        },
        {
          question: 'Puis-je personnaliser l\'interface selon les besoins de mon école ?',
          answer: 'Oui, avec le Plan Forfait, vous pouvez personnaliser l\'interface, les couleurs, le logo, et certaines fonctionnalités selon vos besoins spécifiques.'
        },
        {
          question: 'Comment les parents accèdent-ils aux informations de leurs enfants ?',
          answer: 'Les parents reçoivent des identifiants pour accéder au Portail Parent où ils peuvent consulter les notes, présences, paiements, et communiquer avec les enseignants en temps réel.'
        },
        {
          question: 'SchoolConnect génère-t-il des rapports automatiques ?',
          answer: 'Oui, la plateforme génère automatiquement des bulletins, rapports financiers, statistiques de présence, et de nombreux autres rapports personnalisables.'
        }
      ]
    },
    {
      category: 'Support et Formation',
      faqs: [
        {
          question: 'Quel type de support proposez-vous ?',
          answer: 'Nous offrons un support technique 24/7 par téléphone, email et chat. Notre équipe est basée en RDC et parle français, lingala, et swahili.'
        },
        {
          question: 'Proposez-vous une formation pour notre équipe ?',
          answer: 'Oui, nous incluons une formation complète pour tous les utilisateurs. Nous proposons des sessions en présentiel dans vos locaux ou en ligne selon vos préférences.'
        },
        {
          question: 'Combien de temps faut-il pour apprendre à utiliser SchoolConnect ?',
          answer: 'Grâce à son interface intuitive, la plupart des utilisateurs maîtrisent les fonctions de base en 1-2 heures. La formation complète prend généralement 1-2 jours.'
        }
      ]
    },
    {
      category: 'Sécurité et Données',
      faqs: [
        {
          question: 'Mes données sont-elles sécurisées ?',
          answer: 'Absolument. Toutes les données sont chiffrées, sauvegardées quotidiennement, et stockées sur des serveurs sécurisés. Nous respectons les standards internationaux de sécurité.'
        },
        {
          question: 'Qui peut accéder aux données de mon école ?',
          answer: 'Seuls les utilisateurs autorisés de votre école peuvent accéder aux données. Chaque utilisateur a des permissions spécifiques selon son rôle (directeur, enseignant, parent).'
        },
        {
          question: 'Que se passe-t-il si je perds mes données ?',
          answer: 'Vos données sont sauvegardées automatiquement plusieurs fois par jour. En cas de problème, nous pouvons restaurer vos données rapidement sans perte d\'information.'
        },
        {
          question: 'Puis-je exporter mes données si je change de solution ?',
          answer: 'Oui, vous pouvez exporter toutes vos données à tout moment dans des formats standards (Excel, PDF, CSV) pour les utiliser ailleurs.'
        }
      ]
    },
    {
      category: 'Technique',
      faqs: [
        {
          question: 'Quels sont les prérequis techniques pour utiliser SchoolConnect ?',
          answer: 'SchoolConnect fonctionne sur tout appareil avec un navigateur web moderne : ordinateurs, tablettes, smartphones. Aucune installation spéciale n\'est requise.'
        },
        {
          question: 'SchoolConnect fonctionne-t-il avec une connexion internet lente ?',
          answer: 'Oui, SchoolConnect est spécialement optimisé pour les connexions de faible débit courantes en RDC. La plateforme fonctionne efficacement même avec une connexion 2G.'
        },
        {
          question: 'Puis-je utiliser SchoolConnect sur mon téléphone ?',
          answer: 'Oui, SchoolConnect est entièrement responsive et fonctionne parfaitement sur tous les smartphones et tablettes, iOS et Android.'
        },
        {
          question: 'Y a-t-il une application mobile ?',
          answer: 'SchoolConnect fonctionne parfaitement dans le navigateur mobile. Une application native est en développement et sera disponible prochainement.'
        }
      ]
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold">
              Questions Fréquentes
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 leading-relaxed">
              Trouvez rapidement les réponses à toutes vos questions sur SchoolConnect
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une question..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-lg shadow-lg focus:ring-2 focus:ring-secondary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  Aucune question trouvée pour "{searchTerm}".
                </p>
                <p className="text-gray-500 mt-2">
                  Essayez avec d'autres mots-clés ou contactez-nous directement.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {filteredFaqs.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                      {category.category}
                    </h2>
                    <div className="space-y-4">
                      {category.faqs.map((faq, faqIndex) => {
                        const globalIndex = categoryIndex * 100 + faqIndex;
                        return (
                          <div key={faqIndex} className="card">
                            <button
                              onClick={() => toggleFaq(globalIndex)}
                              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                              <span className="font-medium text-gray-900 pr-4">
                                {faq.question}
                              </span>
                              {openFaq === globalIndex ? (
                                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                              )}
                            </button>
                            {openFaq === globalIndex && (
                              <div className="px-6 pb-4 border-t border-gray-100">
                                <p className="text-gray-600 pt-4">{faq.answer}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Vous ne trouvez pas la réponse à votre question ?
            </h2>
            <p className="text-xl text-gray-600">
              Notre équipe est là pour vous aider. Contactez-nous et nous vous répondrons rapidement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn btn-primary px-8 py-4 text-lg font-semibold"
              >
                Nous contacter
              </a>
              <a
                href="mailto:contact@schoolconnect.cd"
                className="btn btn-outline px-8 py-4 text-lg font-semibold"
              >
                Envoyer un email
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FaqPage;

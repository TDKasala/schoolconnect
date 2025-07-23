import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const privacyPrinciples = [
    {
      icon: Shield,
      title: 'Protection maximale',
      description: 'Vos données sont protégées par les plus hauts standards de sécurité'
    },
    {
      icon: Lock,
      title: 'Chiffrement complet',
      description: 'Toutes les données sont chiffrées en transit et au repos'
    },
    {
      icon: Eye,
      title: 'Transparence totale',
      description: 'Vous savez toujours quelles données nous collectons et pourquoi'
    },
    {
      icon: UserCheck,
      title: 'Contrôle utilisateur',
      description: 'Vous gardez le contrôle total sur vos données personnelles'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold">
              Politique de Confidentialité
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 leading-relaxed">
              Votre vie privée est notre priorité. Découvrez comment nous protégeons vos données.
            </p>
            <p className="text-primary-200">
              Dernière mise à jour : 1er janvier 2024
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nos Principes de Confidentialité
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quatre piliers fondamentaux guident notre approche de la protection des données
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {privacyPrinciples.map((principle, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <principle.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{principle.title}</h3>
                <p className="text-gray-600">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              <div className="card p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <Database className="w-8 h-8 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">1. Données que nous collectons</h2>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p>Nous collectons uniquement les données nécessaires au fonctionnement de SchoolConnect :</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Informations d'identification :</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Nom, prénom, adresse email</li>
                        <li>Numéro de téléphone (optionnel)</li>
                        <li>Rôle dans l'établissement</li>
                        <li>Informations de connexion (mot de passe chiffré)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Données scolaires :</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Informations sur les élèves (notes, présences, discipline)</li>
                        <li>Données financières (frais, paiements, budgets)</li>
                        <li>Communications (messages, annonces)</li>
                        <li>Rapports et statistiques</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Données techniques :</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Adresse IP et informations de navigation</li>
                        <li>Type d'appareil et navigateur utilisé</li>
                        <li>Journaux d'activité pour la sécurité</li>
                        <li>Cookies techniques nécessaires au fonctionnement</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <Eye className="w-8 h-8 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">2. Comment nous utilisons vos données</h2>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p>Vos données sont utilisées exclusivement pour :</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Fournir les services de gestion scolaire</li>
                    <li>Assurer la sécurité et l'intégrité de la plateforme</li>
                    <li>Améliorer nos services et développer de nouvelles fonctionnalités</li>
                    <li>Fournir un support technique personnalisé</li>
                    <li>Respecter nos obligations légales</li>
                    <li>Communiquer avec vous sur les mises à jour importantes</li>
                  </ul>
                  <p className="font-medium text-gray-900">
                    Nous ne vendons jamais vos données à des tiers et ne les utilisons jamais à des fins publicitaires.
                  </p>
                </div>
              </div>

              <div className="card p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <Lock className="w-8 h-8 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">3. Protection et sécurité</h2>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p>Nous mettons en place des mesures de sécurité robustes :</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Sécurité technique :</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Chiffrement SSL/TLS pour toutes les communications</li>
                        <li>Chiffrement AES-256 pour le stockage des données</li>
                        <li>Authentification à deux facteurs disponible</li>
                        <li>Surveillance 24/7 des systèmes</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Sécurité organisationnelle :</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Accès limité aux données selon le principe du moindre privilège</li>
                        <li>Formation régulière du personnel sur la sécurité</li>
                        <li>Audits de sécurité réguliers</li>
                        <li>Plan de réponse aux incidents</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <UserCheck className="w-8 h-8 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">4. Vos droits</h2>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p>Vous disposez des droits suivants concernant vos données personnelles :</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Droit d'accès :</strong> Demander une copie de toutes vos données</li>
                    <li><strong>Droit de rectification :</strong> Corriger les données inexactes</li>
                    <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
                    <li><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format standard</li>
                    <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
                    <li><strong>Droit de limitation :</strong> Limiter le traitement de vos données</li>
                  </ul>
                  <p>
                    Pour exercer ces droits, contactez-nous à : 
                    <a href="mailto:privacy@schoolconnect.cd" className="text-primary-600 hover:underline ml-1">
                      privacy@schoolconnect.cd
                    </a>
                  </p>
                </div>
              </div>

              <div className="card p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <FileText className="w-8 h-8 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">5. Partage des données</h2>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p>Nous ne partageons vos données qu'avec :</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Votre école :</strong> Les données sont partagées selon les rôles définis</li>
                    <li><strong>Prestataires techniques :</strong> Uniquement pour l'hébergement sécurisé</li>
                    <li><strong>Autorités légales :</strong> Si requis par la loi congolaise</li>
                  </ul>
                  <p className="font-medium text-gray-900">
                    Aucun partage commercial ou publicitaire de vos données.
                  </p>
                </div>
              </div>

              <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Conservation des données</h2>
                <div className="space-y-4 text-gray-600">
                  <p>Nous conservons vos données :</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Pendant toute la durée de votre abonnement</li>
                    <li>3 ans après la fin de l'abonnement pour les données financières</li>
                    <li>1 an après la fin de l'abonnement pour les autres données</li>
                    <li>Suppression immédiate sur demande explicite</li>
                  </ul>
                </div>
              </div>

              <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Cookies et technologies similaires</h2>
                <div className="space-y-4 text-gray-600">
                  <p>Nous utilisons des cookies uniquement pour :</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Maintenir votre session de connexion</li>
                    <li>Sauvegarder vos préférences d'interface</li>
                    <li>Assurer la sécurité de la plateforme</li>
                    <li>Améliorer les performances</li>
                  </ul>
                  <p>Aucun cookie publicitaire ou de tracking n'est utilisé.</p>
                </div>
              </div>

              <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Modifications de cette politique</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Nous pouvons modifier cette politique de confidentialité. Les modifications importantes 
                    seront notifiées par email avec un préavis de 30 jours.
                  </p>
                </div>
              </div>

              <div className="card p-8 bg-primary-50 border-primary-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Contact</h2>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Pour toute question concernant cette politique de confidentialité ou vos données :
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Délégué à la protection des données :</strong> privacy@schoolconnect.cd</p>
                    <p><strong>Support général :</strong> contact@schoolconnect.cd</p>
                    <p><strong>Téléphone :</strong> +243 123 456 789</p>
                    <p><strong>Adresse :</strong> Kinshasa, République Démocratique du Congo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold">
              Des questions sur la confidentialité ?
            </h2>
            <p className="text-xl text-primary-100">
              Notre équipe est disponible pour répondre à toutes vos préoccupations concernant la protection de vos données.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn bg-secondary-500 text-white hover:bg-secondary-600 px-8 py-4 text-lg font-semibold"
              >
                Nous contacter
              </Link>
              <Link
                to="/conditions"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold"
              >
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;

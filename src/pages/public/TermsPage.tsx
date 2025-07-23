import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold">
              Conditions d'Utilisation
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 leading-relaxed">
              Dernière mise à jour : 1er janvier 2024
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptation des Conditions</h2>
                <p className="text-gray-600 leading-relaxed">
                  En accédant et en utilisant SchoolConnect, vous acceptez d'être lié par ces conditions d'utilisation. 
                  Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description du Service</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  SchoolConnect est une plateforme de gestion scolaire qui fournit :
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Gestion pédagogique (notes, présences, examens)</li>
                  <li>Gestion financière (frais scolaires, reçus, budgets)</li>
                  <li>Portails de communication (parents, enseignants, administration)</li>
                  <li>Rapports et analyses</li>
                  <li>Support technique</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Comptes Utilisateur</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Pour utiliser SchoolConnect, vous devez créer un compte. Vous êtes responsable de :
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Maintenir la confidentialité de vos identifiants</li>
                  <li>Toutes les activités qui se produisent sous votre compte</li>
                  <li>Notifier immédiatement toute utilisation non autorisée</li>
                  <li>Fournir des informations exactes et à jour</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Utilisation Acceptable</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Vous vous engagez à utiliser SchoolConnect uniquement pour des fins légales et conformes à ces conditions. 
                  Il est interdit de :
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Violer les lois locales, nationales ou internationales</li>
                  <li>Transmettre du contenu illégal, nuisible ou offensant</li>
                  <li>Tenter d'accéder de manière non autorisée au système</li>
                  <li>Interférer avec le fonctionnement du service</li>
                  <li>Utiliser le service pour des activités commerciales non autorisées</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Paiements et Facturation</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Les conditions de paiement sont les suivantes :
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Les frais sont facturés selon le plan choisi (mensuel ou annuel)</li>
                  <li>Les paiements sont dus à l'avance</li>
                  <li>Les retards de paiement peuvent entraîner la suspension du service</li>
                  <li>Les remboursements sont traités selon notre politique de remboursement</li>
                  <li>Les prix peuvent être modifiés avec un préavis de 30 jours</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Propriété Intellectuelle</h2>
                <p className="text-gray-600 leading-relaxed">
                  SchoolConnect et tous ses contenus, fonctionnalités et technologies sont la propriété exclusive de notre société. 
                  Vous recevez une licence limitée, non exclusive et révocable pour utiliser le service conformément à ces conditions.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Protection des Données</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Nous nous engageons à protéger vos données :
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Chiffrement de toutes les données sensibles</li>
                  <li>Sauvegardes quotidiennes automatiques</li>
                  <li>Accès restreint selon les rôles utilisateur</li>
                  <li>Conformité aux standards de sécurité internationaux</li>
                  <li>Droit d'accès, de modification et de suppression de vos données</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation de Responsabilité</h2>
                <p className="text-gray-600 leading-relaxed">
                  Dans la mesure permise par la loi, SchoolConnect ne sera pas responsable des dommages indirects, 
                  incidents, spéciaux ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser le service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Résiliation</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Ces conditions peuvent être résiliées :
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Par vous, à tout moment, en fermant votre compte</li>
                  <li>Par nous, en cas de violation de ces conditions</li>
                  <li>Par nous, avec un préavis de 30 jours pour toute autre raison</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications des Conditions</h2>
                <p className="text-gray-600 leading-relaxed">
                  Nous nous réservons le droit de modifier ces conditions à tout moment. 
                  Les modifications importantes seront notifiées par email avec un préavis de 30 jours.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Droit Applicable</h2>
                <p className="text-gray-600 leading-relaxed">
                  Ces conditions sont régies par les lois de la République Démocratique du Congo. 
                  Tout litige sera soumis à la juridiction exclusive des tribunaux de Kinshasa.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact</h2>
                <p className="text-gray-600 leading-relaxed">
                  Pour toute question concernant ces conditions d'utilisation, contactez-nous :
                </p>
                <div className="bg-gray-50 p-6 rounded-lg mt-4">
                  <p className="text-gray-700">
                    <strong>Email :</strong> legal@schoolconnect.cd<br />
                    <strong>Téléphone :</strong> +243 123 456 789<br />
                    <strong>Adresse :</strong> Kinshasa, République Démocratique du Congo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Des questions sur nos conditions ?
            </h2>
            <p className="text-xl text-gray-600">
              Notre équipe juridique est disponible pour répondre à toutes vos questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn btn-primary px-8 py-4 text-lg font-semibold"
              >
                Nous contacter
              </Link>
              <Link
                to="/confidentialite"
                className="btn btn-outline px-8 py-4 text-lg font-semibold"
              >
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;

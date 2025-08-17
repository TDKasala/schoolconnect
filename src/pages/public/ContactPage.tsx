import React, { useState } from 'react';
import { contactMessagesService } from '../../services/contactMessagesService';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  MessageSquare,
  Users,
  Calendar
} from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    school: '',
    phone: '',
    message: '',
    requestType: 'demo',
    // Honeypot field for spam prevention
    website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      // Submit to Supabase (production path)
      await contactMessagesService.submit({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || formData.requestType || 'Contact',
        message: formData.message || `Demande: ${formData.requestType}\nÉcole: ${formData.school}\nTéléphone: ${formData.phone}`,
        honeypot: formData.website,
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Erreur lors de l\'envoi du message. Veuillez réessayer.');
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'contact@schoolconnect.cd',
      description: 'Envoyez-nous un email, nous répondons sous 24h'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      details: '+243 123 456 789',
      description: 'Appelez-nous du lundi au vendredi, 8h-18h'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      details: 'Kinshasa, République Démocratique du Congo',
      description: 'Notre équipe est basée localement'
    },
    {
      icon: Clock,
      title: 'Horaires',
      details: 'Lun-Ven: 8h-18h, Sam: 9h-13h',
      description: 'Support technique disponible 24/7'
    }
  ];

  const services = [
    {
      icon: MessageSquare,
      title: 'Démonstration personnalisée',
      description: 'Découvrez SchoolConnect avec une démo adaptée à votre école',
      duration: '30-45 minutes'
    },
    {
      icon: Users,
      title: 'Consultation gratuite',
      description: 'Analysons ensemble vos besoins en gestion scolaire',
      duration: '1 heure'
    },
    {
      icon: Calendar,
      title: 'Formation sur site',
      description: 'Formation complète de votre équipe dans vos locaux',
      duration: '1-2 jours'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Message envoyé avec succès !
          </h2>
          <p className="text-gray-600 mb-6">
            Merci pour votre intérêt. Notre équipe vous contactera dans les 24 heures.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                email: '',
                school: '',
                phone: '',
                message: '',
                requestType: 'demo'
              });
            }}
            className="btn btn-primary px-6 py-3"
          >
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold">
              Contactez-nous
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 leading-relaxed">
              Notre équipe locale est là pour vous accompagner dans la modernisation 
              de votre gestion scolaire.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Demandez votre démo gratuite
                </h2>
                <p className="text-lg text-gray-600">
                  Remplissez ce formulaire et nous vous contacterons pour organiser 
                  une démonstration personnalisée de SchoolConnect.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {errorMsg && (
                  <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">{errorMsg}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Objet de votre demande"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                      École *
                    </label>
                    <input
                      type="text"
                      id="school"
                      name="school"
                      required
                      value={formData.school}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Nom de votre école"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+243 123 456 789"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 mb-2">
                    Type de demande *
                  </label>
                  <select
                    id="requestType"
                    name="requestType"
                    required
                    value={formData.requestType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="demo">Démonstration du produit</option>
                    <option value="consultation">Consultation gratuite</option>
                    <option value="pricing">Information sur les tarifs</option>
                    <option value="support">Support technique</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Décrivez vos besoins ou posez vos questions..."
                  />
                </div>

                {/* Honeypot field */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    tabIndex={-1}
                    autoComplete="off"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Envoi en cours...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Send className="w-5 h-5" />
                      <span>Envoyer la demande</span>
                    </div>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Informations de contact
                </h2>
                <p className="text-lg text-gray-600">
                  Plusieurs moyens de nous joindre pour répondre à tous vos besoins.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                      <p className="text-primary-600 font-medium mb-1">{info.details}</p>
                      <p className="text-sm text-gray-600">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Réponse rapide garantie</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Réponse par email sous 24h</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Appel de retour sous 48h</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Démo organisée sous 1 semaine</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nos Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous vous accompagnons à chaque étape de votre transformation numérique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <service.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-sm text-primary-600 font-medium">
                  Durée: {service.duration}
                </div>
              </div>
            ))}
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
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'Combien de temps faut-il pour mettre en place SchoolConnect ?',
                answer: 'La mise en place complète prend généralement 1-2 semaines, incluant la configuration, la formation et la migration des données existantes.'
              },
              {
                question: 'Proposez-vous une formation pour notre équipe ?',
                answer: 'Oui, nous incluons une formation complète pour tous les utilisateurs. Nous proposons des sessions en présentiel ou en ligne selon vos préférences.'
              },
              {
                question: 'Que se passe-t-il si nous avons des problèmes techniques ?',
                answer: 'Notre équipe de support technique basée en RDC est disponible 24/7 par téléphone, email ou chat pour résoudre tous vos problèmes.'
              },
              {
                question: 'Pouvons-nous importer nos données existantes ?',
                answer: 'Absolument ! Nous vous aidons à migrer toutes vos données existantes (élèves, notes, finances) vers SchoolConnect sans perte d\'information.'
              }
            ].map((faq, index) => (
              <div key={index} className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

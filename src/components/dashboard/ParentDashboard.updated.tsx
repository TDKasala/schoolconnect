import React, { useState } from 'react';
import { User, BookOpen, CreditCard, Calendar, MessageSquare, CheckCircle, Send } from 'lucide-react';
import { useParent } from '../../hooks/useParent';

// This would typically come from auth context or props
const PARENT_ID = 'parent-123';

const ParentDashboard: React.FC = () => {
  const {
    stats,
    children,
    messages,
    payments,
    loading,
    error,
    sendMessage
  } = useParent(PARENT_ID);

  const [newMessage, setNewMessage] = useState({
    teacherId: '',
    content: ''
  });
  const [showMessageForm, setShowMessageForm] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.teacherId || !newMessage.content) return;
    
    try {
      await sendMessage(newMessage.teacherId, newMessage.content);
      
      // Reset form
      setNewMessage({
        teacherId: '',
        content: ''
      });
      setShowMessageForm(false);
      
      // Show success message
      alert('Message envoyé avec succès!');
    } catch (err) {
      // Show error message
      alert('Échec de l\'envoi du message');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erreur de chargement du portail parent</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statsData = stats ? [
    { name: 'Enfants', value: stats.childrenCount.toString(), icon: User, color: 'bg-primary-500' },
    { name: 'Moyenne générale', value: `${stats.overallAverage}/20`, icon: BookOpen, color: 'bg-secondary-500' },
    { name: 'Frais scolaires', value: stats.paymentStatus, icon: CreditCard, color: 'bg-primary-600' },
    { name: 'Présence', value: `${stats.overallAttendance}%`, icon: Calendar, color: 'bg-secondary-600' }
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Portail Parent</h1>
        <p className="mt-2 text-gray-600">Suivez les progrès de votre enfant</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Messages Section */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Messages des Enseignants</h2>
            <div className="flex items-center space-x-2">
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {messages.filter(m => m.isNew).length} nouveaux
              </span>
              <button 
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                onClick={() => setShowMessageForm(!showMessageForm)}
              >
                {showMessageForm ? 'Annuler' : 'Nouveau message'}
              </button>
            </div>
          </div>
        </div>
        
        {showMessageForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destinataire</label>
                <select
                  value={newMessage.teacherId}
                  onChange={(e) => setNewMessage({...newMessage, teacherId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Sélectionnez un enseignant</option>
                  <option value="teacher-1">Mme. Lucie - Mathématiques</option>
                  <option value="teacher-2">M. Pierre - Sciences</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tapez votre message ici..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSendMessage}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`border-l-4 ${message.isNew ? 'border-secondary-500 bg-secondary-50' : 'border-primary-500 bg-primary-50'} p-4 rounded-r-lg`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{message.teacherName} - {message.subject}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{message.content}</p>
                <button className="mt-2 text-sm text-secondary-600 hover:text-secondary-700 font-medium">
                  Répondre →
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
              Voir tous les messages →
            </button>
          </div>
        </div>
      </div>

      {/* Children Info */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mes Enfants</h2>
        </div>
        <div className="p-6">
          {children.map((child) => (
            <div key={child.id} className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0">
              <h3 className="font-semibold text-gray-900">{child.name}</h3>
              <p className="text-sm text-gray-600">{child.className}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Moyenne:</span>
                  <span className="ml-2 font-medium">{child.average}/20</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Présence:</span>
                  <span className="ml-2 font-medium">{child.attendance}%</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors text-sm">
                  Voir les notes
                </button>
                <button className="flex-1 bg-secondary-600 text-white py-2 px-4 rounded-md hover:bg-secondary-700 transition-colors text-sm">
                  Voir l\'emploi du temps
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;

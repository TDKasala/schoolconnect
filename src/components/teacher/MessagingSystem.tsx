import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  Paperclip, 
  Eye, 
  EyeOff,
  Clock,
  CheckCircle,
  User,
  Plus,
  X,
  ArrowLeft,
  MoreVertical
} from 'lucide-react';

interface Parent {
  id: string;
  name: string;
  email: string;
  children: string[];
  avatar?: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: string[];
  priority: 'low' | 'medium' | 'high';
  category: 'general' | 'academic' | 'behavior' | 'attendance' | 'urgent';
}

interface Conversation {
  id: string;
  parentId: string;
  parentName: string;
  childName: string;
  lastMessage: Message;
  unreadCount: number;
  messages: Message[];
}

const MessagingSystem: React.FC = () => {
  const [activeView, setActiveView] = useState<'inbox' | 'compose' | 'conversation'>('inbox');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'general' as 'general' | 'academic' | 'behavior' | 'attendance' | 'urgent'
  });

  // Mock data
  const parents: Parent[] = [
    { id: '1', name: 'Marie Kabongo', email: 'marie.kabongo@email.com', children: ['Marie Kabongo Jr.'] },
    { id: '2', name: 'Jean Mukendi', email: 'jean.mukendi@email.com', children: ['Jean Mukendi Jr.'] },
    { id: '3', name: 'Sarah Mbuyi', email: 'sarah.mbuyi@email.com', children: ['Sarah Mbuyi Jr.'] },
    { id: '4', name: 'Paul Tshiaba', email: 'paul.tshiaba@email.com', children: ['Paul Tshiaba Jr.'] },
    { id: '5', name: 'Grace Nkomo', email: 'grace.nkomo@email.com', children: ['Grace Nkomo Jr.'] }
  ];

  const conversations: Conversation[] = [
    {
      id: '1',
      parentId: '1',
      parentName: 'Marie Kabongo',
      childName: 'Marie Kabongo Jr.',
      unreadCount: 2,
      lastMessage: {
        id: '1',
        senderId: '1',
        receiverId: 'teacher',
        subject: 'Question sur les devoirs',
        content: 'Bonjour, j\'aimerais savoir quels sont les devoirs pour ce weekend?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
        priority: 'medium',
        category: 'academic'
      },
      messages: [
        {
          id: '1',
          senderId: '1',
          receiverId: 'teacher',
          subject: 'Question sur les devoirs',
          content: 'Bonjour, j\'aimerais savoir quels sont les devoirs pour ce weekend?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: false,
          priority: 'medium',
          category: 'academic'
        }
      ]
    },
    {
      id: '2',
      parentId: '2',
      parentName: 'Jean Mukendi',
      childName: 'Jean Mukendi Jr.',
      unreadCount: 0,
      lastMessage: {
        id: '2',
        senderId: 'teacher',
        receiverId: '2',
        subject: 'Félicitations pour les progrès',
        content: 'Bonjour, je tenais à vous féliciter pour les excellents progrès de Jean en mathématiques.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isRead: true,
        priority: 'low',
        category: 'academic'
      },
      messages: [
        {
          id: '2',
          senderId: 'teacher',
          receiverId: '2',
          subject: 'Félicitations pour les progrès',
          content: 'Bonjour, je tenais à vous féliciter pour les excellents progrès de Jean en mathématiques.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          isRead: true,
          priority: 'low',
          category: 'academic'
        }
      ]
    },
    {
      id: '3',
      parentId: '3',
      parentName: 'Sarah Mbuyi',
      childName: 'Sarah Mbuyi Jr.',
      unreadCount: 1,
      lastMessage: {
        id: '3',
        senderId: '3',
        receiverId: 'teacher',
        subject: 'Absence de demain',
        content: 'Bonjour, Sarah sera absente demain pour un rendez-vous médical.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: false,
        priority: 'high',
        category: 'attendance'
      },
      messages: [
        {
          id: '3',
          senderId: '3',
          receiverId: 'teacher',
          subject: 'Absence de demain',
          content: 'Bonjour, Sarah sera absente demain pour un rendez-vous médical.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          isRead: false,
          priority: 'high',
          category: 'attendance'
        }
      ]
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.recipient && newMessage.subject && newMessage.content) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      
      // Reset form
      setNewMessage({
        recipient: '',
        subject: '',
        content: '',
        priority: 'medium',
        category: 'general'
      });
      
      // Return to inbox
      setActiveView('inbox');
    }
  };

  const handleReply = (conversationId: string, content: string) => {
    // Here you would typically send the reply to your backend
    console.log('Sending reply to conversation:', conversationId, content);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-secondary-600 bg-secondary-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'academic': return 'text-primary-600 bg-primary-100';
      case 'behavior': return 'text-secondary-600 bg-secondary-100';
      case 'attendance': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterCategory === 'all' || conv.lastMessage.category === filterCategory;
    
    return matchesSearch && matchesFilter;
  });

  if (activeView === 'conversation' && selectedConversation) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => setActiveView('inbox')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux messages
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Conversation avec {selectedConversation.parentName}
          </h1>
          <p className="text-gray-600">Concernant {selectedConversation.childName}</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="space-y-4">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'teacher' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'teacher'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">{message.subject}</div>
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs mt-2 opacity-75">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Section */}
          <div className="p-6">
            <div className="flex space-x-4">
              <textarea
                placeholder="Tapez votre réponse..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
              <button
                onClick={() => handleReply(selectedConversation.id, '')}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'compose') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => setActiveView('inbox')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux messages
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau Message</h1>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="space-y-6">
              {/* Recipient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destinataire
                </label>
                <select
                  value={newMessage.recipient}
                  onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un parent</option>
                  {parents.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name} - {parent.children.join(', ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet
                </label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Sujet du message"
                />
              </div>

              {/* Priority and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priorité
                  </label>
                  <select
                    value={newMessage.priority}
                    onChange={(e) => setNewMessage({...newMessage, priority: e.target.value as 'low' | 'medium' | 'high'})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Élevée</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={newMessage.category}
                    onChange={(e) => setNewMessage({...newMessage, category: e.target.value as any})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="general">Général</option>
                    <option value="academic">Académique</option>
                    <option value="behavior">Comportement</option>
                    <option value="attendance">Présence</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  rows={6}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tapez votre message ici..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setActiveView('inbox')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="mt-2 text-gray-600">Communiquez avec les parents de vos élèves</p>
      </div>

      {/* Header Actions */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 flex space-x-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Toutes catégories</option>
                <option value="general">Général</option>
                <option value="academic">Académique</option>
                <option value="behavior">Comportement</option>
                <option value="attendance">Présence</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <button
              onClick={() => setActiveView('compose')}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Message
            </button>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Conversations ({filteredConversations.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun message trouvé</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => {
                  setSelectedConversation(conversation);
                  setActiveView('conversation');
                }}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          {conversation.parentName}
                        </h3>
                        <span className="text-xs text-gray-500">
                          • {conversation.childName}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(conversation.lastMessage.category)}`}>
                          {conversation.lastMessage.category}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(conversation.lastMessage.priority)}`}>
                          {conversation.lastMessage.priority}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {conversation.lastMessage.subject}
                    </p>
                    
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingSystem;

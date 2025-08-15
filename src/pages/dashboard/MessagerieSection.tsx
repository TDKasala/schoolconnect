import React, { useEffect, useMemo, useState } from 'react';
import {
  Send,
  Search,
  Paperclip,
  Phone,
  Video,
  MoreVertical
} from 'lucide-react';
import { messagesService, Message } from '../../services/messagesService';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

const MessagerieSection: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const conversations = [
    {
      id: 'peer-parent-1',
      name: 'Parents 6ème A',
      type: 'group',
      lastMessage: 'Bonjour, j\'ai une question concernant le devoir...',
      time: '10:30',
      unread: 3,
      avatar: 'bg-blue-500'
    },
    {
      id: 'user-marie',
      name: 'Marie Tshala',
      type: 'individual',
      lastMessage: 'Merci pour l\'information',
      time: '09:15',
      unread: 0,
      avatar: 'bg-green-500'
    },
    {
      id: 'user-jean',
      name: 'Jean Kabila',
      type: 'individual',
      lastMessage: 'Oui, j\'ai bien reçu le message',
      time: 'Hier',
      unread: 1,
      avatar: 'bg-purple-500'
    }
  ];

  // Map our demo ids to actual receiver ids (in a real app, these should come from DB)
  const idMap = useMemo(() => ({
    'user-marie': 'user_marie_id',
    'user-jean': 'user_jean_id',
    // For now, we will not send to group in this MVP
    'peer-parent-1': null as string | null,
  }), []);

  useEffect(() => {
    const fetch = async () => {
      if (!user || !selectedPeerId) return;
      const receiverId = idMap[selectedPeerId as keyof typeof idMap];
      if (!receiverId) {
        setMessages([]);
        return;
      }
      try {
        setLoading(true);
        const data = await messagesService.listBetween({ userId: user.id, peerId: receiverId });
        setMessages(data);
      } catch (e: any) {
        error(`Erreur de chargement des messages: ${e.message || e}`);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user, selectedPeerId, idMap, error]);

  const handleSendMessage = async () => {
    if (!user) {
      error("Vous devez être connecté pour envoyer un message");
      return;
    }
    if (!message.trim()) return;
    const receiverId = selectedPeerId ? idMap[selectedPeerId as keyof typeof idMap] : null;
    if (!receiverId) {
      error("Sélectionnez une conversation (message direct) pour envoyer");
      return;
    }
    const content = message.trim();
    // Optimistic append
    const optimistic: Message = {
      id: `tmp_${Date.now()}`,
      sender_id: user.id,
      receiver_id: receiverId,
      content,
      type: 'direct',
      read: true,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setMessage('');
    try {
      const saved = await messagesService.sendDirect({ senderId: user.id, receiverId, content });
      // Replace optimistic with saved
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? saved : m)));
      success('Message envoyé');
    } catch (e: any) {
      // Revert optimistic
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      error(`Échec d\'envoi: ${e.message || e}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messagerie</h1>
        <p className="mt-2 text-gray-600">Communication en temps réel entre tous les acteurs</p>
      </div>

      <div className="bg-white rounded-lg shadow flex h-96">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>
          
          <div className="overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedPeerId(conversation.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedPeerId === conversation.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${conversation.avatar} flex items-center justify-center text-white text-sm font-medium`}>
                    {conversation.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversation.name}
                      </p>
                      <p className="text-xs text-gray-500">{conversation.time}</p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                P
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Parents 6ème A</p>
                <p className="text-xs text-gray-500">5 participants</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Phone className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Video className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading && (
              <div className="text-sm text-gray-500">Chargement des messages…</div>
            )}
            {!loading && messages.length === 0 && (
              <div className="text-sm text-gray-500">Aucun message</div>
            )}
            {!loading && messages.map((msg) => {
              const isOwn = user?.id === msg.sender_id;
              return (
                <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Paperclip className="h-5 w-5" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Écrire un message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagerieSection;

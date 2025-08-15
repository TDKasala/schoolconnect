import React, { useEffect, useState } from 'react';
import {
  Send,
  Search,
  Paperclip,
  Phone,
  Video,
  MoreVertical
} from 'lucide-react';
import { messagesService, Message } from '../../services/messagesService';
import { usersService, AppUser } from '../../services/usersService';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const MessagerieSection: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [peers, setPeers] = useState<AppUser[]>([]);
  const [search, setSearch] = useState('');
  const [summaries, setSummaries] = useState<Record<string, { unread: number; last?: Message | null }>>({});
  const [peerTyping, setPeerTyping] = useState(false);

  // Load peers from DB
  useEffect(() => {
    const run = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const list = await usersService.listPeers({ schoolId: (user as any)?.profile?.school_id ?? null, excludeUserId: user.id, search });
        setPeers(list);
        // Load thread summaries
        const th = await messagesService.listThreadSummaries({ userId: user.id });
        const map: Record<string, { unread: number; last?: Message | null }> = {};
        for (const t of th) map[t.peer_id] = { unread: t.unread_count, last: t.last_message };
        setSummaries(map);
      } catch (e: any) {
        error(`Erreur de chargement des utilisateurs: ${e.message || e}`);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user, search, error]);

  useEffect(() => {
    const fetch = async () => {
      if (!user || !selectedPeerId) return;
      const receiverId = selectedPeerId;
      try {
        setLoading(true);
        const data = await messagesService.listBetween({ userId: user.id, peerId: receiverId });
        setMessages(data);
        // Mark as read when opening
        await messagesService.markRead({ userId: user.id, peerId: receiverId });
        setSummaries((prev) => ({ ...prev, [receiverId]: { ...(prev[receiverId] || {}), unread: 0 } }));
      } catch (e: any) {
        error(`Erreur de chargement des messages: ${e.message || e}`);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user, selectedPeerId, error]);

  // Realtime messages subscription for the selected peer
  useEffect(() => {
    if (!user || !selectedPeerId) return;
    const peerId = selectedPeerId;
    const channel = supabase
      .channel(`messages-thread-${user.id}-${peerId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `or(and(sender_id.eq.${peerId},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${peerId}))`
      }, (payload: any) => {
        const row = payload.new as Message;
        // Append only if it belongs to this thread
        if (
          (row.sender_id === user.id && row.receiver_id === peerId) ||
          (row.sender_id === peerId && row.receiver_id === user.id)
        ) {
          setMessages((prev) => [...prev, row]);
          // Update last message and unread
          setSummaries((prev) => ({
            ...prev,
            [peerId]: {
              unread: row.sender_id === user.id ? (prev[peerId]?.unread || 0) : (peerId === selectedPeerId ? 0 : (prev[peerId]?.unread || 0) + 1),
              last: row,
            },
          }));
          // If message is from peer and current thread open, mark read
          if (row.sender_id === peerId && row.receiver_id === user.id) {
            messagesService.markRead({ userId: user.id, peerId }).catch(() => {});
          }
        }
      })
      .on('broadcast', { event: 'typing' }, (payload: any) => {
        const { from, to } = payload.payload || {};
        if (from === peerId && to === user.id) {
          setPeerTyping(true);
          // Reset after short delay
          setTimeout(() => setPeerTyping(false), 1500);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedPeerId]);

  const handleSendMessage = async () => {
    if (!user) {
      error("Vous devez être connecté pour envoyer un message");
      return;
    }
    if (!message.trim()) return;
    const receiverId = selectedPeerId;
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
      // Update summaries immediately
      setSummaries((prev) => ({ ...prev, [receiverId]: { unread: prev[receiverId]?.unread || 0, last: saved } }));
    } catch (e: any) {
      // Revert optimistic
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      error(`Échec d\'envoi: ${e.message || e}`);
    }
  };

  // Send typing broadcast when user types
  useEffect(() => {
    if (!user || !selectedPeerId) return;
    if (!message) return;
    const peerId = selectedPeerId;
    const channel = supabase.channel(`typing-${user.id}-${peerId}`);
    const send = async () => {
      try {
        await channel.send({ type: 'broadcast', event: 'typing', payload: { from: user.id, to: peerId } });
      } catch {}
    };
    send();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedPeerId, message]);

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>
          
          <div className="overflow-y-auto">
            {peers.map((peer) => {
              const summary = summaries[peer.id];
              return (
              <div
                key={peer.id}
                onClick={() => setSelectedPeerId(peer.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedPeerId === peer.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium`}>
                    {peer.full_name?.charAt(0) || peer.email?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {peer.full_name || peer.email}
                      </p>
                      <p className="text-xs text-gray-500">{peer.role}</p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {summary?.last?.content || '—'}
                      </p>
                      {!!summary?.unread && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                          {summary.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
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
                <p className="text-sm font-medium text-gray-900">{peers.find(p => p.id === selectedPeerId)?.full_name || '—'}</p>
                <p className="text-xs text-gray-500">{peerTyping ? 'En train d\'écrire…' : 'Direct'}</p>
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

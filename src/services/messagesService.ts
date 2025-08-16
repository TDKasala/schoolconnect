import { supabase } from '../lib/supabase';

export type MessageType = 'direct' | 'group';

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string; // for group messages, could be a group id in future
  content: string;
  type: MessageType;
  read: boolean;
  created_at: string;
  updated_at?: string;
};

export type ThreadSummary = {
  peer_id: string;
  last_message: Message | null;
  unread_count: number;
};

export const messagesService = {
  async listBetween(params: { userId: string; peerId: string; limit?: number }): Promise<Message[]> {
    const { userId, peerId, limit = 200 } = params;
    // Fetch both directions between user and peer, ordered ascending for chat display
    const { data, error } = await supabase
      .from('messages')
      .select('id, sender_id, receiver_id, content, type, read, created_at, updated_at')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${peerId}),and(sender_id.eq.${peerId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true })
      .limit(limit);
    if (error) throw error;
    return (data as Message[]) || [];
  },

  async sendDirect(params: { senderId: string; receiverId: string; content: string }): Promise<Message> {
    const { senderId, receiverId, content } = params;
    const payload = { sender_id: senderId, receiver_id: receiverId, content, type: 'direct' as const, read: false };
    const { data, error } = await supabase
      .from('messages')
      .insert(payload as any)
      .select('id, sender_id, receiver_id, content, type, read, created_at, updated_at')
      .single();
    if (error) throw error;
    return data as Message;
  },

  async markRead(params: { userId: string; peerId: string }): Promise<void> {
    const { userId, peerId } = params;
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('receiver_id', userId)
      .eq('sender_id', peerId)
      .eq('read', false);
    if (error) throw error;
  },

  async listThreadSummaries(params: { userId: string; limit?: number }): Promise<ThreadSummary[]> {
    const { userId, limit = 200 } = params;
    // Fetch recent messages involving the user and compute summaries client-side (MVP)
    const { data, error } = await supabase
      .from('messages')
      .select('id, sender_id, receiver_id, content, type, read, created_at, updated_at')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    const rows = (data as Message[]) || [];

    const map = new Map<string, ThreadSummary>();
    for (const m of rows) {
      const peer = m.sender_id === userId ? m.receiver_id : m.sender_id;
      const existing = map.get(peer);
      const unreadInc = m.receiver_id === userId && !m.read ? 1 : 0;
      if (!existing) {
        map.set(peer, {
          peer_id: peer,
          last_message: m,
          unread_count: unreadInc,
        });
      } else {
        // last_message already the most recent due to ordering; just accumulate unread
        existing.unread_count += unreadInc;
      }
    }
    return Array.from(map.values());
  },
};

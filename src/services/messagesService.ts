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

export const messagesService = {
  async listBetween(params: { userId: string; peerId: string; limit?: number }): Promise<Message[]> {
    const { userId, peerId, limit = 200 } = params;
    // Fetch both directions between user and peer, ordered ascending for chat display
    const { data, error } = await supabase
      .from('messages')
      .select('*')
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
      .select('*')
      .single();
    if (error) throw error;
    return data as Message;
  },
};

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { messagesService, Message } from '../services/messagesService';

/**
 * Subscribe to live direct messages between userId and peerId.
 * - Loads initial thread
 * - Marks as read on load and on incoming peer messages
 * - Subscribes to INSERT for the specific 1:1 thread and appends new messages
 */
export function useLiveThread(userId: string | null, peerId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Load initial messages when participants change
  useEffect(() => {
    const run = async () => {
      if (!userId || !peerId) {
        setMessages([]);
        return;
      }
      setLoading(true);
      try {
        const data = await messagesService.listBetween({ userId, peerId });
        setMessages(data);
        await messagesService.markRead({ userId, peerId });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [userId, peerId]);

  // Realtime subscription to new messages
  useEffect(() => {
    if (!userId || !peerId) return;
    const channel = supabase
      .channel(`messages-thread-${userId}-${peerId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${peerId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${peerId}))`,
        },
        (payload: any) => {
          const row = payload.new as Message;
          if (
            (row.sender_id === userId && row.receiver_id === peerId) ||
            (row.sender_id === peerId && row.receiver_id === userId)
          ) {
            setMessages((prev) => [...prev, row]);
            // Mark read if incoming from peer
            if (row.sender_id === peerId && row.receiver_id === userId) {
              messagesService.markRead({ userId, peerId }).catch(() => {});
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, peerId]);

  return { messages, setMessages, loading };
}

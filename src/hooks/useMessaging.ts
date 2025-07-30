import { useState, useEffect, useCallback } from 'react';
import MessagingService, { MessagingMessage, Conversation, MessagingStats } from '../services/messagingService';

export interface UseMessagingReturn {
  messages: MessagingMessage[];
  conversations: Conversation[];
  stats: MessagingStats | null;
  loading: boolean;
  error: string | null;
  fetchMessages: (limit?: number) => Promise<void>;
  fetchUnreadMessages: () => Promise<void>;
  fetchDirectMessages: (otherUserId: string, limit?: number) => Promise<void>;
  fetchClassMessages: (classId: string, limit?: number) => Promise<void>;
  sendMessage: (messageData: Omit<MessagingMessage, 'id' | 'createdAt' | 'updatedAt'>) => Promise<MessagingMessage>;
  markAsRead: (messageId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  fetchMessagingStats: () => Promise<void>;
  fetchConversations: () => Promise<void>;
}

/**
 * Hook for messaging functionality
 */
export const useMessaging = (userId: string, schoolId: string): UseMessagingReturn => {
  const [messages, setMessages] = useState<MessagingMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [stats, setStats] = useState<MessagingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagingService = new MessagingService(userId, schoolId);

  const fetchMessages = useCallback(async (limit: number = 50) => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagingService.getMessages(limit);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchUnreadMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagingService.getUnreadMessages();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch unread messages');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchDirectMessages = useCallback(async (otherUserId: string, limit: number = 50) => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagingService.getDirectMessages(otherUserId, limit);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch direct messages');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchClassMessages = useCallback(async (classId: string, limit: number = 50) => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagingService.getClassMessages(classId, limit);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class messages');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const sendMessage = useCallback(async (messageData: Omit<MessagingMessage, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newMessage = await messagingService.sendMessage(messageData);
      setMessages(prev => [newMessage, ...prev]);
      return newMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  }, [userId, schoolId]);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      setError(null);
      await messagingService.markAsRead(messageId);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark message as read');
      throw err;
    }
  }, [userId, schoolId]);

  const markAllAsRead = useCallback(async () => {
    try {
      setError(null);
      await messagingService.markAllAsRead();
      setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all messages as read');
      throw err;
    }
  }, [userId, schoolId]);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      setError(null);
      await messagingService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message');
      throw err;
    }
  }, [userId, schoolId]);

  const fetchMessagingStats = useCallback(async () => {
    try {
      setError(null);
      const data = await messagingService.getMessagingStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messaging stats');
    }
  }, [userId, schoolId]);

  const fetchConversations = useCallback(async () => {
    try {
      setError(null);
      const data = await messagingService.getConversations();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
    }
  }, [userId, schoolId]);

  // Fetch initial data
  useEffect(() => {
    fetchMessages();
    fetchMessagingStats();
    fetchConversations();
  }, [fetchMessages, fetchMessagingStats, fetchConversations]);

  return {
    messages,
    conversations,
    stats,
    loading,
    error,
    fetchMessages,
    fetchUnreadMessages,
    fetchDirectMessages,
    fetchClassMessages,
    sendMessage,
    markAsRead,
    markAllAsRead,
    deleteMessage,
    fetchMessagingStats,
    fetchConversations
  };
};

/**
 * Hook for messaging messages
 */
export const useMessagingMessages = (userId: string, schoolId: string) => {
  const [messages, setMessages] = useState<MessagingMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagingService = new MessagingService(userId, schoolId);

  const fetchMessages = useCallback(async (limit: number = 50) => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagingService.getMessages(limit);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchDirectMessages = useCallback(async (otherUserId: string, limit: number = 50) => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagingService.getDirectMessages(otherUserId, limit);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch direct messages');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const fetchClassMessages = useCallback(async (classId: string, limit: number = 50) => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagingService.getClassMessages(classId, limit);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class messages');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  const sendMessage = useCallback(async (messageData: Omit<MessagingMessage, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newMessage = await messagingService.sendMessage(messageData);
      setMessages(prev => [newMessage, ...prev]);
      return newMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  }, [userId, schoolId]);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      setError(null);
      await messagingService.markAsRead(messageId);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark message as read');
      throw err;
    }
  }, [userId, schoolId]);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      setError(null);
      await messagingService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message');
      throw err;
    }
  }, [userId, schoolId]);

  return {
    messages,
    loading,
    error,
    fetchMessages,
    fetchDirectMessages,
    fetchClassMessages,
    sendMessage,
    markAsRead,
    deleteMessage
  };
};

/**
 * Hook for messaging conversations
 */
export const useMessagingConversations = (userId: string, schoolId: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagingService = new MessagingService(userId, schoolId);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagingService.getConversations();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations
  };
};

/**
 * Hook for messaging statistics
 */
export const useMessagingStats = (userId: string, schoolId: string) => {
  const [stats, setStats] = useState<MessagingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagingService = new MessagingService(userId, schoolId);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagingService.getMessagingStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [userId, schoolId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

export default useMessaging;

import { supabase } from '../lib/supabase';
import logger from '../utils/logger';

export interface MessagingMessage {
  id: string;
  senderId: string;
  receiverId?: string;
  classId?: string;
  content: string;
  subject?: string;
  type: 'direct' | 'group' | 'announcement';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: MessagingMessage;
  unreadCount: number;
}

export interface MessagingStats {
  totalMessages: number;
  unreadMessages: number;
  sentMessages: number;
  receivedMessages: number;
}

export class MessagingService {
  private userId: string;
  private _schoolId: string;

  constructor(userId: string, schoolId: string) {
    this.userId = userId;
    this._schoolId = schoolId;
  }

  /**
   * Get messages for the current user
   */
  async getMessages(limit: number = 50): Promise<MessagingMessage[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, sender_id, receiver_id, class_id, content, subject, type, is_read, created_at, updated_at')
        .or(`sender_id.eq.${this.userId},receiver_id.eq.${this.userId}`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(message => ({
        id: message.id,
        senderId: message.sender_id,
        receiverId: message.receiver_id,
        classId: message.class_id,
        content: message.content,
        subject: message.subject,
        type: message.type,
        isRead: message.is_read,
        createdAt: new Date(message.created_at),
        updatedAt: new Date(message.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }
  }

  /**
   * Get unread messages for the current user
   */
  async getUnreadMessages(): Promise<MessagingMessage[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, sender_id, receiver_id, class_id, content, subject, type, is_read, created_at, updated_at')
        .eq('receiver_id', this.userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(message => ({
        id: message.id,
        senderId: message.sender_id,
        receiverId: message.receiver_id,
        classId: message.class_id,
        content: message.content,
        subject: message.subject,
        type: message.type,
        isRead: message.is_read,
        createdAt: new Date(message.created_at),
        updatedAt: new Date(message.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching unread messages:', error);
      throw new Error('Failed to fetch unread messages');
    }
  }

  /**
   * Get messages between two users
   */
  async getDirectMessages(otherUserId: string, limit: number = 50): Promise<MessagingMessage[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, sender_id, receiver_id, class_id, content, subject, type, is_read, created_at, updated_at')
        .or(`and(sender_id.eq.${this.userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${this.userId})`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(message => ({
        id: message.id,
        senderId: message.sender_id,
        receiverId: message.receiver_id,
        classId: message.class_id,
        content: message.content,
        subject: message.subject,
        type: message.type,
        isRead: message.is_read,
        createdAt: new Date(message.created_at),
        updatedAt: new Date(message.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching direct messages:', error);
      throw new Error('Failed to fetch direct messages');
    }
  }

  /**
   * Get messages for a specific class
   */
  async getClassMessages(classId: string, limit: number = 50): Promise<MessagingMessage[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, sender_id, receiver_id, class_id, content, subject, type, is_read, created_at, updated_at')
        .eq('class_id', classId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(message => ({
        id: message.id,
        senderId: message.sender_id,
        receiverId: message.receiver_id,
        classId: message.class_id,
        content: message.content,
        subject: message.subject,
        type: message.type,
        isRead: message.is_read,
        createdAt: new Date(message.created_at),
        updatedAt: new Date(message.updated_at)
      })) || [];
    } catch (error) {
      logger.error('Error fetching class messages:', error);
      throw new Error('Failed to fetch class messages');
    }
  }

  /**
   * Send a new message
   */
  async sendMessage(messageData: Omit<MessagingMessage, 'id' | 'createdAt' | 'updatedAt'>): Promise<MessagingMessage> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: this.userId,
          receiver_id: messageData.receiverId,
          class_id: messageData.classId,
          content: messageData.content,
          subject: messageData.subject,
          type: messageData.type,
          is_read: false
        })
        .select('id, sender_id, receiver_id, class_id, content, subject, type, is_read, created_at, updated_at')
        .single();

      if (error) throw error;

      return {
        id: data.id,
        senderId: data.sender_id,
        receiverId: data.receiver_id,
        classId: data.class_id,
        content: data.content,
        subject: data.subject,
        type: data.type,
        isRead: data.is_read,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      logger.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  /**
   * Mark a message as read
   */
  async markAsRead(messageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('receiver_id', this.userId);

      if (error) throw error;
    } catch (error) {
      logger.error('Error marking message as read:', error);
      throw new Error('Failed to mark message as read');
    }
  }

  /**
   * Mark all messages as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', this.userId)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      logger.error('Error marking all messages as read:', error);
      throw new Error('Failed to mark all messages as read');
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .or(`sender_id.eq.${this.userId},receiver_id.eq.${this.userId}`);

      if (error) throw error;
    } catch (error) {
      logger.error('Error deleting message:', error);
      throw new Error('Failed to delete message');
    }
  }

  /**
   * Get messaging statistics
   */
  async getMessagingStats(): Promise<MessagingStats> {
    try {
      // Get total messages
      const { count: totalMessages, error: totalError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .or(`sender_id.eq.${this.userId},receiver_id.eq.${this.userId}`);

      if (totalError) throw totalError;

      // Get unread messages
      const { count: unreadMessages, error: unreadError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', this.userId)
        .eq('is_read', false);

      if (unreadError) throw unreadError;

      // Get sent messages
      const { count: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('sender_id', this.userId);

      if (sentError) throw sentError;

      // Get received messages
      const { count: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', this.userId);

      if (receivedError) throw receivedError;

      return {
        totalMessages: totalMessages || 0,
        unreadMessages: unreadMessages || 0,
        sentMessages: sentMessages || 0,
        receivedMessages: receivedMessages || 0
      };
    } catch (error) {
      logger.error('Error fetching messaging stats:', error);
      throw new Error('Failed to fetch messaging statistics');
    }
  }

  /**
   * Get conversations (unique senders/receivers)
   */
  async getConversations(): Promise<Conversation[]> {
    try {
      // This is a simplified implementation
      // In a real app, you might want to group messages by conversation
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id, sender_id, receiver_id, class_id, content, subject, type, is_read, created_at, updated_at,
          sender:users!messages_sender_id_fkey(full_name),
          receiver:users!messages_receiver_id_fkey(full_name)
        `)
        .or(`sender_id.eq.${this.userId},receiver_id.eq.${this.userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationsMap: { [key: string]: Conversation } = {};
      
      data?.forEach(message => {
        const otherUserId = message.sender_id === this.userId ? message.receiver_id : message.sender_id;
        
        if (otherUserId && !conversationsMap[otherUserId]) {
          conversationsMap[otherUserId] = {
            id: otherUserId,
            participants: [this.userId, otherUserId],
            lastMessage: {
              id: message.id,
              senderId: message.sender_id,
              receiverId: message.receiver_id,
              classId: message.class_id,
              content: message.content,
              subject: message.subject,
              type: message.type,
              isRead: message.is_read,
              createdAt: new Date(message.created_at),
              updatedAt: new Date(message.updated_at)
            },
            unreadCount: message.receiver_id === this.userId && !message.is_read ? 1 : 0
          };
        } else if (otherUserId) {
          // Update last message if this is newer
          if (message.created_at > conversationsMap[otherUserId].lastMessage.createdAt.toISOString()) {
            conversationsMap[otherUserId].lastMessage = {
              id: message.id,
              senderId: message.sender_id,
              receiverId: message.receiver_id,
              classId: message.class_id,
              content: message.content,
              subject: message.subject,
              type: message.type,
              isRead: message.is_read,
              createdAt: new Date(message.created_at),
              updatedAt: new Date(message.updated_at)
            };
          }
          
          // Update unread count
          if (message.receiver_id === this.userId && !message.is_read) {
            conversationsMap[otherUserId].unreadCount += 1;
          }
        }
      });

      return Object.values(conversationsMap);
    } catch (error) {
      logger.error('Error fetching conversations:', error);
      throw new Error('Failed to fetch conversations');
    }
  }
}

export default MessagingService;

import { supabase } from '../lib/supabase';

export type ContactStatus = 'new' | 'read' | 'responded';

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: ContactStatus;
};

function sanitize(input: string): string {
  // Basic sanitization: trim and remove control chars
  return input.replace(/[\x00-\x1F\x7F]/g, '').trim();
}

export const contactMessagesService = {
  async submit(payload: { name: string; email: string; subject: string; message: string; honeypot?: string }): Promise<ContactMessage> {
    const { name, email, subject, message, honeypot } = payload;

    // Honeypot check (spam prevention)
    if (honeypot && honeypot.trim().length > 0) {
      throw new Error('Spam detected');
    }

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name?.trim() || !emailRegex.test(email) || !subject?.trim() || !message?.trim()) {
      throw new Error('Invalid form data');
    }

    const safe = {
      name: sanitize(name).slice(0, 120),
      email: sanitize(email).toLowerCase().slice(0, 160),
      subject: sanitize(subject).slice(0, 160),
      message: sanitize(message).slice(0, 4000),
      status: 'new' as ContactStatus,
    };

    const { data, error } = await supabase
      .from('contact_messages')
      .insert(safe as any)
      .select('id, name, email, subject, message, status, created_at')
      .single();

    if (error) throw error;
    return data as ContactMessage;
  },

  async list(params?: { status?: ContactStatus; search?: string; limit?: number }): Promise<ContactMessage[]> {
    const { status, search, limit = 200 } = params || {};
    let query = supabase
      .from('contact_messages')
      .select('id, name, email, subject, message, status, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) query = query.eq('status', status);

    if (search && search.trim()) {
      // Basic OR search on name/email/subject/message
      const s = sanitize(search);
      query = query.or(`name.ilike.%${s}%,email.ilike.%${s}%,subject.ilike.%${s}%,message.ilike.%${s}%` as any);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as ContactMessage[]) || [];
  },

  async updateStatus(id: string, status: ContactStatus): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },
};

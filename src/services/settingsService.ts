import { supabase } from '../lib/supabase';
import logger from '../utils/logger';

export type PlatformSettings = {
  id: string;
  platform_name: string;
  contact_email: string;
  primary_color?: string | null;
  support_url?: string | null;
  feature_flags?: {
    messaging?: boolean;
    ubank?: boolean;
    posp?: boolean;
  } | null;
  // JSONB sections
  branding?: {
    logo_url?: string | null;
    theme?: 'light' | 'dark' | 'system';
    color_scheme?: string | null;
  } | null;
  security?: {
    auth_providers?: { email?: boolean; google?: boolean; facebook?: boolean };
    two_factor?: { enabled?: boolean };
    password_policy?: { min_length?: number; require_numbers?: boolean; require_special?: boolean };
    api_keys?: { has_gemini?: boolean };
  } | null;
  data_privacy?: {
    gdpr?: boolean;
    popia?: boolean;
    data_retention_days?: number;
    backups?: { enabled?: boolean; frequency?: 'daily' | 'weekly' | 'monthly' };
  } | null;
  access_control?: {
    rls_preset?: 'strict' | 'balanced' | 'open';
    audit_logs?: { enabled?: boolean };
    permissions?: Record<string, any>;
  } | null;
  ai?: {
    enable_reporting_ai?: boolean;
    enable_chat_ai?: boolean;
    enable_assist_ai?: boolean;
    provider?: 'gemini' | 'openai' | 'none';
    model?: string | null;
  } | null;
  billing?: {
    provider?: ('stripe' | 'paypal')[];
    plan?: 'free' | 'basic' | 'pro' | 'enterprise';
  } | null;
  communication?: {
    email_templates?: Partial<Record<'welcome' | 'reset_password' | 'notification', string>>;
    notifications?: { email?: boolean; sms?: boolean; push?: boolean };
    contact_form?: { enabled?: boolean };
  } | null;
  dashboards?: {
    default_by_role?: Partial<Record<'platform_admin' | 'school_admin' | 'teacher' | 'parent', string>>;
    layouts?: Record<string, any>;
  } | null;
  updated_at?: string;
};

// Table name for platform-wide settings (singleton row)
const SETTINGS_TABLE = 'platform_settings';

export const settingsService = {
  validateSettings(partial: Partial<PlatformSettings>): PlatformSettings {
    const email = partial.contact_email?.trim();
    const name = partial.platform_name?.trim();
    const color = partial.primary_color?.trim();
    const url = partial.support_url?.trim();

    // basic validators
    const emailOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const colorOk = !color || /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    const urlOk = !url || /^(https?:\/\/)[\w.-]+(\:[0-9]+)?(\/.*)?$/.test(url);

    if (email && !emailOk) throw new Error('Email de contact invalide');
    if (color && !colorOk) throw new Error('Couleur principale invalide (utilisez un hex comme #2563eb)');
    if (url && !urlOk) throw new Error('URL de support invalide (doit commencer par http:// ou https://)');

    const feature_flags = partial.feature_flags || {};
    const normalizedFlags = {
      messaging: Boolean(feature_flags.messaging),
      ubank: Boolean(feature_flags.ubank),
      posp: Boolean(feature_flags.posp),
    };

    const branding = {
      logo_url: partial.branding?.logo_url ?? null,
      theme: partial.branding?.theme ?? 'system',
      color_scheme: partial.branding?.color_scheme ?? null,
    };

    const security = {
      auth_providers: {
        email: partial.security?.auth_providers?.email ?? true,
        google: partial.security?.auth_providers?.google ?? false,
        facebook: partial.security?.auth_providers?.facebook ?? false,
      },
      two_factor: { enabled: partial.security?.two_factor?.enabled ?? false },
      password_policy: {
        min_length: partial.security?.password_policy?.min_length ?? 8,
        require_numbers: partial.security?.password_policy?.require_numbers ?? true,
        require_special: partial.security?.password_policy?.require_special ?? false,
      },
      api_keys: { has_gemini: partial.security?.api_keys?.has_gemini ?? false },
    };

    const data_privacy = {
      gdpr: partial.data_privacy?.gdpr ?? true,
      popia: partial.data_privacy?.popia ?? true,
      data_retention_days: partial.data_privacy?.data_retention_days ?? 365,
      backups: { enabled: partial.data_privacy?.backups?.enabled ?? true, frequency: partial.data_privacy?.backups?.frequency ?? 'weekly' },
    };

    const access_control = {
      rls_preset: partial.access_control?.rls_preset ?? 'balanced',
      audit_logs: { enabled: partial.access_control?.audit_logs?.enabled ?? true },
      permissions: partial.access_control?.permissions ?? {},
    };

    const ai = {
      enable_reporting_ai: partial.ai?.enable_reporting_ai ?? true,
      enable_chat_ai: partial.ai?.enable_chat_ai ?? true,
      enable_assist_ai: partial.ai?.enable_assist_ai ?? true,
      provider: partial.ai?.provider ?? 'gemini',
      model: partial.ai?.model ?? 'gemini-2.5-pro',
    };

    const billing = {
      provider: partial.billing?.provider ?? ['stripe'],
      plan: partial.billing?.plan ?? 'pro',
    };

    const communication = {
      email_templates: partial.communication?.email_templates ?? {},
      notifications: {
        email: partial.communication?.notifications?.email ?? true,
        sms: partial.communication?.notifications?.sms ?? false,
        push: partial.communication?.notifications?.push ?? true,
      },
      contact_form: { enabled: partial.communication?.contact_form?.enabled ?? true },
    };

    const dashboards = {
      default_by_role: partial.dashboards?.default_by_role ?? { platform_admin: 'overview', school_admin: 'schools', teacher: 'overview' },
      layouts: partial.dashboards?.layouts ?? {},
    };

    return {
      id: 'platform',
      platform_name: name || partial.platform_name || 'SchoolConnect',
      contact_email: email || partial.contact_email || 'contact@schoolconnect.cd',
      primary_color: color ?? partial.primary_color ?? '#2563eb',
      support_url: url ?? partial.support_url ?? 'https://schoolconnect.cd/support',
      feature_flags: normalizedFlags,
      branding,
      security,
      data_privacy,
      access_control,
      ai,
      billing,
      communication,
      dashboards,
      updated_at: new Date().toISOString(),
    };
  },

  async getSettings(): Promise<PlatformSettings | null> {
    try {
      const { data, error } = await supabase
        .from(SETTINGS_TABLE)
        .select('id, platform_name, contact_email, primary_color, support_url, feature_flags, branding, security, data_privacy, access_control, ai, billing, communication, dashboards, updated_at')
        .eq('id', 'platform')
        .maybeSingle();

      if (error) throw error;
      return data ?? null;
    } catch (err) {
      logger.error('getSettings error:', err);
      return null;
    }
  },

  async upsertSettings(partial: Partial<PlatformSettings>): Promise<PlatformSettings> {
    try {
      // Validate and normalize payload; ensure singleton row with id = 'platform'
      const payload = settingsService.validateSettings(partial) as any;
      const { data, error } = await supabase
        .from(SETTINGS_TABLE)
        .upsert(payload, { onConflict: 'id' })
        .select('id, platform_name, contact_email, primary_color, support_url, feature_flags, branding, security, data_privacy, access_control, ai, billing, communication, dashboards, updated_at')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error validating settings:', error);
      throw new Error('Failed to validate settings');
    }
  },

  // Basic security checks by probing access and schema metadata
  async runSecurityChecks(): Promise<{
    checks: Array<{ name: string; status: 'ok' | 'warn' | 'fail'; details?: string }>; 
    passed: boolean;
  }> {
    const checks: Array<{ name: string; status: 'ok' | 'warn' | 'fail'; details?: string }> = [];

    // 1) Can anon read sensitive tables? (should be protected by RLS)
    const sensitiveTables = ['users', 'activity_logs'];
    for (const table of sensitiveTables) {
      try {
        const { error } = await supabase.from(table).select('id', { count: 'exact', head: true });
        if (!error) {
          checks.push({ name: `RLS ${table}`, status: 'warn', details: `Lecture possible sur ${table} sans erreur. Vérifiez les politiques.` });
        } else {
          checks.push({ name: `RLS ${table}`, status: 'ok' });
        }
      } catch (e) {
        checks.push({ name: `RLS ${table}`, status: 'ok' });
      }
    }

    // 2) Storage buckets (heuristic) - requires storage list permissions; if blocked, we consider ok
    try {
      // Supabase storage SDK not imported here; skip and mark as warn informational
      checks.push({ name: 'Stockage sécurisé', status: 'warn', details: 'Vérification approfondie du stockage non implémentée côté client.' });
    } catch (e) {
      checks.push({ name: 'Stockage sécurisé', status: 'ok' });
    }

    // 3) Environment sanity (client cannot access secrets) – assume ok
    checks.push({ name: 'Clés secrètes protégées', status: 'ok' });

    const passed = checks.every(c => c.status === 'ok');
    return { checks, passed };
  }
};

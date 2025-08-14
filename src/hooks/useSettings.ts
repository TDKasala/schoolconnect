import { useEffect, useState, useCallback } from 'react';
import { settingsService, type PlatformSettings } from '../services/settingsService';

export function useSettings() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await settingsService.getSettings();
      // Ensure a default row even if null
      setSettings(
        data ?? {
          id: 'platform',
          platform_name: 'SchoolConnect',
          contact_email: 'contact@schoolconnect.cd',
          primary_color: '#2563eb',
          support_url: 'https://schoolconnect.cd/support',
        }
      );
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement des paramètres');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (partial: Partial<PlatformSettings>) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await settingsService.upsertSettings({ ...(settings ?? {}), ...partial });
      setSettings(updated);
      return updated;
    } catch (e: any) {
      setError(e?.message || 'Erreur de sauvegarde');
      throw e;
    } finally {
      setSaving(false);
    }
  }, [settings]);

  const runSecurityChecks = useCallback(async () => {
    return settingsService.runSecurityChecks();
  }, []);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  return { settings, setSettings, loading, saving, error, fetchSettings, updateSettings, runSecurityChecks };
}

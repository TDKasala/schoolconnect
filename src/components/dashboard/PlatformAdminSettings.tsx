import React, { useMemo, useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Shield, Palette, Cpu, Lock, Database, Key, BarChart3, LayoutDashboard, Mail, CreditCard } from 'lucide-react';
import type { PlatformSettings } from '../../services/settingsService';
import { useAuth } from '../../contexts/AuthContext';

const SectionCard: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
    {children}
  </div>
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <label className="flex flex-col text-sm text-gray-700">
    <span className="mb-1">{label}</span>
    <input {...props} className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
  </label>
);

const Switch: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }> = ({ label, checked, onChange, disabled }) => (
  <label className="flex items-center justify-between p-3 border rounded-md">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-pressed={checked}
    >
      <span className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'} mt-0.5`} />
    </button>
  </label>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
  <label className="flex flex-col text-sm text-gray-700">
    <span className="mb-1">{label}</span>
    <select {...props} className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">{children}</select>
  </label>
);

const SaveBar: React.FC<{ saving: boolean; onSave: () => void; disabled?: boolean }> = ({ saving, onSave, disabled }) => (
  <div className="sticky bottom-4 flex justify-end">
    <button
      onClick={onSave}
      disabled={saving || disabled}
      className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {saving ? 'Sauvegarde…' : 'Sauvegarder'}
    </button>
  </div>
);

const tabs = [
  { id: 'branding', name: 'Plateforme', icon: Palette },
  { id: 'schools', name: 'Écoles', icon: LayoutDashboard },
  { id: 'billing', name: 'Abonnements', icon: CreditCard },
  { id: 'security', name: 'Auth & Sécurité', icon: Shield },
  { id: 'privacy', name: 'Données & Confidentialité', icon: Database },
  { id: 'access', name: 'Contrôle d\'accès', icon: Lock },
  { id: 'ai', name: 'Intégrations IA', icon: Cpu },
  { id: 'analytics', name: 'Analytique', icon: BarChart3 },
  { id: 'communication', name: 'Communication', icon: Mail },
  { id: 'dashboards', name: 'Tableaux de bord', icon: LayoutDashboard },
] as const;

const PlatformAdminSettings: React.FC = () => {
  const { user } = useAuth();
  const role = (user as any)?.profile?.role ?? 'platform_admin';
  const canManage = role === 'platform_admin';

  const { settings, updateSettings, loading, saving, error } = useSettings();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('branding');
  const [draft, setDraft] = useState<Partial<PlatformSettings>>({});

  const merged = useMemo<PlatformSettings | null>(() => {
    if (!settings) return null;
    return { ...settings, ...draft } as PlatformSettings;
  }, [settings, draft]);

  const onSave = async () => {
    if (!canManage) return;
    if (!merged) return;
    await updateSettings(draft as Partial<PlatformSettings>);
    setDraft({});
  };

  if (loading || !merged) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 ${activeTab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
            >
              <t.icon className="h-4 w-4" /> {t.name}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'branding' && (
        <SectionCard title="Informations Plateforme" description="Nom, logo, thème et couleurs.">
          <Row>
            <Input label="Nom de la plateforme" value={merged.platform_name || ''} onChange={e => setDraft(d => ({ ...d, platform_name: e.target.value }))} />
            <Input label="Email de contact" value={merged.contact_email || ''} onChange={e => setDraft(d => ({ ...d, contact_email: e.target.value }))} />
            <Input label="URL du logo" value={merged.branding?.logo_url || ''} onChange={e => setDraft(d => ({ ...d, branding: { ...(d.branding||{}), logo_url: e.target.value } }))} />
            <Select label="Thème" value={merged.branding?.theme || 'system'} onChange={e => setDraft(d => ({ ...d, branding: { ...(d.branding||{}), theme: e.target.value as any } }))}>
              <option value="system">Système</option>
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
            </Select>
            <Input label="Couleur primaire (hex)" value={merged.primary_color || ''} onChange={e => setDraft(d => ({ ...d, primary_color: e.target.value }))} />
          </Row>
          <SaveBar saving={saving} onSave={onSave} disabled={!canManage} />
        </SectionCard>
      )}

      {activeTab === 'security' && (
        <SectionCard title="Authentification & Sécurité" description="Méthodes de connexion, 2FA, politiques de mot de passe, clés API.">
          <Row>
            <Switch label="Connexion par email" checked={!!merged.security?.auth_providers?.email} onChange={v => setDraft(d => ({ ...d, security: { ...(d.security||{}), auth_providers: { ...(d.security?.auth_providers||{}), email: v } } }))} />
            <Switch label="Connexion via Google" checked={!!merged.security?.auth_providers?.google} onChange={v => setDraft(d => ({ ...d, security: { ...(d.security||{}), auth_providers: { ...(d.security?.auth_providers||{}), google: v } } }))} />
            <Switch label="Connexion via Facebook" checked={!!merged.security?.auth_providers?.facebook} onChange={v => setDraft(d => ({ ...d, security: { ...(d.security||{}), auth_providers: { ...(d.security?.auth_providers||{}), facebook: v } } }))} />
            <Switch label="Activer 2FA" checked={!!merged.security?.two_factor?.enabled} onChange={v => setDraft(d => ({ ...d, security: { ...(d.security||{}), two_factor: { enabled: v } } }))} />
            <Input label="Longueur minimale du mot de passe" type="number" value={merged.security?.password_policy?.min_length?.toString() || '8'} onChange={e => setDraft(d => ({ ...d, security: { ...(d.security||{}), password_policy: { ...(d.security?.password_policy||{}), min_length: Number(e.target.value) } } }))} />
            <Switch label="Mot de passe: chiffres requis" checked={!!merged.security?.password_policy?.require_numbers} onChange={v => setDraft(d => ({ ...d, security: { ...(d.security||{}), password_policy: { ...(d.security?.password_policy||{}), require_numbers: v } } }))} />
            <Switch label="Mot de passe: caractères spéciaux requis" checked={!!merged.security?.password_policy?.require_special} onChange={v => setDraft(d => ({ ...d, security: { ...(d.security||{}), password_policy: { ...(d.security?.password_policy||{}), require_special: v } } }))} />
          </Row>
          <div className="mt-4 text-sm text-gray-500 flex items-center gap-2"><Key className="h-4 w-4" /> Gérer les clés API sensibles via Supabase Secrets (ex: GEMINI_API_KEY).</div>
          <SaveBar saving={saving} onSave={onSave} disabled={!canManage} />
        </SectionCard>
      )}

      {activeTab === 'privacy' && (
        <SectionCard title="Données & Confidentialité" description="Conformité GDPR/POPIA, rétention, sauvegardes.">
          <Row>
            <Switch label="GDPR" checked={!!merged.data_privacy?.gdpr} onChange={v => setDraft(d => ({ ...d, data_privacy: { ...(d.data_privacy||{}), gdpr: v } }))} />
            <Switch label="POPIA" checked={!!merged.data_privacy?.popia} onChange={v => setDraft(d => ({ ...d, data_privacy: { ...(d.data_privacy||{}), popia: v } }))} />
            <Input label="Rétention des données (jours)" type="number" value={merged.data_privacy?.data_retention_days?.toString() || '365'} onChange={e => setDraft(d => ({ ...d, data_privacy: { ...(d.data_privacy||{}), data_retention_days: Number(e.target.value) } }))} />
            <Switch label="Sauvegardes activées" checked={!!merged.data_privacy?.backups?.enabled} onChange={v => setDraft(d => ({ ...d, data_privacy: { ...(d.data_privacy||{}), backups: { ...(d.data_privacy?.backups||{}), enabled: v } } }))} />
            <Select label="Fréquence de sauvegarde" value={merged.data_privacy?.backups?.frequency || 'weekly'} onChange={e => setDraft(d => ({ ...d, data_privacy: { ...(d.data_privacy||{}), backups: { ...(d.data_privacy?.backups||{}), frequency: e.target.value as any } } }))}>
              <option value="daily">Quotidienne</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuelle</option>
            </Select>
          </Row>
          <SaveBar saving={saving} onSave={onSave} disabled={!canManage} />
        </SectionCard>
      )}

      {activeTab === 'access' && (
        <SectionCard title="Contrôle d'accès" description="RLS, journaux d'audit, permissions globales.">
          <Row>
            <Select label="Préréglage RLS" value={merged.access_control?.rls_preset || 'balanced'} onChange={e => setDraft(d => ({ ...d, access_control: { ...(d.access_control||{}), rls_preset: e.target.value as any } }))}>
              <option value="strict">Strict</option>
              <option value="balanced">Équilibré</option>
              <option value="open">Ouvert</option>
            </Select>
            <Switch label="Journaux d'audit activés" checked={!!merged.access_control?.audit_logs?.enabled} onChange={v => setDraft(d => ({ ...d, access_control: { ...(d.access_control||{}), audit_logs: { enabled: v } } }))} />
          </Row>
          <SaveBar saving={saving} onSave={onSave} disabled={!canManage} />
        </SectionCard>
      )}

      {activeTab === 'ai' && (
        <SectionCard title="Intégrations IA" description="Activer/désactiver les fonctionnalités et choisir le fournisseur.">
          <Row>
            <Switch label="Rapports IA (bulletins)" checked={!!merged.ai?.enable_reporting_ai} onChange={v => setDraft(d => ({ ...d, ai: { ...(d.ai||{}), enable_reporting_ai: v } }))} />
            <Switch label="Chat IA" checked={!!merged.ai?.enable_chat_ai} onChange={v => setDraft(d => ({ ...d, ai: { ...(d.ai||{}), enable_chat_ai: v } }))} />
            <Switch label="Assistance IA" checked={!!merged.ai?.enable_assist_ai} onChange={v => setDraft(d => ({ ...d, ai: { ...(d.ai||{}), enable_assist_ai: v } }))} />
            <Select label="Fournisseur" value={merged.ai?.provider || 'gemini'} onChange={e => setDraft(d => ({ ...d, ai: { ...(d.ai||{}), provider: e.target.value as any } }))}>
              <option value="gemini">Gemini</option>
              <option value="openai">OpenAI</option>
              <option value="none">Aucun</option>
            </Select>
            <Input label="Modèle" value={merged.ai?.model || 'gemini-2.5-pro'} onChange={e => setDraft(d => ({ ...d, ai: { ...(d.ai||{}), model: e.target.value } }))} />
          </Row>
          <div className="mt-4 text-sm text-gray-500">Les clés (ex: GEMINI_API_KEY) sont gérées côté serveur (Supabase Secrets) et ne doivent pas être exposées côté client.</div>
          <SaveBar saving={saving} onSave={onSave} disabled={!canManage} />
        </SectionCard>
      )}

      {activeTab === 'billing' && (
        <SectionCard title="Abonnements & Facturation" description="Plans, moyens de paiement, abonnements.">
          <Row>
            <Select label="Plan" value={merged.billing?.plan || 'pro'} onChange={e => setDraft(d => ({ ...d, billing: { ...(d.billing||{}), plan: e.target.value as any } }))}>
              <option value="free">Gratuit</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </Select>
            <Select label="Fournisseurs de paiement" multiple value={(merged.billing?.provider || ['stripe']) as any} onChange={e => {
              const opts = Array.from(e.target.selectedOptions).map(o => o.value) as any;
              setDraft(d => ({ ...d, billing: { ...(d.billing||{}), provider: opts } }));
            }}>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
            </Select>
          </Row>
          <SaveBar saving={saving} onSave={onSave} disabled={!canManage} />
        </SectionCard>
      )}

      {activeTab === 'communication' && (
        <SectionCard title="Paramètres de communication" description="Modèles d'email et notifications.">
          <Row>
            <Input label="Template: Bienvenue (ID/clé)" value={merged.communication?.email_templates?.welcome || ''} onChange={e => setDraft(d => ({ ...d, communication: { ...(d.communication||{}), email_templates: { ...(d.communication?.email_templates||{}), welcome: e.target.value } } }))} />
            <Input label="Template: Réinitialisation mot de passe" value={merged.communication?.email_templates?.reset_password || ''} onChange={e => setDraft(d => ({ ...d, communication: { ...(d.communication||{}), email_templates: { ...(d.communication?.email_templates||{}), reset_password: e.target.value } } }))} />
            <Input label="Template: Notification" value={merged.communication?.email_templates?.notification || ''} onChange={e => setDraft(d => ({ ...d, communication: { ...(d.communication||{}), email_templates: { ...(d.communication?.email_templates||{}), notification: e.target.value } } }))} />
            <Switch label="Notifications email" checked={!!merged.communication?.notifications?.email} onChange={v => setDraft(d => ({ ...d, communication: { ...(d.communication||{}), notifications: { ...(d.communication?.notifications||{}), email: v } } }))} />
            <Switch label="Notifications push" checked={!!merged.communication?.notifications?.push} onChange={v => setDraft(d => ({ ...d, communication: { ...(d.communication||{}), notifications: { ...(d.communication?.notifications||{}), push: v } } }))} />
            <Switch label="Formulaire de contact activé" checked={!!merged.communication?.contact_form?.enabled} onChange={v => setDraft(d => ({ ...d, communication: { ...(d.communication||{}), contact_form: { enabled: v } } }))} />
          </Row>
          <SaveBar saving={saving} onSave={onSave} disabled={!canManage} />
        </SectionCard>
      )}

      {activeTab === 'dashboards' && (
        <SectionCard title="Personnalisation du tableau de bord" description="Défauts par rôle.">
          <Row>
            <Input label="Accueil Platform Admin" value={merged.dashboards?.default_by_role?.platform_admin || ''} onChange={e => setDraft(d => ({ ...d, dashboards: { ...(d.dashboards||{}), default_by_role: { ...(d.dashboards?.default_by_role||{}), platform_admin: e.target.value } } }))} />
            <Input label="Accueil School Admin" value={merged.dashboards?.default_by_role?.school_admin || ''} onChange={e => setDraft(d => ({ ...d, dashboards: { ...(d.dashboards||{}), default_by_role: { ...(d.dashboards?.default_by_role||{}), school_admin: e.target.value } } }))} />
            <Input label="Accueil Enseignant" value={merged.dashboards?.default_by_role?.teacher || ''} onChange={e => setDraft(d => ({ ...d, dashboards: { ...(d.dashboards||{}), default_by_role: { ...(d.dashboards?.default_by_role||{}), teacher: e.target.value } } }))} />
            <Input label="Accueil Parent" value={merged.dashboards?.default_by_role?.parent || ''} onChange={e => setDraft(d => ({ ...d, dashboards: { ...(d.dashboards||{}), default_by_role: { ...(d.dashboards?.default_by_role||{}), parent: e.target.value } } }))} />
          </Row>
          <SaveBar saving={saving} onSave={onSave} disabled={!canManage} />
        </SectionCard>
      )}

      {activeTab === 'schools' && (
        <SectionCard title="Gestion globale des écoles" description="Suspendre/activer et consulter des métriques globales (accessible ailleurs, résumé ici).">
          <div className="text-sm text-gray-600">Utilisez l'onglet Écoles pour la gestion détaillée. Cette section affichera des contrôles rapides et des statistiques globales à l'avenir.</div>
        </SectionCard>
      )}

      {activeTab === 'analytics' && (
        <SectionCard title="Analytique & Logs" description="Statistiques d'utilisation, erreurs, et insights IA (lecture seule ici).">
          <div className="text-sm text-gray-600">Les graphiques et journaux détaillés sont accessibles via l'onglet Analytique du tableau de bord.</div>
        </SectionCard>
      )}
    </div>
  );
};

export default PlatformAdminSettings;

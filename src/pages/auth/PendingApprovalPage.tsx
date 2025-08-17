import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserWithProfile } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const PendingApprovalPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const typedUser = user as UserWithProfile | null;
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let timer: number | undefined;

    const checkApproval = async () => {
      if (!typedUser?.id) return;
      setChecking(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('approved')
          .eq('id', typedUser.id)
          .single();
        if (!error && data?.approved === true) {
          navigate('/dashboard', { replace: true });
        }
      } finally {
        setChecking(false);
      }
    };

    // Initial check
    checkApproval();
    // Poll every 5s
    timer = window.setInterval(checkApproval, 5000);

    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [navigate, typedUser?.id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 animate-pulse bg-blue-200 opacity-40" />
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Compte en attente d'approbation</h1>
        <p className="text-gray-600 mb-4">
          Merci de vous être inscrit. Votre compte est en cours de vérification par un administrateur.
          Vous serez notifié dès qu'il sera approuvé.
        </p>
        <div className="text-sm text-gray-500 mb-6">
          Délai estimé: 24-48 heures. Pour toute urgence, contactez l'administrateur de la plateforme.
        </div>
        <button
          onClick={async () => { await logout(); navigate('/connexion'); }}
          className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Se déconnecter
        </button>
        <div className="mt-6 text-xs text-gray-500">
          {checking ? 'Vérification du statut...' : 'Vérification automatique toutes les 5s'}
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;

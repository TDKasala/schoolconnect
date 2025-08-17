import React, { useState, useEffect } from 'react';
import { X, UserCheck, UserX, User, Mail, Building, Calendar } from 'lucide-react';
import PlatformAdminService from '../../services/platformAdminService';

interface PendingUser {
  id: string;
  email: string;
  name: string;
  role: string;
  schoolId?: string;
  schoolName?: string;
  createdAt: Date;
}

interface PendingUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserApproved?: () => void;
}

const PendingUsersModal: React.FC<PendingUsersModalProps> = ({ isOpen, onClose, onUserApproved }) => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPendingUsers();
    }
  }, [isOpen]);

  const fetchPendingUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await PlatformAdminService.getPendingUsers();
      setPendingUsers(users);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      setError('Erreur lors du chargement des utilisateurs en attente');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    setApproving(userId);
    setError(null);
    try {
      // Find the user to get their current data
      const userToApprove = pendingUsers.find(u => u.id === userId);
      if (!userToApprove) {
        throw new Error('User not found');
      }
      
      // Approve user: set approved=true and keep their role
      await PlatformAdminService.updateUser(userId, {
        role: userToApprove.role as 'platform_admin' | 'school_admin' | 'teacher' | 'parent',
        approved: true,
      });
      
      // Remove from pending list
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      
      // Notify parent component
      if (onUserApproved) {
        onUserApproved();
      }
    } catch (error) {
      console.error('Error approving user:', error);
      setError('Erreur lors de l\'approbation de l\'utilisateur');
    } finally {
      setApproving(null);
    }
  };

  const handleRejectUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir rejeter cet utilisateur?')) {
      return;
    }
    
    setApproving(userId);
    setError(null);
    try {
      // Delete the user
      await PlatformAdminService.deleteUser(userId);
      
      // Remove from pending list
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error rejecting user:', error);
      setError('Erreur lors du rejet de l\'utilisateur');
    } finally {
      setApproving(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'platform_admin':
        return 'bg-purple-100 text-purple-800';
      case 'school_admin':
        return 'bg-blue-100 text-blue-800';
      case 'teacher':
        return 'bg-green-100 text-green-800';
      case 'parent':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'platform_admin':
        return 'Admin Plateforme';
      case 'school_admin':
        return 'Admin École';
      case 'teacher':
        return 'Enseignant';
      case 'parent':
        return 'Parent';
      default:
        return role;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Utilisateurs En Attente d'Approbation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun utilisateur en attente d'approbation</p>
              <p className="text-gray-400 text-sm mt-2">Tous les utilisateurs ont été traités</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map(user => (
                <div key={user.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">{user.name || 'Sans nom'}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                        
                        {user.schoolName && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span>{user.schoolName}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Demande reçue le {formatDate(user.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveUser(user.id)}
                        disabled={approving === user.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <UserCheck className="h-4 w-4" />
                        {approving === user.id ? 'Approbation...' : 'Approuver'}
                      </button>
                      
                      <button
                        onClick={() => handleRejectUser(user.id)}
                        disabled={approving === user.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <UserX className="h-4 w-4" />
                        Rejeter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {pendingUsers.length} utilisateur{pendingUsers.length !== 1 ? 's' : ''} en attente
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingUsersModal;

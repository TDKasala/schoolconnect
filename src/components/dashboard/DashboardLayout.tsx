import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  BookOpen,
  DollarSign,
  Users,
  MessageSquare,
  Calendar,
  LogOut,
  Bell,
  CheckSquare,
  Edit3,
  FileText,
  BarChart3,
  Settings as SettingsIcon,
  Sparkles,
  UserCheck,
  Layers
} from 'lucide-react';
import { useAuth, UserWithProfile } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const typedUser = user as UserWithProfile | null;
  const location = useLocation();
  const navigate = useNavigate();
  const [unauthAlert, setUnauthAlert] = useState(false);

  // Show a small banner if redirected for unauthorized access
  useEffect(() => {
    const state = location.state as any;
    if (state?.unauthorized) {
      setUnauthAlert(true);
      // clear the flag from history state
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // Role-specific navigation
  let navigation: Array<{ name: string; href: string; icon: any }> = [];
  // Grouped navigation for roles
  let navigationGroups: Array<{ title: string; items: Array<{ name: string; href: string; icon: any }> }> | null = null;
  if (typedUser?.profile?.role === 'platform_admin') {
    navigation = [
      { name: 'Administration', href: '/dashboard', icon: Home },
    ];
  } else if (typedUser?.profile?.role === 'teacher') {
    navigationGroups = [
      {
        title: 'Enseignement',
        items: [
          { name: 'Tableau de bord', href: '/dashboard', icon: Home },
          // Keep classes link hidden for teachers if not authorized by route; attendance/grades will filter to teacher classes
          { name: 'Présence', href: '/dashboard/attendance', icon: CheckSquare },
          { name: 'Notes', href: '/dashboard/grades', icon: Edit3 },
        ],
      },
      {
        title: 'Communication',
        items: [
          { name: 'Messagerie', href: '/dashboard/messagerie', icon: MessageSquare },
          { name: 'Calendrier', href: '/dashboard/calendrier', icon: Calendar },
        ],
      },
      {
        title: 'Rapports',
        items: [
          { name: 'Rapports', href: '/dashboard/reports', icon: BarChart3 },
          { name: 'Générateur IA', href: '/dashboard/reports', icon: Sparkles },
        ],
      },
    ];
  } else if (typedUser?.profile?.role === 'parent') {
    navigation = [
      { name: 'Vue d\'ensemble', href: '/dashboard', icon: Home },
      { name: 'Mes enfants', href: '/dashboard/enfants', icon: Users },
      { name: 'Notes', href: '/dashboard/notes', icon: Edit3 },
      { name: 'Paiements', href: '/dashboard/paiements', icon: DollarSign },
      { name: 'Messagerie', href: '/dashboard/messagerie', icon: MessageSquare },
      { name: 'Calendrier', href: '/dashboard/calendrier', icon: Calendar },
    ];
  } else if (typedUser?.profile?.role === 'student') {
    navigation = [
      { name: 'Vue d\'ensemble', href: '/dashboard', icon: Home },
      { name: 'Mes cours', href: '/dashboard/cours', icon: BookOpen },
      { name: 'Présence', href: '/dashboard/attendance', icon: CheckSquare },
      { name: 'Notes', href: '/dashboard/grades', icon: Edit3 },
      { name: 'Messagerie', href: '/dashboard/messagerie', icon: MessageSquare },
      { name: 'Calendrier', href: '/dashboard/calendrier', icon: Calendar },
    ];
  } else {
    // Default: school_admin (grouped, role-relevant only)
    navigationGroups = [
      {
        title: 'Gestion',
        items: [
          { name: 'Tableau de bord', href: '/dashboard', icon: Home },
          { name: 'Élèves', href: '/dashboard/students', icon: Users },
          { name: 'Enseignants', href: '/dashboard/teachers', icon: UserCheck },
          { name: 'Classes', href: '/dashboard/classes', icon: Layers },
          { name: 'Emploi du temps', href: '/dashboard/calendrier', icon: Calendar },
        ],
      },
      {
        title: 'Communication',
        items: [
          { name: 'Annonces', href: '/dashboard/messagerie', icon: MessageSquare },
        ],
      },
      {
        title: 'Rapports',
        items: [
          { name: 'Rapports', href: '/dashboard/reports', icon: BarChart3 },
          { name: 'Générateur IA', href: '/dashboard/reports', icon: Sparkles },
        ],
      },
      {
        title: 'Paramètres',
        items: [
          { name: 'Paramètres', href: '/dashboard/settings', icon: SettingsIcon },
        ],
      },
    ];
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'platform_admin': return 'Admin Plateforme';
      case 'school_admin': return 'Admin École';
      case 'teacher': return 'Enseignant';
      case 'parent': return 'Parent';
      case 'pending': return 'En attente';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'platform_admin': return 'bg-purple-100 text-purple-800';
      case 'school_admin': return 'bg-blue-100 text-blue-800';
      case 'teacher': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent
              navigation={navigation}
              navigationGroups={navigationGroups}
              location={location} 
              user={typedUser} 
              getRoleDisplayName={getRoleDisplayName}
              getRoleBadgeColor={getRoleBadgeColor}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent
            navigation={navigation}
            navigationGroups={navigationGroups}
            location={location} 
            user={typedUser} 
            getRoleDisplayName={getRoleDisplayName}
            getRoleBadgeColor={getRoleBadgeColor}
            handleLogout={handleLogout}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <span className="text-lg font-semibold text-[#212121]">
                      SchoolConnect
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E88E5]">
                <Bell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-[#1E88E5] flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {(typedUser?.profile?.full_name || typedUser?.email)?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-[#212121]">{typedUser?.profile?.full_name || typedUser?.email}</div>
                    <div className="text-xs text-[#616161]">{typedUser?.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            {unauthAlert && (
              <div className="mx-4 sm:mx-6 lg:mx-8 mb-4">
                <div className="flex items-start justify-between rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                  <div>
                    Accès non autorisé: vous n'avez pas la permission d'ouvrir cette page.
                  </div>
                  <button
                    onClick={() => setUnauthAlert(false)}
                    className="ml-4 text-yellow-800 hover:text-yellow-900"
                    aria-label="Fermer l'alerte"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

interface SidebarContentProps {
  navigation: Array<{ name: string; href: string; icon: any }>;
  navigationGroups: Array<{ title: string; items: Array<{ name: string; href: string; icon: any }> }> | null;
  location: any;
  user: UserWithProfile | null;
  getRoleDisplayName: (role: string) => string;
  getRoleBadgeColor: (role: string) => string;
  handleLogout: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  navigation,
  navigationGroups,
  location,
  user: typedUser,
  getRoleDisplayName,
  getRoleBadgeColor,
  handleLogout
}) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4" style={{ backgroundColor: '#1E88E5' }}>
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="font-bold text-sm" style={{ color: '#1E88E5' }}>SC</span>
          </div>
          <span className="text-xl font-bold text-white">SchoolConnect</span>
        </Link>
      </div>

      {/* User info */}
      <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1E88E5' }}>
              <span className="text-sm font-medium text-white">
                {(typedUser?.profile?.full_name || typedUser?.email)?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#212121] truncate">
              {typedUser?.profile?.full_name || typedUser?.email}
            </p>
            <span className={cn(
              'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
              getRoleBadgeColor(typedUser?.profile?.role || '')
            )}>
              {getRoleDisplayName(typedUser?.profile?.role || '')}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-6 overflow-y-auto" style={{ backgroundColor: '#F5F7FA' }}>
        {navigationGroups ? (
          navigationGroups.map((group) => (
            <div key={group.title}>
              <div className="px-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#616161' }}>
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'text-[#1E88E5] bg-white shadow'
                          : 'text-[#616161] hover:bg-white hover:shadow'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'mr-3 flex-shrink-0 h-5 w-5',
                          isActive ? 'text-[#1E88E5]' : 'text-[#9e9e9e] group-hover:text-[#1E88E5]'
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-50 text-[#1E88E5]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5',
                    isActive ? 'text-[#1E88E5]' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            );
          })
        )}
      </nav>

      {/* Bottom actions */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full group flex items-center px-2 py-2 text-sm font-medium text-[#616161] rounded-md hover:bg-gray-50 hover:text-[#212121]"
        >
          <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-[#1E88E5]" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default DashboardLayout;

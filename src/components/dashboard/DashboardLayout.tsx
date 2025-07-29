import React, { useState } from 'react';
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
  Settings,
  Bell,
  Building,
  BarChart3
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

  // Platform admin gets different navigation
  const navigation = typedUser?.profile?.role === 'platform_admin' ? [
    { name: 'Administration', href: '/dashboard', icon: Home },
    { name: 'Écoles', href: '/dashboard/schools', icon: Building },
    { name: 'Utilisateurs', href: '/dashboard/users', icon: Users },
    { name: 'Analytiques', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
  ] : [
    { name: 'Vue d\'ensemble', href: '/dashboard', icon: Home },
    { name: 'Pédagogie', href: '/dashboard/pedagogie', icon: BookOpen },
    { name: 'Finances', href: '/dashboard/finances', icon: DollarSign },
    { name: 'Parents', href: '/dashboard/parents', icon: Users },
    { name: 'Messagerie', href: '/dashboard/messagerie', icon: MessageSquare },
    { name: 'Calendrier', href: '/dashboard/calendrier', icon: Calendar },
  ];

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
                    <span className="text-lg font-semibold text-gray-900">
                      SchoolConnect
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <Bell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-700">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

interface SidebarContentProps {
  navigation: Array<{ name: string; href: string; icon: any }>;
  location: any;
  user: UserWithProfile | null;
  getRoleDisplayName: (role: string) => string;
  getRoleBadgeColor: (role: string) => string;
  handleLogout: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  navigation,
  location,
  user: typedUser,
  getRoleDisplayName,
  getRoleBadgeColor,
  handleLogout
}) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-600">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-primary-600 font-bold text-sm">SC</span>
          </div>
          <span className="text-xl font-bold text-white">SchoolConnect</span>
        </Link>
      </div>

      {/* User info */}
      <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {(typedUser?.profile?.full_name || typedUser?.email)?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
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
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 flex-shrink-0 h-5 w-5',
                  isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4 space-y-2">
        <Link
          to="/dashboard/settings"
          className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
        >
          <Settings className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
          Paramètres
        </Link>
        <button
          onClick={handleLogout}
          className="w-full group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default DashboardLayout;

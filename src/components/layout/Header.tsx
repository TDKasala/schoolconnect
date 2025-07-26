import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Accueil', href: '/' },
    {
      name: 'Fonctionnalités',
      href: '#',
      dropdown: [
        { name: 'Pédagogie', href: '/pedagogie', description: 'Gestion des notes et présences' },
        { name: 'Finances', href: '/finances', description: 'Suivi des frais scolaires' },
        { name: 'Portails', href: '/portails', description: 'Communication parents-école' },
      ]
    },
    { name: 'Avantages', href: '/avantages' },
    { name: 'Tarifs', href: '/tarifs' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="SchoolConnect"
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsFeaturesOpen(true)}
                    onMouseLeave={() => setIsFeaturesOpen(false)}
                  >
                    <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                      <span>{item.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {isFeaturesOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="font-medium text-gray-900">{subItem.name}</div>
                            <div className="text-sm text-gray-500">{subItem.description}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      'text-gray-700 hover:text-primary-600 transition-colors',
                      location.pathname === item.href && 'text-primary-600 font-medium'
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Link
                to="/dashboard"
                className="btn btn-primary px-4 py-2"
              >
                Tableau de bord
              </Link>
            ) : (
              <>
                <Link
                  to="/connexion"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  to="/contact"
                  className="btn btn-primary px-4 py-2"
                >
                  Demander une démo
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div>
                      <div className="text-gray-700 font-medium px-3 py-2">{item.name}</div>
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-6 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-primary-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tableau de bord
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/connexion"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Se connecter
                    </Link>
                    <Link
                      to="/contact"
                      className="block px-3 py-2 text-primary-600 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Demander une démo
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

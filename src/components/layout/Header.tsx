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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-md shadow-lg border-b border-gray-100">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center animate-fade-in">
            <Link to="/" className="flex items-center group">
              <img
                src="/schoolconnect-header.png"
                alt="SchoolConnect"
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsFeaturesOpen(true)}
                    onMouseLeave={() => setIsFeaturesOpen(false)}
                  >
                    <button className="flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
                      <span className="font-medium">{item.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isFeaturesOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-scale-in origin-top">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-4 py-3 hover:bg-gradient-to-r from-primary-50 to-secondary-50 transition-all duration-200 group"
                            onClick={() => setIsFeaturesOpen(false)}
                          >
                            <div className="font-medium text-gray-900 group-hover:text-primary-700 transition-colors">{subItem.name}</div>
                            <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">{subItem.description}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      'px-4 py-2 rounded-lg text-gray-700 font-medium transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:bg-primary-50 hover:text-primary-600',
                      location.pathname === item.href && 'bg-primary-100 text-primary-700 font-semibold'
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <Link
                to="/dashboard"
                className="btn btn-primary px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Tableau de bord
              </Link>
            ) : (
              <>
                <Link
                  to="/connexion"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-primary-50 font-medium"
                >
                  Se connecter
                </Link>
                <Link
                  to="/contact"
                  className="btn btn-primary px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:from-primary-600 hover:to-primary-700"
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
              className="text-gray-700 hover:text-primary-600 p-2 rounded-lg hover:bg-primary-50 transition-all duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6 animate-scale-in" /> : <Menu className="w-6 h-6 animate-fade-in" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white animate-slide-up origin-top">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div>
                      <div className="text-gray-700 font-medium px-3 py-2 rounded-lg bg-gradient-to-r from-primary-50 to-secondary-50">{item.name}</div>
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-6 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
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
                    className="block px-3 py-2 text-primary-600 font-medium bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg hover:from-primary-100 hover:to-primary-200 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tableau de bord
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/connexion"
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Se connecter
                    </Link>
                    <Link
                      to="/contact"
                      className="block px-3 py-2 text-primary-600 font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 mt-2"
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

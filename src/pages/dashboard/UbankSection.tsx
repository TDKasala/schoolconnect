import React, { useState } from 'react';
import {
  DollarSign,
  FileText,
  BarChart3,
  Plus,
  Calendar
} from 'lucide-react';

const UbankSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const stats = [
    { name: 'Revenus ce mois', value: '$2,450,000 USD', change: '+8.2%', color: 'bg-green-500' },
    { name: 'Paiements en attente', value: '$320,000 USD', change: '-2.1%', color: 'bg-yellow-500' },
    { name: 'Dépenses ce mois', value: '$890,000 USD', change: '+4.3%', color: 'bg-red-500' },
    { name: 'Solde', value: '$1,560,000 USD', change: '+12.5%', color: 'bg-blue-500' }
  ];

  const recentPayments = [
    { id: '1', student: 'Marie Tshala', class: '6ème A', amount: '$50 USD', date: '2024-01-15', status: 'paid' },
    { id: '2', student: 'Jean Kabila', class: '6ème A', amount: '$50 USD', date: '2024-01-15', status: 'paid' },
    { id: '3', student: 'Sarah Mukendi', class: '5ème B', amount: '$50 USD', date: '2024-01-14', status: 'paid' },
    { id: '4', student: 'Paul Mbuyi', class: '5ème B', amount: '$50 USD', date: '2024-01-14', status: 'pending' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Module Finances</h1>
        <p className="mt-2 text-gray-600">Gestion financière et comptabilité scolaire</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="ml-2 text-sm font-medium text-green-600">{stat.change}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {['overview', 'payments', 'invoices', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'overview' ? 'Aperçu' : tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Paiements Récents</h4>
                <div className="space-y-3">
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div>
                        <p className="text-sm font-medium">{payment.student}</p>
                        <p className="text-xs text-gray-500">{payment.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{payment.amount}</p>
                        <p className="text-xs text-gray-500">{payment.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Factures à Venir</h4>
                <div className="space-y-3">
                  {recentPayments.filter(p => p.status === 'pending').map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div>
                        <p className="text-sm font-medium">{invoice.student}</p>
                        <p className="text-xs text-gray-500">{invoice.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{invoice.amount}</p>
                        <p className="text-xs text-yellow-600">En attente</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion des Paiements</h3>
              <p className="text-gray-500">Enregistrez et suivez tous les paiements reçus</p>
              <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Paiement
              </button>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion des Factures</h3>
              <p className="text-gray-500">Créez et envoyez des factures aux parents</p>
              <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Facture
              </button>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Rapports Financiers</h3>
              <p className="text-gray-500">Générez des rapports détaillés sur vos finances</p>
              <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                <FileText className="h-4 w-4 mr-2" />
                Générer Rapport
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UbankSection;

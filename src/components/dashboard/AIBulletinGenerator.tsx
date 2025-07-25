import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Users, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { BulletinService, BulletinReport } from '../../services/bulletinService';

interface AIBulletinGeneratorProps {
  classId?: string;
  teacherId?: string;
}

const AIBulletinGenerator: React.FC<AIBulletinGeneratorProps> = ({ classId, teacherId }) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [semester, setSemester] = useState<string>('1');
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [bulletins, setBulletins] = useState<BulletinReport[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('school_id')
        .eq('id', user.user.id)
        .single();

      if (userData) {
        const { data: classes } = await supabase
          .from('classes')
          .select('id, name')
          .eq('school_id', userData.school_id);

        setClasses(classes || []);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const generateBulletins = async () => {
    if (!selectedClass) {
      setError('Veuillez sélectionner une classe');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const bulletins = await BulletinService.generateClassBulletins(
        selectedClass,
        semester,
        year
      );
      setBulletins(bulletins);
      setSuccess(`Bulletins générés avec succès pour ${bulletins.length} élèves`);
    } catch (error) {
      console.error('Error generating bulletins:', error);
      setError('Erreur lors de la génération des bulletins');
    } finally {
      setLoading(false);
    }
  };

  const downloadBulletin = (bulletin: BulletinReport) => {
    const data = JSON.stringify(bulletin, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulletin_${bulletin.student_name}_${semester}_${year}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllBulletins = () => {
    const data = JSON.stringify(bulletins, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulletins_${selectedClass}_${semester}_${year}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Génération de Bulletins IA</h1>
        <p className="mt-2 text-gray-600">
          Générez automatiquement des bulletins trimestriels avec analyses IA
        </p>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Configuration</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classe
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Sélectionner une classe</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trimestre
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="1">1er Trimestre</option>
                <option value="2">2ème Trimestre</option>
                <option value="3">3ème Trimestre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Année scolaire
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="2023-2024"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={generateBulletins}
                disabled={loading || !selectedClass}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Génération...' : 'Générer les bulletins'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {bulletins.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Bulletins générés ({bulletins.length} élèves)
            </h2>
            <button
              onClick={downloadAllBulletins}
              className="bg-secondary-600 text-white py-2 px-4 rounded-md hover:bg-secondary-700 transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Tout télécharger
            </button>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rang
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Élève
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Moyenne
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Présence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mention
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bulletins.map((bulletin, index) => (
                    <tr key={bulletin.student_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{bulletin.rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bulletin.student_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bulletin.overall_average.toFixed(2)}/20
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bulletin.attendance_rate.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bulletin.conduct_grade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => downloadBulletin(bulletin)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBulletinGenerator;

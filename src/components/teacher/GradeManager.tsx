import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Sparkles, 
  Calculator, 
  TrendingUp, 
  Award,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  grades: {
    subject: string;
    scores: number[];
    average: number;
  }[];
  overallAverage: number;
  attendance: number;
  behavior: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement';
}

interface BulletinData {
  student: Student;
  period: string;
  recommendations: string[];
  strengths: string[];
  areasForImprovement: string[];
  teacherComments: string;
  nextSteps: string[];
}

const GradeManager: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('6ème A');
  const [isGeneratingBulletin, setIsGeneratingBulletin] = useState(false);
  const [generatedBulletins, setGeneratedBulletins] = useState<BulletinData[]>([]);
  const [showBulletinModal, setShowBulletinModal] = useState(false);
  const [selectedBulletin, setSelectedBulletin] = useState<BulletinData | null>(null);

  const students: Student[] = [
    {
      id: '1',
      name: 'Marie Kabongo',
      grades: [
        { subject: 'Mathématiques', scores: [15, 17, 14, 16], average: 15.5 },
        { subject: 'Français', scores: [16, 15, 17, 16], average: 16.0 },
        { subject: 'Sciences', scores: [14, 16, 15, 17], average: 15.5 },
        { subject: 'Histoire', scores: [17, 16, 18, 16], average: 16.8 }
      ],
      overallAverage: 15.95,
      attendance: 95,
      behavior: 'excellent'
    },
    {
      id: '2',
      name: 'Jean Mukendi',
      grades: [
        { subject: 'Mathématiques', scores: [12, 14, 13, 15], average: 13.5 },
        { subject: 'Français', scores: [13, 12, 14, 13], average: 13.0 },
        { subject: 'Sciences', scores: [15, 14, 16, 15], average: 15.0 },
        { subject: 'Histoire', scores: [14, 13, 15, 14], average: 14.0 }
      ],
      overallAverage: 13.88,
      attendance: 88,
      behavior: 'good'
    },
    {
      id: '3',
      name: 'Sarah Mbuyi',
      grades: [
        { subject: 'Mathématiques', scores: [18, 17, 19, 18], average: 18.0 },
        { subject: 'Français', scores: [17, 18, 17, 19], average: 17.8 },
        { subject: 'Sciences', scores: [19, 18, 18, 19], average: 18.5 },
        { subject: 'Histoire', scores: [18, 17, 18, 17], average: 17.5 }
      ],
      overallAverage: 17.95,
      attendance: 98,
      behavior: 'excellent'
    }
  ];

  const generateAIBulletin = async (student: Student): Promise<BulletinData> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // AI-generated analysis based on student data
    const getPerformanceLevel = (average: number) => {
      if (average >= 16) return 'excellent';
      if (average >= 14) return 'good';
      if (average >= 12) return 'satisfactory';
      return 'needs_improvement';
    };

    const performanceLevel = getPerformanceLevel(student.overallAverage);
    
    const recommendations: string[] = [];
    const strengths: string[] = [];
    const areasForImprovement: string[] = [];
    let teacherComments = '';
    const nextSteps: string[] = [];

    // AI logic for generating personalized feedback
    if (student.overallAverage >= 16) {
      strengths.push('Excellentes performances académiques');
      strengths.push('Compréhension approfondie des concepts');
      recommendations.push('Encourager la participation aux concours académiques');
      recommendations.push('Proposer des défis supplémentaires');
      teacherComments = `${student.name} démontre une excellente maîtrise des matières enseignées. Ses résultats sont remarquables et témoignent d'un travail sérieux et régulier.`;
      nextSteps.push('Maintenir le niveau d\'excellence');
      nextSteps.push('Explorer des sujets avancés');
    } else if (student.overallAverage >= 14) {
      strengths.push('Bonnes performances générales');
      strengths.push('Progression constante');
      recommendations.push('Continuer les efforts actuels');
      recommendations.push('Renforcer les matières les plus faibles');
      teacherComments = `${student.name} montre de bonnes capacités et une progression satisfaisante. Avec un peu plus d'efforts, il/elle peut atteindre l'excellence.`;
      nextSteps.push('Améliorer la régularité dans le travail');
      nextSteps.push('Participer davantage en classe');
    } else {
      areasForImprovement.push('Renforcer les bases fondamentales');
      areasForImprovement.push('Améliorer la méthode de travail');
      recommendations.push('Prévoir des séances de soutien');
      recommendations.push('Encourager le travail en groupe');
      teacherComments = `${student.name} doit fournir plus d'efforts pour améliorer ses résultats. Un accompagnement personnalisé serait bénéfique.`;
      nextSteps.push('Mettre en place un plan de rattrapage');
      nextSteps.push('Renforcer le suivi parental');
    }

    // Analyze specific subjects
    student.grades.forEach(grade => {
      if (grade.average >= 16) {
        strengths.push(`Excellent niveau en ${grade.subject}`);
      } else if (grade.average < 12) {
        areasForImprovement.push(`Difficultés en ${grade.subject}`);
        nextSteps.push(`Renforcer les acquis en ${grade.subject}`);
      }
    });

    // Attendance analysis
    if (student.attendance >= 95) {
      strengths.push('Assiduité exemplaire');
    } else if (student.attendance < 85) {
      areasForImprovement.push('Améliorer l\'assiduité');
      nextSteps.push('Suivi renforcé des absences');
    }

    return {
      student,
      period: 'Trimestre 1 - 2024',
      recommendations,
      strengths,
      areasForImprovement,
      teacherComments,
      nextSteps
    };
  };

  const handleGenerateBulletins = async () => {
    setIsGeneratingBulletin(true);
    try {
      const bulletins = await Promise.all(
        students.map(student => generateAIBulletin(student))
      );
      setGeneratedBulletins(bulletins);
    } catch (error) {
      console.error('Error generating bulletins:', error);
    } finally {
      setIsGeneratingBulletin(false);
    }
  };

  const viewBulletin = (bulletin: BulletinData) => {
    setSelectedBulletin(bulletin);
    setShowBulletinModal(true);
  };

  const downloadBulletin = (bulletin: BulletinData) => {
    // Simulate PDF download
    const element = document.createElement('a');
    const file = new Blob([`Bulletin de ${bulletin.student.name} - ${bulletin.period}`], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = `bulletin_${bulletin.student.name.replace(' ', '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Notes & Bulletins</h1>
        <p className="mt-2 text-gray-600">Gérez les notes et générez des bulletins avec l'IA</p>
      </div>

      {/* Class Selection */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Sélectionner une classe</h2>
        </div>
        <div className="p-6">
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="6ème A">6ème A - Mathématiques</option>
            <option value="5ème B">5ème B - Mathématiques</option>
            <option value="4ème C">4ème C - Sciences</option>
          </select>
        </div>
      </div>

      {/* Students Grades */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Notes des Élèves - {selectedClass}</h2>
          <button
            onClick={handleGenerateBulletins}
            disabled={isGeneratingBulletin}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isGeneratingBulletin ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Générer Bulletins IA
              </>
            )}
          </button>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Élève
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mathématiques
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Français
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sciences
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Histoire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moyenne
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Présence
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </div>
                    </td>
                    {student.grades.map((grade, index) => (
                      <td key={index} className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{grade.average.toFixed(1)}/20</div>
                        <div className="text-xs text-gray-500">
                          {grade.scores.join(', ')}
                        </div>
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${
                        student.overallAverage >= 16 ? 'text-green-600' :
                        student.overallAverage >= 14 ? 'text-primary-600' :
                        student.overallAverage >= 12 ? 'text-secondary-600' : 'text-red-600'
                      }`}>
                        {student.overallAverage.toFixed(2)}/20
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${
                        student.attendance >= 95 ? 'text-green-600' :
                        student.attendance >= 85 ? 'text-secondary-600' : 'text-red-600'
                      }`}>
                        {student.attendance}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Generated Bulletins */}
      {generatedBulletins.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Award className="h-5 w-5 mr-2 text-secondary-600" />
              Bulletins Générés par IA
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedBulletins.map((bulletin) => (
                <div key={bulletin.student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{bulletin.student.name}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bulletin.student.overallAverage >= 16 ? 'bg-green-100 text-green-800' :
                      bulletin.student.overallAverage >= 14 ? 'bg-blue-100 text-blue-800' :
                      bulletin.student.overallAverage >= 12 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {bulletin.student.overallAverage.toFixed(1)}/20
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {bulletin.strengths.length} points forts
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {bulletin.recommendations.length} recommandations
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewBulletin(bulletin)}
                      className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-md hover:bg-primary-700 transition-colors text-sm flex items-center justify-center"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Voir
                    </button>
                    <button
                      onClick={() => downloadBulletin(bulletin)}
                      className="flex-1 bg-secondary-600 text-white py-2 px-3 rounded-md hover:bg-secondary-700 transition-colors text-sm flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bulletin Modal */}
      {showBulletinModal && selectedBulletin && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Bulletin de {selectedBulletin.student.name}
                </h3>
                <button
                  onClick={() => setShowBulletinModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Header Info */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Période</div>
                      <div className="font-semibold">{selectedBulletin.period}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Moyenne générale</div>
                      <div className="font-semibold text-primary-600">
                        {selectedBulletin.student.overallAverage.toFixed(2)}/20
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Présence</div>
                      <div className="font-semibold text-green-600">
                        {selectedBulletin.student.attendance}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Comportement</div>
                      <div className="font-semibold capitalize">
                        {selectedBulletin.student.behavior.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grades by Subject */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Notes par matière</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedBulletin.student.grades.map((grade, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{grade.subject}</span>
                          <span className="font-bold text-primary-600">
                            {grade.average.toFixed(1)}/20
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Notes: {grade.scores.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                {selectedBulletin.strengths.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      Points forts
                    </h4>
                    <ul className="space-y-2">
                      {selectedBulletin.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Areas for Improvement */}
                {selectedBulletin.areasForImprovement.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-secondary-600" />
                      Axes d'amélioration
                    </h4>
                    <ul className="space-y-2">
                      {selectedBulletin.areasForImprovement.map((area, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-secondary-600 mr-2">•</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Teacher Comments */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Commentaires du professeur</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedBulletin.teacherComments}</p>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary-600" />
                    Recommandations IA
                  </h4>
                  <ul className="space-y-2">
                    {selectedBulletin.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Steps */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Prochaines étapes</h4>
                  <ul className="space-y-2">
                    {selectedBulletin.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-gray-600 mr-2">→</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowBulletinModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={() => downloadBulletin(selectedBulletin)}
                  className="px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 transition-colors flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeManager;

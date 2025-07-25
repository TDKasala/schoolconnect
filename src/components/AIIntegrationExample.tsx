import React, { useState } from 'react';
import { useAIBulletin } from '../hooks/useAIIntegration';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Alert, AlertDescription } from './ui/Alert';
import { Loader2, Brain, Download, RefreshCw } from 'lucide-react';

interface AIIntegrationExampleProps {
  studentId?: string;
  classId?: string;
}

export const AIIntegrationExample: React.FC<AIIntegrationExampleProps> = ({
  studentId,
  classId,
}) => {
  const {
    generateStudentBulletin,
    generateClassReport,
    loading,
    error,
    response,
    clearError,
  } = useAIBulletin();

  const [selectedType, setSelectedType] = useState<'bulletin' | 'report'>('bulletin');
  const [semester, setSemester] = useState('1');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [customPrompt, setCustomPrompt] = useState('');

  const handleGenerate = async () => {
    try {
      if (selectedType === 'bulletin' && studentId) {
        await generateStudentBulletin(studentId, classId || '', semester, year);
      } else if (selectedType === 'report' && classId) {
        await generateClassReport(classId, semester, year);
      }
    } catch (err) {
      console.error('AI generation failed:', err);
    }
  };

  const handleDownload = () => {
    if (response) {
      const blob = new Blob([JSON.stringify(response, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-${selectedType}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Integration Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bulletin">Student Bulletin</SelectItem>
                    <SelectItem value="report">Class Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Semester</label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2023, 2024, 2025].map(y => (
                      <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Prompt */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Custom Prompt (optional)
              </label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Add specific instructions for AI..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    Generate AI Content
                  </>
                )}
              </Button>

              {response && (
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download JSON
                </Button>
              )}

              <Button
                onClick={clearError}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* AI Response Display */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle>AI Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Generated Content:</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{response.content}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Confidence:</span> {response.confidence}
                </div>
                <div>
                  <span className="font-medium">Processing Time:</span> {response.metadata.processingTime}ms
                </div>
                <div>
                  <span className="font-medium">Tokens:</span> {response.metadata.tokens}
                </div>
                <div>
                  <span className="font-medium">Model:</span> {response.metadata.model}
                </div>
              </div>

              {response.metadata.dataSources && (
                <div>
                  <h4 className="font-medium mb-2">Data Sources:</h4>
                  <div className="flex flex-wrap gap-2">
                    {response.metadata.dataSources.map((source: string) => (
                      <span
                        key={source}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {response ? 1 : 0}
              </div>
              <div className="text-sm text-gray-600">Requests</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {response?.metadata.tokens || 0}
              </div>
              <div className="text-sm text-gray-600">Tokens</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {response?.confidence || 0}
              </div>
              <div className="text-sm text-gray-600">Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Reusable UI components for AI features
export const AIFeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onAction: () => void;
  loading?: boolean;
  disabled?: boolean;
}> = ({ title, description, icon, onAction, loading, disabled }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button
        onClick={onAction}
        disabled={loading || disabled}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          'Generate AI Content'
        )}
      </Button>
    </CardContent>
  </Card>
);

export const AIResponseDisplay: React.FC<{
  response: any;
  onClose?: () => void;
}> = ({ response, onClose }) => (
  <Card className="mt-4">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>AI Response</CardTitle>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="whitespace-pre-wrap">{response?.content}</p>
        </div>
        {response?.metadata && (
          <div className="text-sm text-gray-600">
            <div>Processing time: {response.metadata.processingTime}ms</div>
            <div>Confidence: {response.confidence}</div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

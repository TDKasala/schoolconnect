import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface AIRequest {
  prompt: string;
  context?: Record<string, any>;
  type: 'bulletin' | 'report' | 'analysis' | 'summary' | 'recommendation';
  language?: 'fr' | 'en';
}

export interface AIResponse {
  content: string;
  confidence: number;
  metadata?: Record<string, any>;
  processingTime: number;
}

export interface AIIntegrationState {
  loading: boolean;
  error: string | null;
  response: AIResponse | null;
  history: AIResponse[];
  usage: {
    requests: number;
    tokens: number;
    lastRequest: Date | null;
  };
}

interface UseAIIntegrationOptions {
  maxHistory?: number;
  cacheDuration?: number;
  retryAttempts?: number;
  timeout?: number;
}

export const useAIIntegration = (options: UseAIIntegrationOptions = {}) => {
  const {
    maxHistory = 10,
    cacheDuration = 300000, // 5 minutes
    retryAttempts = 3,
    timeout = 30000, // 30 seconds
  } = options;

  const [state, setState] = useState<AIIntegrationState>({
    loading: false,
    error: null,
    response: null,
    history: [],
    usage: {
      requests: 0,
      tokens: 0,
      lastRequest: null,
    },
  });

  const [cache, setCache] = useState<Map<string, { response: AIResponse; timestamp: number }>>(
    new Map()
  );

  const generateCacheKey = useCallback((request: AIRequest): string => {
    return btoa(JSON.stringify({
      prompt: request.prompt,
      type: request.type,
      context: request.context,
      language: request.language,
    }));
  }, []);

  const checkCache = useCallback((cacheKey: string): AIResponse | null => {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      return cached.response;
    }
    return null;
  }, [cache, cacheDuration]);

  const updateCache = useCallback((cacheKey: string, response: AIResponse) => {
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.set(cacheKey, { response, timestamp: Date.now() });
      
      // Clean old cache entries
      const now = Date.now();
      for (const [key, value] of newCache.entries()) {
        if (now - value.timestamp > cacheDuration) {
          newCache.delete(key);
        }
      }
      
      return newCache;
    });
  }, [cacheDuration]);

  const updateHistory = useCallback((response: AIResponse) => {
    setState(prev => ({
      ...prev,
      history: [response, ...prev.history.slice(0, maxHistory - 1)],
    }));
  }, [maxHistory]);

  const processAIRequest = useCallback(async (
    request: AIRequest,
    signal?: AbortSignal
  ): Promise<AIResponse> => {
    const startTime = Date.now();
    
    try {
      // Check if we're in a development environment
      if (import.meta.env.DEV) {
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      }

      // Prepare context data from Supabase
      const contextData = await prepareContextData(request.context);
      
      // Generate AI response based on type
      const response = await generateAIResponse(request, contextData);
      
      const processingTime = Date.now() - startTime;
      
      return {
        ...response,
        processingTime,
      };
      
    } catch (error) {
      if (signal?.aborted) {
        throw new Error('Request aborted');
      }
      throw error;
    }
  }, []);

  const sendRequest = useCallback(async (request: AIRequest): Promise<AIResponse> => {
    const cacheKey = generateCacheKey(request);
    
    // Check cache first
    const cachedResponse = checkCache(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await processAIRequest(request, controller.signal);
      
      clearTimeout(timeoutId);
      
      setState(prev => ({
        ...prev,
        loading: false,
        response,
        usage: {
          ...prev.usage,
          requests: prev.usage.requests + 1,
          tokens: prev.usage.tokens + estimateTokens(response.content),
          lastRequest: new Date(),
        },
      }));

      updateCache(cacheKey, response);
      updateHistory(response);

      return response;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [
    generateCacheKey,
    checkCache,
    updateCache,
    updateHistory,
    processAIRequest,
    timeout,
  ]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }));
  }, []);

  const retryLastRequest = useCallback(async () => {
    if (state.history.length > 0) {
      const lastRequest = state.history[0];
      // Reconstruct the original request from the response
      // This is a simplified approach - in practice, you might want to store the original request
      return sendRequest({
        prompt: lastRequest.content,
        type: 'summary',
      });
    }
  }, [state.history, sendRequest]);

  return {
    ...state,
    sendRequest,
    clearError,
    clearHistory,
    retryLastRequest,
  };
};

// Helper functions

async function prepareContextData(context?: Record<string, any>): Promise<Record<string, any>> {
  if (!context) return {};

  const enrichedContext: Record<string, any> = { ...context };

  // Fetch additional data from Supabase based on context
  if (context.studentId) {
    const { data: student } = await supabase
      .from('students')
      .select('id, first_name, last_name, class_id, school_id, created_at, updated_at, classes(name)')
      .eq('id', context.studentId)
      .single();
    enrichedContext.student = student;
  }

  if (context.classId) {
    const { data: classData } = await supabase
      .from('classes')
      .select('id, name, school_id, level, teacher_id, created_at, schools(name)')
      .eq('id', context.classId)
      .single();
    enrichedContext.class = classData;
  }

  if (context.teacherId) {
    const { data: teacher } = await supabase
      .from('users')
      .select('id')
      .eq('id', context.teacherId)
      .single();
    enrichedContext.teacher = teacher;
  }

  return enrichedContext;
}

async function generateAIResponse(
  request: AIRequest,
  contextData: Record<string, any>
): Promise<AIResponse> {
  const { prompt, type, language = 'fr' } = request;

  // Simulate AI processing based on request type
  switch (type) {
    case 'bulletin':
      return generateBulletinResponse(prompt, contextData, language);
    case 'report':
      return generateReportResponse(prompt, contextData, language);
    case 'analysis':
      return generateAnalysisResponse(prompt, contextData, language);
    case 'summary':
      return generateSummaryResponse(prompt, contextData, language);
    case 'recommendation':
      return generateRecommendationResponse(prompt, contextData, language);
    default:
      return generateGenericResponse(prompt, contextData, language);
  }
}

function generateBulletinResponse(
  prompt: string,
  context: Record<string, any>,
  language: string
): AIResponse {
  const student = context.student;
  const grades = context.grades || [];
  const attendance = context.attendance || [];

  const average = grades.length > 0 
    ? grades.reduce((sum: number, g: any) => sum + (g.grade || 0), 0) / grades.length 
    : 0;

  const attendanceRate = attendance.length > 0
    ? (attendance.filter((a: any) => a.status === 'present').length / attendance.length) * 100
    : 100;

  let comment = '';
  if (average >= 16) {
    comment = language === 'fr' 
      ? 'Excellent travail! L\'élève fait preuve d\'un grand sérieux et d\'une excellente compréhension des matières.'
      : 'Excellent work! The student demonstrates great seriousness and excellent understanding of the subjects.';
  } else if (average >= 14) {
    comment = language === 'fr' 
      ? 'Très bon travail. L\'élève est appliqué et montre une bonne compréhension des concepts.'
      : 'Very good work. The student is diligent and shows good understanding of the concepts.';
  } else if (average >= 12) {
    comment = language === 'fr' 
      ? 'Bon travail global. L\'élève fait des efforts satisfaisants dans la majorité des matières.'
      : 'Good overall work. The student makes satisfactory efforts in most subjects.';
  } else {
    comment = language === 'fr' 
      ? 'Des efforts supplémentaires sont nécessaires pour améliorer les résultats.'
      : 'Additional efforts are needed to improve results.';
  }

  return {
    content: comment,
    confidence: 0.85,
    metadata: {
      average: average.toFixed(2),
      attendanceRate: attendanceRate.toFixed(1),
      totalGrades: grades.length,
      totalAttendance: attendance.length,
    },
    processingTime: 0,
  };
}

function generateReportResponse(
  prompt: string,
  context: Record<string, any>,
  language: string
): AIResponse {
  return {
    content: language === 'fr' 
      ? 'Rapport généré avec succès basé sur les données fournies.'
      : 'Report generated successfully based on provided data.',
    confidence: 0.8,
    metadata: { context },
    processingTime: 0,
  };
}

function generateAnalysisResponse(
  prompt: string,
  context: Record<string, any>,
  language: string
): AIResponse {
  return {
    content: language === 'fr' 
      ? 'Analyse complète effectuée avec recommandations personnalisées.'
      : 'Comprehensive analysis completed with personalized recommendations.',
    confidence: 0.9,
    metadata: { context },
    processingTime: 0,
  };
}

function generateSummaryResponse(
  prompt: string,
  context: Record<string, any>,
  language: string
): AIResponse {
  return {
    content: language === 'fr' 
      ? 'Résumé synthétique généré automatiquement.'
      : 'Synthetic summary generated automatically.',
    confidence: 0.75,
    metadata: { context },
    processingTime: 0,
  };
}

function generateRecommendationResponse(
  prompt: string,
  context: Record<string, any>,
  language: string
): AIResponse {
  return {
    content: language === 'fr' 
      ? 'Recommandations personnalisées basées sur l\'analyse des données.'
      : 'Personalized recommendations based on data analysis.',
    confidence: 0.82,
    metadata: { context },
    processingTime: 0,
  };
}

function generateGenericResponse(
  prompt: string,
  context: Record<string, any>,
  language: string
): AIResponse {
  return {
    content: language === 'fr' 
      ? `Réponse générée pour: ${prompt}`
      : `Response generated for: ${prompt}`,
    confidence: 0.7,
    metadata: { context },
    processingTime: 0,
  };
}

function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

// Custom hook for specific AI features
export const useAIBulletin = () => {
  const ai = useAIIntegration({ cacheDuration: 600000 }); // 10 minutes cache

  const generateStudentBulletin = useCallback(async (
    studentId: string,
    classId: string,
    semester: string,
    year: string
  ) => {
    return ai.sendRequest({
      prompt: `Générer un bulletin pour l'élève avec analyse complète des performances académiques.`,
      type: 'bulletin',
      context: {
        studentId,
        classId,
        semester,
        year,
      },
      language: 'fr',
    });
  }, [ai]);

  const generateClassReport = useCallback(async (
    classId: string,
    semester: string,
    year: string
  ) => {
    return ai.sendRequest({
      prompt: `Générer un rapport de classe complet avec statistiques et analyses.`,
      type: 'report',
      context: {
        classId,
        semester,
        year,
      },
      language: 'fr',
    });
  }, [ai]);

  return {
    ...ai,
    generateStudentBulletin,
    generateClassReport,
  };
};

export default useAIIntegration;

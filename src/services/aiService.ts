import { supabase } from '../lib/supabase';

export interface AIProcessingOptions {
  model?: 'gpt-3.5-turbo' | 'gpt-4' | 'claude-3';
  temperature?: number;
  maxTokens?: number;
  language?: 'fr' | 'en';
  context?: Record<string, any>;
}

export interface AIRequest {
  prompt: string;
  type: 'bulletin' | 'report' | 'analysis' | 'summary' | 'recommendation';
  data?: Record<string, any>;
  options?: AIProcessingOptions;
}

export interface AIResponse {
  content: string;
  confidence: number;
  metadata: {
    model?: string;
    tokens?: number;
    processingTime: number;
    dataSources: string[];
  };
}

export class AIService {
  private static instance: AIService;
  private baseURL: string;
  private apiKey: string;

  private constructor() {
    this.baseURL = import.meta.env.VITE_AI_API_URL || 'http://localhost:3001/api';
    this.apiKey = import.meta.env.VITE_AI_API_KEY || '';
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateBulletinAnalysis(studentId: string, options: AIProcessingOptions = {}): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      // Fetch student data
      const [student, grades, attendance] = await Promise.all([
        supabase
          .from('students')
          .select('id, first_name, last_name, class_id, school_id, created_at, updated_at, classes(name)')
          .eq('id', studentId)
          .single(),
        supabase
          .from('grades')
          .select('id, student_id, subject, grade, max_grade, created_at')
          .eq('student_id', studentId),
        supabase
          .from('attendance')
          .select('id, student_id, status, created_at')
          .eq('student_id', studentId)
      ]);

      const context = {
        student: student.data,
        grades: grades.data,
        attendance: attendance.data,
        language: options.language || 'fr'
      };

      const prompt = this.buildBulletinPrompt(context);
      
      return await this.processAIRequest(prompt, 'bulletin', context, startTime);
      
    } catch (error) {
      throw new Error(`Failed to generate bulletin: ${error}`);
    }
  }

  async generateClassReport(classId: string, options: AIProcessingOptions = {}): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      // Fetch class and students first
      const [classData, studentsRes] = await Promise.all([
        supabase
          .from('classes')
          .select('id, name, school_id, level, teacher_id, created_at, schools(name)')
          .eq('id', classId)
          .single(),
        supabase
          .from('students')
          .select('id')
          .eq('class_id', classId)
      ]);

      const studentIds = studentsRes.data?.map(s => s.id) || [];

      // Fetch grades only if we have students
      const grades = studentIds.length
        ? await supabase
            .from('grades')
            .select('id, student_id, grade, max_grade, created_at')
            .in('student_id', studentIds)
        : { data: [], error: null } as any;

      const context = {
        class: classData.data,
        students: studentsRes.data,
        grades: grades.data,
        language: options.language || 'fr'
      };

      const prompt = this.buildClassReportPrompt(context);
      
      return await this.processAIRequest(prompt, 'report', context, startTime);
      
    } catch (error) {
      throw new Error(`Failed to generate class report: ${error}`);
    }
  }

  async generatePerformanceAnalysis(studentId: string, options: AIProcessingOptions = {}): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      const [grades, attendance, behavior] = await Promise.all([
        supabase
          .from('grades')
          .select('id, student_id, grade, max_grade, created_at')
          .eq('student_id', studentId),
        supabase
          .from('attendance')
          .select('id, student_id, status, created_at')
          .eq('student_id', studentId),
        supabase
          .from('behavior_records')
          .select('id, student_id, created_at')
          .eq('student_id', studentId)
      ]);

      const context = {
        grades: grades.data,
        attendance: attendance.data,
        behavior: behavior.data,
        language: options.language || 'fr'
      };

      const prompt = this.buildAnalysisPrompt(context);
      
      return await this.processAIRequest(prompt, 'analysis', context, startTime);
      
    } catch (error) {
      throw new Error(`Failed to generate performance analysis: ${error}`);
    }
  }

  private buildBulletinPrompt(context: Record<string, any>): string {
    const { student, grades, attendance, language } = context;
    
    if (language === 'fr') {
      return `En tant qu'assistant pédagogique, générez un commentaire personnalisé pour le bulletin de ${student?.full_name || 'l\'élève'}.

Données:
- Moyenne générale: ${this.calculateAverage(grades)}
- Taux de présence: ${this.calculateAttendanceRate(attendance)}%
- Nombre de matières: ${grades?.length || 0}
- Comportement: ${this.assessBehavior(grades, attendance)}

Le commentaire doit être:
1. Encourageant et constructif
2. Spécifique aux performances de l'élève
3. Adapté au niveau scolaire
4. Professionnel et chaleureux

Générez un commentaire de 3-4 phrases maximum.`;
    }

    return `As an educational assistant, generate a personalized comment for ${student?.full_name || 'the student'}'s report card.

Data:
- Overall average: ${this.calculateAverage(grades)}
- Attendance rate: ${this.calculateAttendanceRate(attendance)}%
- Number of subjects: ${grades?.length || 0}
- Behavior: ${this.assessBehavior(grades, attendance)}

The comment should be:
1. Encouraging and constructive
2. Specific to the student's performance
3. Appropriate for the academic level
4. Professional and warm

Generate a 3-4 sentence maximum comment.`;
  }

  private buildClassReportPrompt(context: Record<string, any>): string {
    const { class: classData, students, grades, language } = context;
    
    if (language === 'fr') {
      return `Analysez les performances de la classe ${classData?.name || 'la classe'} avec ${students?.length || 0} élèves.

Données disponibles:
- Nombre total d'élèves: ${students?.length || 0}
- Moyenne de la classe: ${this.calculateClassAverage(grades)}
- Taux de réussite: ${this.calculateSuccessRate(grades)}%
- Distribution des notes: ${this.getGradeDistribution(grades)}

Générez un rapport synthétique incluant:
1. Analyse générale des performances
2. Points forts identifiés
3. Domaines nécessitant amélioration
4. Recommandations pédagogiques`;
    }

    return `Analyze the performance of class ${classData?.name || 'the class'} with ${students?.length || 0} students.

Available data:
- Total number of students: ${students?.length || 0}
- Class average: ${this.calculateClassAverage(grades)}
- Success rate: ${this.calculateSuccessRate(grades)}%
- Grade distribution: ${this.getGradeDistribution(grades)}

Generate a concise report including:
1. Overall performance analysis
2. Identified strengths
3. Areas needing improvement
4. Pedagogical recommendations`;
  }

  private buildAnalysisPrompt(context: Record<string, any>): string {
    const { grades, attendance, behavior, language } = context;
    
    if (language === 'fr') {
      return `Analyse détaillée des performances académiques:

Données:
- Notes: ${grades?.length || 0} évaluations
- Présence: ${this.calculateAttendanceRate(attendance)}%
- Comportement: ${behavior?.length || 0} enregistrements

Fournissez:
1. Analyse des forces et faiblesses
2. Identification des domaines d'amélioration
3. Plan d'action personnalisé
4. Prévisions de progression`;
    }

    return `Detailed academic performance analysis:

Data:
- Grades: ${grades?.length || 0} assessments
- Attendance: ${this.calculateAttendanceRate(attendance)}%
- Behavior: ${behavior?.length || 0} records

Provide:
1. Strengths and weaknesses analysis
2. Areas for improvement identification
3. Personalized action plan
4. Progress predictions`;
  }

  private async processAIRequest(
    prompt: string,
    type: string,
    context: Record<string, any>,
    startTime: number
  ): Promise<AIResponse> {
    // In production, this would call your actual AI service
    // For now, we'll use the simulation approach
    
    const processingTime = Date.now() - startTime;
    
    // Simulate AI response based on type and context
    const response = this.simulateAIResponse(type, context);
    
    return {
      content: response.content,
      confidence: response.confidence,
      metadata: {
        model: 'simulated-gpt-3.5',
        tokens: this.estimateTokens(response.content),
        processingTime,
        dataSources: ['supabase', 'school_data'],
      },
    };
  }

  private simulateAIResponse(type: string, context: Record<string, any>) {
    switch (type) {
      case 'bulletin':
        return {
          content: context.language === 'fr' 
            ? `Excellent travail académique avec une moyenne de ${this.calculateAverage(context.grades)}/20. L'élève démontre une bonne compréhension des concepts et une participation active. Continuer dans cette voie.`
            : `Excellent academic work with an average of ${this.calculateAverage(context.grades)}/20. The student demonstrates good understanding of concepts and active participation. Continue on this path.`,
          confidence: 0.85
        };
      case 'report':
        return {
          content: context.language === 'fr' 
            ? `La classe montre des résultats satisfaisants avec une moyenne globale de ${this.calculateClassAverage(context.grades)}/20. Les élèves sont engagés et les progrès sont constants.`
            : `The class shows satisfactory results with an overall average of ${this.calculateClassAverage(context.grades)}/20. The students are engaged and progress is steady.`,
          confidence: 0.82
        };
      default:
        return {
          content: context.language === 'fr' 
            ? 'Analyse complétée avec succès.'
            : 'Analysis completed successfully.',
          confidence: 0.8
        };
    }
  }

  private calculateAverage(grades: any[]): number {
    if (!grades || grades.length === 0) return 0;
    const validGrades = grades.filter(g => g.grade && g.max_grade);
    if (validGrades.length === 0) return 0;
    
    return validGrades.reduce((sum: number, g: any) => sum + (g.grade / g.max_grade) * 20, 0) / validGrades.length;
  }

  private calculateClassAverage(grades: any[]): number {
    return this.calculateAverage(grades);
  }

  private calculateAttendanceRate(attendance: any[]): number {
    if (!attendance || attendance.length === 0) return 100;
    const present = attendance.filter(a => a.status === 'present').length;
    return (present / attendance.length) * 100;
  }

  private calculateSuccessRate(grades: any[]): number {
    if (!grades || grades.length === 0) return 0;
    const passing = grades.filter(g => (g.grade / g.max_grade) * 20 >= 10).length;
    return (passing / grades.length) * 100;
  }

  private getGradeDistribution(grades: any[]): string {
    if (!grades || grades.length === 0) return 'No data';
    
    const distribution = {
      excellent: grades.filter(g => (g.grade / g.max_grade) * 20 >= 16).length,
      good: grades.filter(g => (g.grade / g.max_grade) * 20 >= 12 && (g.grade / g.max_grade) * 20 < 16).length,
      average: grades.filter(g => (g.grade / g.max_grade) * 20 >= 10 && (g.grade / g.max_grade) * 20 < 12).length,
      needs_improvement: grades.filter(g => (g.grade / g.max_grade) * 20 < 10).length,
    };
    
    return JSON.stringify(distribution);
  }

  private assessBehavior(grades: any[], attendance: any[]): string {
    const avg = this.calculateAverage(grades);
    const attendanceRate = this.calculateAttendanceRate(attendance);
    
    if (avg >= 16 && attendanceRate >= 95) return 'Excellent';
    if (avg >= 14 && attendanceRate >= 90) return 'Très bien';
    if (avg >= 12 && attendanceRate >= 85) return 'Bien';
    if (avg >= 10 && attendanceRate >= 80) return 'Satisfaisant';
    return 'Nécessite amélioration';
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}

export default AIService;

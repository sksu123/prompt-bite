export type SessionId = 'session-1' | 'session-2' | 'session-3' | 'session-4' | 'session-5' | 'session-6';

export type TabType = 'guide' | 'playground' | 'harness' | 'automation' | 'parameters' | 'quiz';

export interface PromptElementConfig {
  persona: string;
  context: string;
  instruction: string;
  tone: string;
  format: string;
  examples: string;
}

export interface StepItem {
  id: string;
  sessionId: SessionId;
  stepNumber: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  category: '기초 원리' | '프롬프트 심화' | '일정 관리' | 'OA/문서' | '업무 자동화' | 'AI 에이전트';
  summary: string;
  keyPoints: string[];
  instructorTip: string;
  slidesRef: string;
  standardPrompt: {
    title: string;
    description: string;
    promptText: string;
    inputVariables?: { name: string; label: string; placeholder: string; defaultValue: string }[];
    expectedOutput: string;
    technique?: string;
  };
  practiceTask: {
    mission: string;
    scenario: string;
    sampleInput: string;
    hints: string[];
    solutionPrompt: string;
    expectedResult: string;
  };
  caseStudy?: {
    title: string;
    incident: string;
    cause: string;
    prevention: string;
    takeaway: string;
  };
}

export interface SessionInfo {
  id: SessionId;
  sessionNumber: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  color: string;
  iconName: string;
  steps: StepItem[];
  checklistItems: string[];
}

export interface HarnessConfig {
  goal: string;
  classificationRules: string;
  toneStyle: string;
  permissions: string;
  prohibitions: string;
  outputFormat: string;
  fewShotExamples: string;
  inspectionChecklist: string;
}

export interface CustomerInquiryCase {
  id: number;
  title: string;
  content: string;
  orderNumber?: string;
  product?: string;
  expectedCategory: string;
  rawAiResponse: string;
  harnessAiResponse: {
    inquiryNo: number;
    category: string;
    urgency: string;
    draftResponse: string;
    needsStaffReview: string;
    reviewReason: string;
  };
}

export interface AutomationScriptItem {
  id: string;
  title: string;
  category: 'GAS' | 'Python' | 'VBA' | 'CSV';
  description: string;
  code: string;
  usageSteps: string[];
  downloadFileName: string;
}

export interface UserProgress {
  completedStepIds: string[];
  completedQuizzes: Record<string, boolean>;
  customPrompts: { id: string; title: string; text: string; date: string }[];
  harnessDrafts: HarnessConfig;
  lastActiveStepId: string;
  userName: string;
  certificateEarnedDate?: string;
}

import React, { useState, useEffect } from 'react';
import { CURRICULUM_SESSIONS } from './data/curriculumData';
import { SessionId, StepItem, TabType } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StepGuideView } from './components/StepGuideView';
import { PromptPlayground } from './components/PromptPlayground';
import { HarnessLab } from './components/HarnessLab';
import { ParameterSim } from './components/ParameterSim';
import { AutomationHub } from './components/AutomationHub';
import { QuizCertificate } from './components/QuizCertificate';

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<TabType>('guide');
  const [currentStepId, setCurrentStepId] = useState<string>('step-1-1');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCertificateModalDirect, setShowCertificateModalDirect] = useState(false);

  // User State & Storage Persistence
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('p_architect_username') || '홍길동';
  });

  const [completedStepIds, setCompletedStepIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('p_architect_completed_steps');
      return saved ? JSON.parse(saved) : ['step-1-1'];
    } catch {
      return ['step-1-1'];
    }
  });

  const [playgroundPrompt, setPlaygroundPrompt] = useState<string>('');

  // Persist State Changes
  useEffect(() => {
    localStorage.setItem('p_architect_username', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('p_architect_completed_steps', JSON.stringify(completedStepIds));
  }, [completedStepIds]);

  // Flatten all steps for sequential navigation
  const allSteps: StepItem[] = CURRICULUM_SESSIONS.flatMap(s => s.steps);
  const totalStepsCount = allSteps.length; // 18 steps total

  const currentStepIndex = allSteps.findIndex(s => s.id === currentStepId);
  const currentStep = allSteps[currentStepIndex] || allSteps[0];
  const currentSession = CURRICULUM_SESSIONS.find(s => s.id === currentStep.sessionId) || CURRICULUM_SESSIONS[0];

  const hasNextStep = currentStepIndex < allSteps.length - 1;
  const hasPrevStep = currentStepIndex > 0;

  const handleToggleComplete = (stepId: string) => {
    setCompletedStepIds(prev => {
      if (prev.includes(stepId)) {
        return prev.filter(id => id !== stepId);
      } else {
        return [...prev, stepId];
      }
    });
  };

  const handleGoToNextStep = () => {
    if (hasNextStep) {
      const nextStep = allSteps[currentStepIndex + 1];
      setCurrentStepId(nextStep.id);
      setActiveTab('guide');
    }
  };

  const handleGoToPrevStep = () => {
    if (hasPrevStep) {
      const prevStep = allSteps[currentStepIndex - 1];
      setCurrentStepId(prevStep.id);
      setActiveTab('guide');
    }
  };

  const handleSendToPlayground = (promptText: string) => {
    setPlaygroundPrompt(promptText);
    setActiveTab('playground');
  };

  const handleOpenCertificate = () => {
    setActiveTab('quiz');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sticky Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        completedCount={completedStepIds.length}
        totalSteps={totalStepsCount}
        userName={userName}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenCertificate={handleOpenCertificate}
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Step Guide Sidebar (Shown in Guide view or on demand) */}
        {activeTab === 'guide' && (
          <Sidebar
            sessions={CURRICULUM_SESSIONS}
            currentStepId={currentStepId}
            onSelectStep={(stepId) => {
              setCurrentStepId(stepId);
              setActiveTab('guide');
            }}
            completedStepIds={completedStepIds}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Dynamic Main Workspace Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 custom-scrollbar">
          {activeTab === 'guide' && (
            <StepGuideView
              step={currentStep}
              sessionTitle={`${currentSession.sessionNumber}회차. ${currentSession.title}`}
              isCompleted={completedStepIds.includes(currentStep.id)}
              onToggleComplete={handleToggleComplete}
              onGoToNextStep={handleGoToNextStep}
              onGoToPrevStep={handleGoToPrevStep}
              hasNextStep={hasNextStep}
              hasPrevStep={hasPrevStep}
              onSendToPlayground={handleSendToPlayground}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'playground' && (
            <PromptPlayground
              initialPrompt={playgroundPrompt}
            />
          )}

          {activeTab === 'harness' && (
            <HarnessLab />
          )}

          {activeTab === 'parameters' && (
            <ParameterSim />
          )}

          {activeTab === 'automation' && (
            <AutomationHub />
          )}

          {activeTab === 'quiz' && (
            <QuizCertificate
              userName={userName}
              completedStepCount={completedStepIds.length}
              totalStepCount={totalStepsCount}
              onUpdateUserName={setUserName}
            />
          )}
        </main>
      </div>
    </div>
  );
}

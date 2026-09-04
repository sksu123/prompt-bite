import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Cpu, 
  Calendar, 
  FileSpreadsheet, 
  Code2, 
  Bot,
  Clock,
  X
} from 'lucide-react';
import { SessionInfo, StepItem, SessionId } from '../types';

interface SidebarProps {
  sessions: SessionInfo[];
  currentStepId: string;
  onSelectStep: (stepId: string) => void;
  completedStepIds: string[];
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const getSessionIcon = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles': return Sparkles;
    case 'Cpu': return Cpu;
    case 'Calendar': return Calendar;
    case 'FileSpreadsheet': return FileSpreadsheet;
    case 'Code2': return Code2;
    case 'Bot': return Bot;
    default: return Sparkles;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentStepId,
  onSelectStep,
  completedStepIds,
  isOpenMobile,
  onCloseMobile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSessions, setExpandedSessions] = useState<Record<SessionId, boolean>>({
    'session-1': true,
    'session-2': true,
    'session-3': true,
    'session-4': true,
    'session-5': true,
    'session-6': true,
  });

  const toggleSession = (sessionId: SessionId) => {
    setExpandedSessions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  const filteredSessions = sessions.map(session => {
    const matchesSession = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           session.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchedSteps = session.steps.filter(step => 
      step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.standardPrompt.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
      ...session,
      steps: searchQuery ? (matchesSession ? session.steps : matchedSteps) : session.steps,
      isVisible: searchQuery ? (matchesSession || matchedSteps.length > 0) : true
    };
  }).filter(s => s.isVisible);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out shrink-0
        lg:static lg:translate-x-0 lg:z-0
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header with Search & Close button on Mobile */}
        <div className="p-4 border-b border-slate-200 flex flex-col gap-3 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Guide Progression
            </h2>
            <button 
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="단계, 키워드, 프롬프트 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Sessions & Steps List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {filteredSessions.map((session) => {
            const Icon = getSessionIcon(session.iconName);
            const isExpanded = expandedSessions[session.id] || !!searchQuery;
            const sessionCompletedCount = session.steps.filter(s => completedStepIds.includes(s.id)).length;
            const isSessionFullyCompleted = sessionCompletedCount === session.steps.length && session.steps.length > 0;

            return (
              <div 
                key={session.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
              >
                {/* Session Accordion Header */}
                <button
                  onClick={() => toggleSession(session.id)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSessionFullyCompleted 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                          {session.sessionNumber}회차
                        </span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                          {sessionCompletedCount}/{session.steps.length}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-800 truncate">
                        {session.subtitle}
                      </h3>
                    </div>
                  </div>

                  <div className="text-slate-400 pl-2">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>

                {/* Steps List */}
                {isExpanded && (
                  <div className="p-1.5 space-y-1 bg-slate-50/50 border-t border-slate-100">
                    {session.steps.map((step, idx) => {
                      const isCurrent = currentStepId === step.id;
                      const isCompleted = completedStepIds.includes(step.id);

                      return (
                        <button
                          key={step.id}
                          onClick={() => {
                            onSelectStep(step.id);
                            onCloseMobile();
                          }}
                          className={`w-full p-2.5 rounded-lg text-left text-xs transition-all flex items-start gap-3 group ${
                            isCurrent
                              ? 'bg-blue-50 text-blue-700 rounded-lg border border-blue-200 font-semibold shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                          }`}
                        >
                          {/* Circle Number Marker */}
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                            isCurrent 
                              ? 'bg-blue-600 text-white' 
                              : isCompleted 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-slate-200 text-slate-600'
                          }`}>
                            {isCompleted ? '✓' : step.stepNumber}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`leading-snug truncate ${isCurrent ? 'text-blue-900 font-bold' : 'text-slate-800'}`}>
                                {step.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {step.estimatedMinutes}분
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="truncate">{step.category}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Tracker Card at Bottom */}
        <div className="p-4 border-t border-slate-200 bg-slate-900 text-white text-xs">
          <p className="opacity-70 mb-2">실습 진행률</p>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-500"
              style={{ width: `${Math.round((completedStepIds.length / 18) * 100)}%` }}
            />
          </div>
          <div className="mt-2 font-mono flex items-center justify-between text-[11px] text-slate-400">
            <span>{completedStepIds.length} / 18 단계 완료</span>
            <span className="text-blue-400 font-bold">{Math.round((completedStepIds.length / 18) * 100)}%</span>
          </div>
        </div>
      </aside>
    </>
  );
};

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Copy, 
  Check, 
  Lightbulb, 
  Sparkles, 
  BookOpen, 
  ShieldAlert, 
  Play, 
  HelpCircle, 
  ChevronRight,
  ExternalLink,
  Target
} from 'lucide-react';
import { StepItem, TabType } from '../types';

interface StepGuideViewProps {
  step: StepItem;
  sessionTitle: string;
  isCompleted: boolean;
  onToggleComplete: (stepId: string) => void;
  onGoToNextStep: () => void;
  onGoToPrevStep: () => void;
  hasNextStep: boolean;
  hasPrevStep: boolean;
  onSendToPlayground: (promptText: string) => void;
  setActiveTab: (tab: TabType) => void;
}

export const StepGuideView: React.FC<StepGuideViewProps> = ({
  step,
  sessionTitle,
  isCompleted,
  onToggleComplete,
  onGoToNextStep,
  onGoToPrevStep,
  hasNextStep,
  hasPrevStep,
  onSendToPlayground,
  setActiveTab
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userDraft, setUserDraft] = useState('');
  const [isDraftSubmitted, setIsDraftSubmitted] = useState(false);

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleRunInPlayground = () => {
    onSendToPlayground(step.standardPrompt.promptText);
    setActiveTab('playground');
  };

  const handleCompleteAndNext = () => {
    if (!isCompleted) {
      onToggleComplete(step.id);
    }
    if (hasNextStep) {
      onGoToNextStep();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Step Header Bar */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
            <span>{sessionTitle}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700">단계 {step.stepNumber}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono">{step.slidesRef}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {step.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">{step.subtitle}</p>
        </div>

        {/* Completion Toggle & Next Guide Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onToggleComplete(step.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              isCompleted
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>{isCompleted ? '완료됨' : '완료 체크'}</span>
          </button>

          {hasNextStep && (
            <button
              onClick={handleCompleteAndNext}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <span>완료 후 다음 단계</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 1. 핵심 요약 & 슬라이드 인사이트 */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>핵심 이론 & 슬라이드 요약</span>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
          {step.summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {step.keyPoints.map((point, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-snug">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. AI 전문 강사의 실무 Pro Tip */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex gap-3.5 items-start">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 text-white shadow-xs">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
              AI 전문강사 & 프롬프트 설계자 실무 TIP
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-blue-950 leading-relaxed">
            {step.instructorTip}
          </p>
        </div>
      </div>

      {/* 3. 표준 프롬프트 & 원클릭 복사 */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">{step.standardPrompt.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyPrompt(step.standardPrompt.promptText)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompt ? '복사 완료' : '프롬프트 복사'}</span>
            </button>
            <button
              onClick={handleRunInPlayground}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>공작소에서 실습</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500">{step.standardPrompt.description}</p>

        {/* Prompt Code Block */}
        <div className="relative bg-slate-900 rounded-xl border border-slate-800 p-4 font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {step.standardPrompt.promptText}
        </div>

        {/* Expected Output Box */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-1.5">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            기대되는 AI 최적 응답 예시
          </span>
          <pre className="font-sans text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
            {step.standardPrompt.expectedOutput}
          </pre>
        </div>
      </div>

      {/* 4. 실습 과제 (Interactive Practice Mission) */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">직접 실습해보기 (Practice Mission)</h3>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
            실전 미션
          </span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            미션 과제: {step.practiceTask.mission}
          </div>
          <p className="text-xs text-slate-600">
            <strong>상황:</strong> {step.practiceTask.scenario}
          </p>
          <div className="p-2.5 bg-white rounded-lg text-xs text-slate-700 font-mono border border-slate-200">
            <strong>제공 데이터:</strong> {step.practiceTask.sampleInput}
          </div>
        </div>

        {/* User Input & Self Evaluation */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>내 프롬프트 작성해보기:</span>
            <span className="text-[11px] text-slate-400 font-mono">{userDraft.length}자</span>
          </label>
          <textarea
            value={userDraft}
            onChange={(e) => {
              setUserDraft(e.target.value);
              setIsDraftSubmitted(false);
            }}
            placeholder="위 시나리오와 힌트를 참고하여 직접 프롬프트를 작성해 보세요..."
            rows={3}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors font-mono"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-amber-700 transition-colors font-semibold"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>{showHint ? '힌트 닫기' : '힌트 보기'}</span>
              </button>

              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-blue-700 transition-colors ml-2 font-semibold"
              >
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showSolution ? 'rotate-90' : ''}`} />
                <span>{showSolution ? '모범 답안 숨기기' : '모범 답안 확인'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (userDraft.trim()) {
                    onSendToPlayground(userDraft);
                    setActiveTab('playground');
                  }
                }}
                disabled={!userDraft.trim()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors"
              >
                공작소로 보내기
              </button>
              <button
                onClick={() => {
                  setIsDraftSubmitted(true);
                  if (!isCompleted) onToggleComplete(step.id);
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                실습 제출 & 완료
              </button>
            </div>
          </div>

          {/* Hint Box */}
          {showHint && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900">
              <strong className="block text-amber-900 font-bold">💡 설계 힌트:</strong>
              <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                {step.practiceTask.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Solution Box */}
          {showSolution && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-emerald-900 font-bold">
                <span>강사 모범 프롬프트 답안</span>
                <button
                  onClick={() => handleCopyPrompt(step.practiceTask.solutionPrompt)}
                  className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Copy className="w-3 h-3" /> 복사
                </button>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg font-mono text-emerald-400 whitespace-pre-wrap border border-slate-800">
                {step.practiceTask.solutionPrompt}
              </div>
              <div className="text-emerald-800 text-[11px]">
                <strong>기대 효과:</strong> {step.practiceTask.expectedResult}
              </div>
            </div>
          )}

          {isDraftSubmitted && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>성공적으로 실습이 완료되었습니다! 다음 단계로 이동하여 학습을 이어가세요.</span>
              </div>
              {hasNextStep && (
                <button
                  onClick={onGoToNextStep}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  다음 단계 이동 &rarr;
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 5. 실제 사건/판례 Case Study (if exists) */}
      {step.caseStudy && (
        <div className="p-6 bg-white rounded-xl border border-rose-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>실제 사고 분석 Case Study: {step.caseStudy.title}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-100 space-y-1">
              <strong className="text-rose-900">사건 개요:</strong>
              <p className="text-slate-700 leading-relaxed">{step.caseStudy.incident}</p>
            </div>
            <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-100 space-y-1">
              <strong className="text-rose-900">발생 원인:</strong>
              <p className="text-slate-700 leading-relaxed">{step.caseStudy.cause}</p>
            </div>
            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
              <strong className="text-emerald-900">예방 대책:</strong>
              <p className="text-slate-700 leading-relaxed">{step.caseStudy.prevention}</p>
            </div>
            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
              <strong className="text-emerald-900">실무 시사점:</strong>
              <p className="text-slate-700 leading-relaxed">{step.caseStudy.takeaway}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Step Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={onGoToPrevStep}
          disabled={!hasPrevStep}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전 단계</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleComplete(step.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              isCompleted
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            {isCompleted ? '✓ 완료 상태' : '완료로 표시'}
          </button>

          {hasNextStep && (
            <button
              onClick={handleCompleteAndNext}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
            >
              <span>다음 단계 진행</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

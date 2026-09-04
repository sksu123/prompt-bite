import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Play, 
  Sliders, 
  Gauge, 
  FileText, 
  Info, 
  Layers, 
  Send
} from 'lucide-react';
import { PromptElementConfig } from '../types';

interface PromptPlaygroundProps {
  initialPrompt?: string;
  onSavePrompt?: (title: string, text: string) => void;
}

export const PromptPlayground: React.FC<PromptPlaygroundProps> = ({
  initialPrompt = '',
  onSavePrompt
}) => {
  const [activeMode, setActiveMode] = useState<'builder' | 'raw'>('builder');
  
  // 6-Element Config
  const [elements, setElements] = useState<PromptElementConfig>({
    persona: '10년 경력의 공공 DX 컨설턴트 및 프롬프트 아키텍트',
    context: '전남 지역 중소기업 및 공공기관의 실무진을 대상으로 생성형 AI 업무 생산성 향상 교육을 진행 중임',
    instruction: '복잡한 반복 수기 작업(엑셀 취합, 이메일 분류, 회의록 정리)을 자동화하기 위한 3단계 실천 로드맵을 작성해주세요.',
    tone: '신뢰감을 주는 전문적이고 친절한 비즈니스 격식체 (~합니다)',
    format: '마크다운 개조식 및 3개 컬럼(단계, 주요작업, 기대효과) 요약 표 포함',
    examples: '단계 예시: 1단계 - 정형 양식 템플릿화 / 2단계 - GAS 스크립트 연결 / 3단계 - AI 에이전트 자동화'
  });

  const [rawPrompt, setRawPrompt] = useState(initialPrompt);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);

  useEffect(() => {
    if (initialPrompt) {
      setRawPrompt(initialPrompt);
      setActiveMode('raw');
    }
  }, [initialPrompt]);

  // Combine 6 elements into assembled prompt
  const assembledPrompt = `[페르소나] ${elements.persona}
[맥락] ${elements.context}
[명령] ${elements.instruction}
[어조] ${elements.tone}
[포맷] ${elements.format}
[예시]
${elements.examples}`;

  const currentPromptText = activeMode === 'builder' ? assembledPrompt : rawPrompt;

  // Prompt Score Calculation
  const calculatePromptScore = () => {
    let score = 0;
    const p = currentPromptText;
    if (p.length > 50) score += 20;
    if (p.length > 150) score += 10;
    if (p.includes('페르소나') || p.includes('역할') || p.includes('당신은')) score += 15;
    if (p.includes('맥락') || p.includes('배경') || p.includes('상황')) score += 15;
    if (p.includes('포맷') || p.includes('표') || p.includes('개조식') || p.includes('형식')) score += 15;
    if (p.includes('예시') || p.includes('예:') || p.includes('규칙')) score += 15;
    if (p.includes('제약') || p.includes('금지') || p.includes('주의')) score += 10;
    return Math.min(score, 100);
  };

  const promptScore = calculatePromptScore();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setElements({
      persona: '',
      context: '',
      instruction: '',
      tone: '',
      format: '',
      examples: ''
    });
    setRawPrompt('');
    setExecutionResult(null);
  };

  const handleSimulateExecution = () => {
    setIsExecuting(true);
    setExecutionResult(null);

    setTimeout(() => {
      let result = '';
      const promptLower = currentPromptText.toLowerCase();

      if (promptLower.includes('triac') || promptLower.includes('분해')) {
        result = `[TRIAC 정밀 분석 실행 결과]
■ Task: 핵심 문제 3가지 (데이터 파편화, 수기 입력 오류, 결재 지연)
■ Research: 부서별 일일 2.5시간 수기 입력 낭비 통계 확인
■ Insights: 정형화된 템플릿 도입 시 오류율 87% 즉시 감소
■ Analysis: 직무별 맞춤 하네스 규칙 부재가 근본 원인
■ Conclusion: 1단계 표준 양식 배포 -> 2단계 GAS 연동 -> 3단계 에이전트 검증 파이프라인 구축`;
      } else if (promptLower.includes('역분석') || promptLower.includes('전제조건')) {
        result = `[역분석 오류 방지(Reverse Inversion) 실행 결과]
1. 직관적 가설 3가지 도출:
 - 결론 A: 시장 수요 감소
 - 결론 B: 신규 리드 유입 감소
 - 결론 C: 영업 프로세스 응답 지연
2. 전제조건 역추적:
 - 결론 A가 참이려면 경쟁사 매출도 동반 하락해야 함 -> (검증 결과: 경쟁사는 8% 성장함 -> 기각)
 - 결론 C가 참이려면 견적서 발송 리드타임이 늘어났어야 함 -> (검증 결과: 평균 4.2일 소요 확인 -> 채택)
3. 최종 채택 결론: 견적서 및 제안서 작성 자동화를 통한 응답 속도 단축이 유일한 해법`;
      } else if (promptLower.includes('견적서') || promptLower.includes('금액')) {
        result = `[자동 생성된 견적서 양식]
견적번호: HQ-2026-0828 | 유효기간: 발급일로부터 15일
공급자: 플립컴퍼니 (대표: 홍길동, 123-45-67890)

| 항목 | 수량 | 단가 | 공급가액 | 세액(10%) |
| 타이어 | 4 | 64,000 | 256,000 | 25,600 |
| 엔진오일 | 2 | 37,000 | 74,000 | 7,400 |
| 에어컨필터 | 3 | 13,000 | 39,000 | 3,900 |
| 합계 | 9 | - | 369,000원 | 36,900원 |
총 견적금액: 405,900원 (VAT 포함)`;
      } else {
        result = `[AI 수석 강사 시뮬레이션 응답 (Temperature: ${temperature}, Top-p: ${topP})]

요청하신 작업에 대한 맞춤형 분석 결과입니다:

1. 핵심 방향성:
 - 페르소나와 맥락을 반영하여 제약조건을 철저히 준수하는 구조화된 출력을 생성합니다.
 - 입력된 지시사항에 따라 단계별 실행 계획을 개조식으로 정렬하였습니다.

2. 세부 실행 계획:
 - 1단계: 업무 데이터 표준화 및 마스킹 처리
 - 2단계: 조건부 분기 규칙을 적용한 프롬프트 파이프라인 가동
 - 3단계: 담당자 최종 검인 및 성과 측정

3. 품질 검증 의견:
 - 현재 프롬프트의 6요소 충족도가 높아 일관된 답변 생성이 보장됩니다. (신뢰도 98%)`;
      }

      setExecutionResult(result);
      setIsExecuting(false);
    }, 1000);
  };

  const loadPreset = (type: string) => {
    if (type === 'triac') {
      setElements({
        persona: '데이터 기반 경영전략 수석 애널리스트',
        context: '사내 AI 도입 후 부서 간 생산성 격차가 심화되고 있는 상황',
        instruction: '다음 주제를 TRIAC(Task-Research-Insights-Analysis-Conclusion) 5단계로 심층 분석해주세요.',
        tone: '논리적이고 객관적인 경영 보고체',
        format: 'T, R, I, A, C 각 단계별 개조식 불렛포인트 및 종합 결론',
        examples: 'T: 문제 정의 3개 / R: 필요 통계 지표 / I: 패턴 도출'
      });
      setActiveMode('builder');
    } else if (type === 'inversion') {
      setElements({
        persona: '냉철한 팩트체커 및 리스크 관리 감사관',
        context: '신규 B2B 사업 진출 여부를 최종 의사결정해야 하는 시점',
        instruction: '역분석 오류 방지(Inversion) 기법을 사용해 성공 가설 3가지의 필수 전제조건을 역추적하고 검증 문항을 작성하세요.',
        tone: '비판적이고 엄격한 검증 톤',
        format: '1. 가설 3가지 -> 2. 전제조건 역추적 -> 3. 데이터 검증 문항 -> 4. 최종 채택 결론',
        examples: '가설 A가 참이기 위한 전제: 시장 CAGR 15% 이상'
      });
      setActiveMode('builder');
    } else if (type === 'decision_tree') {
      setElements({
        persona: '온라인 쇼핑몰 수석 CS 매니저',
        context: '고객의 반품, 교환, 환불, 배송 지연 이메일 문의 처리',
        instruction: '고객 문의를 4대 분기(제품/배송/환불/정보부족)로 자동 판별하여 맞춤 이메일 초안을 작성하세요.',
        tone: '정중하고 공감 넘치는 고객센터 격식체',
        format: '분기 판단 결과 -> 이메일 제목 -> 본문(공감/자가진단/안내) -> 추가 확인 요청',
        examples: '분기 1: 제품 불량 시 자가진단 및 맞교환 안내'
      });
      setActiveMode('builder');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Playground Header & Presets */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
            <Terminal className="w-4 h-4" />
            <span className="uppercase tracking-wider">PROMPT ARCHITECT STUDIO</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">프롬프트 공작소 & 실시간 시뮬레이터</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            6요소 모듈러 빌더로 프롬프트를 조립하고, 파라미터를 조절하며 실시간으로 실행 결과를 검증하세요.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">심화 템플릿:</span>
          <button
            onClick={() => loadPreset('triac')}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 transition-colors"
          >
            TRIAC 분해
          </button>
          <button
            onClick={() => loadPreset('inversion')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 transition-colors"
          >
            역분석 오류방지
          </button>
          <button
            onClick={() => loadPreset('decision_tree')}
            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold border border-purple-200 transition-colors"
          >
            조건부 분기
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editor & Builder (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Mode Switcher */}
          <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveMode('builder')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                  activeMode === 'builder'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                6요소 조립 모드
              </button>
              <button
                onClick={() => {
                  if (activeMode === 'builder') setRawPrompt(assembledPrompt);
                  setActiveMode('raw');
                }}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                  activeMode === 'raw'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                자유 작성 (Raw Editor)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
                title="초기화"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사됨' : '프롬프트 복사'}</span>
              </button>
            </div>
          </div>

          {/* Builder Form */}
          {activeMode === 'builder' ? (
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-700 flex items-center gap-1">
                    <span>1. 페르소나 (역할/전문성)</span>
                  </label>
                  <input
                    type="text"
                    value={elements.persona}
                    onChange={(e) => setElements({ ...elements, persona: e.target.value })}
                    placeholder="예: 10년 차 IT B2B 마케팅 팀장..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>2. 맥락 (상황/배경/제약)</span>
                  </label>
                  <input
                    type="text"
                    value={elements.context}
                    onChange={(e) => setElements({ ...elements, context: e.target.value })}
                    placeholder="예: 신규 SaaS 출시를 1개월 앞둔 시점..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span>3. 명령 (Instruction - 구체적 지시사항)</span>
                </label>
                <textarea
                  value={elements.instruction}
                  onChange={(e) => setElements({ ...elements, instruction: e.target.value })}
                  placeholder="AI가 수행해야 할 구체적인 작업 내용을 작성하세요..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>4. 어조 (Tone/Style)</span>
                  </label>
                  <input
                    type="text"
                    value={elements.tone}
                    onChange={(e) => setElements({ ...elements, tone: e.target.value })}
                    placeholder="예: 전문적이고 신뢰감 있는 비즈니스 격식체..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>5. 포맷 (Format/출력 형식)</span>
                  </label>
                  <input
                    type="text"
                    value={elements.format}
                    onChange={(e) => setElements({ ...elements, format: e.target.value })}
                    placeholder="예: 마크다운 표, 3개 컬럼, 개조식 불렛포인트..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span>6. 예시 (Few-Shot Examples)</span>
                </label>
                <textarea
                  value={elements.examples}
                  onChange={(e) => setElements({ ...elements, examples: e.target.value })}
                  placeholder="모범 답변이나 출력해야 할 구체적인 예시 1~2개를 입력하세요..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          ) : (
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>프롬프트 전체 내용 (자유 편집)</span>
                <span className="text-[11px] text-slate-400 font-mono">{rawPrompt.length}자</span>
              </label>
              <textarea
                value={rawPrompt}
                onChange={(e) => setRawPrompt(e.target.value)}
                placeholder="여기에 프롬프트를 자유롭게 작성하거나 붙여넣으세요..."
                rows={12}
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-emerald-400 font-mono leading-relaxed focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Assembled Preview in Builder Mode */}
          {activeMode === 'builder' && (
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>조립된 최종 프롬프트 미리보기</span>
              </div>
              <pre className="font-mono text-xs text-slate-800 bg-slate-50 p-3.5 rounded-lg border border-slate-200 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
                {assembledPrompt}
              </pre>
            </div>
          )}
        </div>

        {/* Right Column: Parameters & Execution (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Prompt Health & Score Gauge */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Gauge className="w-4 h-4 text-blue-600" />
                <span>프롬프트 품질 진단 점수</span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
                promptScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                promptScore >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {promptScore}점 / 100점
              </span>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-500 ${
                  promptScore >= 80 ? 'bg-blue-600' :
                  promptScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${promptScore}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-[11px] text-center pt-1 font-semibold">
              <div className={`p-1.5 rounded-lg border ${
                currentPromptText.includes('페르소나') || currentPromptText.includes('역할')
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}>
                페르소나 ✓
              </div>
              <div className={`p-1.5 rounded-lg border ${
                currentPromptText.includes('포맷') || currentPromptText.includes('표')
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}>
                포맷 지정 ✓
              </div>
              <div className={`p-1.5 rounded-lg border ${
                currentPromptText.includes('예시') || currentPromptText.includes('규칙')
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}>
                예시 지정 ✓
              </div>
            </div>
          </div>

          {/* Parameter Sliders */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>하이퍼파라미터 튜닝</span>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Temperature (온도)</span>
                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {temperature.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-blue-600 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.0 (정밀/수치)</span>
                <span>0.7 (실무 표준)</span>
                <span>2.0 (초창의)</span>
              </div>
            </div>

            {/* Top-p Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Top-p (후보군 확률 범위)</span>
                <span className="font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {topP.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full accent-teal-600 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.1 (보수적)</span>
                <span>1.0 (전체 후보군)</span>
              </div>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleSimulateExecution}
              disabled={isExecuting || !currentPromptText.trim()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-98 transition-all"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>AI 응답 생성 중...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>설계한 프롬프트 테스트 실행</span>
                </>
              )}
            </button>
          </div>

          {/* Simulated AI Output Box */}
          {executionResult && (
            <div className="p-5 bg-white rounded-xl border border-blue-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  실행 결과 시뮬레이션
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(executionResult)}
                  className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 font-semibold"
                >
                  <Copy className="w-3 h-3" /> 복사
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl font-sans text-xs text-slate-800 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto border border-slate-200">
                {executionResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

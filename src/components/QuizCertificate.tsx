import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Printer, 
  Sparkles, 
  ShieldCheck, 
  FileCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  sessionNo: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    sessionNo: 1,
    question: '계약서나 법률 문서, 수치 계산 등 무오류성이 중요한 작업 시 적합한 Temperature 파라미터 값은?',
    options: ['0.1 ~ 0.3', '0.7 ~ 0.9', '1.3 ~ 1.5', '1.8 ~ 2.0'],
    correctIndex: 0,
    explanation: '사실 기반의 정밀하고 일관된 답변을 생성하려면 Temperature를 0.1~0.3 수준으로 낮추어야 합니다.'
  },
  {
    id: 2,
    sessionNo: 2,
    question: '직관적 결론을 내리기 전에 필수 전제조건을 역추적하여 데이터로 검증하는 6대 프롬프트 심화 기법은?',
    options: ['TRIAC 구조 분해', '역분석 오류 방지(Inversion)', '자가 질문 메타인지', '조건부 다중 분기'],
    correctIndex: 1,
    explanation: '역분석 오류 방지(Inversion)는 "이 결론이 맞으려면 어떤 조건이 충족되어야 하는가?"를 역추적하여 편향을 차단하는 기법입니다.'
  },
  {
    id: 3,
    sessionNo: 3,
    question: 'Google Calendar에 다수의 일정을 한 번에 일괄 등록(Import)하기 위해 생성해야 하는 표준 파일 포맷은?',
    options: ['.xlsx 엑셀 통합 문서', '.csv (구글 캘린더 8대 헤더 규격)', '.json 데이터 파일', '.pdf 문서'],
    correctIndex: 1,
    explanation: '구글 캘린더는 Subject, Start Date, Start Time, End Date, End Time, All Day Event, Description, Location 등의 8대 헤더가 지정된 CSV 파일을 지원합니다.'
  },
  {
    id: 4,
    sessionNo: 4,
    question: 'Colab 파이썬으로 엑셀 자동화 시, 셀 스타일링(폰트, 배경색, 테두리, 수식)을 완벽 지원하는 라이브러리는?',
    options: ['pandas', 'openpyxl', 'matplotlib', 'requests'],
    correctIndex: 1,
    explanation: 'openpyxl 라이브러리를 사용하면 엑셀 셀 병합, 색상 채우기(PatternFill), 테두리(Border), 수식(=SUM)을 자유자재로 다룰 수 있습니다.'
  },
  {
    id: 5,
    sessionNo: 5,
    question: 'Google Apps Script(GAS)에서 매 1시간마다 웹 데이터를 자동으로 수집하여 시트에 기록하게 만드는 기능은?',
    options: ['timeBased 트리거 (ScriptApp.newTrigger)', 'VBA 매크로 단추', '구글 폼 연동', '슬랙 웹훅'],
    correctIndex: 0,
    explanation: 'ScriptApp.newTrigger().timeBased().everyHours(1).create()를 사용하면 클라우드 상에서 1시간마다 자동 실행됩니다.'
  },
  {
    id: 6,
    sessionNo: 6,
    question: 'AI 에이전트의 오작동 및 월권행위(임의 환불, 개인정보 노출)를 방지하기 위해 7대 업무 장치를 설계하는 기법은?',
    options: ['하네스 엔지니어링 (Harness Engineering)', '파인 튜닝 (Fine-tuning)', 'RAG 검색 증강 생성', 'Few-shot 러닝'],
    correctIndex: 0,
    explanation: '하네스 엔지니어링은 목표, 분류규칙, 말투, 권한/금지사항, 양식, 정답, 점검표 7개 장치를 통해 안전한 자동화를 구축합니다.'
  }
];

interface QuizCertificateProps {
  userName: string;
  completedStepCount: number;
  totalStepCount: number;
  onUpdateUserName: (name: string) => void;
}

export const QuizCertificate: React.FC<QuizCertificateProps> = ({
  userName,
  completedStepCount,
  totalStepCount,
  onUpdateUserName
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [inputName, setInputName] = useState(userName);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const score = calculateScore();
  const passed = score >= 5;
  const progressPercent = Math.round((completedStepCount / totalStepCount) * 100);
  const isEligibleForCertificate = completedStepCount >= 10 || passed;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
            <Award className="w-4 h-4" />
            <span className="uppercase tracking-wider">Comprehensive Assessment & Certificate</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">학습 평가 및 공식 수료증 발급</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            1~6회차 전 과정 핵심 6문항 퀴즈를 풀고 전남 AI·D 30+ 캠프 공식 이수 수료증을 취득하세요.
          </p>
        </div>

        {/* Certificate Button */}
        <button
          onClick={() => setShowCertificateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <Award className="w-4 h-4" />
          <span>수료증 미리보기 및 발급</span>
        </button>
      </div>

      {/* Quiz Section */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <span>핵심 역량 진단 평가 (총 6문항)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetQuiz}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>다시 풀기</span>
            </button>
            {!showResults && (
              <button
                onClick={() => setShowResults(true)}
                disabled={Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                채점하기
              </button>
            )}
          </div>
        </div>

        {/* Score Summary if Results Shown */}
        {showResults && (
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            passed 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-3">
              {passed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-amber-600 shrink-0" />
              )}
              <div>
                <h4 className="text-sm font-bold">
                  {passed ? '축하합니다! 합격 기준을 통과하셨습니다.' : '아쉽습니다. 오답을 확인하고 다시 도전해보세요.'}
                </h4>
                <p className="text-xs mt-0.5">
                  총 {QUIZ_QUESTIONS.length}문항 중 <strong className="font-bold">{score}문항</strong> 정답 (합격 기준: 5문항 이상)
                </p>
              </div>
            </div>
            {passed && (
              <button
                onClick={() => setShowCertificateModal(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shrink-0 shadow-sm"
              >
                수료증 발급하기 &rarr;
              </button>
            )}
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {QUIZ_QUESTIONS.map((q, qIndex) => {
            const selectedOpt = selectedAnswers[q.id];
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div 
                key={q.id}
                className={`p-4 rounded-xl border transition-all ${
                  showResults 
                    ? isCorrect 
                      ? 'bg-emerald-50/40 border-emerald-200' 
                      : 'bg-rose-50/40 border-rose-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                      Q{qIndex + 1}
                    </span>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {q.sessionNo}회차
                    </span>
                  </div>
                  {showResults && (
                    <span className={`text-xs font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {isCorrect ? '✓ 정답' : '✗ 오답'}
                    </span>
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 pl-8">
                  {q.question}
                </h4>

                {/* Options */}
                <div className="space-y-2 pl-8">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = selectedOpt === optIndex;
                    let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';
                    
                    if (showResults) {
                      if (optIndex === q.correctIndex) {
                        optionStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-100 border-rose-400 text-rose-900';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500/30';
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleSelectOption(q.id, optIndex)}
                        disabled={showResults}
                        className={`w-full text-left p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${optionStyle}`}
                      >
                        <span>{optIndex + 1}. {opt}</span>
                        {isSelected && !showResults && (
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showResults && (
                  <div className="mt-3 pl-8 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                    <strong className="text-blue-700 block mb-0.5">해설:</strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 relative my-8">
            {/* Modal Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                <ShieldCheck className="w-4 h-4" />
                <span>OFFICIAL COURSE COMPLETION CERTIFICATE</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>인쇄 / PDF 저장</span>
                </button>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Name Input Bar */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="text-xs font-bold text-slate-700">이수자 성명 입력:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => {
                    setInputName(e.target.value);
                    onUpdateUserName(e.target.value);
                  }}
                  placeholder="홍길동"
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* The Certificate Frame */}
            <div id="certificate-print-area" className="border-8 border-double border-slate-800 p-8 sm:p-12 bg-white text-center space-y-6 relative shadow-inner">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-xs text-slate-400 font-serif">◈</div>
              <div className="absolute top-2 right-2 text-xs text-slate-400 font-serif">◈</div>
              <div className="absolute bottom-2 left-2 text-xs text-slate-400 font-serif">◈</div>
              <div className="absolute bottom-2 right-2 text-xs text-slate-400 font-serif">◈</div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-700 tracking-widest uppercase">
                  Certificate of Completion
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                  수 료 증
                </h1>
                <p className="text-[11px] font-mono text-slate-400">발급번호: JNAID-2026-0828</p>
              </div>

              <div className="space-y-2 py-4">
                <p className="text-sm text-slate-500">이수자 성명</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 underline decoration-blue-500 decoration-2 underline-offset-8">
                  {inputName || '학습자'}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl mx-auto font-serif">
                위 사람은 <strong>전남 AI·D 30+ 집중캠프</strong>에서 주관하는
                <br />
                <span className="font-bold text-blue-800 text-sm sm:text-base">
                  「생성형 AI 심화 및 프롬프트 하네스 엔지니어링 실무 과정」
                </span>
                <br />
                (총 6회차 커리큘럼 및 실무 자동화 프로젝트)을 우수한 성적으로 이수하였음을 증명합니다.
              </p>

              {/* Badges / Skills list */}
              <div className="grid grid-cols-3 gap-2 text-[11px] py-2 border-y border-slate-200 max-w-lg mx-auto text-slate-600">
                <div>✓ 6대 프롬프트 아키텍처</div>
                <div>✓ GAS & Colab 파이썬 자동화</div>
                <div>✓ 하네스 7대 보안 제어</div>
              </div>

              {/* Date & Seal */}
              <div className="pt-4 flex items-end justify-between max-w-lg mx-auto text-left text-xs">
                <div>
                  <p className="text-slate-500 font-mono">발급일자: 2026년 08월 28일</p>
                  <p className="font-bold text-slate-800 mt-1">전남 AI·D 30+ 교육위원회</p>
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-red-700 text-red-700 flex items-center justify-center font-bold text-[10px] transform rotate-12 shadow-sm">
                  직인생략
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

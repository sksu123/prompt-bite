import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  TrendingUp, 
  HelpCircle 
} from 'lucide-react';

interface PromptPreset {
  id: string;
  name: string;
  category: string;
  prompt: string;
  recommendedTemp: number;
  recommendedTopP: number;
  explanation: string;
  outputs: {
    tempLow: string;
    tempMid: string;
    tempHigh: string;
  };
}

const PRESETS: PromptPreset[] = [
  {
    id: 'contract',
    name: '계약서 비밀유지 조항 요약 (법률/정밀)',
    category: '정밀/분석',
    prompt: '비밀유지계약서(NDA) 제4조(비밀유지 의무 기간 3년, 위반 시 손해배상금 5천만원)의 핵심 조항 3가지를 사실 위주로 불렛포인트 요약해주세요.',
    recommendedTemp: 0.2,
    recommendedTopP: 0.2,
    explanation: '계약서나 법률 문서, 수치 계산 작업에서는 허위 사실이나 환각(Hallucination)이 발생하지 않도록 Temperature를 0.1~0.3 수준으로 낮추어야 합니다.',
    outputs: {
      tempLow: `[NDA 제4조 핵심 요약]
1. 비밀유지 의무 기간: 계약 체결일로부터 만 3년
2. 비밀 정보 사용 제한: 사전 서면 승인 없이 제3자 제공 및 목적 외 사용 엄격 금지
3. 위반 시 배상 책임: 위반 당사자는 상대방에게 손해배상금 50,000,000원 즉시 지급`,
      tempMid: `[NDA 제4조 주요 내용 요약]
- 비밀유지 유효기간은 3년간 유지됩니다.
- 업무 목적 외 무단 사용 및 제3자 누설이 금지됩니다.
- 위반 시 5천만 원의 위약벌 및 손해배상 책임이 부과됩니다.`,
      tempHigh: `[약속의 무게: NDA 제4조 통찰]
3년이란 시간 동안 상호 간의 소중한 신뢰와 지적 자산을 수호하는 든든한 방패입니다. 만약 균열이 생길 경우 5,000만 원이라는 무거운 책임이 따르게 됩니다.`
    }
  },
  {
    id: 'marketing',
    name: '신제품 친환경 텀블러 SNS 카피라이팅 (창의/마케팅)',
    category: '창의/기획',
    prompt: '2030 직장인을 타겟으로 한 친환경 스테인리스 보온 텀블러 인스타그램 카피 3가지를 감성적이고 파격적인 톤으로 작성해주세요.',
    recommendedTemp: 1.1,
    recommendedTopP: 0.9,
    explanation: '광고 카피, 슬로건, 브레인스토밍 등 창의적 작업에서는 비유와 은유, 다양한 어휘 조합을 위해 Temperature를 0.9~1.3 수준으로 높입니다.',
    outputs: {
      tempLow: `1. 24시간 보온보냉 친환경 텀블러 #텀블러 #보온병 #친환경
2. 일회용 컵 대신 스테인리스 텀블러로 환경을 지키세요. #에코라이프
3. 출근길 필수품, 하루 종일 따뜻한 커피를 즐기세요. #직장인필수`,
      tempMid: `1. 일회용 컵에 담긴 커피보다, 내 손안의 텀블러가 더 따뜻한 이유 ☕ #그린오피스 #텀블러
2. 월요일 아침을 깨우는 가장 세련된 습관 ✨ 24시간 변함없는 온도 #모닝루틴
3. 작은 텀블러 하나로 지구에게 건네는 다정한 인사 🌿 #에코라이프`,
      tempHigh: `1. 차가운 도심, 당신의 데스크 위에서 피어나는 작은 오아시스 🌿 0.1도의 온기까지 기억합니다. #내책상속미학
2. 플라스틱 행성을 탈출하는 가장 감각적인 우주선 🚀 오늘 당신의 손끝은 지구를 구하는 중! #텀블러혁명
3. 월요일의 피로를 녹이는 은빛 마법 텀블러 ✨ 커피 향기 속에 스며든 나만의 쉼표.`
    }
  },
  {
    id: 'meeting',
    name: '주간 부서 회의록 5줄 액션아이템 도출 (실무/균형)',
    category: '실무/균형',
    prompt: '영업지원팀 주간 회의 내용(ERP 연동 일정 지연, 신규 고객사 견적서 발송 3건, 교육 일정 확정)에서 담당자별 액션아이템 3개를 도출하세요.',
    recommendedTemp: 0.5,
    recommendedTopP: 0.7,
    explanation: '일반적인 업무 회의록 정리나 보고서 작성은 정확성과 자연스러운 문장력을 고루 갖추어야 하므로 Temperature 0.5~0.7이 가장 이상적입니다.',
    outputs: {
      tempLow: `[영업지원팀 주간 액션아이템]
1. IT팀 연락 및 ERP 연동 지연 사유 확인: 김대리 (3/15까지)
2. 신규 고객사 3곳 견적서 검토 및 발송: 이과장 (3/12까지)
3. 3월 AI 실무 교육 일정 공지 및 참석자 확정: 박팀장 (3/13까지)`,
      tempMid: `[영업지원팀 금주 실행 과제]
- [ERP 안정화]: 김대리님이 IT 개발팀과 긴급 미팅을 진행하여 3/15까지 납기 일정 재조정
- [고객사 대응]: 이과장님이 요청 접수된 견적서 3건 최종 승인 후 금일 내 발송
- [역량 강화]: 박팀장님이 3월 AI 심화 교육 참석자 명단 확정 및 캘린더 등록`,
      tempHigh: `[성장을 위한 이번 주 핵심 미션 트리거]
1. 정체된 ERP의 흐름을 뚫어라! 김대리의 긴급 개발 공조 작전 (목표: 3/15)
2. 고객의 마음을 사로잡을 정밀 견적서 3총사 발송 완료! (담당: 이과장)
3. 미래를 준비하는 AI 학습 챌린지 전사 킥오프 (리드: 박팀장)`
    }
  }
];

export const ParameterSim: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESETS[0].id);
  const [customPrompt, setCustomPrompt] = useState<string>(PRESETS[0].prompt);
  const [temperature, setTemperature] = useState<number>(0.2);
  const [topP, setTopP] = useState<number>(0.2);
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const currentPreset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  const handleSelectPreset = (preset: PromptPreset) => {
    setSelectedPresetId(preset.id);
    setCustomPrompt(preset.prompt);
    setTemperature(preset.recommendedTemp);
    setTopP(preset.recommendedTopP);
  };

  const getSimulatedResult = () => {
    if (temperature < 0.4) {
      return currentPreset.outputs.tempLow;
    } else if (temperature <= 0.8) {
      return currentPreset.outputs.tempMid;
    } else {
      return currentPreset.outputs.tempHigh;
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
            <Sliders className="w-4 h-4" />
            <span className="uppercase tracking-wider">HYPERPARAMETER TUNING LAB</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Temperature & Top-p 파라미터 시뮬레이터</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            라면을 끓일 때 물의 양과 화력을 조절하듯, Temperature와 Top-p를 조절하여 생성 품질을 제어해보세요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTemperature(0.2);
              setTopP(0.2);
            }}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold border border-blue-200 transition-colors"
          >
            정밀 모드 (0.2)
          </button>
          <button
            onClick={() => {
              setTemperature(0.7);
              setTopP(0.8);
            }}
            className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold border border-slate-300 transition-colors"
          >
            균형 모드 (0.7)
          </button>
          <button
            onClick={() => {
              setTemperature(1.2);
              setTopP(0.95);
            }}
            className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold border border-purple-200 transition-colors"
          >
            창의 모드 (1.2)
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRESETS.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-300 shadow-sm ring-1 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100/70 text-blue-800 border border-blue-200">
                  {preset.category}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  추천 Temp {preset.recommendedTemp}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 leading-snug">{preset.name}</h4>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Controls & Sliders (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>파라미터 정밀 조절</span>
            </h3>

            {/* Temperature Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800">
                    Temperature (온도: 무작위성/창의성)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    높을수록 창의적이고 비유적이며, 낮을수록 정형화되고 사실적인 답변을 생성합니다.
                  </p>
                </div>
                <span className="text-base font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
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
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0.0 (법률/수치)</span>
                <span>0.7 (표준 실무)</span>
                <span>2.0 (초창의/소설)</span>
              </div>
            </div>

            {/* Top-p Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800">
                    Top-p (Nucleus Sampling: 후보 단어 누적 확률)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    누적 확률 p% 범위 내의 단어들만 후보군으로 선택하여 엉뚱한 어휘를 억제합니다.
                  </p>
                </div>
                <span className="text-base font-mono font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
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
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0.1 (극상위 단어만)</span>
                <span>1.0 (모든 후보군 고려)</span>
              </div>
            </div>

            {/* Current Prompt Input */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700">입력 프롬프트</label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Instructor Pro Tip Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex gap-3.5 items-start">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 text-white">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-900">강사의 실무 파라미터 공식</h4>
              <p className="text-xs text-blue-800 mt-0.5 leading-relaxed">
                {currentPreset.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Simulation Output & Comparison (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  실시간 시뮬레이션 결과 (Temp: {temperature.toFixed(2)}, Top-p: {topP.toFixed(2)})
                </h3>
              </div>
              <button
                onClick={() => handleCopy(getSimulatedResult())}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사됨' : '복사'}</span>
              </button>
            </div>

            {/* Generated Output */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans text-xs text-slate-800 leading-relaxed whitespace-pre-wrap min-h-[220px]">
              {getSimulatedResult()}
            </div>

            {/* Quality Analysis Badge */}
            <div className="p-3 bg-slate-100 rounded-lg flex items-center justify-between text-xs">
              <span className="text-slate-600">현재 설정 특성:</span>
              <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                temperature < 0.4 ? 'bg-blue-100 text-blue-800' :
                temperature <= 0.8 ? 'bg-emerald-100 text-emerald-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {temperature < 0.4 ? '정밀 사실 / 무오류 지향 (0.0~0.3)' :
                 temperature <= 0.8 ? '실무 표준 / 논리적 균형 (0.4~0.8)' :
                 '고창의 / 은유적 표현 풍부 (0.9~2.0)'}
              </span>
            </div>
          </div>

          {/* 3-Way Comparative Box */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700">3단계 온도별 생성 비교 한눈에 보기</h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-blue-700 block mb-1">■ Temp 0.2 (사실 기반)</span>
                <p className="text-slate-600 line-clamp-2">{currentPreset.outputs.tempLow}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-emerald-700 block mb-1">■ Temp 0.7 (실무 표준)</span>
                <p className="text-slate-600 line-clamp-2">{currentPreset.outputs.tempMid}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-purple-700 block mb-1">■ Temp 1.2 (창의적 카피)</span>
                <p className="text-slate-600 line-clamp-2">{currentPreset.outputs.tempHigh}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

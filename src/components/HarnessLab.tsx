import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Layers, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Building
} from 'lucide-react';
import { DEFAULT_HARNESS_CONFIG, CUSTOMER_INQUIRIES } from '../data/harnessData';
import { HarnessConfig, CustomerInquiryCase } from '../types';

export const HarnessLab: React.FC = () => {
  const [harnessConfig, setHarnessConfig] = useState<HarnessConfig>(DEFAULT_HARNESS_CONFIG);
  const [activeDeviceTab, setActiveDeviceTab] = useState<keyof HarnessConfig>('goal');
  const [selectedCaseId, setSelectedCaseId] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'comparison' | 'table' | 'raw_test'>('comparison');
  const [copiedAll, setCopiedAll] = useState(false);

  const selectedCase = CUSTOMER_INQUIRIES.find(c => c.id === selectedCaseId) || CUSTOMER_INQUIRIES[0];

  const deviceTabs: { id: keyof HarnessConfig; label: string; file: string; num: string }[] = [
    { id: 'goal', label: '업무목표', file: '01_업무목표.txt', num: '01' },
    { id: 'classificationRules', label: '분류규칙', file: '02_분류규칙.txt', num: '02' },
    { id: 'toneStyle', label: '답변말투', file: '03_답변말투.txt', num: '03' },
    { id: 'permissions', label: '권한 및 금지사항', file: '04_권한과금지사항.txt', num: '04' },
    { id: 'outputFormat', label: '결과양식', file: '05_결과양식.txt', num: '05' },
    { id: 'fewShotExamples', label: '예시와 정답', file: '06_예시와정답.txt', num: '06' },
    { id: 'inspectionChecklist', label: '완료점검표', file: '07_완료점검표.txt', num: '07' }
  ];

  const handleDownloadHarness = () => {
    const content = `=====================================================
전남 AI·D 30+ 하네스 엔지니어링 (Harness Engineering) 마스터 패키지
=====================================================

[01_업무목표.txt]
${harnessConfig.goal}

-----------------------------------------------------
[02_분류규칙.txt]
${harnessConfig.classificationRules}

-----------------------------------------------------
[03_답변말투.txt]
${harnessConfig.toneStyle}

-----------------------------------------------------
[04_권한과금지사항.txt]
${harnessConfig.permissions}
${harnessConfig.prohibitions}

-----------------------------------------------------
[05_결과양식.txt]
${harnessConfig.outputFormat}

-----------------------------------------------------
[06_예시와정답.txt]
${harnessConfig.fewShotExamples}

-----------------------------------------------------
[07_완료점검표.txt]
${harnessConfig.inspectionChecklist}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Harness_Engineering_Package.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyBundle = () => {
    const fullText = Object.values(harnessConfig).join('\n\n---\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Hero Banner */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
            <ShieldCheck className="w-4 h-4" />
            <span className="uppercase tracking-wider">ADVANCED HARNESS ARCHITECTURE</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">하네스 엔지니어링(Harness Engineering) 랩</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            AI에게 단순 질문을 던지는 대신, <strong className="text-blue-600">7대 업무 장치(Harness)</strong>를 설계하여 위험 행동을 차단하고 100% 일관된 고객 지원 시스템을 구축합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyBundle}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors"
          >
            {copiedAll ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>하네스 전체 복사</span>
          </button>
          <button
            onClick={handleDownloadHarness}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>패키지 다운로드</span>
          </button>
        </div>
      </div>

      {/* Conceptual Comparison Card */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 bg-white rounded-lg border border-slate-200 flex items-start gap-2.5 shadow-xs">
          <div className="px-2 py-1 bg-slate-100 text-slate-700 rounded font-bold text-[11px] shrink-0">기존</div>
          <div>
            <strong className="text-slate-800 block mb-0.5">단순 프롬프트 엔지니어링</strong>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              채팅창에서 1회성 명령으로 답변을 유도함. 예외 상황에서 임의 환불 승인 등 사고 위험 높음.
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-blue-50/70 rounded-lg border border-blue-200 flex items-start gap-2.5 shadow-xs">
          <div className="px-2 py-1 bg-blue-600 text-white rounded font-bold text-[11px] shrink-0">하네스</div>
          <div>
            <strong className="text-blue-900 block mb-0.5">하네스 엔지니어링 (7대 장치)</strong>
            <p className="text-blue-800 text-[11px] leading-relaxed">
              목표, 규칙, 말투, 권한, 양식, 정답, 점검표를 구조화하여 컨베이어 벨트처럼 안전한 자동화 구축.
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-emerald-50/70 rounded-lg border border-emerald-200 flex items-start gap-2.5 shadow-xs">
          <div className="px-2 py-1 bg-emerald-600 text-white rounded font-bold text-[11px] shrink-0">성과</div>
          <div>
            <strong className="text-emerald-900 block mb-0.5">실제 비즈니스 결과</strong>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              고객 문의 8건 전수 처리, 오안내 0건, 개인정보 노출 0건, 담당자 검토 항목 100% 식별.
            </p>
          </div>
        </div>
      </div>

      {/* 7 Harness Device Tabs & Live Editor */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">하네스 7대 구성 장치 에디터</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">교안 p.226 7대 업무장치 표준</span>
        </div>

        {/* 7 Tabs Bar */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {deviceTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDeviceTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeDeviceTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="text-[10px] font-mono px-1 rounded bg-black/10">{tab.num}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Active Tab Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono font-semibold text-blue-700">
              파일명: {deviceTabs.find(t => t.id === activeDeviceTab)?.file}
            </span>
            <span>내용을 직접 수정하여 시뮬레이션에 적용할 수 있습니다.</span>
          </div>
          <textarea
            value={harnessConfig[activeDeviceTab]}
            onChange={(e) => setHarnessConfig({ ...harnessConfig, [activeDeviceTab]: e.target.value })}
            rows={7}
            className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 leading-relaxed focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Interactive 8 Customer Inquiries Runner & Comparison */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>실제 쇼핑몰 고객 문의 8건 하네스 검증 시뮬레이터</span>
            </div>
            <p className="text-xs text-slate-500">교안 p.229~p.234 8대 실습 케이스 전수 수록</p>
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'comparison'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1:1 전후 비교 뷰
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              8건 종합 표 뷰
            </button>
          </div>
        </div>

        {/* Case Selector Pills */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CUSTOMER_INQUIRIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all flex items-center gap-1.5 font-semibold ${
                selectedCaseId === c.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 ring-1 ring-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span className="font-mono font-bold text-blue-600">#{c.id}</span>
              <span className="truncate max-w-[120px]">{c.title}</span>
            </button>
          ))}
        </div>

        {/* 1:1 Comparative View */}
        {viewMode === 'comparison' && (
          <div className="space-y-4">
            {/* Customer Original Inquiry Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  고객 원문 문의 (Case #{selectedCase.id}: {selectedCase.title})
                </span>
                {selectedCase.orderNumber && (
                  <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    주문번호: {selectedCase.orderNumber}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed font-sans">
                "{selectedCase.content}"
              </p>
            </div>

            {/* Side-by-Side: Without Harness vs With Harness */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Without Harness (DANGEROUS RAW AI) */}
              <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    하네스 미적용 (단순 프롬프트)
                  </span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold border border-rose-200">
                    위험: 임의 승인 및 보안 위반
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg text-xs text-rose-900 leading-relaxed border border-rose-200">
                  {selectedCase.rawAiResponse}
                </div>

                <div className="space-y-1 text-[11px] text-rose-800 bg-rose-100/60 p-3 rounded-lg border border-rose-200">
                  <strong className="font-bold">⚠️ 발생 문제점:</strong>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>회사 정책(반품비, 주문조회 등) 미확인 채 임의 약속</li>
                    <li>권한 밖의 환불/취소 독단적 승인 처리</li>
                    <li>담당자 에스컬레이션 체계 부재</li>
                  </ul>
                </div>
              </div>

              {/* Right: With Harness (PERFECTLY GUARDED AI) */}
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    하네스 7대 장치 적용 결과
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
                    안전: 표준 규정 및 담당자 검토
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg text-xs text-emerald-950 leading-relaxed border border-emerald-200">
                  {selectedCase.harnessAiResponse.draftResponse}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                    <span className="text-slate-500 block text-[10px]">분류 / 긴급도</span>
                    <strong className="text-emerald-800">{selectedCase.harnessAiResponse.category} / {selectedCase.harnessAiResponse.urgency}</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                    <span className="text-slate-500 block text-[10px]">담당자 승인 필요</span>
                    <strong className="text-amber-800">{selectedCase.harnessAiResponse.needsStaffReview} ({selectedCase.harnessAiResponse.reviewReason})</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8-Case Comprehensive Summary Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="p-3">번호</th>
                  <th className="p-3">문의 요약</th>
                  <th className="p-3">분류</th>
                  <th className="p-3">긴급도</th>
                  <th className="p-3">하네스 답변 초안</th>
                  <th className="p-3 text-center">담당자 확인</th>
                  <th className="p-3">확인 이유</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                {CUSTOMER_INQUIRIES.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-600">#{item.id}</td>
                    <td className="p-3 font-medium text-slate-900">{item.title}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {item.harnessAiResponse.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.harnessAiResponse.urgency === '높음'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.harnessAiResponse.urgency}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs truncate" title={item.harnessAiResponse.draftResponse}>
                      {item.harnessAiResponse.draftResponse}
                    </td>
                    <td className="p-3 font-bold text-center">
                      <span className={item.harnessAiResponse.needsStaffReview === '예' ? 'text-amber-600' : 'text-slate-400'}>
                        {item.harnessAiResponse.needsStaffReview}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 text-[11px] max-w-xs">
                      {item.harnessAiResponse.reviewReason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

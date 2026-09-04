import React, { useState } from 'react';
import { 
  FileCode2, 
  Download, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Code2, 
  Terminal, 
  Calendar, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AUTOMATION_SCRIPTS } from '../data/automationData';
import { AutomationScriptItem } from '../types';

export const AutomationHub: React.FC = () => {
  const [selectedScriptId, setSelectedScriptId] = useState<string>(AUTOMATION_SCRIPTS[0].id);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'GAS' | 'Python' | 'VBA' | 'CSV'>('ALL');
  const [copied, setCopied] = useState(false);

  const filteredScripts = activeCategory === 'ALL' 
    ? AUTOMATION_SCRIPTS 
    : AUTOMATION_SCRIPTS.filter(s => s.category === activeCategory);

  const currentScript = AUTOMATION_SCRIPTS.find(s => s.id === selectedScriptId) || AUTOMATION_SCRIPTS[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentScript.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentScript.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentScript.downloadFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'GAS':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Python':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'VBA':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CSV':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
            <FileCode2 className="w-4 h-4" />
            <span className="uppercase tracking-wider">Automated Workflow Library</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">실무 자동화 스크립트 허브</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Google Apps Script, Colab Python, Excel VBA 매크로, Google Calendar CSV 스크립트 모음입니다.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          {(['ALL', 'GAS', 'Python', 'VBA', 'CSV'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {cat === 'ALL' ? '전체 보기' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Script List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
            스크립트 선택 ({filteredScripts.length}개)
          </h3>
          <div className="space-y-2">
            {filteredScripts.map((script) => {
              const isSelected = script.id === selectedScriptId;
              return (
                <button
                  key={script.id}
                  onClick={() => setSelectedScriptId(script.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-300 shadow-sm ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getCategoryBadge(script.category)}`}>
                      {script.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 truncate">
                      {script.downloadFileName}
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                    {script.title}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer & Instructions (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header Bar */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getCategoryBadge(currentScript.category)}`}>
                    {currentScript.category}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{currentScript.downloadFileName}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{currentScript.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{currentScript.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? '복사 완료' : '코드 복사'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>다운로드</span>
                </button>
              </div>
            </div>

            {/* How to use */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>적용 및 실행 방법 (Step-by-Step)</span>
              </div>
              <ol className="space-y-1.5 text-xs text-slate-600 pl-5 list-decimal">
                {currentScript.usageSteps.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Code Viewer Container */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2 font-mono text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>{currentScript.downloadFileName}</span>
              </div>
              <span className="text-[11px] text-slate-500">{currentScript.code.split('\n').length} lines</span>
            </div>

            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[500px] overflow-y-auto">
              <code>{currentScript.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

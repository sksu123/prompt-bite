import React from 'react';
import { Award, Menu, CheckCircle2, BookOpen, Terminal, ShieldCheck, Sliders, FileCode2, CheckSquare } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  completedCount: number;
  totalSteps: number;
  userName: string;
  onOpenMobileMenu: () => void;
  onOpenCertificate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  completedCount,
  totalSteps,
  userName,
  onOpenMobileMenu,
  onOpenCertificate
}) => {
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'guide', label: '단계별 실습 가이드', icon: BookOpen },
    { id: 'playground', label: '프롬프트 공작소', icon: Terminal },
    { id: 'harness', label: '하네스 랩 (7대 장치)', icon: ShieldCheck },
    { id: 'parameters', label: '파라미터 시뮬레이터', icon: Sliders },
    { id: 'automation', label: '자동화 스크립트 허브', icon: FileCode2 },
    { id: 'quiz', label: '학습 평가 & 수료증', icon: CheckSquare }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shrink-0">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="메뉴 열기"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-sm">
                PA
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Prompt Architect AI
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 bg-slate-800 text-blue-400 text-xs rounded font-semibold uppercase tracking-wider border border-slate-700">
                  전남 AI·D 30+ 캠프
                </span>
              </div>
            </div>
          </div>

          {/* Progress & User Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Progress Gauge */}
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>진도율: <strong className="text-blue-400">{completedCount}</strong>/{totalSteps} 단계 ({progressPercent}%)</span>
              </div>
              <div className="w-32 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Certificate Button */}
            <button
              onClick={onOpenCertificate}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                progressPercent >= 50
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>수료증</span>
            </button>

            {/* User Avatar */}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-white">
                {userName.slice(0, 1) || 'U'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};


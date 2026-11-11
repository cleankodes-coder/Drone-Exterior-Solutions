import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Inbox, 
  Home, 
  Crosshair, 
  Bot, 
  Clock, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';

export const ProductTourModal: React.FC = () => {
  const { isTourOpen, setIsTourOpen, setIsSimulatorOpen, setActiveTab } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isTourOpen) return null;

  const tourSteps = [
    {
      step: 1,
      title: 'Unified Enquiry Management',
      subtitle: 'All customer leads organised in one centralized operations register',
      icon: Inbox,
      content: 'Incoming requests from your WordPress website, WhatsApp widget, and email are logged into a single dashboard. Easily search by postcode, customer, or service across Hampshire, Surrey, and West Sussex.',
      targetTab: 'enquiries'
    },
    {
      step: 2,
      title: 'Residential & Commercial Workflows',
      subtitle: 'Dedicated pipelines reflecting real exterior cleaning methods',
      icon: Home,
      content: 'Domestic roof scrapes, gutter clears, and driveway restorations follow a proven step-by-step Kanban pipeline. Commercial tenders move through structured site surveys and access reviews.',
      targetTab: 'residential'
    },
    {
      step: 3,
      title: 'Commercial Drone Survey Pipeline',
      subtitle: 'CAA airspace review, site access & method planning',
      icon: Crosshair,
      content: 'Drone cleaning is deployed where height or access warrants it. Track building height, surface area, CAA airspace NOTAMs, and site-specific RAMS. Every flight suitability decision remains strictly human-approved.',
      targetTab: 'surveys'
    },
    {
      step: 4,
      title: 'AI-Style Customer Communication',
      subtitle: 'Fast, professional UK-English message drafting',
      icon: Bot,
      content: 'Generate polished customer acknowledgements, photo requests, and survey booking proposals tailored to the specific enquiry. Review, edit, copy, and approve drafts with a single click.',
      targetTab: 'assistant'
    },
    {
      step: 5,
      title: 'Proactive Follow-Up Management',
      subtitle: 'Never let quotes go cold or photo requests slip away',
      icon: Clock,
      content: 'Automated 3-day post-quote reminders and photo request alerts keep communication flowing so you win more high-margin exterior cleaning contracts.',
      targetTab: 'followups'
    },
    {
      step: 6,
      title: 'Try Submitting a Live Demo Enquiry',
      subtitle: 'Experience the real-time intake sequence in action',
      icon: Zap,
      content: 'Launch the interactive enquiry simulator to submit a fictional domestic roof cleaning or commercial drone cleaning project and watch the command centre update immediately!',
      targetTab: 'overview'
    }
  ];

  const current = tourSteps[currentStep];
  const StepIcon = current.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setActiveTab(tourSteps[next].targetTab as any);
    } else {
      setIsTourOpen(false);
      setIsSimulatorOpen(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      setActiveTab(tourSteps[prev].targetTab as any);
    }
  };

  const handleSkip = () => {
    setIsTourOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="bg-[#0B1424] border border-[#F5B82E]/40 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#14243C] p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#F5B82E] font-bold uppercase tracking-wider bg-[#F5B82E]/10 px-2 py-0.5 rounded border border-[#F5B82E]/20">
              Step {current.step} of {tourSteps.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">60-Second Guided Tour</span>
          </div>

          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#14243C] border border-[#F5B82E]/30 text-[#F5B82E] flex items-center justify-center shadow-md shadow-[#F5B82E]/10">
            <StepIcon className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white tracking-tight">
              {current.title}
            </h2>
            <p className="text-xs text-[#F5B82E] font-medium">
              {current.subtitle}
            </p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-[#14243C] p-3.5 rounded-xl border border-white/5">
            {current.content}
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {tourSteps.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => {
                  setCurrentStep(idx);
                  setActiveTab(s.targetTab as any);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentStep === idx
                    ? 'w-6 bg-[#F5B82E]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-[#0E1A2D] border-t border-white/10 flex items-center justify-between text-xs">
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 bg-[#F5B82E] hover:bg-[#e0a423] text-[#0B1424] font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow"
            >
              <span>{currentStep === tourSteps.length - 1 ? 'Launch Live Demo' : 'Next Step'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  RotateCcw, 
  ShieldAlert, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Layers, 
  Cpu, 
  Database,
  Lock,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const DemoSettingsModal: React.FC = () => {
  const { resetAllDemoData, enquiries, quotes, followUps, showToast } = useApp();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleConfirmReset = () => {
    resetAllDemoData();
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#14243C] to-[#0B1424] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-4 h-4 text-[#F5B82E]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5B82E]">
              System Configuration & Architecture
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Sales Demo Settings & Integration Proposal
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Review how this command centre is designed to seamlessly overlay your existing WordPress site without disrupting daily operations.
          </p>
        </div>
      </div>

      {/* Demo Reset Card */}
      <div className="p-5 rounded-xl bg-[#14243C] border border-white/8 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#F5B82E]" />
              <span>Reset Local Demo Data</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Restore the original 15 fictional UK enquiry records, seed quotations, follow-up tasks, and scheduled calendar operations. This cleans your browser localStorage.
            </p>
          </div>

          {!isResetConfirmOpen ? (
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-4 py-2 bg-[#0B1424] hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer"
            >
              Reset to Factory Seed
            </button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleConfirmReset}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-white/5 font-mono">
          <span>Active Inquiries: {enquiries.length}</span>
          <span>·</span>
          <span>Active Quotes: {quotes.length}</span>
          <span>·</span>
          <span>Pending Follow-ups: {followUps.length}</span>
        </div>
      </div>

      {/* Future WordPress Architecture Panel */}
      <div className="p-5 rounded-xl bg-[#14243C] border border-white/8 space-y-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#F5B82E] block">
            Future Architecture Blueprint
          </span>
          <h2 className="text-base font-bold text-white mt-1">
            How this could work with your existing WordPress website
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Drone Exterior Solutions currently uses a WordPress website with residential and commercial quotation forms, customer photo uploads, and a WhatsApp contact widget. You do not need to rebuild your website.
          </p>
        </div>

        {/* 4-Step Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#0B1424] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Globe className="w-4 h-4" />
              <span>Step 1: Website</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Customer submits existing form or sends WhatsApp message with property photos.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B1424] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold">
              <Cpu className="w-4 h-4" />
              <span>Step 2: Integration</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Secure webhook relays the payload into your private operations database in under 2 seconds.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B1424] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-[#F5B82E] font-bold">
              <Layers className="w-4 h-4" />
              <span>Step 3: AI Triage</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              System checks postcodes, categorizes residential vs commercial, and checks CAA airspace buffers.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0B1424] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Step 4: Human Review</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Scott and team review quote drafts, approve drone flights, and dispatch customer updates.
            </p>
          </div>
        </div>

        {/* Technical Boundaries Disclosure */}
        <div className="p-4 rounded-xl bg-[#0B1424] border border-white/10 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-bold">
            <Lock className="w-4 h-4 text-[#F5B82E]" />
            <span>Interactive Demo Scope & Transparency Disclosure</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            This interactive preview demonstrates a proposed workflow for <strong>Drone Exterior Solutions Ltd</strong>. All customer records are fictional and all integrations, AI outputs, messaging and automations are simulated. No live business systems, WordPress webhooks, or third-party APIs are connected.
          </p>
          <p className="text-[11px] text-slate-400">
            Scott P. and his team have not formally approved or endorsed this software; it has been prepared strictly as a professional concept preview to illustrate what is digitally possible.
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Inbox, 
  Home, 
  Building2, 
  Crosshair, 
  FileText, 
  Bot, 
  Clock, 
  Calendar, 
  History, 
  Settings, 
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileNavOpen: boolean;
  onCloseMobileNav: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileNavOpen,
  onCloseMobileNav
}) => {
  const { 
    activeTab, 
    setActiveTab, 
    enquiries, 
    followUps, 
    quotes, 
    setIsSimulatorOpen 
  } = useApp();

  // Dynamic counts for badge indicators
  const totalEnquiries = enquiries.length;
  const pendingSurveys = enquiries.filter(e => 
    e.droneSurvey && (e.droneSurvey.suitabilityDecision === 'In Progress' || e.droneSurvey.suitabilityDecision === 'Awaiting Review')
  ).length;
  const dueFollowUps = followUps.filter(f => f.status === 'Pending').length;
  const pendingQuotes = quotes.filter(q => q.status === 'Draft' || q.status === 'Awaiting Approval').length;

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'enquiries', label: 'All Enquiries', icon: Inbox, badge: totalEnquiries },
    { id: 'residential', label: 'Residential Jobs', icon: Home },
    { id: 'commercial', label: 'Commercial Projects', icon: Building2 },
    { 
      id: 'surveys', 
      label: 'Drone Surveys', 
      icon: Crosshair, 
      badge: pendingSurveys > 0 ? pendingSurveys : undefined,
      badgeColor: 'bg-[#F5B82E] text-[#0B1424]'
    },
    { 
      id: 'quotes', 
      label: 'Quotations', 
      icon: FileText,
      badge: pendingQuotes > 0 ? pendingQuotes : undefined
    },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { 
      id: 'followups', 
      label: 'Follow-ups', 
      icon: Clock, 
      badge: dueFollowUps > 0 ? dueFollowUps : undefined,
      badgeColor: 'bg-amber-500/20 text-[#F5B82E]'
    },
    { id: 'calendar', label: 'Calendar / Schedule', icon: Calendar },
    { id: 'activity', label: 'Activity Log', icon: History },
    { id: 'settings', label: 'Demo Settings', icon: Settings }
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    onCloseMobileNav();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={onCloseMobileNav}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#0B1424] border-r border-white/8 flex flex-col transition-all duration-300 ease-in-out ${
          isMobileNavOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-white/8 flex items-center justify-between px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F5B82E] to-[#cf9017] flex items-center justify-center text-[#0B1424] font-black shrink-0 shadow-lg shadow-[#F5B82E]/10">
              <span className="text-base tracking-tighter">DES</span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="font-bold text-white text-sm tracking-tight block truncate">
                  Drone Exterior
                </span>
                <span className="text-[10px] text-slate-400 block truncate font-mono">
                  CAA Auth. Spec. Ops
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Live Simulator Promo Card (expanded only) */}
        {!isCollapsed && (
          <div className="p-3 mx-3 my-2.5 rounded-xl bg-gradient-to-br from-[#14243C] to-[#0d1829] border border-[#F5B82E]/30 relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#F5B82E]" />
              <span className="text-xs font-semibold text-white">Interactive Demo</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
              Experience the enquiry-to-quotation workflow in real time.
            </p>
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="w-full py-1.5 px-2 bg-[#F5B82E] hover:bg-[#e0a423] text-[#0B1424] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow cursor-pointer"
            >
              <span>Try Live Enquiry Demo</span>
            </button>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative cursor-pointer ${
                  isActive
                    ? 'bg-[#14243C] text-[#F5B82E] shadow-sm border border-[#F5B82E]/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#F5B82E]' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!isCollapsed && item.badge !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono font-medium shrink-0 ${
                      item.badgeColor || 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Tooltip on collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#14243C] border border-white/15 text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {item.label}
                    {item.badge !== undefined && ` (${item.badge})`}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / Concept Demo Disclosure */}
        <div className="p-3 border-t border-white/8 bg-[#080E1A]">
          {!isCollapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#F5B82E]" />
                  Concept Preview
                </span>
                <span className="font-mono text-[10px] text-slate-500">v1.2 Sales Demo</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Simulated operations workflow for Drone Exterior Solutions Ltd. Fictional client data.
              </p>
              <a
                href="https://droneexteriorsolutions.co.uk/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-[#F5B82E] hover:underline"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          ) : (
            <div className="flex justify-center text-slate-500" title="Concept Demo">
              <Shield className="w-4 h-4 text-[#F5B82E]" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

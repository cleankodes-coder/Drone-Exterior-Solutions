import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Search, 
  Sparkles, 
  HelpCircle, 
  CheckCheck, 
  Menu, 
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface TopBarProps {
  onToggleMobileNav: () => void;
  isMobileNavOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleMobileNav, isMobileNavOpen }) => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    setIsSimulatorOpen, 
    setIsTourOpen,
    enquiries,
    setSelectedEnquiryId,
    setActiveTab
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Filtered search results
  const searchResults = searchQuery.trim() === '' ? [] : enquiries.filter(e => 
    e.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.companyName && e.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 5);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSearchResult = (enquiryId: string) => {
    setSelectedEnquiryId(enquiryId);
    setActiveTab('enquiries');
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B1424]/95 backdrop-blur-md border-b border-white/8 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Nav toggle + Breadcrumb / Brand */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          aria-label="Toggle navigation"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5">
          {/* Hexagon/drone logo mark */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F5B82E] to-[#D99A15] flex items-center justify-center text-[#0B1424] font-bold shadow-md shadow-[#F5B82E]/10 shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>
          <div className="min-w-0 hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm tracking-tight truncate">
                Drone Exterior Solutions
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F5B82E] px-1.5 py-0.5 rounded bg-[#F5B82E]/10 border border-[#F5B82E]/20">
                Command Centre
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              Residential · Commercial · Specialist Drone Cleaning Operations
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Fast Search Bar */}
      <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search enquiries, postcodes, clients or services..."
            className="w-full bg-[#14243C]/90 text-sm text-slate-200 placeholder-slate-400 pl-9 pr-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[#F5B82E]/50 focus:ring-1 focus:ring-[#F5B82E]/30 transition-all"
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchFocused && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#14243C] border border-white/15 rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5 bg-[#0B1424]/40">
              Matching Enquiries ({searchResults.length})
            </div>
            <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectSearchResult(result.id)}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-white/5 flex items-center justify-between gap-3 transition-colors group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#F5B82E]">{result.id}</span>
                      <span className="font-medium text-sm text-white truncate">{result.customerName}</span>
                      {result.companyName && (
                        <span className="text-xs text-slate-400 truncate">({result.companyName})</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 truncate mt-0.5">
                      {result.service} · {result.location}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#F5B82E] shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Live Simulator CTA Button */}
        <button
          onClick={() => setIsSimulatorOpen(true)}
          className="relative inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-[#0B1424] bg-[#F5B82E] hover:bg-[#e0a423] rounded-lg shadow-md shadow-[#F5B82E]/15 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0B1424]" />
          <span>Try Live Enquiry Demo</span>
        </button>

        {/* Tour Button */}
        <button
          onClick={() => setIsTourOpen(true)}
          title="60-Second Guided Tour"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-[#14243C] hover:bg-[#1E3557] border border-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#F5B82E]" />
          <span>Take Tour</span>
        </button>

        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#F5B82E] text-[#0B1424] font-bold text-[10px] rounded-full flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#14243C] border border-white/15 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-[#0B1424]/60">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">Operations Activity</span>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-[#F5B82E]/20 text-[#F5B82E] px-2 py-0.5 rounded-full font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-slate-400 hover:text-[#F5B82E] flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active notifications.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.enquiryId) {
                          setSelectedEnquiryId(notif.enquiryId);
                          setActiveTab('enquiries');
                          setIsNotifOpen(false);
                        }
                      }}
                      className={`p-3.5 text-left hover:bg-white/5 transition-colors cursor-pointer flex gap-3 ${
                        !notif.read ? 'bg-[#0B1424]/40' : ''
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#F5B82E]" style={{ opacity: notif.read ? 0.2 : 1 }} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs ${notif.read ? 'text-slate-300' : 'text-white font-medium'}`}>
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill: Illustrative Administrator Preview */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-[#1E3557] border border-white/15 flex items-center justify-center text-xs font-bold text-[#F5B82E] shadow-inner">
            SP
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
              <span>Scott P.</span>
              <ShieldCheck className="w-3 h-3 text-[#F5B82E]" />
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              Administrator (Demo)
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

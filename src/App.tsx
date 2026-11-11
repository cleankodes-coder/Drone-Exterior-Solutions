import React, { useState } from 'react';
import { AppProvider, useApp, NavigationTab } from './context/AppContext';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/Toast';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { EnquiryList } from './components/enquiries/EnquiryList';
import { ResidentialWorkflow } from './components/residential/ResidentialWorkflow';
import { CommercialDroneWorkflow } from './components/commercial/CommercialDroneWorkflow';
import { QuotationManager } from './components/quotations/QuotationManager';
import { AIAssistantModal } from './components/assistant/AIAssistantModal';
import { FollowUpCentre } from './components/followups/FollowUpCentre';
import { OperationsCalendar } from './components/calendar/OperationsCalendar';
import { ActivityLogView } from './components/activity/ActivityLogView';
import { DemoSettingsModal } from './components/settings/DemoSettingsModal';
import { DemoSimulatorModal } from './components/simulator/DemoSimulatorModal';
import { ProductTourModal } from './components/tour/ProductTourModal';
import { EnquiryRecord, Quotation } from './types';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Assistant modal triggered from specific enquiry
  const [assistantTargetEnquiryId, setAssistantTargetEnquiryId] = useState<string | null>(null);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);

  // Quote creator targeted from specific enquiry
  const [quoteToEdit, setQuoteToEdit] = useState<Quotation | null>(null);

  const handleOpenAssistantForEnquiry = (enquiryId: string) => {
    setAssistantTargetEnquiryId(enquiryId);
    setIsAssistantModalOpen(true);
  };

  const handleCreateQuoteForEnquiry = (enquiry: EnquiryRecord) => {
    setActiveTab('quotes');
  };

  return (
    <div className="min-h-screen bg-[#0B1424] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <TopBar 
        onToggleMobileNav={() => setIsMobileNavOpen(prev => !prev)} 
        isMobileNavOpen={isMobileNavOpen}
      />

      {/* Main Body */}
      <div className="flex flex-1 relative">
        {/* Responsive Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          isMobileNavOpen={isMobileNavOpen}
          onCloseMobileNav={() => setIsMobileNavOpen(false)}
        />

        {/* Dynamic Main Viewport */}
        <main
          className={`flex-1 min-w-0 transition-all duration-300 ease-in-out p-4 sm:p-6 lg:p-8 ${
            isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'overview' && <OverviewDashboard />}
            {activeTab === 'enquiries' && (
              <EnquiryList 
                onOpenAssistantForEnquiry={handleOpenAssistantForEnquiry}
                onCreateQuoteForEnquiry={handleCreateQuoteForEnquiry}
              />
            )}
            {activeTab === 'residential' && <ResidentialWorkflow />}
            {activeTab === 'commercial' && <CommercialDroneWorkflow />}
            {activeTab === 'surveys' && <CommercialDroneWorkflow />}
            {activeTab === 'quotes' && <QuotationManager initialQuoteToEdit={quoteToEdit} />}
            {activeTab === 'assistant' && <AIAssistantModal />}
            {activeTab === 'followups' && (
              <FollowUpCentre onOpenAssistantForEnquiry={handleOpenAssistantForEnquiry} />
            )}
            {activeTab === 'calendar' && <OperationsCalendar />}
            {activeTab === 'activity' && <ActivityLogView />}
            {activeTab === 'settings' && <DemoSettingsModal />}
          </div>
        </main>
      </div>

      {/* Persistent Toast Notifications */}
      <ToastContainer />

      {/* Live Enquiry Demo Simulator Modal */}
      <DemoSimulatorModal onOpenAssistantForEnquiry={handleOpenAssistantForEnquiry} />

      {/* Product Tour Modal */}
      <ProductTourModal />

      {/* Dedicated Assistant Modal when triggered from enquiry card */}
      {isAssistantModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#0B1424] border border-white/20 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden p-4 sm:p-6 my-auto">
            <AIAssistantModal
              initialEnquiryId={assistantTargetEnquiryId}
              onClose={() => setIsAssistantModalOpen(false)}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

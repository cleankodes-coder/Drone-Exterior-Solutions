import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  EnquiryRecord, 
  Quotation, 
  FollowUpItem, 
  CalendarAppointment, 
  ActivityNotification,
  EnquiryStatus,
  ActivityHistoryItem,
  InternalNote,
  DroneSurveyDetails
} from '../types';
import { 
  INITIAL_ENQUIRIES, 
  INITIAL_QUOTES, 
  INITIAL_FOLLOW_UPS, 
  INITIAL_CALENDAR_APPOINTMENTS, 
  INITIAL_NOTIFICATIONS 
} from '../data/seedData';

export type NavigationTab = 
  | 'overview'
  | 'enquiries'
  | 'residential'
  | 'commercial'
  | 'surveys'
  | 'quotes'
  | 'assistant'
  | 'followups'
  | 'calendar'
  | 'activity'
  | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  enquiries: EnquiryRecord[];
  quotes: Quotation[];
  followUps: FollowUpItem[];
  appointments: CalendarAppointment[];
  notifications: ActivityNotification[];
  selectedEnquiryId: string | null;
  setSelectedEnquiryId: (id: string | null) => void;
  selectedEnquiry: EnquiryRecord | null;
  
  // Simulator & Tour states
  isSimulatorOpen: boolean;
  setIsSimulatorOpen: (open: boolean) => void;
  isTourOpen: boolean;
  setIsTourOpen: (open: boolean) => void;
  
  // Toast notifications
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  dismissToast: (id: string) => void;
  
  // Enquiry CRUD & actions
  addEnquiry: (enquiry: Omit<EnquiryRecord, 'id' | 'activityHistory' | 'dateReceived'>) => EnquiryRecord;
  updateEnquiry: (id: string, updates: Partial<EnquiryRecord>) => void;
  updateEnquiryStatus: (id: string, status: EnquiryStatus, note?: string) => void;
  deleteEnquiry: (id: string) => void;
  addInternalNote: (enquiryId: string, noteText: string, author?: string) => void;
  updateDroneSurvey: (enquiryId: string, surveyUpdates: Partial<DroneSurveyDetails>) => void;
  
  // Quotations
  addQuote: (quote: Omit<Quotation, 'id' | 'createdAt'>) => Quotation;
  updateQuote: (id: string, updates: Partial<Quotation>) => void;
  simulateSendQuote: (quoteId: string) => void;
  deleteQuote: (id: string) => void;
  
  // Follow-ups
  addFollowUp: (followUp: Omit<FollowUpItem, 'id'>) => FollowUpItem;
  updateFollowUp: (id: string, updates: Partial<FollowUpItem>) => void;
  completeFollowUp: (id: string) => void;
  deleteFollowUp: (id: string) => void;
  
  // Calendar Appointments
  addAppointment: (appointment: Omit<CalendarAppointment, 'id'>) => CalendarAppointment;
  updateAppointment: (id: string, updates: Partial<CalendarAppointment>) => void;
  deleteAppointment: (id: string) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // System Reset
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ENQUIRIES: 'des_command_enquiries_v1',
  QUOTES: 'des_command_quotes_v1',
  FOLLOW_UPS: 'des_command_followups_v1',
  APPOINTMENTS: 'des_command_appointments_v1',
  NOTIFICATIONS: 'des_command_notifications_v1',
  TOUR_SEEN: 'des_command_tour_seen_v1'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initialize from localStorage or fallback to seed data
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return stored ? JSON.parse(stored) : INITIAL_ENQUIRIES;
    } catch {
      return INITIAL_ENQUIRIES;
    }
  });

  const [quotes, setQuotes] = useState<Quotation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUOTES);
      return stored ? JSON.parse(stored) : INITIAL_QUOTES;
    } catch {
      return INITIAL_QUOTES;
    }
  });

  const [followUps, setFollowUps] = useState<FollowUpItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FOLLOW_UPS);
      return stored ? JSON.parse(stored) : INITIAL_FOLLOW_UPS;
    } catch {
      return INITIAL_FOLLOW_UPS;
    }
  });

  const [appointments, setAppointments] = useState<CalendarAppointment[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return stored ? JSON.parse(stored) : INITIAL_CALENDAR_APPOINTMENTS;
    } catch {
      return INITIAL_CALENDAR_APPOINTMENTS;
    }
  });

  const [notifications, setNotifications] = useState<ActivityNotification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [enquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [quotes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(followUps));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [followUps]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [notifications]);

  // Check if tour should open on first visit
  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEYS.TOUR_SEEN);
      if (!seen) {
        // Small delay so user sees dashboard first
        const t = setTimeout(() => {
          setIsTourOpen(true);
          localStorage.setItem(STORAGE_KEYS.TOUR_SEEN, 'true');
        }, 800);
        return () => clearTimeout(t);
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const selectedEnquiry = useMemo(() => {
    if (!selectedEnquiryId) return null;
    return enquiries.find(e => e.id === selectedEnquiryId) || null;
  }, [enquiries, selectedEnquiryId]);

  // Actions
  const addEnquiry = (enquiryData: Omit<EnquiryRecord, 'id' | 'activityHistory' | 'dateReceived'>): EnquiryRecord => {
    const nextNumber = enquiries.length + 1;
    const newId = `ENQ-2026-${String(nextNumber).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newRecord: EnquiryRecord = {
      ...enquiryData,
      id: newId,
      dateReceived: now,
      activityHistory: [
        {
          id: `act-${Date.now()}`,
          timestamp: now,
          action: `Enquiry logged via ${enquiryData.contactMethod}`,
          actor: 'Operations System'
        }
      ]
    };

    setEnquiries(prev => [newRecord, ...prev]);

    // Push system notification
    const newNotif: ActivityNotification = {
      id: `notif-${Date.now()}`,
      timestamp: now,
      type: 'enquiry',
      title: 'New Enquiry Logged',
      message: `${newRecord.customerName} - ${newRecord.service} (${newRecord.location})`,
      enquiryId: newId,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('success', 'Enquiry Created', `Added ${newId} for ${newRecord.customerName}`);
    return newRecord;
  };

  const updateEnquiry = (id: string, updates: Partial<EnquiryRecord>) => {
    setEnquiries(prev => prev.map(item => {
      if (item.id !== id) return item;
      return { ...item, ...updates };
    }));
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus, note?: string) => {
    const now = new Date().toISOString();
    setEnquiries(prev => prev.map(item => {
      if (item.id !== id) return item;
      const historyItem: ActivityHistoryItem = {
        id: `act-${Date.now()}`,
        timestamp: now,
        action: `Status changed from "${item.status}" to "${status}"`,
        actor: 'Scott P.',
        details: note
      };
      const updatedNotes = note ? [
        ...item.notes,
        {
          id: `note-${Date.now()}`,
          author: 'Scott P.',
          timestamp: now,
          text: `[Status Change to ${status}] ${note}`
        }
      ] : item.notes;

      return {
        ...item,
        status,
        notes: updatedNotes,
        activityHistory: [historyItem, ...item.activityHistory]
      };
    }));

    showToast('info', 'Status Updated', `Enquiry ${id} set to ${status}`);
  };

  const deleteEnquiry = (id: string) => {
    const record = enquiries.find(e => e.id === id);
    setEnquiries(prev => prev.filter(e => e.id !== id));
    if (selectedEnquiryId === id) setSelectedEnquiryId(null);
    showToast('warning', 'Enquiry Removed', `Deleted ${id} (${record?.customerName || ''})`);
  };

  const addInternalNote = (enquiryId: string, noteText: string, author = 'Scott P.') => {
    if (!noteText.trim()) return;
    const now = new Date().toISOString();
    const newNote: InternalNote = {
      id: `note-${Date.now()}`,
      author,
      timestamp: now,
      text: noteText.trim()
    };
    const historyItem: ActivityHistoryItem = {
      id: `act-${Date.now()}`,
      timestamp: now,
      action: 'Internal Note Added',
      actor: author,
      details: noteText.trim()
    };

    setEnquiries(prev => prev.map(item => {
      if (item.id !== enquiryId) return item;
      return {
        ...item,
        notes: [newNote, ...item.notes],
        activityHistory: [historyItem, ...item.activityHistory]
      };
    }));

    showToast('success', 'Note Added', 'Internal operations note recorded');
  };

  const updateDroneSurvey = (enquiryId: string, surveyUpdates: Partial<DroneSurveyDetails>) => {
    const now = new Date().toISOString();
    setEnquiries(prev => prev.map(item => {
      if (item.id !== enquiryId || !item.droneSurvey) return item;
      const updatedSurvey = { ...item.droneSurvey, ...surveyUpdates };
      const historyItem: ActivityHistoryItem = {
        id: `act-${Date.now()}`,
        timestamp: now,
        action: 'Drone Survey Details & RAMS Updated',
        actor: updatedSurvey.assignedReviewer || 'Scott P.'
      };
      return {
        ...item,
        droneSurvey: updatedSurvey,
        activityHistory: [historyItem, ...item.activityHistory]
      };
    }));
    showToast('info', 'Survey Updated', 'Operational drone assessment parameters saved');
  };

  // Quotes
  const addQuote = (quoteData: Omit<Quotation, 'id' | 'createdAt'>): Quotation => {
    const nextNum = quotes.length + 83;
    const quoteId = `QUO-2026-${String(nextNum).padStart(3, '0')}`;
    const quoteNumber = `DES-2026-${String(nextNum).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newQuote: Quotation = {
      ...quoteData,
      id: quoteId,
      quoteNumber,
      createdAt: now
    };

    setQuotes(prev => [newQuote, ...prev]);

    // Link quote back to enquiry
    if (quoteData.enquiryId) {
      setEnquiries(prev => prev.map(e => {
        if (e.id !== quoteData.enquiryId) return e;
        return {
          ...e,
          quoteId,
          sampleQuoteAmount: quoteData.totalAmount,
          status: 'Quote Sent'
        };
      }));
    }

    showToast('success', 'Quotation Created', `Drafted ${quoteNumber} for £${newQuote.totalAmount.toLocaleString('en-GB')}`);
    return newQuote;
  };

  const updateQuote = (id: string, updates: Partial<Quotation>) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
    showToast('info', 'Quote Updated', `Saved changes to quotation`);
  };

  const simulateSendQuote = (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;
    const now = new Date().toISOString();

    setQuotes(prev => prev.map(q => {
      if (q.id !== quoteId) return q;
      return { ...q, status: 'Sent', sentDate: now };
    }));

    // Update enquiry status as well
    if (quote.enquiryId) {
      updateEnquiryStatus(quote.enquiryId, 'Quote Sent', `Formal quotation ${quote.quoteNumber} (£${quote.totalAmount}) dispatched to ${quote.customerName}`);
    }

    // Add follow-up automatically for 3 days ahead
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 3);
    const newFollowUp: FollowUpItem = {
      id: `FOL-${Date.now()}`,
      enquiryId: quote.enquiryId,
      customerName: quote.customerName,
      service: quote.service,
      location: quote.siteAddress,
      dueDate: followUpDate.toISOString(),
      priority: 'Medium',
      reason: 'Quote follow-up check-in (3 days post dispatch)',
      suggestedAction: 'Send courteous follow-up email or call to discuss questions and booking schedule.',
      status: 'Pending'
    };
    setFollowUps(prev => [newFollowUp, ...prev]);

    showToast('success', 'Quote Dispatched (Simulated)', `Quote ${quote.quoteNumber} marked as sent. 3-day follow-up task scheduled.`);
  };

  const deleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    showToast('warning', 'Quote Deleted', `Removed quote from register`);
  };

  // Follow-ups
  const addFollowUp = (data: Omit<FollowUpItem, 'id'>): FollowUpItem => {
    const newFollowUp: FollowUpItem = {
      ...data,
      id: `FOL-${Date.now()}`
    };
    setFollowUps(prev => [newFollowUp, ...prev]);
    showToast('success', 'Follow-up Scheduled', `Reminder set for ${data.customerName}`);
    return newFollowUp;
  };

  const updateFollowUp = (id: string, updates: Partial<FollowUpItem>) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const completeFollowUp = (id: string) => {
    const target = followUps.find(f => f.id === id);
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, status: 'Completed' } : f));
    if (target?.enquiryId) {
      const now = new Date().toISOString();
      setEnquiries(prev => prev.map(e => {
        if (e.id !== target.enquiryId) return e;
        return {
          ...e,
          activityHistory: [
            {
              id: `act-${Date.now()}`,
              timestamp: now,
              action: `Follow-up completed: ${target.reason}`,
              actor: 'Scott P.'
            },
            ...e.activityHistory
          ]
        };
      }));
    }
    showToast('success', 'Follow-up Completed', 'Task resolved and logged to timeline');
  };

  const deleteFollowUp = (id: string) => {
    setFollowUps(prev => prev.filter(f => f.id !== id));
  };

  // Appointments
  const addAppointment = (data: Omit<CalendarAppointment, 'id'>): CalendarAppointment => {
    const newAppt: CalendarAppointment = {
      ...data,
      id: `CAL-${Date.now()}`
    };
    setAppointments(prev => [...prev, newAppt]);
    showToast('success', 'Appointment Booked', `${data.title} on ${data.date}`);
    return newAppt;
  };

  const updateAppointment = (id: string, updates: Partial<CalendarAppointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    showToast('info', 'Schedule Updated', 'Appointment details modified');
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    showToast('warning', 'Appointment Cancelled', 'Removed from operations calendar');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('info', 'Notifications Cleared', 'All alerts marked as read');
  };

  // Reset to original seed data
  const resetAllDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.ENQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.QUOTES);
    localStorage.removeItem(STORAGE_KEYS.FOLLOW_UPS);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    
    setEnquiries(INITIAL_ENQUIRIES);
    setQuotes(INITIAL_QUOTES);
    setFollowUps(INITIAL_FOLLOW_UPS);
    setAppointments(INITIAL_CALENDAR_APPOINTMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedEnquiryId(null);
    setActiveTab('overview');

    showToast('info', 'Demo Data Reset', 'Restored pristine sample records for Drone Exterior Solutions');
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      enquiries,
      quotes,
      followUps,
      appointments,
      notifications,
      selectedEnquiryId,
      setSelectedEnquiryId,
      selectedEnquiry,
      isSimulatorOpen,
      setIsSimulatorOpen,
      isTourOpen,
      setIsTourOpen,
      toasts,
      showToast,
      dismissToast,
      addEnquiry,
      updateEnquiry,
      updateEnquiryStatus,
      deleteEnquiry,
      addInternalNote,
      updateDroneSurvey,
      addQuote,
      updateQuote,
      simulateSendQuote,
      deleteQuote,
      addFollowUp,
      updateFollowUp,
      completeFollowUp,
      deleteFollowUp,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      markNotificationRead,
      markAllNotificationsRead,
      resetAllDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

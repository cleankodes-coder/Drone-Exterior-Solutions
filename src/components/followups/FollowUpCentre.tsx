import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FollowUpItem } from '../../types';
import { 
  Clock, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  AlertCircle, 
  Send, 
  Copy, 
  Bot, 
  Check, 
  Trash2, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface FollowUpCentreProps {
  onOpenAssistantForEnquiry: (enquiryId: string) => void;
}

export const FollowUpCentre: React.FC<FollowUpCentreProps> = ({ onOpenAssistantForEnquiry }) => {
  const { 
    followUps, 
    completeFollowUp, 
    deleteFollowUp, 
    addFollowUp, 
    updateFollowUp, 
    enquiries, 
    setSelectedEnquiryId,
    showToast 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'due' | 'completed'>('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New follow-up form state
  const [targetEnquiryId, setTargetEnquiryId] = useState(enquiries[0]?.id || '');
  const [customerName, setCustomerName] = useState(enquiries[0]?.customerName || '');
  const [service, setService] = useState(enquiries[0]?.service || '');
  const [location, setLocation] = useState(enquiries[0]?.location || '');
  const [reason, setReason] = useState('Quote review follow-up after 48 hours');
  const [suggestedAction, setSuggestedAction] = useState('Telephone client to confirm receipt of estimate and answer any queries');
  const [priority, setPriority] = useState<FollowUpItem['priority']>('High');

  // Filter items
  const filteredItems = followUps.filter(f => {
    if (activeFilter === 'due') return f.status === 'Pending';
    if (activeFilter === 'completed') return f.status === 'Completed';
    return true;
  });

  const pendingCount = followUps.filter(f => f.status === 'Pending').length;
  const completedCount = followUps.filter(f => f.status === 'Completed').length;

  const handleSelectEnquiry = (enqId: string) => {
    setTargetEnquiryId(enqId);
    const enq = enquiries.find(e => e.id === enqId);
    if (enq) {
      setCustomerName(enq.customerName);
      setService(enq.service);
      setLocation(enq.location);
    }
  };

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    const d = new Date();
    d.setDate(d.getDate() + 2);

    addFollowUp({
      enquiryId: targetEnquiryId,
      customerName,
      service,
      location,
      dueDate: d.toISOString(),
      priority,
      reason,
      suggestedAction,
      status: 'Pending'
    });

    setIsNewModalOpen(false);
  };

  const handleQuickCopyAction = (item: FollowUpItem) => {
    const text = `Follow-up on ${item.service} for ${item.customerName} (${item.location}): ${item.suggestedAction}`;
    navigator.clipboard.writeText(text);
    showToast('info', 'Action Copied', 'Follow-up action copied to clipboard');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#14243C] to-[#0B1424] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Customer Retention & Follow-up Queue
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">{pendingCount} Actions Requiring Contact</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Follow-Up & Administrative Tasks
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Never let a hot quote go cold or a photo request get forgotten. Track scheduled check-ins, surveyor recalls, and customer updates.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-3.5 py-2 bg-[#F5B82E] hover:bg-[#e0a423] text-[#0B1424] font-bold text-xs rounded-lg transition-all shadow flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Follow-Up</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`py-1 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#1E3557] text-[#F5B82E]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Tasks ({followUps.length})
        </button>
        <button
          onClick={() => setActiveFilter('due')}
          className={`py-1 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
            activeFilter === 'due'
              ? 'bg-[#1E3557] text-amber-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Pending / Due Today ({pendingCount})
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`py-1 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
            activeFilter === 'completed'
              ? 'bg-[#1E3557] text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Task List Grid */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-[#14243C] rounded-xl border border-white/8">
            No follow-up items in this view.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isCompleted = item.status === 'Completed';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-[#0E1A2D] border-white/5 opacity-60'
                    : 'bg-[#14243C] border-white/8 hover:border-amber-400/40 shadow-sm'
                }`}
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-[#F5B82E] font-medium">{item.id}</span>
                    <span className="text-slate-500">·</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-300' :
                      item.priority === 'High' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {item.priority} Priority
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-xs text-slate-400">
                      Due: {new Date(item.dueDate).toLocaleDateString('en-GB')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">
                    {item.customerName}
                    <span className="text-xs font-normal text-slate-300 ml-2">
                      ({item.service} · {item.location})
                    </span>
                  </h3>

                  <p className="text-xs font-medium text-amber-300">
                    Reason: {item.reason}
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed bg-[#0B1424] p-2 rounded border border-white/5">
                    <strong className="text-slate-300">Suggested Action:</strong> {item.suggestedAction}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {!isCompleted ? (
                    <>
                      <button
                        onClick={() => onOpenAssistantForEnquiry(item.enquiryId)}
                        className="px-2.5 py-1.5 text-xs bg-[#1E3557] hover:bg-[#25426c] text-[#F5B82E] font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                        title="Draft message via AI Assistant"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Draft Note</span>
                      </button>

                      <button
                        onClick={() => handleQuickCopyAction(item)}
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg"
                        title="Copy action text"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => completeFollowUp(item.id)}
                        className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Done</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed
                      </span>
                      <button
                        onClick={() => deleteFollowUp(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove completed follow-up"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedEnquiryId(item.enquiryId)}
                    className="p-1.5 text-slate-400 hover:text-white"
                    title="Open Enquiry Record"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Follow-Up Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14243C] border border-white/15 p-5 rounded-2xl max-w-lg w-full space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F5B82E]" />
              <span>Create Customer Follow-Up</span>
            </h3>

            <form onSubmit={handleCreateFollowUp} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Select Enquiry</label>
                <select
                  value={targetEnquiryId}
                  onChange={(e) => handleSelectEnquiry(e.target.value)}
                  className="w-full bg-[#0B1424] text-white p-2.5 rounded-lg border border-white/10"
                >
                  {enquiries.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.id} — {e.customerName} ({e.service})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Follow-up Reason *</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Unanswered quote after 3 days"
                  className="w-full bg-[#0B1424] text-white p-2.5 rounded-lg border border-white/10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Suggested Next Action *</label>
                <textarea
                  rows={2}
                  required
                  value={suggestedAction}
                  onChange={(e) => setSuggestedAction(e.target.value)}
                  placeholder="e.g. Call client to discuss access and water flow rate"
                  className="w-full bg-[#0B1424] text-white p-2.5 rounded-lg border border-white/10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-[#0B1424] text-white p-2.5 rounded-lg border border-white/10"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3.5 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#F5B82E] text-[#0B1424] font-bold rounded-lg cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

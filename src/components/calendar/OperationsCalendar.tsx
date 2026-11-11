import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarAppointment } from '../../types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Crosshair, 
  Home, 
  Building2, 
  X,
  CheckCircle,
  UserCheck
} from 'lucide-react';

export const OperationsCalendar: React.FC = () => {
  const { appointments, addAppointment, updateAppointment, deleteAppointment, enquiries } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<CalendarAppointment | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New appointment form state
  const [targetEnquiryId, setTargetEnquiryId] = useState(enquiries[0]?.id || '');
  const [title, setTitle] = useState('Domestic Roof Moss Softwash');
  const [customerName, setCustomerName] = useState(enquiries[0]?.customerName || '');
  const [location, setLocation] = useState(enquiries[0]?.location || 'Guildford, Surrey');
  const [type, setType] = useState<CalendarAppointment['type']>('Residential Cleaning');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [durationHours, setDurationHours] = useState(4);
  const [assignedTeam, setAssignedTeam] = useState('Dave M., Mark R.');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar matrix calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Mon = 0

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      enquiryId: targetEnquiryId,
      title,
      customerName,
      location,
      type,
      date,
      time,
      durationHours,
      status: 'Scheduled',
      assignedTeam: assignedTeam.split(',').map(s => s.trim())
    });
    setIsNewModalOpen(false);
  };

  const handleSelectEnquiry = (enqId: string) => {
    setTargetEnquiryId(enqId);
    const enq = enquiries.find(e => e.id === enqId);
    if (enq) {
      setCustomerName(enq.customerName);
      setLocation(enq.location);
      setTitle(`${enq.service} - ${enq.customerName}`);
      setType(enq.division === 'drone_specialist' ? 'Drone Survey' : enq.division === 'commercial' ? 'Commercial Cleaning' : 'Residential Cleaning');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#14243C] to-[#0B1424] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="w-4 h-4 text-[#F5B82E]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5B82E]">
              Operations Schedule & Mobilisation
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">{appointments.length} Scheduled Operations</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Field Team Diary & Drone Survey Schedule
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Coordinate drone flights, roof cleaning teams, gutter vacuum units, and site risk inductions across Hampshire, Surrey & West Sussex.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-3.5 py-2 bg-[#F5B82E] hover:bg-[#e0a423] text-[#0B1424] font-bold text-xs rounded-lg transition-all shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Calendar Controls & Month Navigator */}
      <div className="p-3.5 rounded-xl bg-[#14243C] border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg bg-[#0B1424] hover:bg-[#1E3557] text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-white text-sm px-2">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg bg-[#0B1424] hover:bg-[#1E3557] text-slate-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleToday}
            className="px-2.5 py-1 bg-[#1E3557] text-[#F5B82E] font-medium rounded-lg ml-2 hover:bg-[#25426c]"
          >
            Today
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5B82E]" />
            <span>Drone Survey</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span>Residential Clean</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Commercial Project</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl bg-[#14243C] border border-white/8 overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 bg-[#0E1A2D] border-b border-white/10 text-center text-[11px] font-semibold text-slate-400 py-2.5 uppercase tracking-wider">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-white/5 min-h-[500px]">
          {/* Leading empty spaces */}
          {Array.from({ length: startingDayOffset }).map((_, idx) => (
            <div key={`empty-${idx}`} className="bg-[#0B1424]/40 min-h-[90px] p-1.5 opacity-30" />
          ))}

          {/* Month Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNumber = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
            const dayAppointments = appointments.filter(a => a.date === dateStr);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div
                key={`day-${dayNumber}`}
                className={`min-h-[100px] p-1.5 flex flex-col justify-between transition-colors ${
                  isToday ? 'bg-[#1E3557]/40 ring-1 ring-[#F5B82E]/40' : 'bg-[#14243C] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                    isToday ? 'bg-[#F5B82E] text-[#0B1424]' : 'text-slate-400'
                  }`}>
                    {dayNumber}
                  </span>
                  {dayAppointments.length > 0 && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {dayAppointments.length} task{dayAppointments.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Day Tasks */}
                <div className="space-y-1 overflow-y-auto max-h-24 flex-1">
                  {dayAppointments.map(app => {
                    const isDrone = app.type === 'Drone Survey';
                    const isRes = app.type === 'Residential Cleaning';

                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedAppointment(app)}
                        className={`p-1.5 rounded text-[10px] cursor-pointer truncate transition-all ${
                          isDrone
                            ? 'bg-[#F5B82E]/15 text-[#F5B82E] border border-[#F5B82E]/30 font-semibold'
                            : isRes
                            ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                        title={`${app.time} - ${app.title} (${app.customerName})`}
                      >
                        <span className="font-mono font-bold mr-1">{app.time}</span>
                        <span>{app.customerName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14243C] border border-white/20 p-5 rounded-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[11px] font-mono text-[#F5B82E] uppercase font-bold">
                  {selectedAppointment.type}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedAppointment.title}</h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedAppointment.date} at {selectedAppointment.time} ({selectedAppointment.durationHours} hrs allocated)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedAppointment.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Assigned Crew: {selectedAppointment.assignedTeam.join(', ')}</span>
              </div>
              {selectedAppointment.notes && (
                <p className="bg-[#0B1424] p-3 rounded-lg border border-white/5 text-[11px] mt-2">
                  <strong className="text-white block mb-0.5">Crew Briefing:</strong>
                  {selectedAppointment.notes}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-white/10 text-xs">
              <button
                onClick={() => {
                  deleteAppointment(selectedAppointment.id);
                  setSelectedAppointment(null);
                }}
                className="text-rose-400 hover:underline cursor-pointer"
              >
                Cancel Appointment
              </button>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-1.5 bg-[#F5B82E] text-[#0B1424] font-bold rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14243C] border border-white/15 p-5 rounded-2xl max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#F5B82E]" />
                <span>Schedule Operations Task</span>
              </h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Link to Enquiry (Optional)</label>
                <select
                  value={targetEnquiryId}
                  onChange={(e) => handleSelectEnquiry(e.target.value)}
                  className="w-full bg-[#0B1424] text-white p-2.5 rounded-lg border border-white/10"
                >
                  <option value="">-- Manual Schedule --</option>
                  {enquiries.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.id} — {e.customerName} ({e.service})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Operation Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10"
                  >
                    <option value="Drone Survey">Drone Survey & Flight Assessment</option>
                    <option value="Residential Cleaning">Residential Cleaning</option>
                    <option value="Commercial Cleaning">Commercial Cleaning</option>
                    <option value="Follow-up Call">Follow-up Call</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Time</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Duration (Hrs)</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={durationHours}
                    onChange={(e) => setDurationHours(parseInt(e.target.value) || 2)}
                    className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10 text-right"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Assigned Crew</label>
                <input
                  type="text"
                  value={assignedTeam}
                  onChange={(e) => setAssignedTeam(e.target.value)}
                  placeholder="e.g. Scott P., Dave M."
                  className="w-full bg-[#0B1424] text-white p-2 rounded-lg border border-white/10"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#F5B82E] text-[#0B1424] font-bold rounded-lg cursor-pointer"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Phone, 
  Bell, 
  Download, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CounselingSchedule, UserGrowthProfile } from '../types/therapy';
import { fireCelebration } from '../utils/confetti';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserGrowthProfile;
  onSaveSchedule: (schedule: CounselingSchedule, nextDate: string) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveSchedule,
}) => {
  const currentSchedule = profile.schedule || {
    nextSessionDate: profile.nextSessionDate || '2026-11-18',
    nextSessionTime: '15:00',
    cadence: 'biweekly',
    appointmentType: 'telehealth',
    telehealthUrl: 'https://meet.google.com/session-brooks',
    reminderEnabled: true,
    dailyMicroLearningReminderTime: '20:00',
    notes: 'Focus for next session: Family boundaries roleplay.',
  };

  const [date, setDate] = useState(currentSchedule.nextSessionDate);
  const [time, setTime] = useState(currentSchedule.nextSessionTime);
  const [cadence, setCadence] = useState<'weekly' | 'biweekly' | 'monthly' | 'as_needed'>(currentSchedule.cadence);
  const [appointmentType, setAppointmentType] = useState<'telehealth' | 'in_person' | 'phone'>(currentSchedule.appointmentType);
  const [telehealthUrl, setTelehealthUrl] = useState(currentSchedule.telehealthUrl || '');
  const [clinicAddress, setClinicAddress] = useState(currentSchedule.clinicAddress || '');
  const [reminderEnabled, setReminderEnabled] = useState(currentSchedule.reminderEnabled);
  const [dailyMicroReminderTime, setDailyMicroReminderTime] = useState(currentSchedule.dailyMicroLearningReminderTime || '20:00');
  const [notes, setNotes] = useState(currentSchedule.notes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSchedule: CounselingSchedule = {
      nextSessionDate: date,
      nextSessionTime: time,
      cadence,
      appointmentType,
      telehealthUrl,
      clinicAddress,
      reminderEnabled,
      dailyMicroLearningReminderTime: dailyMicroReminderTime,
      notes,
    };

    onSaveSchedule(updatedSchedule, date);
    fireCelebration();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  // Generate .ics file for calendar export
  const handleExportICS = () => {
    const sessionDateTime = new Date(`${date}T${time || '10:00'}:00`);
    const endDateTime = new Date(sessionDateTime.getTime() + 50 * 60 * 1000); // 50-minute clinical hour

    const formatDateForICS = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startICS = formatDateForICS(sessionDateTime);
    const endICS = formatDateForICS(endDateTime);

    const locationText = appointmentType === 'telehealth'
      ? telehealthUrl || 'Telehealth Video Call'
      : appointmentType === 'in_person'
      ? clinicAddress || 'Counseling Clinic'
      : 'Phone Call';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TheraBloom//Counseling Schedule//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:Counseling Session with ${profile.counselorName}`,
      `DESCRIPTION:Between-session reflection & counseling appointment with ${profile.counselorName}. Prep notes: ${notes || 'Review between-session homework & reflections in TheraBloom.'}`,
      `DTSTART:${startICS}`,
      `DTEND:${endICS}`,
      `LOCATION:${locationText}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `counseling_session_${date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5DFD5] my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#607066] hover:bg-[#EFEAE2] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2D5A43] mb-1">
          <Calendar className="w-4 h-4 text-[#A3E635]" />
          <span>Counseling Schedule & Cadence</span>
        </div>
        <h2 className="text-xl font-bold text-[#1E2922] mb-1">
          Input & Manage Your Schedule
        </h2>
        <p className="text-xs text-[#607066] mb-6">
          Set your upcoming appointment dates, meeting formats, and daily micro-learning reflection times.
        </p>

        {savedSuccess && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center space-x-2 border border-emerald-200 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Schedule updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
          
          {/* Next Appointment Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                Next Session Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                Session Time *
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20"
                />
              </div>
            </div>
          </div>

          {/* Session Cadence */}
          <div>
            <label className="block text-xs font-semibold text-[#4A574E] mb-1">
              Counseling Frequency / Cadence
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'weekly', label: 'Weekly' },
                { id: 'biweekly', label: 'Every 2 Weeks' },
                { id: 'monthly', label: 'Monthly' },
                { id: 'as_needed', label: 'As Needed' },
              ].map((cad) => (
                <button
                  key={cad.id}
                  type="button"
                  onClick={() => setCadence(cad.id as any)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                    cadence === cad.id
                      ? 'bg-[#2D5A43] text-white border-[#2D5A43] shadow-xs'
                      : 'bg-white border-[#E8E2D9] text-[#4A574E] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {cad.label}
                </button>
              ))}
            </div>
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-xs font-semibold text-[#4A574E] mb-1">
              Session Format & Location
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[
                { id: 'telehealth', label: 'Telehealth', icon: Video },
                { id: 'in_person', label: 'In-Person', icon: MapPin },
                { id: 'phone', label: 'Phone', icon: Phone },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setAppointmentType(t.id as any)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                      appointmentType === t.id
                        ? 'bg-[#2D5A43] text-white border-[#2D5A43] shadow-xs'
                        : 'bg-white border-[#E8E2D9] text-[#4A574E] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {appointmentType === 'telehealth' && (
              <input
                type="text"
                placeholder="Telehealth Video URL (e.g. Google Meet, Zoom link)"
                value={telehealthUrl}
                onChange={(e) => setTelehealthUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029] text-xs"
              />
            )}

            {appointmentType === 'in_person' && (
              <input
                type="text"
                placeholder="Clinic Address or Office Room #"
                value={clinicAddress}
                onChange={(e) => setClinicAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029] text-xs"
              />
            )}
          </div>

          {/* Between-Session Practice Reminders */}
          <div className="p-3.5 rounded-2xl bg-[#EAF2ED]/60 border border-[#D1E5D8] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-[#2D5A43]" />
                <span className="font-bold text-xs text-[#1E2922]">
                  Daily Micro-Learning & Reflection Cadence
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2D5A43]"></div>
              </label>
            </div>
            <p className="text-[11px] text-[#526056]">
              Set your ideal daily time for a 2-minute micro-learning seed and journaling check-in.
            </p>
            {reminderEnabled && (
              <div className="flex items-center space-x-2 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#2D5A43]" />
                <span className="text-xs text-[#4A574E]">Preferred time:</span>
                <input
                  type="time"
                  value={dailyMicroReminderTime}
                  onChange={(e) => setDailyMicroReminderTime(e.target.value)}
                  className="p-1 rounded-lg border border-[#D1E5D8] bg-white text-xs text-[#243029]"
                />
              </div>
            )}
          </div>

          {/* Session Focus / Agenda Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#4A574E] mb-1">
              Topics or Intended Focus for Next Session
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Roleplay boundary script with coworker, discuss recent panic trigger."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029] text-xs"
            />
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-[#EAE3DA] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleExportICS}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#2D5A43] text-[#243029] text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-xs"
              title="Download .ics event to import into Apple, Google, or Outlook Calendar"
            >
              <Download className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>Add to Calendar (.ics)</span>
            </button>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#607066] hover:bg-[#EFEAE2] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                Save Schedule
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

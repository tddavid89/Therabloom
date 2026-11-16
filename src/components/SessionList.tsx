import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Quote, 
  Search, 
  HeartHandshake, 
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { Session, Resource, Homework } from '../types/therapy';

interface SessionListProps {
  sessions: Session[];
  resources: Resource[];
  homework: Homework[];
  onOpenAddSession: () => void;
  onSelectSession: (session: Session) => void;
  onOpenSessionPrep: () => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  resources,
  homework,
  onOpenAddSession,
  onSelectSession,
  onOpenSessionPrep,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = sessions.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.focusTheme.toLowerCase().includes(term) ||
      s.rawNotes.toLowerCase().includes(term) ||
      s.counselorName.toLowerCase().includes(term) ||
      `session ${s.sessionNumber}`.includes(term)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E2922]">
            Counseling Sessions & Discussion Notes
          </h2>
          <p className="text-xs sm:text-sm text-[#607066]">
            Your private repository of session breakthroughs, recurring themes, and counselor wisdom
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenSessionPrep}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#2D5A43] text-xs font-semibold text-[#1E2922] transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <ClipboardList className="w-3.5 h-3.5 text-[#2D5A43]" />
            <span>Generate Next Session Prep</span>
          </button>
          
          <button
            onClick={onOpenAddSession}
            className="px-4 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Session</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8C9B90] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by theme, keyword, breakthrough, or counselor name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E8E2D9] bg-white text-xs sm:text-sm text-[#243029] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 shadow-2xs"
        />
      </div>

      {/* Sessions Timeline Cards */}
      <div className="space-y-4">
        {filteredSessions.map((session) => {
          const linkedHwCount = homework.filter((h) => 
            h.sessionId === session.id || session.homeworkIds?.includes(h.id)
          ).length;
          const linkedResCount = resources.filter((r) => 
            session.resourceIds?.includes(r.id)
          ).length;

          return (
            <div
              key={session.id}
              onClick={() => onSelectSession(session)}
              className="bg-white rounded-3xl p-6 border border-[#E8E2D9] shadow-xs hover:shadow-md hover:border-[#2D5A43]/40 transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EAF2ED] text-[#2D5A43] text-xs font-bold border border-[#D1E5D8]">
                      Session #{session.sessionNumber}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-[#607066]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{session.date}</span>
                    </div>
                    <span className="text-xs text-[#8C9B90]">•</span>
                    <span className="text-xs text-[#607066]">{session.counselorName}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#1E2922] group-hover:text-[#2D5A43] transition">
                    {session.focusTheme}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#4E5D53] line-clamp-2 leading-relaxed">
                    {session.summary || session.rawNotes}
                  </p>

                  {session.counselorAdvice && (
                    <div className="flex items-center space-x-2 text-xs text-[#2D5A43] bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EAE3DA]">
                      <Quote className="w-3.5 h-3.5 shrink-0 text-[#2D5A43]" />
                      <span className="italic line-clamp-1">"{session.counselorAdvice}"</span>
                    </div>
                  )}

                  {/* Badges / Links count */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#607066]">
                    {session.modalities && session.modalities.length > 0 && (
                      <div className="flex items-center gap-1 mr-1">
                        {session.modalities.map((mod) => (
                          <span
                            key={mod}
                            className="px-2 py-0.5 rounded-md bg-[#EAF2ED] text-[#2D5A43] text-[10px] font-bold border border-[#D1E5D8]"
                          >
                            {mod}
                          </span>
                        ))}
                      </div>
                    )}
                    {session.emotionAfter && (
                      <span className="px-2 py-0.5 rounded-lg bg-[#F4EFEA] border border-[#E8E2D9]">
                        Felt: <strong className="text-[#1E2922]">{session.emotionAfter}</strong>
                      </span>
                    )}
                    {linkedHwCount > 0 && (
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {linkedHwCount} Homework Experiments
                      </span>
                    )}
                    {linkedResCount > 0 && (
                      <span className="px-2 py-0.5 rounded-lg bg-sky-50 text-sky-800 border border-sky-200">
                        {linkedResCount} Resources
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between shrink-0">
                  <div className="hidden md:flex items-center space-x-1 text-xs font-semibold text-[#2D5A43] group-hover:translate-x-1 transition">
                    <span>View Session Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <button className="md:hidden text-xs font-semibold text-[#2D5A43] flex items-center space-x-1">
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}

        {filteredSessions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#E8E2D9] p-8">
            <HeartHandshake className="w-10 h-10 text-[#8C9B90] mx-auto mb-2" />
            <h3 className="text-base font-bold text-[#1E2922]">No counseling sessions found</h3>
            <p className="text-xs text-[#607066] mt-1 max-w-sm mx-auto">
              Start by logging your first counseling session to synthesize notes and generate micro-learning!
            </p>
            <button
              onClick={onOpenAddSession}
              className="mt-4 px-4 py-2 rounded-xl bg-[#2D5A43] text-white text-xs font-semibold hover:bg-[#234734] transition cursor-pointer"
            >
              Log New Session
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

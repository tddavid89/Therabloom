import React from 'react';
import { X, Calendar, User, Heart, Sparkles, Quote, BookOpen, CheckSquare } from 'lucide-react';
import { Session, Resource, Homework } from '../types/therapy';

interface SessionDetailModalProps {
  session: Session | null;
  allResources: Resource[];
  allHomework: Homework[];
  onClose: () => void;
  onOpenResource: (resource: Resource) => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  session,
  allResources,
  allHomework,
  onClose,
  onOpenResource,
}) => {
  if (!session) return null;

  const linkedResources = allResources.filter((r) => session.resourceIds?.includes(r.id));
  const linkedHomework = allHomework.filter((h) => 
    h.sessionId === session.id || session.homeworkIds?.includes(h.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5DFD5] my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#607066] hover:bg-[#EFEAE2] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2D5A43] mb-1">
            <Sparkles className="w-4 h-4 text-[#A3E635]" />
            <span>Session #{session.sessionNumber}</span>
            <span>•</span>
            <div className="flex items-center space-x-1 text-[#607066]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{session.date}</span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E2922]">
            {session.focusTheme}
          </h2>
          <p className="text-xs text-[#607066] mt-0.5">
            Counselor: {session.counselorName}
          </p>

          {session.modalities && session.modalities.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mt-2">
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
        </div>

        {/* Emotion Shift Badge */}
        {(session.emotionBefore || session.emotionAfter) && (
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#F4EFEA] border border-[#E8E2D9] mb-6 text-xs">
          <div>
            <span className="block text-[#607066] text-[11px] mb-0.5">Emotion Entering:</span>
            <span className="font-semibold text-[#1E2922]">{session.emotionBefore}</span>
          </div>
          <div>
            <span className="block text-[#607066] text-[11px] mb-0.5">Emotion Leaving:</span>
            <span className="font-semibold text-emerald-800">{session.emotionAfter}</span>
          </div>
        </div>
        )}

        {/* Counselor Advice Highlight */}
        {session.counselorAdvice && (
          <div className="p-4 rounded-2xl bg-[#EAF2ED] border border-[#D1E5D8] mb-6 flex items-start space-x-3">
            <Quote className="w-5 h-5 text-[#2D5A43] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D5A43] block mb-0.5">
                Counselor Mantra / Core Advice
              </span>
              <p className="text-sm font-serif italic text-[#1E2922]">
                "{session.counselorAdvice}"
              </p>
            </div>
          </div>
        )}

        {/* Raw Session Notes */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A574E] mb-2">
            Detailed Discussion & Breakthrough Notes
          </h3>
          <div className="p-4 rounded-2xl bg-white border border-[#EAE3DA] whitespace-pre-line text-xs sm:text-sm text-[#2E3C33] leading-relaxed">
            {session.rawNotes}
          </div>
        </div>

        {/* Key Insights */}
        {session.keyInsights && session.keyInsights.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A574E] mb-2">
              Key Psychological Insights & Takeaways
            </h3>
            <ul className="space-y-2">
              {session.keyInsights.map((insight, idx) => (
                <li
                  key={idx}
                  className="flex items-start space-x-2 text-xs sm:text-sm text-[#243029] bg-white p-2.5 rounded-xl border border-[#EAE3DA]"
                >
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Linked Homework */}
        {linkedHomework.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#4A574E] mb-2">
              <CheckSquare className="w-4 h-4 text-[#2D5A43]" />
              <span>Assigned Between-Session Experiments ({linkedHomework.length})</span>
            </div>
            <div className="space-y-2">
              {linkedHomework.map((hw) => (
                <div
                  key={hw.id}
                  className="p-3 rounded-xl bg-white border border-[#EAE3DA] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-[#1E2922] block">{hw.title}</span>
                    <span className="text-[#607066] text-[11px]">{hw.suggestedFrequency}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      hw.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {hw.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Linked Resources */}
        {linkedResources.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#4A574E] mb-2">
              <BookOpen className="w-4 h-4 text-[#2D5A43]" />
              <span>Recommended Resources ({linkedResources.length})</span>
            </div>
            <div className="space-y-2">
              {linkedResources.map((res) => (
                <div
                  key={res.id}
                  onClick={() => onOpenResource(res)}
                  className="p-3 rounded-xl bg-white border border-[#EAE3DA] flex items-center justify-between text-xs hover:border-[#2D5A43] transition cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-[#1E2922] block">{res.title}</span>
                    <span className="text-[#607066] text-[11px]">{res.authorOrCreator}</span>
                  </div>
                  <span className="text-[#2D5A43] text-xs font-semibold">View Takeaways →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close footer */}
        <div className="mt-8 pt-4 border-t border-[#EAE3DA] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2D5A43] text-white text-xs font-semibold hover:bg-[#234734] transition cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};

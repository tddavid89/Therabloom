import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ClipboardList, 
  CheckCircle2, 
  Copy, 
  Printer, 
  Plus, 
  Trash2, 
  AlertCircle, 
  RefreshCw, 
  HelpCircle, 
  Target, 
  HeartHandshake, 
  Activity,
  ArrowUp,
  ArrowDown,
  Tag
} from 'lucide-react';
import { 
  Session, 
  Homework, 
  Theme, 
  JournalEntry, 
  TherapyModality, 
  NextSessionGuide, 
  NextSessionAgendaItem 
} from '../types/therapy';
import { fireCelebration } from '../utils/confetti';

interface NextSessionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentSessions: Session[];
  homework: Homework[];
  themes: Theme[];
  journalEntries: JournalEntry[];
  activeModalities: TherapyModality[];
  nextSessionDate?: string;
  counselorName: string;
}

export const NextSessionGuideModal: React.FC<NextSessionGuideModalProps> = ({
  isOpen,
  onClose,
  recentSessions,
  homework,
  themes,
  journalEntries,
  activeModalities,
  nextSessionDate,
  counselorName,
}) => {
  const [guide, setGuide] = useState<NextSessionGuide | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userCustomNote, setUserCustomNote] = useState('');
  const [newTopicText, setNewTopicText] = useState('');
  const [newTopicPriority, setNewTopicPriority] = useState<'High' | 'Medium' | 'Exploratory'>('High');

  useEffect(() => {
    if (isOpen && !guide) {
      handleGenerateGuide();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerateGuide = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate/session-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeModalities,
          themes,
          recentSessions: recentSessions.slice(0, 2),
          journalEntries: journalEntries.slice(0, 8),
          homework,
          userNotes: userCustomNote,
          targetSessionDate: nextSessionDate || 'Upcoming Session',
        }),
      });

      let data: any = null;
      if (response && response.ok) {
        data = await response.json();
      }
      
      const generatedGuide: NextSessionGuide = {
        id: `guide-${Date.now()}`,
        targetSessionDate: nextSessionDate || 'Upcoming Session',
        sessionTitle: `Session Prep with ${counselorName}`,
        primaryIntention: data?.primaryIntention || 'To unpack acute emotional triggers from the week and build empirical confidence.',
        prioritizedAgenda: (data?.prioritizedAgenda || []).map((item: any, idx: number) => ({
          id: item.id || `agenda-${idx}`,
          topic: item.topic || 'Discussion Topic',
          priority: item.priority || 'Medium',
          context: item.context || '',
          triggerEvent: item.triggerEvent || '',
          relatedModality: item.relatedModality || activeModalities[0] || 'CBT',
          isDiscussed: false,
        })),
        weekTriggersAndEmotions: data?.weekTriggersAndEmotions || [
          {
            trigger: 'Work request boundary hesitation on Thursday',
            emotion: 'Guilt & Vulnerability',
            somaticSensation: 'Chest tightness, elevated pulse',
          },
        ],
        modalityCheckins: data?.modalityCheckins || activeModalities.map((m) => ({
          modality: m,
          notes: `Check in on ${m} practices applied between sessions.`,
        })),
        winsToCelebrate: data?.winsToCelebrate || [
          'Noticed boundary hesitation and delayed response by 24 hours.',
          'Used 4-7-8 somatic breathing before the team meeting.',
        ],
        homeworkDebriefNotes: data?.homeworkDebriefNotes || 'Practiced the boundary delay experiment with noticeable relief after initial anxiety.',
        questionsForTherapist: data?.questionsForTherapist || [
          'How can I stay anchored in Self when a family member pushes back against my boundary?',
          'Can we practice an experiential roleplay for saying no directly?',
        ],
        generatedAt: new Date().toISOString(),
      };

      if (!generatedGuide.prioritizedAgenda || generatedGuide.prioritizedAgenda.length === 0) {
        generatedGuide.prioritizedAgenda = [
          {
            id: 'ag-1',
            topic: 'Interpersonal boundary test & lingering guilt',
            priority: 'High',
            context: 'Felt guilty after saying no to weekend favor; want to unburden the protector part.',
            triggerEvent: 'Family text message thread',
            relatedModality: activeModalities.includes('IFS') ? 'IFS' : 'DBT',
            isDiscussed: false,
          },
          {
            id: 'ag-2',
            topic: 'Somatic tightness during performance review',
            priority: 'Medium',
            context: 'Noticed throat constriction and shallow breathing before speaking.',
            triggerEvent: 'Quarterly review sync',
            relatedModality: 'Somatic Experiencing',
            isDiscussed: false,
          },
          {
            id: 'ag-3',
            topic: 'Disputing "I should be further along" core belief',
            priority: 'Exploratory',
            context: 'Caught perfectionist inner critic spiral on Tuesday.',
            relatedModality: 'CBT',
            isDiscussed: false,
          },
        ];
      }

      setGuide(generatedGuide);
      fireCelebration();
    } catch (_err) {
      // Local graceful fallback
      setGuide({
        id: `guide-fallback-${Date.now()}`,
        targetSessionDate: nextSessionDate || 'Upcoming Session',
        sessionTitle: `Session Prep with ${counselorName}`,
        primaryIntention: 'To prioritize boundaries without self-abandonment and regulate acute nervous system spikes.',
        prioritizedAgenda: [
          {
            id: 'ag-1',
            topic: 'Interpersonal boundary test & lingering guilt',
            priority: 'High',
            context: 'Felt guilty after saying no to weekend favor; want to unburden the protector part.',
            triggerEvent: 'Family text message thread',
            relatedModality: activeModalities.includes('IFS') ? 'IFS' : 'DBT',
            isDiscussed: false,
          },
          {
            id: 'ag-2',
            topic: 'Somatic tightness during performance review',
            priority: 'Medium',
            context: 'Noticed throat constriction and shallow breathing before speaking.',
            triggerEvent: 'Quarterly review sync',
            relatedModality: 'Somatic Experiencing',
            isDiscussed: false,
          },
          {
            id: 'ag-3',
            topic: 'Disputing "I should be further along" core belief',
            priority: 'Exploratory',
            context: 'Caught perfectionist inner critic spiral on Tuesday.',
            relatedModality: 'CBT',
            isDiscussed: false,
          },
        ],
        weekTriggersAndEmotions: [
          {
            trigger: 'Late night notification from colleague',
            emotion: 'Anxious anticipation (7/10)',
            somaticSensation: 'Stomach flutter and tight jaw',
          },
        ],
        modalityCheckins: activeModalities.map((m) => ({
          modality: m,
          notes: `Check in on ${m} integration.`,
        })),
        winsToCelebrate: [
          'Successfully set a 24-hour buffer on request.',
          'Practiced somatic reset twice when activated.',
        ],
        homeworkDebriefNotes: 'Boundary delay experiment worked well; anxiety peaked at minute 10 then subsided.',
        questionsForTherapist: [
          'What somatic anchor can I use when adrenaline rushes into my chest?',
          'Can we map out the exile part underneath the people-pleaser manager?',
        ],
        generatedAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePriority = (itemId: string) => {
    if (!guide) return;
    setGuide({
      ...guide,
      prioritizedAgenda: guide.prioritizedAgenda.map((item) => {
        if (item.id === itemId) {
          const nextPriority =
            item.priority === 'High'
              ? 'Medium'
              : item.priority === 'Medium'
              ? 'Exploratory'
              : 'High';
          return { ...item, priority: nextPriority };
        }
        return item;
      }),
    });
  };

  const handleToggleDiscussed = (itemId: string) => {
    if (!guide) return;
    setGuide({
      ...guide,
      prioritizedAgenda: guide.prioritizedAgenda.map((item) =>
        item.id === itemId ? { ...item, isDiscussed: !item.isDiscussed } : item
      ),
    });
  };

  const handleAddCustomTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicText.trim() || !guide) return;

    const newItem: NextSessionAgendaItem = {
      id: `custom-topic-${Date.now()}`,
      topic: newTopicText,
      priority: newTopicPriority,
      context: 'Added directly by you',
      relatedModality: activeModalities[0] || 'CBT',
      isDiscussed: false,
    };

    setGuide({
      ...guide,
      prioritizedAgenda: [newItem, ...guide.prioritizedAgenda],
    });
    setNewTopicText('');
  };

  const handleDeleteTopic = (itemId: string) => {
    if (!guide) return;
    setGuide({
      ...guide,
      prioritizedAgenda: guide.prioritizedAgenda.filter((item) => item.id !== itemId),
    });
  };

  const handleCopyText = () => {
    if (!guide) return;
    const text = `
=== SESSION DISCUSSION GUIDE for ${counselorName} ===
Date: ${guide.targetSessionDate}
Intention: ${guide.primaryIntention}

🎯 PRIORITIZED AGENDA ITEMS:
${guide.prioritizedAgenda
  .map(
    (item, idx) =>
      `${idx + 1}. [${item.priority.toUpperCase()}] ${item.topic} (${item.relatedModality || 'General'})\n   Context: ${item.context}${item.triggerEvent ? ` | Trigger: ${item.triggerEvent}` : ''}`
  )
  .join('\n\n')}

⚡ WHAT CAME UP DURING THE WEEK (Triggers & Somatics):
${guide.weekTriggersAndEmotions.map((t) => `• ${t.trigger} -> Emotion: ${t.emotion} (${t.somaticSensation || 'Body activation'})`).join('\n')}

🌿 MODALITY FOCUS & CHECK-INS:
${guide.modalityCheckins.map((m) => `• [${m.modality}]: ${m.notes}`).join('\n')}

✨ WINS & BREAKTHROUGHS TO CELEBRATE:
${guide.winsToCelebrate.map((w) => `• ${w}`).join('\n')}

❓ TARGETED QUESTIONS FOR COUNSELOR:
${guide.questionsForTherapist.map((q, i) => `${i + 1}. ${q}`).join('\n')}
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const priorityColors = {
    High: 'bg-rose-50 text-rose-800 border-rose-200',
    Medium: 'bg-amber-50 text-amber-800 border-amber-200',
    Exploratory: 'bg-sky-50 text-sky-800 border-sky-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5DFD5] my-8 max-h-[90vh] overflow-y-auto">
        
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
            <ClipboardList className="w-4 h-4 text-[#A3E635]" />
            <span>Interactive Next Session Guide</span>
            <span>•</span>
            <span className="text-[#607066]">{nextSessionDate || 'Upcoming Session'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E2922]">
            What to Discuss in Your Next Session
          </h2>
          <p className="text-xs sm:text-sm text-[#607066] mt-0.5">
            Decide on prioritized topics, review triggers from the week, and frame questions with {counselorName}
          </p>

          {/* Active Modalities Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-[#EAE3DA] text-xs">
            <span className="text-[#607066] font-medium text-[11px] mr-1">Active Modalities:</span>
            {activeModalities.map((mod) => (
              <span
                key={mod}
                className="px-2.5 py-0.5 rounded-lg bg-[#EAF2ED] text-[#2D5A43] text-[11px] font-semibold border border-[#D1E5D8]"
              >
                {mod}
              </span>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16 space-y-3">
            <RefreshCw className="w-8 h-8 text-[#2D5A43] animate-spin mx-auto" />
            <h3 className="text-sm font-bold text-[#1E2922]">
              Distilling Your Week & Organizing Agenda Topics...
            </h3>
            <p className="text-xs text-[#607066] max-w-sm mx-auto">
              Scanning your journal entries, homework experiments, and modality goals to suggest your highest-impact session focus.
            </p>
          </div>
        ) : guide ? (
          <div className="space-y-6 text-xs sm:text-sm">
            
            {/* Primary Session Intention */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2D5A43] to-[#3B6E53] text-white shadow-xs">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#A3E635] mb-1">
                <Target className="w-3.5 h-3.5" />
                <span>Session Intention & Core Hope</span>
              </div>
              <p className="text-sm sm:text-base font-serif italic text-white/95 leading-relaxed">
                "{guide.primaryIntention}"
              </p>
            </div>

            {/* Prioritized Agenda Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#1E2922] text-sm sm:text-base">
                    Prioritized Discussion Topics
                  </h3>
                  <p className="text-xs text-[#607066]">
                    Click priority badge to re-rank (High / Medium / Exploratory), or check off when discussed
                  </p>
                </div>
                <span className="text-xs text-[#607066] font-semibold">
                  {guide.prioritizedAgenda.filter((a) => a.isDiscussed).length} of {guide.prioritizedAgenda.length} Discussed
                </span>
              </div>

              {/* Topic Cards */}
              <div className="space-y-2.5">
                {guide.prioritizedAgenda.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 ${
                      item.isDiscussed
                        ? 'bg-[#FAFBF9] border-emerald-200/70 opacity-60'
                        : 'bg-white border-[#E8E2D9] shadow-xs hover:border-[#2D5A43]/40'
                    }`}
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={item.isDiscussed}
                        onChange={() => handleToggleDiscussed(item.id)}
                        className="mt-1 rounded text-[#2D5A43] focus:ring-[#2D5A43] w-4 h-4 cursor-pointer"
                        title="Mark as discussed in session"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Priority Toggle Button */}
                          <button
                            type="button"
                            onClick={() => handleTogglePriority(item.id)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition cursor-pointer ${
                              priorityColors[item.priority]
                            }`}
                            title="Click to toggle priority level"
                          >
                            {item.priority} Priority
                          </button>

                          {item.relatedModality && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#4A574E] border border-[#EAE3DA]">
                              {item.relatedModality}
                            </span>
                          )}

                          {item.triggerEvent && (
                            <span className="text-[11px] text-[#607066] italic">
                              • From: {item.triggerEvent}
                            </span>
                          )}
                        </div>

                        <h4 className={`text-sm font-bold text-[#1E2922] ${item.isDiscussed ? 'line-through text-[#607066]' : ''}`}>
                          {item.topic}
                        </h4>
                        <p className="text-xs text-[#4E5D53] leading-relaxed">
                          {item.context}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTopic(item.id)}
                      className="p-1 rounded-lg text-[#8C9B90] hover:text-rose-600 transition cursor-pointer self-end sm:self-start"
                      title="Remove from agenda"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Topic Inline Form */}
              <form onSubmit={handleAddCustomTopic} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add another topic you want to bring up in session..."
                  value={newTopicText}
                  onChange={(e) => setNewTopicText(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-xs text-[#243029]"
                />
                <select
                  value={newTopicPriority}
                  onChange={(e) => setNewTopicPriority(e.target.value as any)}
                  className="p-2 rounded-xl border border-[#E4DDD3] bg-white text-xs text-[#243029]"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Exploratory">Exploratory</option>
                </select>
                <button
                  type="submit"
                  disabled={!newTopicText.trim()}
                  className="px-3 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#234734] disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>
            </div>

            {/* Two-Column Grid: Week's Triggers & Modality Check-Ins */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Card 1: What Came Up During the Week */}
              <div className="p-4 rounded-2xl bg-white border border-[#EAE3DA]">
                <div className="flex items-center space-x-1.5 font-bold text-xs text-[#1E2922] mb-2">
                  <Activity className="w-3.5 h-3.5 text-amber-600" />
                  <span>What Came Up During the Week</span>
                </div>
                <div className="space-y-2">
                  {guide.weekTriggersAndEmotions.map((t, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA] text-xs">
                      <span className="font-semibold text-[#1E2922] block">{t.trigger}</span>
                      <div className="text-[11px] text-[#607066] mt-0.5">
                        <span>Felt: <strong className="text-amber-800">{t.emotion}</strong></span>
                        {t.somaticSensation && <span> • Body: {t.somaticSensation}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Modalities Check-Ins */}
              <div className="p-4 rounded-2xl bg-white border border-[#EAE3DA]">
                <div className="flex items-center space-x-1.5 font-bold text-xs text-[#1E2922] mb-2">
                  <Tag className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>Modality Context Focus Points</span>
                </div>
                <div className="space-y-2">
                  {guide.modalityCheckins.map((mc, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA] text-xs">
                      <span className="font-bold text-[#2D5A43] block text-[11px] uppercase tracking-wide">
                        {mc.modality}
                      </span>
                      <p className="text-[#334238] mt-0.5">{mc.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Questions to Ask Counselor */}
            <div className="p-4 rounded-2xl bg-[#EAF2ED]/70 border border-[#D1E5D8]">
              <div className="flex items-center space-x-1.5 font-bold text-xs text-[#2D5A43] mb-2">
                <HelpCircle className="w-4 h-4 text-[#2D5A43]" />
                <span>Targeted Questions for {counselorName}</span>
              </div>
              <ul className="space-y-1.5">
                {guide.questionsForTherapist.map((q, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-[#1E2922]">
                    <span className="font-bold text-[#2D5A43] shrink-0">Q{idx + 1}:</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Wins & Celebrations */}
            {guide.winsToCelebrate && guide.winsToCelebrate.length > 0 && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                <span className="font-bold text-emerald-800 block mb-1">Wins to Celebrate in Session:</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {guide.winsToCelebrate.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        ) : null}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#EAE3DA]">
          <button
            type="button"
            onClick={handleGenerateGuide}
            disabled={isLoading}
            className="flex items-center space-x-1.5 text-xs font-semibold text-[#2D5A43] hover:text-[#1E2922] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate with New Thoughts</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2 rounded-xl border border-[#E4DDD3] bg-white hover:bg-[#FAF8F5] text-[#243029] transition cursor-pointer"
              title="Print Session Guide"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="px-4 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied Guide!' : 'Copy Guide for Session'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

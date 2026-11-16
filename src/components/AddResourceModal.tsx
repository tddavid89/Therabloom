import React, { useState } from 'react';
import { X, Sparkles, Wand2, Youtube, BookOpen, Share2, FileText, Headphones, AlertCircle } from 'lucide-react';
import { Resource, ResourceType, Theme } from '../types/therapy';
import { fireCelebration } from '../utils/confetti';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  themes: Theme[];
  onSaveResource: (resource: Resource) => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  themes,
  onSaveResource,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType>('youtube');
  const [url, setUrl] = useState('');
  const [authorOrCreator, setAuthorOrCreator] = useState('');
  const [notes, setNotes] = useState('');
  const [relatedThemeId, setRelatedThemeId] = useState(themes[0]?.id || 'theme-boundaries');
  const [isAssignedByTherapist, setIsAssignedByTherapist] = useState(true);
  const [estimatedTimeMinutes, setEstimatedTimeMinutes] = useState(10);

  // AI Distillation state
  const [isDistilling, setIsDistilling] = useState(false);
  const [distilledResult, setDistilledResult] = useState<{
    distilledTakeaways?: string[];
    coreQuoteOrInsight?: string;
    microAction?: string;
    journalPrompt?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunDistill = async () => {
    if (!title.trim() && !notes.trim()) {
      setErrorMsg('Please provide a title or brief notes about the resource first.');
      return;
    }
    setErrorMsg(null);
    setIsDistilling(true);

    try {
      const selectedTheme = themes.find((t) => t.id === relatedThemeId)?.name || 'Growth';
      const response = await fetch('/api/synthesize/resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          type,
          url,
          authorOrCreator,
          notes,
          relatedTheme: selectedTheme,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to distill resource on server');
      }

      const data = await response.json();
      setDistilledResult(data);
      fireCelebration();
    } catch (err: any) {
      console.error('Error distilling resource:', err);
      setErrorMsg(err?.message || 'Distillation failed. You can still save manually.');
    } finally {
      setIsDistilling(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      setErrorMsg('Please enter a title for the resource.');
      return;
    }

    const typeBadges: Record<ResourceType, string> = {
      youtube: 'YouTube Video',
      book: 'Book / Chapter',
      social_post: 'Social Media Post',
      article: 'Article / Handout',
      podcast: 'Podcast Episode',
    };

    const newResource: Resource = {
      id: `res-${Date.now()}`,
      title,
      type,
      url,
      authorOrCreator,
      notes,
      distilledTakeaways: distilledResult?.distilledTakeaways || [
        'Pay attention to nervous system signals.',
        'Practice self-compassion and gentle reflection.',
      ],
      coreQuoteOrInsight: distilledResult?.coreQuoteOrInsight,
      microAction: distilledResult?.microAction,
      journalPrompt: distilledResult?.journalPrompt,
      relatedThemeId,
      completed: false,
      isAssignedByTherapist,
      estimatedTimeMinutes: Number(estimatedTimeMinutes) || 10,
      assignedDate: new Date().toISOString().split('T')[0],
      platformBadge: typeBadges[type],
    };

    onSaveResource(newResource);
    onClose();
  };

  const typeIcons: { type: ResourceType; label: string; icon: any }[] = [
    { type: 'youtube', label: 'YouTube Video', icon: Youtube },
    { type: 'book', label: 'Book / Chapter', icon: BookOpen },
    { type: 'social_post', label: 'Social Media Post', icon: Share2 },
    { type: 'article', label: 'Article / Handout', icon: FileText },
    { type: 'podcast', label: 'Podcast Episode', icon: Headphones },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5DFD5] my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE3DA] mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#A3E635]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1E2922]">Add Therapy Resource & Distill</h2>
              <p className="text-xs text-[#607066]">
                Save videos, books, posts, and articles, and let Gemini extract the key takeaways
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#607066] hover:bg-[#EFEAE2] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs flex items-center space-x-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Resource Type Selector */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-[#4A574E] mb-2">
            Resource Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {typeIcons.map((t) => {
              const Icon = t.icon;
              const isSelected = type === t.type;
              return (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setType(t.type)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center space-y-1 transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#2D5A43] text-white border-[#2D5A43] shadow-xs'
                      : 'bg-white border-[#E8E2D9] text-[#243029] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] text-center">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-[#4A574E] mb-1">
              Resource Title or Topic *
            </label>
            <input
              type="text"
              placeholder="e.g. Polyvagal Theory in Everyday Life, or Chapter 4 of Attached"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                Link / URL (YouTube, Post, Article)
              </label>
              <input
                type="text"
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                Author / Creator / Speaker
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Kristin Neff, Brené Brown, Dr. Nicole LePera"
                value={authorOrCreator}
                onChange={(e) => setAuthorOrCreator(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#4A574E] mb-1">
                Related Counseling Theme
              </label>
              <select
                value={relatedThemeId}
                onChange={(e) => setRelatedThemeId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-3 pt-5">
              <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-[#243029]">
                <input
                  type="checkbox"
                  checked={isAssignedByTherapist}
                  onChange={(e) => setIsAssignedByTherapist(e.target.checked)}
                  className="rounded text-[#2D5A43] focus:ring-[#2D5A43] w-4 h-4"
                />
                <span>Assigned Directly by Therapist</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A574E] mb-1">
              Your Notes, Highlights, or Why You Saved It
            </label>
            <textarea
              rows={3}
              placeholder="What part resonated with you? What timestamp or quote stood out?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E4DDD3] bg-white text-[#243029]"
            />
          </div>

          {/* AI Distill Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EAF2ED] to-[#F0F7FA] border border-[#CDE5D4]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
              <div className="flex items-center space-x-2">
                <Wand2 className="w-4 h-4 text-[#2D5A43]" />
                <span className="font-bold text-[#1E2922] text-xs sm:text-sm">
                  AI Distillation Engine
                </span>
              </div>
              <button
                type="button"
                onClick={handleRunDistill}
                disabled={isDistilling || !title.trim()}
                className="px-3.5 py-1.5 rounded-xl bg-[#2D5A43] hover:bg-[#234734] disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isDistilling ? 'animate-spin' : ''}`} />
                <span>{isDistilling ? 'Distilling Takeaways...' : 'Distill Key Therapy Insights'}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#526056]">
              Gemini will distill the top 3 psychological takeaways, 1 real-world micro-action, and a journaling prompt.
            </p>

            {distilledResult && (
              <div className="mt-3 pt-3 border-t border-[#D1E5D8] space-y-2 text-xs">
                {distilledResult.distilledTakeaways && (
                  <div>
                    <strong className="text-[#1E2922] block mb-1">Extracted Key Takeaways:</strong>
                    <ul className="list-disc pl-4 space-y-1 text-[#243029]">
                      {distilledResult.distilledTakeaways.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {distilledResult.microAction && (
                  <p className="text-[#2D5A43] font-semibold">
                    🎯 <strong>Micro-Action:</strong> {distilledResult.microAction}
                  </p>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-[#EAE3DA]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#607066] hover:bg-[#EFEAE2] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            Save to Resource Vault
          </button>
        </div>

      </div>
    </div>
  );
};

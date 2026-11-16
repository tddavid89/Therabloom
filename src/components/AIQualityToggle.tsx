import React, { useState } from 'react';
import { AIQuality, getAIQuality, setAIQuality } from '../utils/aiContext';

// Fast = small model, quick replies. Deep = larger model, slower but uses your notes better.
export const AIQualityToggle: React.FC = () => {
  const [q, setQ] = useState<AIQuality>(getAIQuality());
  const pick = (v: AIQuality) => {
    setQ(v);
    setAIQuality(v);
  };
  const base = 'px-3 py-1.5 text-xs font-semibold transition cursor-pointer';
  return (
    <div className="inline-flex flex-col items-start gap-1">
      <div role="group" aria-label="AI speed" className="inline-flex rounded-xl border border-[#E8E2D9] overflow-hidden bg-white">
        <button
          type="button"
          aria-pressed={q === 'fast'}
          onClick={() => pick('fast')}
          className={`${base} ${q === 'fast' ? 'bg-[#2D5A43] text-white' : 'text-[#607066] hover:bg-[#FAF8F5]'}`}
        >
          Fast
        </button>
        <button
          type="button"
          aria-pressed={q === 'deep'}
          onClick={() => pick('deep')}
          className={`${base} ${q === 'deep' ? 'bg-[#2D5A43] text-white' : 'text-[#607066] hover:bg-[#FAF8F5]'}`}
        >
          Deep
        </button>
      </div>
      <span className="text-[10px] text-[#8A9890]">
        {q === 'fast' ? 'Quick replies, simpler answers' : 'Slower, uses your notes better'}
      </span>
    </div>
  );
};

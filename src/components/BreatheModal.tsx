import React, { useState, useEffect } from 'react';
import { X, Wind, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { fireCelebration } from '../utils/confetti';

interface BreatheModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteExercise: (xp: number) => void;
}

type Technique = '478' | 'box' | 'sigh';

export const BreatheModal: React.FC<BreatheModalProps> = ({
  isOpen,
  onClose,
  onCompleteExercise,
}) => {
  const [technique, setTechnique] = useState<Technique>('478');
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [timer, setTimer] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedBonus, setCompletedBonus] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      setCyclesCompleted(0);
      setCompletedBonus(false);
      return;
    }
    setIsActive(true);
  }, [isOpen]);

  useEffect(() => {
    if (!isActive) return;

    let countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Transition phases based on technique
        if (technique === '478') {
          if (phase === 'Inhale') {
            setPhase('Hold');
            return 7;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            return 8;
          } else {
            setPhase('Inhale');
            setCyclesCompleted((c) => c + 1);
            return 4;
          }
        } else if (technique === 'box') {
          if (phase === 'Inhale') {
            setPhase('Hold');
            return 4;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            return 4;
          } else if (phase === 'Exhale') {
            setPhase('Rest');
            return 4;
          } else {
            setPhase('Inhale');
            setCyclesCompleted((c) => c + 1);
            return 4;
          }
        } else {
          // Physiological Sigh: 2 quick inhales (2s + 1s), long exhale (6s)
          if (phase === 'Inhale') {
            setPhase('Exhale');
            return 6;
          } else {
            setPhase('Inhale');
            setCyclesCompleted((c) => c + 1);
            return 3;
          }
        }
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [isActive, phase, technique]);

  // Check if completed 3 cycles
  useEffect(() => {
    if (cyclesCompleted >= 3 && !completedBonus) {
      setCompletedBonus(true);
      fireCelebration();
      onCompleteExercise(25);
    }
  }, [cyclesCompleted, completedBonus, onCompleteExercise]);

  if (!isOpen) return null;

  const techniqueDescriptions = {
    '478': 'Dr. Andrew Weil’s natural tranquilizer for the nervous system. Inhale 4s, Hold 7s, Exhale 8s.',
    'box': 'Navy SEAL focus & grounding anchor. Equal 4s inhale, hold, exhale, hold.',
    'sigh': 'Huberman lab physiological sigh. Quick double inhale through nose, long cleansing exhale through mouth.',
  };

  const getCircleScale = () => {
    if (phase === 'Inhale') return 'scale-125 duration-[4000ms]';
    if (phase === 'Hold') return 'scale-125 duration-0';
    if (phase === 'Exhale') return 'scale-75 duration-[6000ms]';
    return 'scale-75 duration-0';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5DFD5] text-center overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#607066] hover:bg-[#EFEAE2] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Wind className="w-5 h-5 text-[#2D5A43]" />
          <h2 className="text-xl font-bold text-[#1E2922]">Somatic Reset & Breath Anchor</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#607066] mb-6">
          Bring your awareness down from racing thoughts into the physical sensation of your body.
        </p>

        {/* Technique Selector */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-[#EFEAE2] rounded-xl mb-6">
          <button
            onClick={() => {
              setTechnique('478');
              setPhase('Inhale');
              setTimer(4);
            }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              technique === '478' ? 'bg-white text-[#2D5A43] shadow-xs' : 'text-[#607066]'
            }`}
          >
            4-7-8 Calming
          </button>
          <button
            onClick={() => {
              setTechnique('box');
              setPhase('Inhale');
              setTimer(4);
            }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              technique === 'box' ? 'bg-white text-[#2D5A43] shadow-xs' : 'text-[#607066]'
            }`}
          >
            Box (4-4-4-4)
          </button>
          <button
            onClick={() => {
              setTechnique('sigh');
              setPhase('Inhale');
              setTimer(3);
            }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              technique === 'sigh' ? 'bg-white text-[#2D5A43] shadow-xs' : 'text-[#607066]'
            }`}
          >
            Physiological Sigh
          </button>
        </div>

        {/* Dynamic Breathing Sphere Visual */}
        <div className="relative my-8 flex items-center justify-center h-52">
          {/* Subtle outer ripple */}
          <div className="absolute w-48 h-48 rounded-full bg-[#2D5A43]/5 animate-ping opacity-25" />
          
          {/* Breathing Circle */}
          <div
            className={`w-36 h-36 rounded-full bg-gradient-to-tr from-[#2D5A43] to-[#4E8163] flex flex-col items-center justify-center text-white shadow-xl transition-transform ease-in-out ${getCircleScale()}`}
          >
            <span className="text-sm font-semibold uppercase tracking-wider opacity-90">{phase}</span>
            <span className="text-4xl font-extrabold my-1">{timer}</span>
            <Heart className="w-4 h-4 text-[#A3E635] opacity-80" />
          </div>
        </div>

        {/* Guidance Prompt */}
        <p className="text-xs text-[#526056] italic mb-4 max-w-sm mx-auto">
          {techniqueDescriptions[technique]}
        </p>

        {/* Cycles and Rewards */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#F3EFEA] rounded-xl text-xs text-[#4A574E] mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#2D5A43]" />
            <span>
              Cycles Completed: <strong>{cyclesCompleted} / 3</strong>
            </span>
          </div>
          {completedBonus ? (
            <span className="text-emerald-700 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>+25 XP Awarded!</span>
            </span>
          ) : (
            <span className="text-stone-500">Do 3 cycles to water garden (+25 XP)</span>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#EFEAE2] hover:bg-[#E5DFD5] text-[#1E2922] font-medium text-sm transition cursor-pointer"
          >
            {isActive ? 'Pause Rhythm' : 'Resume Rhythm'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white font-medium text-sm transition cursor-pointer"
          >
            Done Reflecting
          </button>
        </div>

      </div>
    </div>
  );
};

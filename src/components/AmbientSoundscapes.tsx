import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, CloudRain, Wind, Waves, Music, BellRing } from 'lucide-react';
import { AmbientSoundType } from '../types/therapy';

export const AmbientSoundscapes: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState<AmbientSoundType>('silence');
  const [volume, setVolume] = useState(0.4);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const intervalRef = useRef<any>(null);

  // Initialize Audio Context on demand (user interaction)
  const initAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      const gainNode = audioCtxRef.current.createGain();
      gainNode.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
      gainNode.connect(audioCtxRef.current.destination);
      gainNodeRef.current = gainNode;
    } else if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const stopCurrentSound = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (_) {}
      oscillatorRef.current = null;
    }

    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.disconnect();
      } catch (_) {}
      noiseSourceRef.current = null;
    }
  };

  const playSound = (type: AmbientSoundType) => {
    initAudioContext();
    const ctx = audioCtxRef.current;
    const masterGain = gainNodeRef.current;
    if (!ctx || !masterGain) return;

    stopCurrentSound();

    if (type === 'silence') {
      setIsPlaying(false);
      setActiveSound('silence');
      return;
    }

    setIsPlaying(true);
    setActiveSound(type);

    if (type === 'rain') {
      // Pink noise filtered for rainfall
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
        b6 = white * 0.115926;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();
      noiseSourceRef.current = noise;
    } else if (type === 'bowls') {
      // Singing bowl harmonic resonance (pure fundamental + gentle vibrato)
      const osc = ctx.createOscillator();
      const bowlGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(216, ctx.currentTime); // 216 Hz peaceful harmonic

      // Gentle pulsating envelope
      bowlGain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.connect(bowlGain);
      bowlGain.connect(masterGain);
      osc.start();
      oscillatorRef.current = osc;
    } else if (type === 'waves') {
      // Sweeping ocean swell
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.05;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      // Modulate filter frequency for ocean wave rhythm
      let t = 0;
      intervalRef.current = setInterval(() => {
        t += 0.05;
        const freq = 200 + Math.sin(t * 0.6) * 150;
        if (ctx.state === 'running') {
          filter.frequency.setTargetAtTime(freq, ctx.currentTime, 0.1);
        }
      }, 50);

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();
      noiseSourceRef.current = noise;
    } else if (type === 'forest') {
      // Wind rustle + distant bird chime harmonic
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(432, ctx.currentTime); // 432 Hz grounding frequency

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      oscillatorRef.current = osc;
    }
  };

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.05);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopCurrentSound();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const sounds: { type: AmbientSoundType; label: string; icon: any }[] = [
    { type: 'rain', label: 'Rainfall', icon: CloudRain },
    { type: 'bowls', label: 'Singing Bowl', icon: BellRing },
    { type: 'waves', label: 'Ocean Waves', icon: Waves },
    { type: 'forest', label: 'Forest 432Hz', icon: Wind },
  ];

  return (
    <div className="flex items-center space-x-2 bg-[#F4EFEA] px-2.5 py-1.5 rounded-xl border border-[#E4DDD3] text-xs">
      <div className="flex items-center space-x-1 text-[#607066] font-medium mr-1">
        <Music className="w-3.5 h-3.5 text-[#2D5A43]" />
        <span className="hidden sm:inline">Ambient:</span>
      </div>

      <div className="flex items-center space-x-1">
        {sounds.map((s) => {
          const Icon = s.icon;
          const isActive = activeSound === s.type && isPlaying;
          return (
            <button
              key={s.type}
              onClick={() => {
                if (isActive) {
                  playSound('silence');
                } else {
                  playSound(s.type);
                }
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition cursor-pointer ${
                isActive
                  ? 'bg-[#2D5A43] text-white shadow-2xs'
                  : 'bg-white hover:bg-[#FAF8F5] text-[#4A574E] border border-[#E8E2D9]'
              }`}
              title={isActive ? `Pause ${s.label}` : `Play soothing ${s.label}`}
            >
              <Icon className="w-3 h-3" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {isPlaying && (
        <button
          onClick={() => playSound('silence')}
          className="p-1 rounded-lg text-[#607066] hover:text-[#1E2922] transition cursor-pointer ml-1"
          title="Mute soundscape"
        >
          <VolumeX className="w-3.5 h-3.5 text-stone-500" />
        </button>
      )}
    </div>
  );
};

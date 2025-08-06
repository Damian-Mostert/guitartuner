// context/TunerContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import tunings from "@/data/tunings";

type Note = {
  label: string;
  frequency: number;
};

type TunerContextType = {
  tuningType: keyof typeof tunings;
  setTuningType: (type: keyof typeof tunings) => void;
  currentTuning: typeof tunings[keyof typeof tunings];
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  autoDetect: boolean;
  setAutoDetect: (value: boolean) => void;
  playTone: (frequency: number,instrumentType:string) => void;
};

const TunerContext = createContext<TunerContextType | undefined>(undefined);

export const TunerProvider = ({ children }: { children: ReactNode }) => {
  const [tuningType, setTuningType] = useState<keyof typeof tunings>("standard");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [autoDetect, setAutoDetect] = useState(false);

  const currentTuning = tunings[tuningType];

  const playTone = (frequency: number, instrumentType: string) => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Set initial oscillator type
    switch (instrumentType) {
      case "bass":
        osc.type = "square";
        break;
      case "ukulele":
        osc.type = "triangle";
        break;
      case "violin":
        osc.type = "sawtooth";
        break;
      default:
        osc.type = "sine";
    }

    const duration = 2; // Total note duration in seconds
    const fadeOutTime = 1.5; // When to start fading (0.5s before end)

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.2, now); // Start volume
    gain.gain.linearRampToValueAtTime(0.0, now + fadeOutTime); // Fade to silence

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration); // Stop oscillator after full duration
  };



  return (
    <TunerContext.Provider
      value={{
        tuningType,
        setTuningType,
        currentTuning,
        selectedNote,
        setSelectedNote,
        autoDetect,
        setAutoDetect,
        playTone,
      }}
    >
      {children}
    </TunerContext.Provider>
  );
};

export const useTuner = (): TunerContextType => {
  const context = useContext(TunerContext);
  if (!context) throw new Error("useTuner must be used within a TunerProvider");
  return context;
};

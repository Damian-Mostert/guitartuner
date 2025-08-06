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
  playTone: (frequency: number) => void;
};

const TunerContext = createContext<TunerContextType | undefined>(undefined);

export const TunerProvider = ({ children }: { children: ReactNode }) => {
  const [tuningType, setTuningType] = useState<keyof typeof tunings>("standard");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [autoDetect, setAutoDetect] = useState(false);

  const currentTuning = tunings[tuningType];

  const playTone = (frequency: number) => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2);
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

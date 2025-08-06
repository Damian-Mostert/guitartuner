"use client";

import PitchDetector from "@/components/tuner";
import React, { useState } from "react";

// Available tunings
const tunings: Record<string, { name: string; notes: { label: string; frequency: number }[] }> = {
  standard: {
    name: "Standard Guitar",
    notes: [
      { label: "E4", frequency: 329.63 },
      { label: "B3", frequency: 246.94 },
      { label: "G3", frequency: 196.0 },
      { label: "D3", frequency: 146.83 },
      { label: "A2", frequency: 110.0 },
      { label: "E2", frequency: 82.41 },
    ],
  },
  bass: {
    name: "Bass Guitar",
    notes: [
      { label: "G2", frequency: 98.0 },
      { label: "D2", frequency: 73.42 },
      { label: "A1", frequency: 55.0 },
      { label: "E1", frequency: 41.2 },
    ],
  },
  ukulele: {
    name: "Ukulele",
    notes: [
      { label: "A4", frequency: 440.0 },
      { label: "E4", frequency: 329.63 },
      { label: "C4", frequency: 261.63 },
      { label: "G4", frequency: 392.0 },
    ],
  },
};

const GuitarTuner: React.FC = () => {
  const [tuningType, setTuningType] = useState<keyof typeof tunings>("standard");
  const [selectedNote, setSelectedNote] = useState<{ label: string; frequency: number } | null>(null);

  const playTone = (frequency: number) => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 2);
  };

  const currentTuning = tunings[tuningType];

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">🎸 Guitar Tuner</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Select Instrument:</label>
        <select
          value={tuningType}
          onChange={(e) => setTuningType(e.target.value as keyof typeof tunings)}
          className="p-2 border rounded w-full"
        >
          {Object.entries(tunings).map(([key, value]) => (
            <option key={key} value={key}>
              {value.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {currentTuning.notes.map((note, i) => (
          <button
            key={i}
            onClick={() => {
              playTone(note.frequency);
              setSelectedNote(note);
            }}
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
          >
            {note.label}
          </button>
        ))}
      </div>

      {selectedNote && (
        <PitchDetector
          targetFreq={selectedNote.frequency}
          label={`Tuning: ${selectedNote.label}`}
        />
      )}
    </div>
  );
};

export default GuitarTuner;

"use client";

import PitchDetector from "@/components/pitchDetector";
import React from "react";
import { useTuner } from "@/context/TunerContext";
import tunings from "@/data/tunings";
import { Circle, CircleCheck, PlayCircleIcon } from "lucide-react";
import Image from "next/image";
import { PitchProvider } from "@/context/PitchContext";

const GuitarTuner: React.FC = () => {
	const {
		tuningType,
		setTuningType,
		currentTuning,
		selectedNote,
		setSelectedNote,
		autoDetect,
		setAutoDetect,
		playTone,
	} = useTuner();

	return (
    <PitchProvider autoDetect={autoDetect} targetFreq={autoDetect ? -1 : selectedNote?.frequency ?? -1} notes={currentTuning.notes}>
      <main className="w-screen h-screen overflow-hidden flex items-end lg:items-center justify-center">
        <Image priority width={600} height={600} alt={currentTuning.name} className="absolute h-[90vh] lg:rotate-45 left-0 object-contain object-top-left lg:object-bottom-left" src={currentTuning.icon}/>
        <div className="p-4">
          <div className="p-4 relative z-50 rounded-2xl shadow-2xl border border-zinc-300 w-full max-w-md" style={{
            background:"#FFFFFF50",
            backdropFilter:"blur(4px)"
          }}>
            <Image priority width={80} height={80} alt="Guitartuner.co.za" className="mx-auto mb-2 w-auto h-20" src="/logo.png"/>
            <div className="mb-6 flex w-full gap-2 items-center">
              <label className="block font-semibold">Instrument</label>
              <select
                value={tuningType}
                onChange={(e) => {
                  setTuningType(e.target.value);
                  setSelectedNote(null);
                }}
                className="bg-white p-2 rounded w-full border border-zinc-300 focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(tunings).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6 flex items-center gap-2 px-1">              
              <button onClick={()=>{
                  setAutoDetect(!autoDetect);                  
              }}  className="font-semibold text-zinc-900 cursor-pointe flex items-center gap-2">
                Auto Detect
                {autoDetect?<CircleCheck/>:<Circle/>}
              </button>
            </div>

            {!autoDetect && (
              <div className="grid grid-cols-3 gap-2 mb-6">
                {currentTuning.notes.map((note, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedNote(note)}
                    className={`p-3 flex items-center justify-between text-sm font-semibold rounded-lg transition-all shadow-inner border ${
                      selectedNote?.label === note.label
                        ? "bg-blue-600 text-white border-blue-400"
                        : "bg-white hover:bg-blue-400 hover:text-white text-zinc-600 border-zinc-200"
                    }`}
                  >
                    <span>{note.label}</span>
                    <PlayCircleIcon
                      className="w-5 h-5 hover:text-amber-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        playTone(note.frequency, currentTuning.soundType);
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white rounded-xl border border-zinc-300 p-4">
              <PitchDetector
                label={
                  autoDetect
                    ? `Auto Detect (${tunings[tuningType].name})`
                    : selectedNote
                    ? `Tuning: ${selectedNote.label}`
                    : ""
                }
                autoDetect={autoDetect}
              />
            </div>
          </div>      
        </div>    
      </main>
    </PitchProvider>
	);
};

export default GuitarTuner;

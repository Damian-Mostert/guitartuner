"use client";

import PitchDetector from "@/components/pitchDetector";
import React from "react";
import { useTuner } from "@/context/TunerContext";
import tunings from "@/data/tunings";
import { PlayCircleIcon } from "lucide-react";

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
		<main className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-100 text-black">
      <img className="absolute h-screen left-0" src={currentTuning.icon}/>
			<div className="p-4 mx-4 relative z-50 rounded-2xl shadow-2xl bg-zinc-200 border border-zinc-300 w-full max-w-md">
				<div className="mb-6">
					<label className="block font-semibold mb-2 text-zinc-900">Instrument</label>
					<select
						value={tuningType}
						onChange={(e) => {
							setTuningType(e.target.value);
							setSelectedNote(null);
						}}
						className="p-2 rounded w-full bg-zinc-200 text-zinc-900 border border-zinc-300 focus:ring-2 focus:ring-blue-500"
					>
						{Object.entries(tunings).map(([key, value]) => (
							<option key={key} value={key}>
								{value.name}
							</option>
						))}
					</select>
				</div>

				<div className="mb-6 flex items-center gap-2 px-1">
					<input
						id="autodetect"
						type="checkbox"
						checked={autoDetect}
						onChange={() => {
							setAutoDetect(!autoDetect);
							setSelectedNote(null);
						}}
						className="accent-blue-500 scale-125"
					/>
					<label htmlFor="autodetect" className="font-semibold text-zinc-900 cursor-pointer">
						Auto Detect
					</label>
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
										: "bg-zinc-300 hover:bg-zinc-400 hover:text-white text-zinc-600 border-zinc-200"
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

				<div className="rounded-xl border border-zinc-300 p-4">
					<PitchDetector
						targetFreq={autoDetect ? -1 : selectedNote?.frequency ?? -1}
						label={
							autoDetect
								? `Auto Detect (${tunings[tuningType].name})`
								: selectedNote
								? `Tuning: ${selectedNote.label}`
								: ""
						}
						autoDetect={autoDetect}
						notes={currentTuning.notes}
					/>
				</div>
			</div>
      <img className="absolute bottom-4 right-4 w-auto h-20" src="/logo.png"/>
		</main>
	);
};

export default GuitarTuner;

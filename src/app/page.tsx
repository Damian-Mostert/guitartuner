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
		<main className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 text-white">
			<div className="p-6 rounded-2xl shadow-2xl bg-zinc-900 border border-zinc-700 w-full max-w-md">
				<div className="mb-6">
					<label className="block font-semibold mb-2 text-zinc-300">Instrument</label>
					<select
						value={tuningType}
						onChange={(e) => {
							setTuningType(e.target.value);
							setSelectedNote(null);
						}}
						className="p-2 rounded w-full bg-zinc-800 text-white border border-zinc-600 focus:ring-2 focus:ring-blue-500"
					>
						{Object.entries(tunings).map(([key, value]) => (
							<option key={key} value={key}>
								{value.name}
							</option>
						))}
					</select>
				</div>

				<div className="mb-6 flex items-center gap-2">
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
					<label htmlFor="autodetect" className="font-semibold text-zinc-300 cursor-pointer">
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
										: "bg-zinc-700 hover:bg-zinc-600 text-zinc-100 border-zinc-600"
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

				<div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4">
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
		</main>
	);
};

export default GuitarTuner;

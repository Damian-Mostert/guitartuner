"use client";

import PitchDetector from "@/components/pitchDetector";
import React from "react";
import { useTuner } from "@/context/TunerContext";
import tunings from "@/data/tunings";
import { SpeakerIcon } from "lucide-react";

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
		<main className="w-screen h-screen flex items-center justify-center">
			<div className="p-4 max-w-md mx-auto bg-white rounded shadow border-stone-200 border">
				<h2 className="text-2xl font-bold mb-4">🎸 Guitar Tuner</h2>

				<div className="mb-4">
					<label className="block font-semibold mb-2">Select Instrument:</label>
					<select
						value={tuningType}
						onChange={(e) => {
							setTuningType(e.target.value);
							setSelectedNote(null);
						}}
						className="p-2 border rounded w-full"
					>
						{Object.entries(tunings).map(([key, value]) => (
							<option key={key} value={key}>
								{value.name}
							</option>
						))}
					</select>
				</div>

				<div className="mb-4 flex items-center gap-2">
					<label className="font-semibold">Auto Detect</label>
					<input
						type="checkbox"
						checked={autoDetect}
						onChange={() => {
							setAutoDetect(!autoDetect);
							setSelectedNote(null);
						}}
					/>
				</div>

				{!autoDetect && (
					<div className="grid grid-cols-2 gap-4">
						{currentTuning.notes.map((note, i) => (
							<button
								key={i}
								onClick={() => setSelectedNote(note)}
								className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded shadow flex items-center justify-between"
								>
									{note.label}
								  <SpeakerIcon onClick={()=>playTone(note.frequency)}/>
							</button>
						))}
					</div>
				)}

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
		</main>
	);
};

export default GuitarTuner;

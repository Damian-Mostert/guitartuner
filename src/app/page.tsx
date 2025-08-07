"use client";

import PitchDetector from "@/components/pitchDetector";
import React from "react";
import { useTuner } from "@/context/TunerContext";
import tunings from "@/data/tunings";
import { Circle, CircleCheck } from "lucide-react";
import Image from "next/image";
import { PitchProvider } from "@/context/PitchContext";
import { usePWA } from "@/context/PwaContext";
import StringInstrumentDisplay from "@/components/stringInstrumentDisplay";

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

	const {
    isOffline,
    canUpdate,
    updateInfo,
    update
  } = usePWA();

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
							}} className="font-semibold text-zinc-900 cursor-pointe flex items-center gap-2">
								Auto Detect
								{autoDetect?<CircleCheck/>:<Circle/>}
							</button>
						</div>
						{!autoDetect && (
							<StringInstrumentDisplay
                notes={currentTuning.notes}
                selectedNote={selectedNote}
                setSelectedNote={setSelectedNote}
                playTone={playTone}
                soundType={currentTuning.soundType}
              />
						)}

						<div className="bg-white rounded-xl border border-zinc-300 p-4 mt-4">
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
        <div  className="absolute bottom-4 right-4 z-50">
          {isOffline ? <div className="p-2 bg-blue-200 rounded-md">
              You are offline
          </div>:<>
            {canUpdate && <div className="p-2 bg-amber-200 rounded-md">
                Update available {updateInfo} <button onClick={update} className="bg-white hover:bg-blue-400 hover:text-white text-zinc-600 border-zinc-200 p-2 rounded-md">Update</button>
            </div>}
          </>}
        </div>
			</main>
		</PitchProvider>
	);
};

export default GuitarTuner;

"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
  useRef,
} from "react";

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
	playTone: (frequency: number, instrumentType: string) => void;
};

const TunerContext = createContext<TunerContextType | undefined>(undefined);

export const TunerProvider = ({ children }: { children: ReactNode }) => {
	const [tuningType, setTuningTypeState] = useState<keyof typeof tunings>("standard");
	const [selectedNote, setSelectedNoteState] = useState<Note | null>(null);
	const [autoDetect, setAutoDetectState] = useState(true);

	const setTuningType = (type: keyof typeof tunings) => {
		setTuningTypeState(type);
		localStorage.setItem("tuningType", type);
	};

	const setAutoDetect = (value: boolean) => {
		setAutoDetectState(value);
		localStorage.setItem("autoDetect", JSON.stringify(value));
	};

	const setSelectedNote = (note: Note | null) => {
		setSelectedNoteState(note);
		if (note) {
			localStorage.setItem("selectedNote", JSON.stringify(note));
		} else {
			localStorage.removeItem("selectedNote");
		}
	};

	useEffect(() => {
		const storedTuning = localStorage.getItem("tuningType");
		const storedAutoDetect = localStorage.getItem("autoDetect");
		const storedNote = localStorage.getItem("selectedNote");

		if (storedTuning && storedTuning in tunings) {
			setTuningTypeState(storedTuning as keyof typeof tunings);
		}

		if (storedAutoDetect !== null) {
			setAutoDetectState(JSON.parse(storedAutoDetect));
		}

		if (storedNote) {
			try {
				const parsedNote = JSON.parse(storedNote);
				if (parsedNote.label && typeof parsedNote.frequency === "number") {
					setSelectedNoteState(parsedNote);
				}
			} catch {
				// Ignore invalid data
			}
		}
	}, []);

	useEffect(() => {
		if (!autoDetect) {
			const firstNote = tunings[tuningType].notes[0];
			setSelectedNote(firstNote);
		} else {
			setSelectedNote(null);
		}
	}, [tuningType, autoDetect]);

	const currentTuning = tunings[tuningType];
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  const playTone = (frequency: number, instrumentType: string) => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === "closed") return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

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

    const duration = 2;
    const fadeOutTime = 1.5;
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.0, now + fadeOutTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
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
	if (!context) {
		throw new Error("useTuner must be used within a TunerProvider");
	}
	return context;
};

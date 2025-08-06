import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { PitchDetector } from "pitchy";

interface Note {
  label: string;
  frequency: number;
}

interface PitchContextType {
  currentFreq: number | null;
  direction: string;
  detectedNote: Note | null;
  diff: number;
}

const PitchContext = createContext<PitchContextType | undefined>(undefined);

interface PitchProviderProps {
  children: ReactNode;
  targetFreq: number;
  autoDetect: boolean;
  notes: Note[];
}

export const PitchProvider: React.FC<PitchProviderProps> = ({
  children,
  targetFreq,
  autoDetect,
  notes,
}) => {
  const [currentFreq, setCurrentFreq] = useState<number | null>(null);
  const [direction, setDirection] = useState<string>("");
  const [detectedNote, setDetectedNote] = useState<Note | null>(null);
  const [diff, setDiff] = useState<number>(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const detectorRef = useRef<ReturnType<typeof PitchDetector.forFloat32Array> | null>(null);
  const recentFreqs = useRef<number[]>([]);

  const smoothFrequency = (newFreq: number) => {
    const maxSamples = 5;
    recentFreqs.current.push(newFreq);
    if (recentFreqs.current.length > maxSamples) {
      recentFreqs.current.shift();
    }
    const sum = recentFreqs.current.reduce((a, b) => a + b, 0);
    return sum / recentFreqs.current.length;
  };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const initMic = async () => {
            if (audioContextRef.current?.state === "closed") return;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = audioCtx;

            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 2048;
            analyserRef.current = analyser;

            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            const buffer = new Float32Array(analyser.fftSize);
            detectorRef.current = PitchDetector.forFloat32Array(analyser.fftSize);

            const update = () => {
            if (!analyserRef.current || !detectorRef.current || !audioContextRef.current) return;

            analyserRef.current.getFloatTimeDomainData(buffer);
            const [pitch, clarity] = detectorRef.current.findPitch(buffer, audioContextRef.current.sampleRate);

            if (clarity > 0.9 && pitch > 0) {
                const smoothed = smoothFrequency(pitch);
                setCurrentFreq(smoothed);

                let refFreq = targetFreq;
                if (autoDetect && notes.length) {
                const closest = notes.reduce((prev, curr) =>
                    Math.abs(curr.frequency - smoothed) < Math.abs(prev.frequency - smoothed) ? curr : prev
                );
                setDetectedNote(closest);
                refFreq = closest.frequency;
                }

                const difference = smoothed - refFreq;
                setDiff(difference);

                if (Math.abs(difference) < 1.5) {
                setDirection("Perfect");
                } else if (difference > 0) {
                setDirection("Tune Down");
                } else {
                setDirection("Tune Up");
                }
            }
            };

            intervalId = setInterval(update, 75);
        };

        initMic();

        // Only clean up on unmount
        return () => {
            clearInterval(intervalId);
            if (audioContextRef.current?.state !== "closed") {
            audioContextRef.current?.close();
            }
        };
    }, []);


    useEffect(() => {
    const resumeAudio = () => {
        if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
        }
    };
    window.addEventListener("click", resumeAudio);
    return () => window.removeEventListener("click", resumeAudio);
    }, []);


  return (
    <PitchContext.Provider value={{ currentFreq, direction, detectedNote, diff }}>
      {children}
    </PitchContext.Provider>
  );
};

export const usePitch = (): PitchContextType => {
  const context = useContext(PitchContext);
  if (!context) {
    throw new Error("usePitch must be used within a PitchProvider");
  }
  return context;
};

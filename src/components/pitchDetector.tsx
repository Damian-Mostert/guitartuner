import React, { useEffect, useRef, useState } from "react";
import { PitchDetector } from "pitchy";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "lucide-react";

interface Note {
  label: string;
  frequency: number;
}

interface PitchDetectorProps {
  targetFreq: number;
  label: string;
  autoDetect?: boolean;
  notes?: Note[];
}

const PitchDetectorComponent: React.FC<PitchDetectorProps> = ({
  targetFreq,
  label,
  autoDetect = false,
  notes = [],
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
    const initMic = async () => {
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

      const intervalId = setInterval(update, 75); // more stable than requestAnimationFrame

      return () => clearInterval(intervalId);
    };

    initMic();

    return () => {
      audioContextRef.current?.close();
    };
  }, [targetFreq, autoDetect, notes]);

  // Resume AudioContext on user interaction
  useEffect(() => {
    const resumeAudio = () => {
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }
    };
    window.addEventListener("click", resumeAudio);
    return () => window.removeEventListener("click", resumeAudio);
  }, []);

  const needlePosition = Math.max(-50, Math.min(50, diff * 10)); // clamp between -50 and 50

  const getColor = () => {
    if (direction === "Perfect") return "bg-green-500";
    if (direction === "Tune Up") return "bg-yellow-500";
    if (direction === "Tune Down") return "bg-red-500";
    return "bg-gray-400";
  };

  return (
    <div className="w-full">
      <div className="text-center mb-2 text-lg font-bold">{label}</div>

      <div className="flex flex-col items-center justify-center">
        {autoDetect && detectedNote && (
          <div className="text-5xl font-bold text-purple-600 mb-2">{detectedNote.label}</div>
        )}
        <div className="text-3xl text-blue-700 font-semibold mb-4">
          {currentFreq ? `${currentFreq.toFixed(1)} Hz` : "Listening..."}
        </div>

        <div className="relative w-64 h-4 bg-stone-900 rounded-full mb-3">
          <div
            className={`absolute top-0 left-1/2 w-1 h-4 ${getColor()}`}
            style={{ transform: `translateX(${needlePosition}px)`,transition:"all 0.5s" }}
          />
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">0</div>
          <div className="absolute -top-5 left-0 text-sm text-gray-600">-50</div>
          <div className="absolute -top-5 right-0 text-sm text-gray-600">+50</div>
        </div>

        <div className={`text-lg font-semibold ${direction === "Perfect" ? "text-green-600" : "text-red-600"}`}>
          {direction === "Tune Down" && <ArrowLeftIcon />}
          {direction === "Tune Up" && <ArrowRightIcon />}
          {direction === "Perfect" && <CheckIcon />}
        </div>
      </div>
    </div>
  );
};

export default PitchDetectorComponent;

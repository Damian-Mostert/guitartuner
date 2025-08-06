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
        analyser.getFloatTimeDomainData(buffer);
        const [pitch, clarity] = detectorRef.current!.findPitch(buffer, audioCtx.sampleRate);

        if (clarity > 0.9 && pitch > 0) {
          setCurrentFreq(pitch);

          let refFreq = targetFreq;
          if (autoDetect && notes.length) {
            const closest = notes.reduce((prev, curr) =>
              Math.abs(curr.frequency - pitch) < Math.abs(prev.frequency - pitch) ? curr : prev
            );
            setDetectedNote(closest);
            refFreq = closest.frequency;
          }

          const difference = pitch - refFreq;
          setDiff(difference);

          if (Math.abs(difference) < 1.5) {
            setDirection("Perfect");
          } else if (difference > 0) {
            setDirection("Tune Down");
          } else {
            setDirection("Tune Up");
          }
        }

        requestAnimationFrame(update);
      };

      update();
    };

    initMic();

    return () => {
      audioContextRef.current?.close();
    };
  }, [targetFreq, autoDetect, notes]);

  const needlePosition = Math.max(-50, Math.min(50, diff * 10)); // clamp between -50 and 50

  const getColor = () => {
    if (direction === "Perfect") return "bg-green-500";
    if (direction === "Tune Up") return "bg-yellow-500";
    if (direction === "Tune Down") return "bg-red-500";
    return "bg-gray-400";
  };

  return (
    <div className="mt-6 p-6 bg-stone-100 rounded-md shadow-md">
      <div className="text-center mb-2 text-lg font-bold">{label}</div>

      <div className="flex flex-col items-center justify-center">
        {autoDetect && detectedNote && (
          <div className="text-5xl font-bold text-purple-600 mb-2">{detectedNote.label}</div>
        )}
        <div className="text-3xl text-blue-700 font-semibold mb-4">
          {currentFreq ? `${currentFreq.toFixed(1)} Hz` : "Listening..."}
        </div>

        <div className="relative w-64 h-4 bg-gray-300 rounded-full mb-3">
          <div
            className={`absolute top-0 left-1/2 w-1 h-4 ${getColor()} transition-transform duration-100`}
            style={{ transform: `translateX(${needlePosition}px)` }}
          />
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">0</div>
          <div className="absolute -top-5 left-0 text-sm text-gray-600">-50</div>
          <div className="absolute -top-5 right-0 text-sm text-gray-600">+50</div>
        </div>

        <div className={`text-lg font-semibold ${direction === "Perfect" ? "text-green-600" : "text-red-600"}`}>
          {direction == "Tune Down"&&<>
            <ArrowLeftIcon/>
          </>}
          {direction == "Tune Up"&&<>
            <ArrowRightIcon/>
          </>}
          {direction == "Perfect"&&<>
            <CheckIcon/>            
          </>}
        </div>
      </div>
    </div>
  );
};

export default PitchDetectorComponent;

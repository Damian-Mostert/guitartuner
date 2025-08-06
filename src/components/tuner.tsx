import React, { useEffect, useRef, useState } from "react";
import { PitchDetector } from "pitchy";

interface PitchDetectorProps {
  targetFreq: number;
  label: string;
}

const PitchDetectorComponent: React.FC<PitchDetectorProps> = ({ targetFreq, label }) => {
  const [currentFreq, setCurrentFreq] = useState<number | null>(null);
  const [direction, setDirection] = useState<string>("");

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

          const diff = pitch - targetFreq;

          if (Math.abs(diff) < 1.5) {
            setDirection("Perfect");
          } else if (diff > 0) {
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
  }, [targetFreq]);

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded">
      <div className="text-lg font-bold">{label}</div>
      <div className="text-xl text-blue-600">
        {currentFreq ? `${currentFreq.toFixed(1)} Hz` : "Listening..."}
      </div>
      <div className="text-md font-semibold text-green-600">{direction}</div>
    </div>
  );
};

export default PitchDetectorComponent;

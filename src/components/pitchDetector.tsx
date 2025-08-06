import React from "react";
import { usePitch } from "@/context/PitchContext";

interface PitchDetectorProps {
  label: string;
  autoDetect?: boolean;
}

const PitchDetectorComponent: React.FC<PitchDetectorProps> = ({
  label,
  autoDetect = false,
}) => {
   const { currentFreq, direction, detectedNote, diff } = usePitch();

  const needlePosition = Math.max(-50, Math.min(50, diff * 10)); // clamp between -50 and 50

  const getColor = () => {
    if (direction === "Perfect") return "bg-green-500";
    if (direction === "Tune Up") return "bg-yellow-500";
    if (direction === "Tune Down") return "bg-red-500";
    return "bg-gray-400";
  };

  const getBgColor = () => {
    if (direction === "Perfect") return "bg-green-100";
    if (direction === "Tune Up") return "bg-yellow-100";
    if (direction === "Tune Down") return "bg-red-100";
    return "bg-gray-100";
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

        <div className={`relative w-64 h-4 ${getBgColor()} shadow-inner rounded-full mb-3`} style={{transition:"all 0.5s" }}>
          <div
            className={`absolute top-0 left-1/2 w-1 h-4 ${getColor()}`}
            style={{ transform: `translateX(${needlePosition}px)`,transition:"all 0.5s" }}
          />
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">0</div>
          <div className="absolute -top-5 left-0 text-sm text-gray-600">-50</div>
          <div className="absolute -top-5 right-0 text-sm text-gray-600">+50</div>
        </div>

        <div className={`text-lg font-semibold ${direction === "Perfect" ? "text-green-600" : "text-red-600"}`}>
          {direction}
        </div>
      </div>
    </div>
  );
};

export default PitchDetectorComponent;

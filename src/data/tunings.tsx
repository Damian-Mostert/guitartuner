const tunings: Record<string, { name: string; notes: { label: string; frequency: number }[] }> = {
  standard: {
    name: "Standard Guitar",
    notes: [
      { label: "E4", frequency: 329.63 },
      { label: "B3", frequency: 246.94 },
      { label: "G3", frequency: 196.0 },
      { label: "D3", frequency: 146.83 },
      { label: "A2", frequency: 110.0 },
      { label: "E2", frequency: 82.41 },
    ],
  },
  dropD: {
    name: "Drop D Guitar",
    notes: [
      { label: "E4", frequency: 329.63 },
      { label: "B3", frequency: 246.94 },
      { label: "G3", frequency: 196.0 },
      { label: "D3", frequency: 146.83 },
      { label: "A2", frequency: 110.0 },
      { label: "D2", frequency: 73.42 },
    ],
  },
  halfStepDown: {
    name: "Half Step Down Guitar",
    notes: [
      { label: "D#4", frequency: 311.13 },
      { label: "A#3", frequency: 233.08 },
      { label: "F#3", frequency: 185.0 },
      { label: "C#3", frequency: 138.59 },
      { label: "G#2", frequency: 103.83 },
      { label: "D#2", frequency: 77.78 },
    ],
  },
  dadgad: {
    name: "DADGAD Guitar",
    notes: [
      { label: "D4", frequency: 293.66 },
      { label: "A3", frequency: 220.0 },
      { label: "G3", frequency: 196.0 },
      { label: "D3", frequency: 146.83 },
      { label: "A2", frequency: 110.0 },
      { label: "D2", frequency: 73.42 },
    ],
  },
  sevenString: {
    name: "7-String Guitar",
    notes: [
      { label: "E4", frequency: 329.63 },
      { label: "B3", frequency: 246.94 },
      { label: "G3", frequency: 196.0 },
      { label: "D3", frequency: 146.83 },
      { label: "A2", frequency: 110.0 },
      { label: "E2", frequency: 82.41 },
      { label: "B1", frequency: 61.74 },
    ],
  },
  twelveString: {
    name: "12-String Guitar",
    notes: [
      { label: "E4/E3", frequency: 329.63 }, // paired string average shown
      { label: "B3", frequency: 246.94 },
      { label: "G3/G4", frequency: 392.0 },
      { label: "D3/D4", frequency: 293.66 },
      { label: "A2/A3", frequency: 220.0 },
      { label: "E2/E3", frequency: 164.81 },
    ],
  },
  bass: {
    name: "Bass Guitar",
    notes: [
      { label: "G2", frequency: 98.0 },
      { label: "D2", frequency: 73.42 },
      { label: "A1", frequency: 55.0 },
      { label: "E1", frequency: 41.2 },
    ],
  },
  doubleBass: {
    name: "Double Bass",
    notes: [
      { label: "G2", frequency: 98.0 },
      { label: "D2", frequency: 73.42 },
      { label: "A1", frequency: 55.0 },
      { label: "E1", frequency: 41.2 },
    ],
  },
  ukulele: {
    name: "Ukulele",
    notes: [
      { label: "A4", frequency: 440.0 },
      { label: "E4", frequency: 329.63 },
      { label: "C4", frequency: 261.63 },
      { label: "G4", frequency: 392.0 },
    ],
  },
  baritoneUkulele: {
    name: "Baritone Ukulele",
    notes: [
      { label: "E3", frequency: 164.81 },
      { label: "B3", frequency: 246.94 },
      { label: "G3", frequency: 196.0 },
      { label: "D3", frequency: 146.83 },
    ],
  },
  violin: {
    name: "Violin",
    notes: [
      { label: "E5", frequency: 659.25 },
      { label: "A4", frequency: 440.0 },
      { label: "D4", frequency: 293.66 },
      { label: "G3", frequency: 196.0 },
    ],
  },
  viola: {
    name: "Viola",
    notes: [
      { label: "A4", frequency: 440.0 },
      { label: "D4", frequency: 293.66 },
      { label: "G3", frequency: 196.0 },
      { label: "C3", frequency: 130.81 },
    ],
  },
  cello: {
    name: "Cello",
    notes: [
      { label: "A3", frequency: 220.0 },
      { label: "D3", frequency: 146.83 },
      { label: "G2", frequency: 98.0 },
      { label: "C2", frequency: 65.41 },
    ],
  },
  mandolin: {
    name: "Mandolin",
    notes: [
      { label: "E4", frequency: 329.63 },
      { label: "A3", frequency: 220.0 },
      { label: "D3", frequency: 146.83 },
      { label: "G3", frequency: 196.0 },
    ],
  },
  banjo: {
    name: "Banjo (5-string)",
    notes: [
      { label: "G4", frequency: 392.0 },
      { label: "D3", frequency: 146.83 },
      { label: "G3", frequency: 196.0 },
      { label: "B3", frequency: 246.94 },
      { label: "D4", frequency: 293.66 },
    ],
  },
  charango: {
    name: "Charango",
    notes: [
      { label: "E4", frequency: 329.63 },
      { label: "A4", frequency: 440.0 },
      { label: "E5", frequency: 659.25 },
      { label: "C5", frequency: 523.25 },
      { label: "G4", frequency: 392.0 },
    ],
  },
  balalaika: {
    name: "Balalaika",
    notes: [
      { label: "E4", frequency: 329.63 },
      { label: "E4", frequency: 329.63 },
      { label: "A4", frequency: 440.0 },
    ],
  },
  sitar: {
    name: "Sitar",
    notes: [
      { label: "C3", frequency: 130.81 },
      { label: "C4", frequency: 261.63 },
      { label: "G3", frequency: 196.0 },
      { label: "C5", frequency: 523.25 },
      { label: "G4", frequency: 392.0 },
      { label: "C6", frequency: 1046.5 },
      { label: "G5", frequency: 783.99 },
    ],
  },
};

export default tunings;

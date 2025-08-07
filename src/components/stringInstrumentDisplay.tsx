import React, { useEffect, useRef, useState } from "react";

interface Note {
	label: string;
	frequency: number;
}

interface Props {
	notes: Note[];
	soundType: string;
	selectedNote: Note | null;
	setSelectedNote: (note: Note) => void;
	playTone: (frequency: number, soundType: string) => void;
}

const StringInstrumentCanvas: React.FC<Props> = ({
	notes,
	soundType,
	playTone,
	selectedNote,
	setSelectedNote,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [playingNote, setPlayingNote] = useState<string | null>(null);

	const vibrationDuration = 300; // ms
	const vibrationAmplitude = 4; // px

	// Trigger vibration
	const triggerVibration = (label: string) => {
		setPlayingNote(label);
		setTimeout(() => setPlayingNote(null), vibrationDuration);
	};

	// DRAW STRINGS + PLAY BUTTON
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const width = canvas.width;
		const height = canvas.height;

		ctx.clearRect(0, 0, width, height);

		const padding = 20;
		const playX = width - padding - 30;
		const stringSpacing = (height - padding * 2) / (notes.length - 1);
		const wavePoints = 100;

		const time = Date.now();

		notes.forEach((note, i) => {
			const y = padding + i * stringSpacing;

			// Style
			const isSelected = selectedNote?.label === note.label;
			ctx.lineWidth = isSelected ? 4 : 2;

			// Metallic gradient string
			const gradient = ctx.createLinearGradient(0, y, width, y);
			if (isSelected) {
				gradient.addColorStop(0, "#f43f5e"); // red
				gradient.addColorStop(1, "#ef4444");
			} else {
				gradient.addColorStop(0, "#999");
				gradient.addColorStop(1, "#ccc");
			}
			ctx.strokeStyle = gradient;

			// Draw vibrating or flat string
			ctx.beginPath();
			if (playingNote === note.label) {
				for (let j = 0; j <= wavePoints; j++) {
					const x = padding + (j / wavePoints) * (width - 2 * padding);
					const amp =
						vibrationAmplitude *
						Math.exp(-3 * (j / wavePoints)) *
						Math.sin(
							(time / 100) * Math.PI * 4 -
								(j / wavePoints) * (2 * Math.PI * (width / 60))
						);
					const yOffset = amp;
					j === 0 ? ctx.moveTo(x, y + yOffset) : ctx.lineTo(x, y + yOffset);
				}
			} else {
				ctx.moveTo(padding, y);
				ctx.lineTo(width - padding, y);
			}
			ctx.stroke();

			// Label
			ctx.font = "bold 14px sans-serif";
			ctx.fillStyle = isSelected ? "#dc2626" : "#333";
			ctx.fillText(note.label, padding - 10, y - 10);

			// Play button (amber circle)
			ctx.beginPath();
			ctx.arc(playX, y, 10, 0, Math.PI * 2);
			ctx.fillStyle = "#f59e0b";
			ctx.shadowColor = "rgba(0,0,0,0.2)";
			ctx.shadowBlur = 4;
			ctx.fill();
			ctx.shadowBlur = 0;

			// Play icon
			ctx.beginPath();
			const size = 6;
			ctx.moveTo(playX - size / 2 + 2, y - size);
			ctx.lineTo(playX + size / 2 + 2, y);
			ctx.lineTo(playX - size / 2 + 2, y + size);
			ctx.closePath();
			ctx.fillStyle = "white";
			ctx.fill();
		});
	}, [notes, selectedNote, playingNote]);

	// CLICK HANDLER
	const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const yClick = e.clientY - rect.top;

		const padding = 20;
		const playX = canvas.width - padding - 30;
		const stringSpacing = (canvas.height - padding * 2) / (notes.length - 1);

		const stringIndex = Math.round((yClick - padding) / stringSpacing);
		if (stringIndex < 0 || stringIndex >= notes.length) return;

		const note = notes[stringIndex];
		const stringY = padding + stringIndex * stringSpacing;

		const distToPlayButton = Math.sqrt(
			(x - playX) ** 2 + (yClick - stringY) ** 2
		);

		if (distToPlayButton <= 10) {
			playTone(note.frequency, soundType);
			triggerVibration(note.label);
		} else {
			setSelectedNote(note);
		}
	};

	return (
		<canvas
			ref={canvasRef}
			width={340}
			height={notes.length * 45 + 40}
			onClick={handleCanvasClick}
		/>
	);
};

export default StringInstrumentCanvas;

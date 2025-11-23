import React, { useState, useRef, useEffect } from 'react';
import { Member } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface DrawWheelProps {
    members: Member[];
    onWinnerSelected: (member: Member) => void;
    excludeMembers?: string[]; // Members who have already won
}

export const DrawWheel: React.FC<DrawWheelProps> = ({
    members,
    onWinnerSelected,
    excludeMembers = []
}) => {
    const { t } = useLanguage();
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winner, setWinner] = useState<Member | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Filter out excluded members
    const eligibleMembers = members.filter(m => !excludeMembers.includes(m.id));

    useEffect(() => {
        drawWheel();
    }, [eligibleMembers, rotation]);

    const drawWheel = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((rotation * Math.PI) / 180);

        const sliceAngle = (2 * Math.PI) / eligibleMembers.length;
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

        eligibleMembers.forEach((member, index) => {
            const startAngle = index * sliceAngle;
            const endAngle = startAngle + sliceAngle;
            const color = colors[index % colors.length];

            // Draw slice
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, startAngle, endAngle);
            ctx.lineTo(0, 0);
            ctx.fill();

            // Draw border
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw text
            ctx.save();
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(member.name, radius / 2, 0);
            ctx.restore();
        });

        ctx.restore();

        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        ctx.fillStyle = '#2C3E50';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw pointer at top
        ctx.beginPath();
        ctx.moveTo(centerX, 20);
        ctx.lineTo(centerX - 15, 40);
        ctx.lineTo(centerX + 15, 40);
        ctx.closePath();
        ctx.fillStyle = '#E74C3C';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    const spinWheel = () => {
        if (spinning || eligibleMembers.length === 0) return;

        setSpinning(true);
        setWinner(null);

        // Random spins between 5-10 full rotations plus random angle
        const spins = 5 + Math.random() * 5;
        const extraDegrees = Math.random() * 360;
        const totalRotation = rotation + spins * 360 + extraDegrees;

        // Animate rotation
        const duration = 4000; // 4 seconds
        const startTime = Date.now();
        const startRotation = rotation;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentRotation = startRotation + (totalRotation - startRotation) * easeOut;

            setRotation(currentRotation % 360);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Determine winner
                const normalizedRotation = (360 - (currentRotation % 360)) % 360;
                const sliceAngle = 360 / eligibleMembers.length;
                const winnerIndex = Math.floor(normalizedRotation / sliceAngle);
                const selectedWinner = eligibleMembers[winnerIndex];

                setWinner(selectedWinner);
                setSpinning(false);
                onWinnerSelected(selectedWinner);
            }
        };

        animate();
    };

    if (eligibleMembers.length === 0) {
        return (
            <div className="draw-wheel-container">
                <p className="no-members">{t('draw.noEligibleMembers') || 'No eligible members for draw'}</p>
            </div>
        );
    }

    return (
        <div className="draw-wheel-container">
            <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="draw-wheel-canvas"
            />

            <button
                onClick={spinWheel}
                disabled={spinning}
                className="spin-button"
            >
                {spinning ? t('draw.spinning') || 'Spinning...' : t('draw.spin')}
            </button>

            {winner && !spinning && (
                <div className="winner-announcement">
                    <h2>{t('draw.congratulations')}</h2>
                    <h3>{winner.name}</h3>
                    <p>{t('draw.winner')}</p>
                </div>
            )}
        </div>
    );
};

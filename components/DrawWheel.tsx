import React, { useState, useEffect } from 'react';
import { Member } from '../types';
import { Trophy } from 'lucide-react';

interface DrawWheelProps {
  candidates: Member[];
  onWinnerSelected: (winner: Member) => void;
}

export const DrawWheel: React.FC<DrawWheelProps> = ({ candidates, onWinnerSelected }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [winner, setWinner] = useState<Member | null>(null);

  const startDraw = () => {
    if (candidates.length === 0) return;
    setIsSpinning(true);
    setWinner(null);

    let speed = 50;
    let counter = 0;
    const maxIterations = 40 + Math.floor(Math.random() * 20); // Random spins

    const spin = () => {
      setDisplayIndex(prev => (prev + 1) % candidates.length);
      counter++;

      if (counter < maxIterations) {
        // Slow down effect
        if (counter > maxIterations - 10) speed += 30;
        else if (counter > maxIterations - 20) speed += 10;
        setTimeout(spin, speed);
      } else {
        const finalIndex = Math.floor(Math.random() * candidates.length);
        setDisplayIndex(finalIndex);
        setIsSpinning(false);
        setWinner(candidates[finalIndex]);
        setTimeout(() => onWinnerSelected(candidates[finalIndex]), 1500);
      }
    };

    spin();
  };

  if (winner) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-indigo-50 rounded-2xl animate-fade-in text-center border-2 border-indigo-100">
        <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce">
            <Trophy className="text-white w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-indigo-900 mb-1">Congratulations!</h3>
        <p className="text-xl text-indigo-600 font-medium">{winner.name}</p>
        <p className="text-sm text-slate-500 mt-2">{winner.phone}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="relative w-64 h-40 flex items-center justify-center bg-slate-100 rounded-xl overflow-hidden border-4 border-slate-200 shadow-inner">
        <div className="text-3xl font-bold text-slate-700 transition-all duration-75">
          {candidates[displayIndex]?.name || "Ready?"}
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-300"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-slate-300"></div>
      </div>

      <button
        onClick={startDraw}
        disabled={isSpinning || candidates.length === 0}
        className={`
          px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all transform hover:scale-105 active:scale-95
          ${isSpinning 
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-indigo-500/30'}
        `}
      >
        {isSpinning ? 'Spinning...' : 'START DRAW'}
      </button>
      
      {candidates.length === 0 && (
          <p className="text-red-500 text-sm">No eligible members for this draw.</p>
      )}
    </div>
  );
};
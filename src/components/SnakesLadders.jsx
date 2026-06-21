"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, Trophy, RotateCcw, CheckCircle, XCircle, ArrowUp, ArrowDown } from "lucide-react";
import confetti from "canvas-confetti";
import { quizQuestions } from "@/data/quiz-questions";
import { updateAchievement, updateBestTime } from "@/utils/storage";

const BOARD_SIZE = 10;
const TOTAL_CELLS = 100;

// Ladders: start -> end (naik) — 10 tangga
const ladders = {
  4: 25, 9: 31, 21: 42, 28: 84, 36: 57,
  40: 59, 51: 67, 63: 81, 71: 91, 80: 98,
};

// Snakes: start -> end (turun) — 10 ular
const snakes = {
  17: 7, 46: 26, 54: 34, 62: 19, 75: 53,
  87: 24, 90: 68, 93: 73, 95: 56, 99: 78,
};

// Get the (col, row) grid position from cell number (1-indexed)
// Row 0 = bottom row (cells 1-10), Row 9 = top row (cells 91-100)
// Even rows go left-to-right, odd rows go right-to-left
const getCellPosition = (num) => {
  const row = Math.floor((num - 1) / BOARD_SIZE);
  const colInRow = (num - 1) % BOARD_SIZE;
  const col = row % 2 === 0 ? colInRow : (BOARD_SIZE - 1 - colInRow);
  return { col, row };
};

// Convert cell position to SVG percentage coordinates (center of cell)
const getCellCenter = (num) => {
  const { col, row } = getCellPosition(num);
  const visualRow = BOARD_SIZE - 1 - row; // flip for display (top-down)
  const x = (col + 0.5) / BOARD_SIZE * 100;
  const y = (visualRow + 0.5) / BOARD_SIZE * 100;
  return { x, y };
};

const PALETTE = [
  { main: "#3b82f6", dark: "#1d4ed8", pattern: "#1e3a8a" }, // Blue
  { main: "#a855f7", dark: "#7e22ce", pattern: "#581c87" }, // Purple
  { main: "#f97316", dark: "#c2410c", pattern: "#7c2d12" }, // Orange
  { main: "#ec4899", dark: "#be185d", pattern: "#831843" }, // Pink
  { main: "#14b8a6", dark: "#0f766e", pattern: "#134e4a" }, // Teal
  { main: "#eab308", dark: "#a16207", pattern: "#713f12" }, // Yellow
  { main: "#ef4444", dark: "#b91c1c", pattern: "#7f1d1d" }, // Red
  { main: "#22c55e", dark: "#15803d", pattern: "#14532d" }, // Green
];

const Ladder = ({ start, end, color }) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx);
  const length = Math.sqrt(dx * dx + dy * dy);
  const numRungs = Math.max(3, Math.floor(length / 2.5)); 
  
  const rungs = [];
  for (let i = 1; i <= numRungs; i++) {
    const rX = start.x + dx * (i / (numRungs + 1));
    const rY = start.y + dy * (i / (numRungs + 1));
    rungs.push({ x: rX, y: rY });
  }

  const width = 1.2;
  const nx = -Math.sin(angle) * width;
  const ny = Math.cos(angle) * width;

  return (
    <g className="opacity-90">
      <line x1={start.x - nx} y1={start.y - ny} x2={end.x - nx} y2={end.y - ny} stroke={color.dark} strokeWidth="0.8" strokeLinecap="round" />
      <line x1={start.x + nx} y1={start.y + ny} x2={end.x + nx} y2={end.y + ny} stroke={color.dark} strokeWidth="0.8" strokeLinecap="round" />
      {rungs.map((r, i) => (
        <line key={i} x1={r.x - nx} y1={r.y - ny} x2={r.x + nx} y2={r.y + ny} stroke={color.main} strokeWidth="0.6" />
      ))}
    </g>
  );
};

const Snake = ({ start, end, color }) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  
  const cp1x = start.x + dx * 0.2 - Math.sin(angle) * dist * 0.2;
  const cp1y = start.y + dy * 0.2 + Math.cos(angle) * dist * 0.2;
  const cp2x = start.x + dx * 0.8 + Math.sin(angle) * dist * 0.2;
  const cp2y = start.y + dy * 0.8 - Math.cos(angle) * dist * 0.2;
  
  const pathData = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;
  
  const headDx = cp1x - start.x;
  const headDy = cp1y - start.y;
  const headAngle = Math.atan2(headDy, headDx) * 180 / Math.PI;

  return (
    <g className="opacity-90">
      <path d={pathData} stroke={color.dark} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d={pathData} stroke={color.main} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d={pathData} stroke={color.pattern} strokeWidth="0.5" strokeDasharray="0.5 1.5" strokeLinecap="round" fill="none" />
      
      <g transform={`translate(${start.x}, ${start.y}) rotate(${headAngle - 90})`}>
        <ellipse cx="0" cy="0" rx="1.5" ry="2" fill={color.main} stroke={color.dark} strokeWidth="0.3" />
        <circle cx="-0.6" cy="-0.8" r="0.4" fill="#fff" />
        <circle cx="0.6" cy="-0.8" r="0.4" fill="#fff" />
        <circle cx="-0.6" cy="-0.8" r="0.1" fill="#000" />
        <circle cx="0.6" cy="-0.8" r="0.1" fill="#000" />
        <path d="M 0 -2 L 0 -3.5 L -0.5 -4 M 0 -3.5 L 0.5 -4" stroke="#f43f5e" strokeWidth="0.2" fill="none" />
      </g>
    </g>
  );
};

const Pawn = () => (
  <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible filter drop-shadow-md">
    <defs>
      <radialGradient id="pawnGlow" cx="40%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#a5b4fc" />
        <stop offset="30%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#312e81" />
      </radialGradient>
      <linearGradient id="pawnShine" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
        <stop offset="50%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
    
    {/* Base shadow */}
    <ellipse cx="50" cy="112" rx="35" ry="10" fill="rgba(0,0,0,0.4)" filter="blur(2px)" />
    
    {/* Base */}
    <path d="M 25 105 C 25 95, 35 90, 42 85 L 58 85 C 65 90, 75 95, 75 105 C 75 112, 63 115, 50 115 C 37 115, 25 112, 25 105 Z" fill="url(#pawnGlow)" stroke="#1e1b4b" strokeWidth="1.5" />
    <path d="M 25 105 C 25 95, 35 90, 42 85 L 58 85 C 65 90, 75 95, 75 105 C 75 112, 63 115, 50 115 C 37 115, 25 112, 25 105 Z" fill="url(#pawnShine)" />
    
    {/* Ring */}
    <ellipse cx="50" cy="85" rx="18" ry="5" fill="url(#pawnGlow)" stroke="#1e1b4b" strokeWidth="1.5" />
    <ellipse cx="50" cy="85" rx="18" ry="5" fill="url(#pawnShine)" />

    {/* Neck/Stem */}
    <path d="M 40 85 L 43 45 L 57 45 L 60 85 Z" fill="url(#pawnGlow)" stroke="#1e1b4b" strokeWidth="1.5" />
    <path d="M 40 85 L 43 45 L 57 45 L 60 85 Z" fill="url(#pawnShine)" />

    {/* Collar Ring */}
    <ellipse cx="50" cy="45" rx="15" ry="4" fill="url(#pawnGlow)" stroke="#1e1b4b" strokeWidth="1.5" />
    <ellipse cx="50" cy="45" rx="15" ry="4" fill="url(#pawnShine)" />

    {/* Head */}
    <circle cx="50" cy="25" r="18" fill="url(#pawnGlow)" stroke="#1e1b4b" strokeWidth="1.5" />
    <circle cx="50" cy="25" r="18" fill="url(#pawnShine)" />
    
    {/* Highlight on head */}
    <ellipse cx="43" cy="16" rx="6" ry="3" fill="rgba(255,255,255,0.7)" transform="rotate(-30 43 16)" />
  </svg>
);

const generateBoard = () => {
  const board = [];
  for (let row = 9; row >= 0; row--) {
    const rowCells = [];
    for (let col = 0; col < 10; col++) {
      let num;
      if (row % 2 === 0) {
        num = row * 10 + col + 1;
      } else {
        num = row * 10 + (9 - col) + 1;
      }
      rowCells.push(num);
    }
    board.push(rowCells);
  }
  return board;
};

export default function SnakesLadders() {
  const board = useMemo(() => generateBoard(), []);
  const [position, setPosition] = useState(1);
  const [diceValue, setDiceValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState([]);
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    let timer;
    if (gameStarted && !gameWon) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameWon]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  const [animatedDice, setAnimatedDice] = useState({
    visible: false, value: 1, startLeft: "0%", startTop: "0%", endLeft: "50%", endTop: "50%", rot: 0 
  });

  const [quizModal, setQuizModal] = useState({
    isOpen: false, type: null, targetPos: null, question: null,
  });

  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false, isCorrect: false, explanation: "", type: null, targetPos: null,
  });

  const getRandomQuestion = useCallback(() => {
    const available = quizQuestions.filter(q => !usedQuestions.includes(q.id));
    if (available.length === 0) {
      setUsedQuestions([]);
      return quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
  }, [usedQuestions]);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const interval = setInterval(() => {
      if (Date.now() > animationEnd) return clearInterval(interval);
      confetti({ ...defaults, particleCount: 40, origin: { x: Math.random(), y: Math.random() * 0.4 } });
    }, 200);
  };

  const handleRollDice = () => {
    if (isRolling || quizModal.isOpen || feedbackModal.isOpen || gameWon) return;
    
    if (!gameStarted) setGameStarted(true);
    setIsRolling(true);
    
    const finalValue = Math.floor(Math.random() * 6) + 1;
    
    // Lemparkan dari bawah (kiri atau kanan acak)
    const startLeft = Math.random() > 0.5 ? "120%" : "-20%";
    const startTop = "120%"; 
    // Jatuh secara acak di area tengah papan
    const endLeft = `${30 + Math.random() * 40}%`; 
    const endTop = `${30 + Math.random() * 40}%`; 
    // Putaran rotasi acak yang sangat banyak
    const rot = (Math.random() > 0.5 ? 1 : -1) * (720 + Math.random() * 360);

    setAnimatedDice({ visible: true, value: 1, startLeft, startTop, endLeft, endTop, rot });

    let rolls = 0;
    const rollInterval = setInterval(() => {
      setAnimatedDice(prev => ({ ...prev, value: Math.floor(Math.random() * 6) + 1 }));
      rolls++;
      if (rolls > 12) { // 1 detik lemparan
        clearInterval(rollInterval);
        setAnimatedDice(prev => ({ ...prev, value: finalValue }));
        setDiceValue(finalValue);
        if (finalValue === 6) updateAchievement("lucky_roller", 1);
        if (!gameStarted) updateAchievement("first_step", 1);
        
        // Biarkan dadu di papan selama 1.2 detik lalu hilangkan
        setTimeout(() => {
          setAnimatedDice(prev => ({ ...prev, visible: false }));
          // Setelah dadu menghilang perlahan, baru jalankan pion
          setTimeout(() => {
            movePlayer(finalValue);
          }, 400); 
        }, 1200);
      }
    }, 80);
  };

  const movePlayer = (steps) => {
    let currentPos = position;
    let targetPos = position + steps;
    if (targetPos > TOTAL_CELLS) targetPos = TOTAL_CELLS;
    
    // Pindahkan pion satu per satu setiap 300ms
    const stepInterval = setInterval(() => {
      currentPos++;
      setPosition(currentPos);
      
      if (currentPos >= targetPos) {
        clearInterval(stepInterval);
        setIsRolling(false);

        // Setelah selesai melangkah, cek menang / ular / tangga
        if (currentPos === TOTAL_CELLS) {
          setGameWon(true);
          setScore(prev => prev + 50);
          updateBestTime(elapsedTime);
          triggerConfetti();
          return;
        }

        if (ladders[currentPos]) {
          const q = getRandomQuestion();
          setUsedQuestions(prev => [...prev, q.id]);
          setTimeout(() => {
            setQuizModal({ isOpen: true, type: "ladder", targetPos: ladders[currentPos], question: q });
          }, 400);
        } else if (snakes[currentPos]) {
          const q = getRandomQuestion();
          setUsedQuestions(prev => [...prev, q.id]);
          setTimeout(() => {
            setQuizModal({ isOpen: true, type: "snake", targetPos: snakes[currentPos], question: q });
          }, 400);
        }
      }
    }, 300);
  };

  const handleAnswer = (selectedIdx) => {
    const isCorrect = selectedIdx === quizModal.question.correctAnswer;
    setQuestionsAnswered(prev => prev + 1);

    let targetPos = null;
    if (quizModal.type === "ladder") {
      if (isCorrect) {
        targetPos = quizModal.targetPos;
        setScore(prev => prev + 10);
        setCorrectAnswers(prev => prev + 1);
        updateAchievement("data_explorer", 1);
      }
    } else if (quizModal.type === "snake") {
      if (isCorrect) {
        setScore(prev => prev + 10);
        setCorrectAnswers(prev => prev + 1);
        updateAchievement("data_explorer", 1);
        updateAchievement("snake_charmer", 1);
      } else {
        targetPos = quizModal.targetPos;
      }
    }

    setQuizModal({ isOpen: false, type: null, targetPos: null, question: null });
    setFeedbackModal({
      isOpen: true,
      isCorrect,
      explanation: quizModal.question.explanation,
      type: quizModal.type,
      targetPos,
    });
  };

  const closeFeedback = () => {
    if (feedbackModal.targetPos !== null) {
      setPosition(feedbackModal.targetPos);
    }
    setFeedbackModal({ isOpen: false, isCorrect: false, explanation: "", type: null, targetPos: null });
  };

  const resetGame = () => {
    setElapsedTime(0);
    setGameStarted(false);
    setPosition(1);
    setDiceValue(null);
    setScore(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setGameWon(false);
    setUsedQuestions([]);
    setQuizModal({ isOpen: false, type: null, targetPos: null, question: null });
    setFeedbackModal({ isOpen: false, isCorrect: false, explanation: "", type: null, targetPos: null });
  };

  const getCellColor = (num) => {
    if (ladders[num]) return "bg-emerald-50 text-emerald-700";
    if (snakes[num]) return "bg-red-50 text-red-700";
    if (num === TOTAL_CELLS) return "bg-amber-50 text-amber-700";
    if (num === 1) return "bg-indigo-50 text-indigo-700";
    return "bg-white text-gray-400";
  };

  const getCellIcon = (num) => {
    if (ladders[num]) return <ArrowUp size={10} className="text-emerald-500" />;
    if (snakes[num]) return <ArrowDown size={10} className="text-red-500" />;
    if (num === TOTAL_CELLS) return <Trophy size={10} className="text-amber-500" />;
    return null;
  };

  // Dice face dots
  const diceDots = {
    1: [[1,1]],
    2: [[0,2],[2,0]],
    3: [[0,2],[1,1],[2,0]],
    4: [[0,0],[0,2],[2,0],[2,2]],
    5: [[0,0],[0,2],[1,1],[2,0],[2,2]],
    6: [[0,0],[0,2],[1,0],[1,2],[2,0],[2,2]],
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full justify-between items-start">
      {/* Left Panel */}
      <div className="w-full xl:w-[260px] 2xl:w-[300px] shrink-0 space-y-4 order-2 xl:order-1">
        {/* Game Info */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-indigo-700 mb-3">🎲 Cara Bermain</h3>
          <ul className="text-gray-500 text-sm space-y-2 leading-relaxed">
            <li className="flex gap-2"><span className="text-emerald-500 font-bold">🪜</span> Tangga: Jawab benar = naik!</li>
            <li className="flex gap-2"><span className="text-red-500 font-bold">🐍</span> Ular: Jawab salah = turun!</li>
            <li className="flex gap-2"><span className="text-amber-500 font-bold">🏆</span> Tujuan: Sampai petak 100!</li>
          </ul>
        </div>
      </div>

      {/* Main Board Area (Center) */}
      <div className="flex-1 w-full flex flex-col items-center gap-4 order-1 xl:order-2">
        {/* Header with Dice & Controls */}
        <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-indigo-700 tracking-tight">Ular Tangga Data 🐍🪜</h2>
            <p className="text-gray-400 text-sm font-medium mt-0.5">Jawab quiz seputar Food Loss & Waste!</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Dice */}
            <div className="w-14 h-14 bg-white border-2 border-indigo-100 rounded-xl shadow-inner flex items-center justify-center p-2">
              {diceValue ? (
                <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-full h-full">
                  {[0,1,2].map(r => [0,1,2].map(c => {
                    const hasDot = diceDots[diceValue]?.some(([dr,dc]) => dr===r && dc===c);
                    return <div key={`${r}-${c}`} className={`rounded-full ${hasDot ? 'bg-indigo-600' : 'bg-transparent'}`} />;
                  }))}
                </div>
              ) : (
                <Dices size={24} className="text-indigo-300" />
              )}
            </div>
            <button 
              onClick={handleRollDice}
              disabled={isRolling || quizModal.isOpen || feedbackModal.isOpen || gameWon}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-6 h-14 font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <Dices size={18} />
              Kocok Dadu
            </button>
            <button 
              onClick={resetGame}
              className="h-14 w-14 rounded-xl border-2 border-gray-100 hover:border-red-300 hover:bg-red-50 flex items-center justify-center transition-all text-gray-400 hover:text-red-500"
              title="Reset Game"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Board */}
        <div className="w-full max-w-[75vh] bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="relative w-full aspect-square">
            <div className="grid grid-cols-10 grid-rows-10 gap-0 relative w-full h-full border-l border-t border-gray-200 rounded-xl overflow-hidden">
              {board.map((row) => (
                row.map((cellNum) => {
                  const isCurrent = position === cellNum;
                  return (
                    <div 
                      key={cellNum}
                      className={`flex flex-col items-center justify-center text-[10px] md:text-xs border-r border-b border-gray-200 transition-all duration-300 relative font-bold ${getCellColor(cellNum)} ${isCurrent ? 'ring-2 ring-indigo-400 ring-offset-2 scale-110 rounded-lg shadow-xl z-10' : ''}`}
                    >
                      <span>{cellNum}</span>
                      {getCellIcon(cellNum)}
                    </div>
                  );
                })
              ))}
            </div>

            {/* SVG Overlay for Ladders & Snakes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              {Object.entries(ladders).map(([from, to], idx) => {
                const start = getCellCenter(Number(from));
                const end = getCellCenter(Number(to));
                const color = PALETTE[idx % PALETTE.length];
                return <Ladder key={`ladder-${from}`} start={start} end={end} color={color} />;
              })}
              {Object.entries(snakes).map(([from, to], idx) => {
                const start = getCellCenter(Number(from));
                const end = getCellCenter(Number(to));
                // Offset index so snakes start with different colors than ladders
                const color = PALETTE[(idx + 4) % PALETTE.length]; 
                return <Snake key={`snake-${from}`} start={start} end={end} color={color} />;
              })}
            </svg>

            {/* Player Token (Rendered absolutely on top of everything) */}
            <motion.div
              className="absolute z-40 w-8 h-10 md:w-10 md:h-12 pointer-events-none"
              animate={{
                left: `${getCellCenter(position).x}%`,
                top: `${getCellCenter(position).y}%`,
                x: "-50%",
                y: "-75%"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Pawn />
            </motion.div>

            {/* Animated Thrown Dice overlay */}
            <AnimatePresence>
              {animatedDice.visible && (
                <motion.div
                  initial={{ 
                    left: animatedDice.startLeft, 
                    top: animatedDice.startTop, 
                    rotate: 0, 
                    scale: 0.3,
                    x: "-50%", y: "-50%" 
                  }}
                  animate={{ 
                    left: animatedDice.endLeft, 
                    top: animatedDice.endTop, 
                    rotate: animatedDice.rot,
                    scale: [0.3, 1.8, 0.8, 1.2, 1] // Animasi memantul (bounce)
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ 
                    duration: 1, 
                    ease: "easeOut",
                    scale: { times: [0, 0.4, 0.6, 0.8, 1], duration: 1 }
                  }}
                  className="absolute z-50 w-20 h-20 md:w-24 md:h-24 bg-white border-4 border-indigo-100 rounded-2xl shadow-2xl flex items-center justify-center p-3"
                >
                  <div className="grid grid-cols-3 grid-rows-3 gap-1 md:gap-1.5 w-full h-full">
                    {[0,1,2].map(r => [0,1,2].map(c => {
                      const hasDot = diceDots[animatedDice.value]?.some(([dr,dc]) => dr===r && dc===c);
                      return <div key={`${r}-${c}`} className={`rounded-full shadow-inner ${hasDot ? 'bg-indigo-600' : 'bg-transparent'}`} />;
                    }))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Win Banner */}
        <AnimatePresence>
          {gameWon && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-amber-50 to-emerald-50 p-6 rounded-2xl border-2 border-amber-200 text-center w-full max-w-[75vh]"
            >
              <h3 className="text-2xl font-black text-amber-700">🎉 Selamat, Kamu Menang!</h3>
              <p className="text-amber-600 mt-2 font-medium">Skor akhir: <span className="font-black text-xl">{score} poin</span> — Jawaban benar: {correctAnswers}/{questionsAnswered}</p>
              <button onClick={resetGame} className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all">
                Main Lagi
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Panel */}
      <div className="w-full xl:w-[260px] 2xl:w-[300px] shrink-0 space-y-4 order-3">
        {/* Score */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-indigo-700 mb-3 flex items-center gap-2">
            <Trophy size={18} /> Skor & Progres
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Posisi</span>
              <span className="text-sm font-bold text-indigo-600">Petak {position}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                animate={{ width: `${position}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-indigo-50 p-2 rounded-xl text-center">
                <span className="block text-[10px] text-indigo-400 font-bold mb-1 uppercase">Skor</span>
                <span className="block text-lg font-black text-indigo-700">{score}</span>
              </div>
              <div className="bg-emerald-50 p-2 rounded-xl text-center">
                <span className="block text-[10px] text-emerald-500 font-bold mb-1 uppercase">Waktu</span>
                <span className="block text-lg font-black text-emerald-700">{formatTime(elapsedTime)}</span>
              </div>
              <div className="bg-amber-50 p-2 rounded-xl text-center">
                <span className="block text-[10px] text-amber-500 font-bold mb-1 uppercase">Kuis</span>
                <span className="block text-lg font-black text-amber-700">{correctAnswers}<span className="text-xs text-amber-400">/{questionsAnswered}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-xs">
          <h3 className="font-bold text-gray-400 mb-3 uppercase tracking-wider">Legenda</h3>
          <div className="space-y-2 text-gray-500">
            {Object.entries(ladders).map(([from, to]) => (
              <div key={`leg-${from}`} className="flex justify-between items-center border-b border-gray-50 pb-1">
                <span className="flex items-center gap-1.5"><ArrowUp size={12} className="text-emerald-500" /> {from} → {to}</span>
              </div>
            ))}
            {Object.entries(snakes).map(([from, to]) => (
              <div key={`leg-${from}`} className="flex justify-between items-center border-b border-gray-50 pb-1 text-red-400">
                <span className="flex items-center gap-1.5"><ArrowDown size={12} className="text-red-400" /> {from} → {to}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {quizModal.isOpen && quizModal.question && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full relative z-10 border border-gray-100"
            >
              <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold mb-4 ${quizModal.type === 'ladder' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {quizModal.type === 'ladder' ? '🪜 Tantangan Tangga — Jawab benar untuk naik!' : '🐍 Bahaya Ular — Jawab benar agar selamat!'}
              </div>
              <h2 className="text-xl font-black text-gray-800 mb-5 leading-snug">
                {quizModal.question.question}
              </h2>
              <div className="space-y-2.5">
                {quizModal.question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="w-full text-left p-3.5 rounded-xl border-2 border-gray-100 hover:border-indigo-400 hover:bg-indigo-50 transition-all font-medium text-gray-600 text-sm"
                  >
                    <span className="text-indigo-400 font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedbackModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeFeedback} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full relative z-10 border border-gray-100 text-center"
            >
              {feedbackModal.isCorrect ? (
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-emerald-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle size={32} className="text-red-600" />
                </div>
              )}
              <h3 className={`text-xl font-black mb-2 ${feedbackModal.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                {feedbackModal.isCorrect ? 'Benar! 🎉' : 'Salah! 😔'}
              </h3>
              <p className={`text-sm font-bold mb-3 ${feedbackModal.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                {feedbackModal.isCorrect
                  ? (feedbackModal.type === 'ladder' ? `Kamu naik ke petak ${feedbackModal.targetPos}!` : 'Kamu selamat dari ular!')
                  : (feedbackModal.type === 'snake' ? `Kamu turun ke petak ${feedbackModal.targetPos}!` : 'Kamu tetap di tempat.')
                }
              </p>
              <p className="text-gray-500 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl mb-5">
                💡 {feedbackModal.explanation}
              </p>
              <button onClick={closeFeedback} className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold transition-all">
                Lanjut
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

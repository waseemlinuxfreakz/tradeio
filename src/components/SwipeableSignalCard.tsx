import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Check, X, ArrowUp, Info } from 'lucide-react';

interface SwipeableSignalCardProps {
  children: React.ReactNode;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
}

const SwipeableSignalCard: React.FC<SwipeableSignalCardProps> = ({
  children,
  onSwipe
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [exitX, setExitX] = useState(0);
  const [exitY, setExitY] = useState(0);
  const dragStartTime = useRef<number>(0);
  const dragStartY = useRef<number>(0);
  const swipeUpTimer = useRef<NodeJS.Timeout>();
  const [showSwipeUpIndicator, setShowSwipeUpIndicator] = useState(false);

  // Motion values for tracking drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values for rotation and indicators
  const rotate = useTransform(x, [-200, 200], [-5, 5]);
  const approveScale = useTransform(x, [0, 100], [0.5, 1.5]);
  const approveOpacity = useTransform(x, [0, 100], [0, 1]);
  const rejectScale = useTransform(x, [-100, 0], [1.5, 0.5]);
  const rejectOpacity = useTransform(x, [-100, 0], [1, 0]);
  const executeScale = useTransform(y, [-100, 0], [1.5, 0.5]);
  const executeOpacity = useTransform(y, [-100, 0], [1, 0]);

  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(true);
    dragStartTime.current = Date.now();
    dragStartY.current = info.point.y;
    
    // Start monitoring for long upward swipe
    if (info.delta.y < 0) { // Only for upward movement
      swipeUpTimer.current = setTimeout(() => {
        const currentY = info.point.y;
        const distance = dragStartY.current - currentY;
        
        if (distance > 100) { // Minimum distance threshold
          setShowSwipeUpIndicator(true);
        }
      }, 1000); // Start showing indicator after 1 second
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    clearTimeout(swipeUpTimer.current);
    setIsDragging(false);
    setShowSwipeUpIndicator(false);

    const swipeThreshold = 100;
    const swipeDuration = Date.now() - dragStartTime.current;
    const xOffset = info.offset.x;
    const yOffset = info.offset.y;
    const distance = dragStartY.current - info.point.y;
    
    // Check for long upward swipe
    if (yOffset < 0 && distance > 100 && swipeDuration > 2000) {
      setExitY(-window.innerHeight);
      onSwipe('up');
    } else if (Math.abs(xOffset) > swipeThreshold) {
      if (xOffset > 0) {
        // Swipe right - Like
        setExitX(window.innerWidth);
        onSwipe('right');
      } else {
        // Swipe left - Dislike
        setExitX(-window.innerWidth);
        onSwipe('left');
      }
    }
  };

  return (
    <div className="relative w-full">
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.9}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={{
          x: exitX,
          y: exitY,
          opacity: exitX !== 0 || exitY !== 0 ? 0 : 1,
          scale: exitX !== 0 || exitY !== 0 ? 0.8 : 1,
          transition: { duration: 0.2 }
        }}
        style={{
          x,
          y,
          rotate,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden"
      >
        {/* Like Indicator (Right Swipe) */}
        <motion.div
          className="absolute top-8 right-8 rounded-full bg-emerald-500/20 p-4"
          style={{ scale: approveScale, opacity: approveOpacity }}
        >
          <Check className="w-8 h-8 text-emerald-500" />
          <div className="absolute top-16 right-0 text-sm text-emerald-500 whitespace-nowrap">
            Like Signal
          </div>
        </motion.div>

        {/* Dislike Indicator (Left Swipe) */}
        <motion.div
          className="absolute top-8 left-8 rounded-full bg-rose-500/20 p-4"
          style={{ scale: rejectScale, opacity: rejectOpacity }}
        >
          <X className="w-8 h-8 text-rose-500" />
          <div className="absolute top-16 left-0 text-sm text-rose-500 whitespace-nowrap">
            Skip Signal
          </div>
        </motion.div>

        {/* Execute Indicator (Up Swipe) */}
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2 rounded-full bg-blue-500/20 p-4"
          style={{ scale: executeScale, opacity: executeOpacity }}
        >
          <ArrowUp className="w-8 h-8 text-blue-500" />
          <div className="absolute top-16 left-1/2 -translate-x-1/2 text-sm text-blue-500 whitespace-nowrap">
            Execute Now
          </div>
        </motion.div>

        {/* Long Press Indicator */}
        {showSwipeUpIndicator && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-blue-400 animate-pulse">
            <Info className="w-4 h-4" />
            Keep swiping up to execute...
          </div>
        )}

        {/* Card Content */}
        {children}
      </motion.div>
    </div>
  );
};

export default SwipeableSignalCard;
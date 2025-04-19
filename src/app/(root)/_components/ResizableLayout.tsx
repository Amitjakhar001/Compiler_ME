"use client";
import { useState, useRef, useEffect, ReactNode } from "react";

interface ResizableLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export default function ResizableLayout({ leftPanel, rightPanel }: ResizableLayoutProps) {
  const [splitPosition, setSplitPosition] = useState(50); // Default 50% split
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    
    // Calculate percentage (constrained between 20% and 80%)
    const newPosition = Math.min(Math.max((mouseX / containerWidth) * 100, 20), 80);
    setSplitPosition(newPosition);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Add touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Add this to properly handle the event
    isDraggingRef.current = true;
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while dragging
    if (!isDraggingRef.current || !containerRef.current || !e.touches[0]) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const touchX = e.touches[0].clientX - containerRect.left;
    
    // Calculate percentage (constrained between 20% and 80%)
    const newPosition = Math.min(Math.max((touchX / containerWidth) * 100, 20), 80);
    setSplitPosition(newPosition);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    document.removeEventListener("touchcancel", handleTouchEnd);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex relative h-[calc(100vh-140px)] min-h-[600px]"
    >
      {/* Left panel (editor) */}
      <div 
        className="overflow-hidden pr-2"
        style={{ width: `${splitPosition}%` }}
      >
        {leftPanel}
      </div>

      {/* Draggable resizer */}
      <div 
        ref={dragRef}
        className="absolute top-0 bottom-0 w-4 bg-transparent cursor-col-resize z-10 flex items-center justify-center"
        style={{ left: `calc(${splitPosition}% - 2px)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="w-1 h-16 bg-gray-600/40 rounded-full hover:bg-blue-500/70 transition-colors" />
      </div>

      {/* Right panel (output) */}
      <div 
        className="overflow-hidden pl-2"
        style={{ width: `${100 - splitPosition}%` }}
      >
        {rightPanel}
      </div>
    </div>
  );
}
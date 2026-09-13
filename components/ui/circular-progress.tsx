"use client";

import { motion } from "motion/react";
import React from "react";

interface ActivityRingsProps {
  size?: number;
  outerValue: number; // 0 to 100 (e.g. Daily Tasks)
  innerValue: number; // 0 to 100 (e.g. XP Progress)
  outerColor?: string;
  innerColor?: string;
  className?: string;
}

export function ActivityRings({
  size = 120,
  outerValue,
  innerValue,
  outerColor = "#10b981", // Emerald (Daily Tasks)
  innerColor = "#6366f1", // Indigo (Level XP)
  className = "",
}: ActivityRingsProps) {
  const strokeWidth = 8;
  const gap = 4;

  // Outer ring (Daily tasks)
  const outerRadius = (size - strokeWidth) / 2;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const outerOffset = outerCircumference - (Math.min(100, Math.max(0, outerValue)) / 100) * outerCircumference;

  // Inner ring (XP Level)
  const innerRadius = outerRadius - strokeWidth - gap;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const innerOffset = innerCircumference - (Math.min(100, Math.max(0, innerValue)) / 100) * innerCircumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 transform overflow-visible"
      >
        {/* Outer Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={outerRadius}
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Outer Animated Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={outerRadius}
          stroke={outerColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={outerCircumference}
          initial={{ strokeDashoffset: outerCircumference }}
          animate={{ strokeDashoffset: outerOffset }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />

        {/* Inner Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Inner Animated Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          stroke={innerColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={innerCircumference}
          initial={{ strokeDashoffset: innerCircumference }}
          animate={{ strokeDashoffset: innerOffset }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        />
      </svg>

      {/* Center Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-sm font-bold font-mono text-white leading-none">
          {Math.round(outerValue)}%
        </span>
        <span className="text-[9px] font-semibold text-slate-400 mt-0.5 tracking-wider uppercase">
          Today
        </span>
      </div>
    </div>
  );
}

interface SingleRingProps {
  size?: number;
  strokeWidth?: number;
  value: number;
  color?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SingleRing({
  size = 40,
  strokeWidth = 4,
  value,
  color = "#6366f1",
  children,
  className = "",
}: SingleRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 transform"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

export function CircularProgress({
  size = 140,
  strokeWidth = 10,
  value,
  colorStart = "#8B5CF6",
  children,
  className = "",
}: any) {
  return (
    <SingleRing size={size} strokeWidth={strokeWidth} value={value} color={colorStart} className={className}>
      {children}
    </SingleRing>
  );
}

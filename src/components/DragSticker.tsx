"use client";

import { motion } from "framer-motion";
import { useRef, type CSSProperties, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  style?: CSSProperties;
  rotate?: number;
  idleRotateRange?: number;
  idleDuration?: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

export default function DragSticker({
  children,
  style,
  rotate = 0,
  idleRotateRange = 3,
  idleDuration = 6,
  onDragStart,
  onDragEnd,
}: Props) {
  const isDraggingRef = useRef(false);

  return (
    <motion.div
      drag
      dragElastic={0.18}
      dragMomentum={true}
      dragTransition={{ power: 0.25, timeConstant: 220, bounceStiffness: 280, bounceDamping: 22 }}
      animate={
        isDraggingRef.current
          ? { rotate }
          : { rotate: [rotate - idleRotateRange, rotate + idleRotateRange, rotate - idleRotateRange] }
      }
      transition={{ duration: idleDuration, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      whileDrag={{ scale: 1.06, cursor: "grabbing", zIndex: 60 }}
      onDragStart={() => {
        isDraggingRef.current = true;
        onDragStart?.();
      }}
      onDragEnd={() => {
        isDraggingRef.current = false;
        onDragEnd?.();
      }}
      style={{
        cursor: "grab",
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

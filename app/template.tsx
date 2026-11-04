"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Route transition — a short cinematic settle on every navigation:
 * the page rises 12px and fades in on the brand's ease curve. Kept
 * under 500ms so it reads as finish, never as waiting.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";

export default function AuthTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.5 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
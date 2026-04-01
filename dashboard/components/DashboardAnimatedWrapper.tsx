"use client";

import { motion } from "framer-motion";

export default function DashboardAnimatedWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full px-8 pt-8 pb-6 flex flex-col gap-6"
    >
      {children}
    </motion.div>
  );
}

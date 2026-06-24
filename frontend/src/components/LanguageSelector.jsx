import React from 'react';
import { motion } from 'framer-motion';

export default function LanguageSelector({
  languages,
  selectedLang,
  setSelectedLang,
  containerVariants = {},
  cardVariants = {}
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 gap-4"
    >
      {languages.map((lang) => (
        <motion.button
          key={lang}
          variants={cardVariants}
          onClick={() => setSelectedLang(lang)}
          className={`p-4 rounded-xl font-semibold border text-center transition cursor-pointer ${
            selectedLang === lang
              ? 'ring-2 ring-accent border-accent bg-panel scale-105 text-text'
              : 'bg-surface border-border text-muted hover:border-accent/40'
          }`}
        >
          {lang}
        </motion.button>
      ))}
    </motion.div>
  );
}
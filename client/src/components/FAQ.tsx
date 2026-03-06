import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { TobaccoLeafPattern, FiligreeDivider } from "./Decorations";

const faqs = [
  {
    question: "Where are Attaie cigars made?",
    answer: "All Attaie cigars are hand-rolled in our dedicated facility in the Dominican Republic, using time-honored techniques passed down through generations of master torcedores."
  },
  {
    question: "Which cigar is best for beginners?",
    answer: "We recommend starting with the Attaie Reserve Robusto. Its mild-to-medium body offers a smooth introduction to premium cigars with notes of cream and nuts."
  },
  {
    question: "What makes Attaie Reserve different?",
    answer: "Each Attaie cigar is aged for a minimum of 5 years in cedar vaults. This patient process allows the flavors to marry and mellow, creating unparalleled complexity and smoothness."
  },
  {
    question: "How should I store my cigars?",
    answer: "Store your Attaie cigars in a humidor maintained at 65-72% relative humidity and 65-70°F. This preserves the natural oils and ensures an optimal smoking experience."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to most countries worldwide. During our grand opening, enjoy free shipping on all orders within the United States."
  },
  {
    question: "What's the difference between Reserve, Black, and Platinum?",
    answer: "Reserve is our classic medium-bodied line. Black delivers bold, full-bodied complexity for experienced smokers. Platinum represents our ultra-premium selection with rare, aged tobaccos."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="snap-section py-16 md:py-32 bg-[#0A0A0A] relative texture-overlay">
      <TobaccoLeafPattern opacity={0.015} />
      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-10 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#C5A059] text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase mb-4 md:mb-6 block">Need Info?</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white">Frequently Asked Questions</h2>
          <FiligreeDivider className="mt-6 md:mt-10" />
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-0 border-t border-white/10">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className="border-b border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-5 md:py-7 flex items-center justify-between text-left group"
                data-testid={`button-faq-${index}`}
              >
                <span className={`font-serif text-base md:text-xl transition-colors pr-4 ${
                  openIndex === index ? 'text-[#C5A059]' : 'text-white group-hover:text-[#C5A059]'
                }`}>
                  {faq.question}
                </span>
                <motion.div 
                  className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 border border-white/20 flex items-center justify-center"
                  whileHover={{ borderColor: "rgba(197, 160, 89, 0.5)" }}
                >
                  {openIndex === index ? (
                    <Minus className="w-3 h-3 md:w-4 md:h-4 text-[#C5A059]" />
                  ) : (
                    <Plus className="w-3 h-3 md:w-4 md:h-4 text-white/50" />
                  )}
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 md:pb-7 text-white/50 leading-relaxed font-light max-w-3xl text-sm md:text-base">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, RotateCcw, Leaf, TreeDeciduous, Trophy, Droplet, TreePine, Flame, Zap, Moon, Crown, Sun, PartyPopper, Gift, Check } from "lucide-react";
import { Link } from "wouter";

interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; value: string; icon: React.ElementType }[];
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "How experienced are you with cigars?",
    options: [
      { label: "New to cigars", value: "beginner", icon: Leaf },
      { label: "Occasional smoker", value: "intermediate", icon: TreeDeciduous },
      { label: "Seasoned aficionado", value: "expert", icon: Trophy },
    ],
  },
  {
    id: 2,
    question: "What flavors do you prefer?",
    options: [
      { label: "Creamy & Smooth", value: "mild", icon: Droplet },
      { label: "Earthy & Woody", value: "medium", icon: TreePine },
      { label: "Bold & Spicy", value: "full", icon: Flame },
    ],
  },
  {
    id: 3,
    question: "How much time do you have?",
    options: [
      { label: "Quick break (30 min)", value: "short", icon: Zap },
      { label: "Relaxed evening (1 hour)", value: "medium", icon: Moon },
      { label: "Extended occasion (1.5+ hrs)", value: "long", icon: Crown },
    ],
  },
  {
    id: 4,
    question: "What's the occasion?",
    options: [
      { label: "Daily enjoyment", value: "casual", icon: Sun },
      { label: "Special celebration", value: "special", icon: PartyPopper },
      { label: "Gift for someone", value: "gift", icon: Gift },
    ],
  },
];

interface CigarRecommendation {
  name: string;
  description: string;
  strength: string;
  imageUrl: string;
}

const getRecommendation = (answers: Record<number, string>): CigarRecommendation => {
  const experience = answers[1];
  const flavor = answers[2];

  if (experience === "beginner" || flavor === "mild") {
    return {
      name: "Attaie Reserve Robusto",
      description: "A smooth, creamy introduction to premium cigars with gentle notes of vanilla and cedar.",
      strength: "Mild to Medium",
      imageUrl: "https://images.unsplash.com/photo-1627807452654-72944b58e7f1?auto=format&fit=crop&q=80&w=800",
    };
  } else if (flavor === "full" || experience === "expert") {
    return {
      name: "Attaie Reserve Black",
      description: "Our boldest offering. Rich, intense, and complex with dark chocolate and espresso notes.",
      strength: "Full",
      imageUrl: "https://images.unsplash.com/photo-1550953613-2cb979b0091c?auto=format&fit=crop&q=80&w=800",
    };
  } else {
    return {
      name: "Attaie Reserve Toro",
      description: "A perfectly balanced medium-bodied cigar with notes of earth, leather, and subtle spice.",
      strength: "Medium-Full",
      imageUrl: "https://images.unsplash.com/photo-1596637508086-4c40590a5996?auto=format&fit=crop&q=80&w=800",
    };
  }
};

export function CigarQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const currentQuestion = questions[currentStep];
  const recommendation = showResult ? getRecommendation(answers) : null;
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <section className="snap-section py-16 md:py-32 bg-gradient-to-b from-[#0D0D0D] to-[#0A0A0A] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.05),transparent_60%)]" />
      
      <div className="max-w-3xl mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#C5A059] text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase mb-4 md:mb-6 block">Discover Your Match</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white italic">Find Your Perfect Cigar</h2>
        </motion.div>

        {/* Progress bar */}
        {!showResult && (
          <div className="mb-10 md:mb-12">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white/30 text-xs">Question {currentStep + 1} of {questions.length}</span>
              <span className="text-[#C5A059] text-xs">{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-[#C5A059]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Quiz Content */}
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl md:text-2xl font-serif text-white text-center mb-8 md:mb-12">
                {currentQuestion.question}
              </h3>

              <div className="grid gap-4">
                {currentQuestion.options.map((option, index) => {
                  const IconComponent = option.icon;
                  const isSelected = answers[currentQuestion.id] === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => handleAnswer(currentQuestion.id, option.value)}
                      className={`p-5 md:p-6 border text-left transition-all duration-300 flex items-center gap-4 ${
                        isSelected
                          ? "border-[#C5A059] bg-[#C5A059]/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      data-testid={`quiz-option-${option.value}`}
                    >
                      <IconComponent className={`w-6 h-6 ${isSelected ? "text-[#C5A059]" : "text-white/50"}`} />
                      <span className={`text-base md:text-lg ${
                        isSelected ? "text-[#C5A059]" : "text-white/70"
                      }`}>
                        {option.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-10 md:mt-12">
                <button
                  onClick={prevStep}
                  className={`flex items-center gap-2 text-white/50 hover:text-white transition-colors ${
                    currentStep === 0 ? "invisible" : ""
                  }`}
                  data-testid="button-quiz-prev"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back</span>
                </button>
                <motion.button
                  onClick={nextStep}
                  disabled={!answers[currentQuestion.id]}
                  className="flex items-center gap-2 px-6 py-3 bg-[#C5A059] text-black text-sm uppercase tracking-wider font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                  whileHover={{ scale: answers[currentQuestion.id] ? 1.02 : 1 }}
                  whileTap={{ scale: answers[currentQuestion.id] ? 0.98 : 1 }}
                  data-testid="button-quiz-next"
                >
                  <span>{currentStep === questions.length - 1 ? "See My Match" : "Next"}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 border-2 border-[#C5A059] flex items-center justify-center mx-auto mb-8"
              >
                <Check className="text-[#C5A059] w-8 h-8" />
              </motion.div>

              <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">Your Perfect Match</h3>
              <p className="text-white/50 mb-10">Based on your preferences, we recommend:</p>

              <div className="border border-white/10 p-6 md:p-10 bg-gradient-to-b from-white/5 to-transparent">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <motion.img
                    src={recommendation?.imageUrl}
                    alt={recommendation?.name}
                    className="w-full aspect-[4/5] object-cover"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  />
                  <div className="text-left">
                    <span className="text-[#C5A059] text-xs tracking-[0.3em] uppercase mb-3 block">{recommendation?.strength}</span>
                    <h4 className="text-2xl md:text-3xl font-serif text-white mb-4">{recommendation?.name}</h4>
                    <p className="text-white/50 leading-relaxed mb-8">{recommendation?.description}</p>
                    <Link href="/catalog">
                      <span 
                        className="inline-block px-8 py-4 bg-[#C5A059] text-black text-xs tracking-[0.2em] uppercase font-semibold cursor-pointer"
                        data-testid="button-quiz-shop"
                      >
                        Shop Now
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              <button
                onClick={restart}
                className="flex items-center gap-2 text-white/50 hover:text-[#C5A059] transition-colors mx-auto mt-10"
                data-testid="button-quiz-restart"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm">Take Quiz Again</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

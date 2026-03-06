import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone, Mail, MapPin, Clock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const quickLinks = [
    { icon: Phone, label: "Call Us", value: "(555) 123-4567", href: "tel:+15551234567" },
    { icon: Mail, label: "Email", value: "concierge@attaiecigars.com", href: "mailto:concierge@attaiecigars.com" },
    { icon: MapPin, label: "Find Retailers", value: "Locate a store near you", href: "/retailers" },
    { icon: HelpCircle, label: "Cigar Guide", value: "Learn about our cigars", href: "/guide" },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-24 right-6 z-[70] w-80 bg-[#0A0A0A] border border-[#C5A059]/30 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
              data-testid="panel-help-widget"
            >
              <div className="bg-gradient-to-r from-[#C5A059]/20 via-[#2DD4BF]/10 to-[#E8736F]/20 p-5 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-serif text-lg">How can we help?</h3>
                    <p className="text-white/50 text-xs mt-1">Our concierge team is here for you</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    data-testid="button-close-help"
                  >
                    <X className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2">
                {quickLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover-elevate transition-colors group"
                    data-testid={`link-help-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2DD4BF]/20 to-[#1a6b6b]/20 flex items-center justify-center border border-[#2DD4BF]/30 group-hover:border-[#C5A059]/50 transition-colors">
                      <link.icon className="w-4 h-4 text-[#2DD4BF] group-hover:text-[#C5A059] transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{link.label}</p>
                      <p className="text-white/40 text-xs truncate">{link.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="p-4 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>Mon-Sat: 10am - 8pm EST</span>
                </div>
                <Button
                  asChild
                  className="w-full mt-3 bg-gradient-to-r from-[#C5A059] to-[#8B7355] text-black font-medium text-xs uppercase tracking-wider hover:opacity-90"
                >
                  <a href="/contact" data-testid="link-help-contact">
                    Send a Message
                  </a>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-[5.5rem] z-[60] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isOpen 
            ? "bg-white/10 border border-white/20" 
            : "bg-gradient-to-br from-[#2DD4BF] to-[#1a6b6b] shadow-[#2DD4BF]/20 hover:shadow-xl hover:shadow-[#2DD4BF]/30"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open help"
        data-testid="button-help-widget"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-5 h-5 text-black" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Facebook, Twitter, Link2, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title, description = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      color: "#1877F2"
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
      color: "#1DA1F2"
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} - ${fullUrl}`)}`,
      color: "#25D366"
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="border-white/20 text-white/70 hover:text-white hover:border-[#C5A059]/50 gap-2"
        data-testid="button-share-toggle"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 z-50 bg-[#0A0A0A] border border-[#C5A059]/30 rounded-xl shadow-xl p-4 min-w-[200px]"
              data-testid="panel-share-options"
            >
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Share this cigar</p>
              
              <div className="flex gap-2 mb-4">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:brightness-125 transition-all"
                    style={{ backgroundColor: `${link.color}20` }}
                    onClick={() => setIsOpen(false)}
                    data-testid={`link-share-${link.name.toLowerCase()}`}
                  >
                    <link.icon className="w-4 h-4" style={{ color: link.color }} />
                  </a>
                ))}
              </div>

              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover-elevate transition-colors"
                data-testid="button-share-copy-link"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[#2DD4BF]" />
                ) : (
                  <Link2 className="w-4 h-4 text-white/60" />
                )}
                <span className="text-sm text-white/70">
                  {copied ? "Link copied!" : "Copy link"}
                </span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

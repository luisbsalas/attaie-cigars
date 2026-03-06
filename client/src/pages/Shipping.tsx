import { motion } from "framer-motion";
import { Package, RotateCcw, Shield, Clock, Truck, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { TropicalPattern } from "@/components/Decorations";

export default function Shipping() {
  const shippingInfo = [
    {
      icon: Truck,
      title: "Standard Shipping",
      details: "5-7 business days",
      description: "Free on orders over $150. $9.95 flat rate for orders under $150.",
      color: "#2DD4BF"
    },
    {
      icon: Clock,
      title: "Express Shipping",
      details: "2-3 business days",
      description: "$19.95 flat rate. Available for orders placed before 2pm EST.",
      color: "#C5A059"
    },
    {
      icon: Package,
      title: "Overnight Shipping",
      details: "Next business day",
      description: "$34.95 flat rate. Orders must be placed before 12pm EST.",
      color: "#E8736F"
    }
  ];

  const returnPolicy = [
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Unopened products may be returned within 30 days of delivery for a full refund."
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "If your cigars arrive damaged or in poor condition, we'll replace them at no cost."
    },
    {
      icon: AlertCircle,
      title: "Return Conditions",
      description: "Items must be unopened and in original packaging. Opened boxes cannot be returned due to tobacco regulations."
    }
  ];

  const faqs = [
    {
      q: "How are cigars shipped?",
      a: "All cigars are shipped in humidity-controlled packaging with Boveda packs to maintain optimal freshness during transit."
    },
    {
      q: "Do you ship internationally?",
      a: "Currently, we only ship within the United States due to tobacco import regulations. We hope to expand internationally in the future."
    },
    {
      q: "What if my package is delayed?",
      a: "Contact our concierge team with your order number and we'll investigate immediately. We'll work with the carrier to locate your package or send a replacement."
    },
    {
      q: "Can I change my shipping address after ordering?",
      a: "Yes, if your order hasn't shipped yet. Contact us immediately and we'll update the address. Once shipped, changes aren't possible."
    },
    {
      q: "Do I need to sign for my package?",
      a: "Yes, adult signature (21+) is required for all orders containing tobacco products. Someone of legal age must be present to receive the delivery."
    }
  ];

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      {/* Hero Section */}
      <section className="snap-section relative py-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2DD4BF]/15 via-transparent to-[#E8736F]/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.1)_0%,transparent_50%)]" />
        <TropicalPattern opacity={0.03} />
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-[#2DD4BF] text-xs tracking-[0.3em] uppercase mb-6 block" data-testid="text-shipping-subtitle">
            Policies & Information
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6" data-testid="text-shipping-title">
            Shipping & <span className="italic bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] bg-clip-text text-transparent">Returns</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
            We take great care in packaging and shipping your cigars to ensure they arrive in perfect condition
          </p>
        </motion.div>
      </section>

      {/* Shipping Options */}
      <section className="snap-section py-24 relative">
        <TropicalPattern opacity={0.02} />
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#C5A059] text-xs tracking-[0.3em] uppercase mb-4 block">
              Delivery Options
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-white">
              Shipping <span className="italic text-[#C5A059]">Methods</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {shippingInfo.map((option, index) => (
              <motion.div
                key={option.title}
                className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl hover:border-[#C5A059]/30 transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${option.color}20`, border: `1px solid ${option.color}40` }}
                >
                  <option.icon className="w-6 h-6" style={{ color: option.color }} />
                </div>
                <h3 className="text-xl font-serif text-white mb-2">{option.title}</h3>
                <p className="text-[#C5A059] text-sm font-medium mb-3">{option.details}</p>
                <p className="text-white/50 text-sm leading-relaxed">{option.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 p-6 bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 rounded-xl flex items-start gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <CheckCircle2 className="w-6 h-6 text-[#2DD4BF] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-medium mb-1">Free Shipping on Orders Over $150</h4>
              <p className="text-white/50 text-sm">
                Enjoy complimentary standard shipping on all qualifying orders within the continental United States.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Return Policy */}
      <section className="snap-section py-24 bg-gradient-to-b from-[#0A0A0A] to-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#E8736F] text-xs tracking-[0.3em] uppercase mb-4 block">
              Our Promise
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-white">
              Return <span className="italic text-[#E8736F]">Policy</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {returnPolicy.map((policy, index) => (
              <motion.div
                key={policy.title}
                className="text-center p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E8736F]/20 to-[#C5A059]/20 flex items-center justify-center mx-auto mb-6 border border-[#E8736F]/30">
                  <policy.icon className="w-7 h-7 text-[#E8736F]" />
                </div>
                <h3 className="text-xl font-serif text-white mb-3">{policy.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{policy.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="snap-section py-24 relative">
        <TropicalPattern opacity={0.02} />
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#B8A9C9] text-xs tracking-[0.3em] uppercase mb-4 block">
              Common Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-white">
              Shipping <span className="italic text-[#B8A9C9]">FAQs</span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white/5 border border-white/10 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="snap-section py-24 text-center bg-gradient-to-b from-[#0d0d0d] to-[#1a6b6b]/10">
        <motion.div
          className="max-w-2xl mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <MapPin className="w-10 h-10 text-[#2DD4BF] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
            Questions About Your Order?
          </h2>
          <p className="text-white/50 mb-8">
            Our concierge team is here to help with any shipping or return inquiries.
          </p>
          <a 
            href="/contact"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#C5A059] to-[#8B7355] text-black font-medium text-sm uppercase tracking-wider rounded-md hover:opacity-90 transition-opacity"
            data-testid="link-contact-shipping"
          >
            Contact Concierge
          </a>
        </motion.div>
      </section>
    </div>
  );
}

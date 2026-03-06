import { motion } from "framer-motion";
import { Scissors, Flame, Thermometer, Clock, Wind, Package } from "lucide-react";
import { TropicalPattern } from "@/components/Decorations";

const guideSections = [
  {
    icon: Package,
    title: "Selecting Your Cigar",
    content: [
      {
        subtitle: "Visual Inspection",
        text: "Look for a cigar with a smooth, oily wrapper without cracks, tears, or blemishes. The color should be uniform, and the construction should feel firm but not hard."
      },
      {
        subtitle: "The Squeeze Test",
        text: "Gently squeeze the cigar along its length. It should have slight give without any soft spots or hard lumps, indicating proper moisture and construction."
      },
      {
        subtitle: "The Aroma",
        text: "Smell the foot of the cigar (the unlit end). A quality cigar will have rich, complex aromas—hints of earth, leather, sweetness, or spice depending on the blend."
      }
    ]
  },
  {
    icon: Scissors,
    title: "Cutting Your Cigar",
    content: [
      {
        subtitle: "Straight Cut",
        text: "The most common method. Use a sharp guillotine cutter and cut just above the cap line (about 1/16\" from the head). This provides optimal draw and flavor."
      },
      {
        subtitle: "V-Cut",
        text: "Creates a wedge-shaped notch that concentrates smoke on the palate. Ideal for cigars with smaller ring gauges and those who prefer a tighter draw."
      },
      {
        subtitle: "Punch Cut",
        text: "Creates a small hole in the cap. Best for larger ring gauge cigars. Produces a more concentrated flavor experience with less tobacco on your lips."
      }
    ]
  },
  {
    icon: Flame,
    title: "Lighting Your Cigar",
    content: [
      {
        subtitle: "Toast the Foot",
        text: "Hold the flame about half an inch from the foot and rotate the cigar slowly. You want to char the entire end evenly without letting the flame touch the tobacco directly."
      },
      {
        subtitle: "Light and Draw",
        text: "Once toasted, put the cigar to your lips and draw while continuing to rotate over the flame. Take your time—rushing creates an uneven burn."
      },
      {
        subtitle: "Use the Right Flame",
        text: "Butane lighters or cedar matches are preferred. Avoid regular matches or liquid fuel lighters, which can impart unwanted flavors to your cigar."
      }
    ]
  },
  {
    icon: Wind,
    title: "Smoking Your Cigar",
    content: [
      {
        subtitle: "Pacing is Key",
        text: "Draw on your cigar about once per minute. Smoking too fast heats the cigar, causing bitter flavors. Smoking too slow may cause it to go out."
      },
      {
        subtitle: "Don't Inhale",
        text: "Unlike cigarettes, cigar smoke is meant to be savored in the mouth, not inhaled into the lungs. Enjoy the flavors on your palate."
      },
      {
        subtitle: "Let the Ash Build",
        text: "A well-made cigar will hold an inch or more of ash. This acts as an insulator, keeping the cherry at the ideal temperature for optimal flavor."
      }
    ]
  },
  {
    icon: Thermometer,
    title: "Storage Essentials",
    content: [
      {
        subtitle: "The 70/70 Rule",
        text: "Store cigars at 70% relative humidity and 70°F (21°C). This maintains the oils and moisture essential for proper flavor and burn."
      },
      {
        subtitle: "Humidor Care",
        text: "Season a new humidor before use. Check humidity levels regularly with a calibrated hygrometer. Rotate cigars periodically for even aging."
      },
      {
        subtitle: "Keep It Clean",
        text: "Never store flavored cigars with regular cigars. The flavors will transfer. Also avoid storing anything else in your humidor that could affect the cigars."
      }
    ]
  },
  {
    icon: Clock,
    title: "Aging & Patience",
    content: [
      {
        subtitle: "Rest After Purchase",
        text: "Allow new cigars to rest in your humidor for at least two weeks after purchase. This stabilizes moisture levels after shipping and handling."
      },
      {
        subtitle: "The Aging Process",
        text: "Like fine wine, many cigars improve with age. The tobaccos marry together, harshness mellows, and complexity develops over months or years."
      },
      {
        subtitle: "Know Your Blends",
        text: "Milder cigars age faster than full-bodied ones. Some cigars peak at 2-3 years, while others continue improving for a decade or more."
      }
    ]
  }
];

const strengthLevels = [
  { level: "Mild", description: "Smooth, creamy flavors with subtle nuances. Perfect for morning smokes or those new to cigars.", color: "from-[#e8dcc8] to-[#d4c4a8]" },
  { level: "Medium", description: "Balanced complexity with notes of leather, cedar, and earth. The versatile choice for any occasion.", color: "from-[#c9a878] to-[#b89558]" },
  { level: "Medium-Full", description: "Rich, bold flavors with increased spice and depth. For the experienced palate seeking more intensity.", color: "from-[#8b6b3d] to-[#725630]" },
  { level: "Full", description: "Powerful, complex profiles with pepper, dark chocolate, and espresso notes. For the true aficionado.", color: "from-[#4a3728] to-[#2d221a]" }
];

export default function CigarGuide() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      {/* Hero Section */}
      <section className="snap-section relative py-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1596637508086-4c40590a5996?auto=format&fit=crop&q=80&w=2000"
            alt="Cigar guide"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8736F]/15 via-transparent to-[#2DD4BF]/15" />
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-[#E8736F] text-xs tracking-[0.3em] uppercase mb-6 block">
            The Art of Enjoyment
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
            Cigar <span className="italic bg-gradient-to-r from-[#C5A059] via-[#E8736F] to-[#2DD4BF] bg-clip-text text-transparent">Guide</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
            Master the ritual of the perfect smoke with our comprehensive guide to cigar selection, cutting, lighting, and storage
          </p>
        </motion.div>
      </section>

      {/* Strength Guide */}
      <section className="snap-section py-24 relative">
        <TropicalPattern opacity={0.03} />
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#2DD4BF] text-xs tracking-[0.3em] uppercase mb-4 block">
              Know Your Strength
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-white">
              Understanding <span className="italic bg-gradient-to-r from-[#C5A059] to-[#E8736F] bg-clip-text text-transparent">Body & Strength</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {strengthLevels.map((item, index) => (
              <motion.div
                key={item.level}
                className="relative overflow-hidden rounded-lg p-6 border border-white/10 group hover:border-[#C5A059]/30 transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`} />
                <h3 className="text-white text-xl font-serif mb-3">{item.level}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Guide Sections */}
      <section className="snap-section py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-24">
            {guideSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="grid md:grid-cols-12 gap-8 items-start">
                  {/* Section Header */}
                  <div className="md:col-span-4 lg:col-span-3 sticky top-24">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E8736F]/20 to-[#2DD4BF]/20 flex items-center justify-center border border-[#E8736F]/30">
                        <section.icon className="w-6 h-6 text-[#E8736F]" />
                      </div>
                      <span className="text-[#E8736F] text-xs uppercase tracking-wider">
                        Step {sectionIndex + 1}
                      </span>
                    </div>
                    <h3 className="text-3xl font-serif text-white">{section.title}</h3>
                  </div>

                  {/* Section Content */}
                  <div className="md:col-span-8 lg:col-span-9 space-y-8">
                    {section.content.map((item, itemIndex) => (
                      <motion.div
                        key={item.subtitle}
                        className="p-6 bg-gradient-to-br from-[#E8736F]/5 to-[#2DD4BF]/5 border border-[#E8736F]/20 rounded-xl hover:border-[#E8736F]/40 transition-colors"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: itemIndex * 0.1 }}
                      >
                        <h4 className="text-white font-medium mb-2">{item.subtitle}</h4>
                        <p className="text-white/50 leading-relaxed">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro Tips Section */}
      <section className="snap-section py-24 bg-gradient-to-b from-[#0A0A0A] to-[#1a6b6b]/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#C5A059] text-xs tracking-[0.3em] uppercase mb-4 block">
              Final Wisdom
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-12">
              Pro Tips from <span className="italic text-[#C5A059]">Master Rollers</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { tip: "Never bite or use your teeth to cut a cigar—it damages the wrapper and affects the draw.", number: "01" },
              { tip: "If your cigar goes out, gently blow through it to expel stale smoke before relighting.", number: "02" },
              { tip: "The last third of a cigar is often the richest—don't give up too soon.", number: "03" }
            ].map((item, index) => (
              <motion.div
                key={item.number}
                className="text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-5xl font-serif text-[#C5A059]/30 mb-4 block">{item.number}</span>
                <p className="text-white/60 leading-relaxed">{item.tip}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="snap-section py-24 text-center">
        <motion.div
          className="max-w-2xl mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
            Ready to Apply Your Knowledge?
          </h2>
          <p className="text-white/50 mb-8">
            Browse our collection and find the perfect cigar to practice these techniques.
          </p>
          <a 
            href="/catalog"
            className="inline-block px-10 py-4 bg-[#C5A059] text-black font-medium text-sm uppercase tracking-wider"
            data-testid="link-shop-cigars"
          >
            Shop Our Cigars
          </a>
        </motion.div>
      </section>
    </div>
  );
}

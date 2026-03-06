import { motion } from "framer-motion";
import { TropicalPattern } from "@/components/Decorations";
import { DecorativeDivider } from "@/components/BaroqueFrame";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function TermsOfUse() {
  useEffect(() => {
    document.title = "Terms of Use | Attaie Cigars";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Terms of Use for Attaie Cigars premium cigar e-commerce website. Read our terms regarding age verification, purchases, shipping, and site usage.');
    }
    
    return () => {
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Attaie Cigars - Premium hand-rolled cigars from the Dominican Republic.');
      }
    };
  }, []);

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <section className="py-24 relative">
        <TropicalPattern opacity={0.02} />
        
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-[#C5A059] hover:text-white transition-colors mb-8" data-testid="link-back-home">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm tracking-wider uppercase">Back to Home</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4" data-testid="text-terms-title">
              Terms of <span className="italic text-[#C5A059]">Use</span>
            </h1>
            <p className="text-white/40 mb-8">Last updated: February 2026</p>
            
            <DecorativeDivider variant="simple" className="mb-12" />
          </motion.div>

          <motion.div
            className="prose prose-invert prose-lg max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-8 text-white/70">
              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">1. Acceptance of Terms</h2>
                <p className="leading-relaxed">
                  By accessing and using the Attaie Cigars website ("Site"), you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our Site. These terms apply to all visitors, users, and others who access or use the Site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">2. Age Verification</h2>
                <p className="leading-relaxed">
                  You must be at least 21 years of age to access this Site and purchase our products. By using this Site, you represent and warrant that you are at least 21 years old. We reserve the right to request proof of age at any time and to deny access or sales to anyone who cannot provide satisfactory proof of age.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">3. Use of the Site</h2>
                <p className="leading-relaxed mb-4">
                  You agree to use the Site only for lawful purposes and in accordance with these Terms. You agree not to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use the Site in any way that violates any applicable federal, state, local, or international law</li>
                  <li>Attempt to interfere with the proper working of the Site</li>
                  <li>Use any robot, spider, or other automatic device to access the Site</li>
                  <li>Introduce any viruses, trojan horses, worms, or other malicious material</li>
                  <li>Attempt to gain unauthorized access to any portion of the Site</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">4. Intellectual Property</h2>
                <p className="leading-relaxed">
                  The Site and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Attaie Cigars, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">5. Products and Purchases</h2>
                <p className="leading-relaxed">
                  All purchases made through our Site are subject to product availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice. We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">6. Shipping and Delivery</h2>
                <p className="leading-relaxed">
                  Tobacco products can only be shipped to addresses where the recipient is at least 21 years of age. Adult signature is required for all deliveries. We do not ship to states or jurisdictions where the sale or shipment of tobacco products is prohibited. You are responsible for complying with all applicable laws regarding the purchase and receipt of tobacco products.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">7. Disclaimer of Warranties</h2>
                <p className="leading-relaxed">
                  THE SITE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. NEITHER ATTAIE CIGARS NOR ANY PERSON ASSOCIATED WITH ATTAIE CIGARS MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE SITE.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">8. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  IN NO EVENT WILL ATTAIE CIGARS, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SITE, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE SITE OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">9. Governing Law</h2>
                <p className="leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms shall be brought exclusively in the federal or state courts located in Florida.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">10. Changes to Terms</h2>
                <p className="leading-relaxed">
                  We reserve the right to modify these Terms at any time. If we make changes, we will post the amended terms on this page and update the "Last updated" date. Your continued use of the Site after any such changes constitutes your acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">11. Contact Information</h2>
                <p className="leading-relaxed">
                  If you have any questions about these Terms of Use, please contact us at:
                </p>
                <div className="mt-4 p-6 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-white font-serif text-lg">Attaie Cigars</p>
                  <p className="text-white/50 mt-2">Email: legal@attaiecigars.com</p>
                </div>
              </section>
            </div>
          </motion.div>

          <div className="flex justify-center py-16">
            <DecorativeDivider variant="ornate" />
          </div>
        </div>
      </section>
    </div>
  );
}

import { motion } from "framer-motion";
import { TropicalPattern } from "@/components/Decorations";
import { DecorativeDivider } from "@/components/BaroqueFrame";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | Attaie Cigars";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Privacy Policy for Attaie Cigars. Learn how we collect, use, and protect your personal information when you visit our site or make a purchase.');
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
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4" data-testid="text-privacy-title">
              Privacy <span className="italic text-[#C5A059]">Policy</span>
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
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">1. Introduction</h2>
                <p className="leading-relaxed">
                  Attaie Cigars ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">2. Information We Collect</h2>
                <p className="leading-relaxed mb-4">
                  We may collect information about you in a variety of ways. The information we may collect includes:
                </p>
                
                <h3 className="text-xl font-serif text-white/90 mb-3 mt-6">Personal Data</h3>
                <p className="leading-relaxed">
                  When you make a purchase or register on our Site, we may collect personally identifiable information, such as your name, shipping address, email address, telephone number, date of birth, and payment information.
                </p>
                
                <h3 className="text-xl font-serif text-white/90 mb-3 mt-6">Age Verification Data</h3>
                <p className="leading-relaxed">
                  As required by law for tobacco product sales, we collect age verification information to confirm you are at least 21 years of age. This may include date of birth and government-issued ID verification.
                </p>
                
                <h3 className="text-xl font-serif text-white/90 mb-3 mt-6">Derivative Data</h3>
                <p className="leading-relaxed">
                  Our servers automatically collect information when you access the Site, such as your IP address, browser type, operating system, access times, and the pages you have viewed.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">3. Use of Your Information</h2>
                <p className="leading-relaxed mb-4">
                  We use information collected about you to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Process and fulfill your orders</li>
                  <li>Verify your age for tobacco product purchases</li>
                  <li>Send you order confirmations and shipping updates</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Send promotional communications (with your consent)</li>
                  <li>Improve our website and customer service</li>
                  <li>Prevent fraudulent transactions and monitor against theft</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">4. Disclosure of Your Information</h2>
                <p className="leading-relaxed mb-4">
                  We may share information we have collected about you in certain situations:
                </p>
                
                <h3 className="text-xl font-serif text-white/90 mb-3 mt-6">By Law or to Protect Rights</h3>
                <p className="leading-relaxed">
                  If we believe the release of information is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by applicable law.
                </p>
                
                <h3 className="text-xl font-serif text-white/90 mb-3 mt-6">Third-Party Service Providers</h3>
                <p className="leading-relaxed">
                  We may share your information with third parties that perform services for us, including payment processing, shipping, age verification, data analysis, email delivery, hosting services, and customer service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">5. Security of Your Information</h2>
                <p className="leading-relaxed">
                  We use administrative, technical, and physical security measures to protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">6. Cookies and Tracking Technologies</h2>
                <p className="leading-relaxed">
                  We may use cookies, web beacons, tracking pixels, and other tracking technologies to help customize the Site and improve your experience. You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies through your browser settings. If you disable cookies, some features of the Site may not function properly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">7. Your Rights</h2>
                <p className="leading-relaxed mb-4">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The right to access the personal data we hold about you</li>
                  <li>The right to request correction of inaccurate personal data</li>
                  <li>The right to request deletion of your personal data</li>
                  <li>The right to opt-out of marketing communications</li>
                  <li>The right to data portability</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  To exercise any of these rights, please contact us using the information provided below.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">8. California Privacy Rights</h2>
                <p className="leading-relaxed">
                  California residents may request information regarding the disclosure of personal information to third parties for direct marketing purposes. We do not share personal information with third parties for their direct marketing purposes without your consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">9. Children's Privacy</h2>
                <p className="leading-relaxed">
                  Our Site is not intended for individuals under the age of 21. We do not knowingly collect personal information from anyone under 21 years of age. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately so we can delete such information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">10. Changes to This Privacy Policy</h2>
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif text-[#C5A059] mb-4">11. Contact Us</h2>
                <p className="leading-relaxed">
                  If you have questions or comments about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-6 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-white font-serif text-lg">Attaie Cigars</p>
                  <p className="text-white/50 mt-2">Email: privacy@attaiecigars.com</p>
                  <p className="text-white/50">For data requests: datarequest@attaiecigars.com</p>
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

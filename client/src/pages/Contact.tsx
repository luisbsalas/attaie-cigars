import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { TropicalPattern } from "@/components/Decorations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Message Sent",
      description: "Thank you for reaching out. We'll respond within 24 hours.",
    });
    
    form.reset();
  };

  const contactInfo = [
    { icon: MapPin, label: "Visit Us", value: "123 Cigar Lane, Miami, FL 33101", href: "#" },
    { icon: Phone, label: "Call Us", value: "+1 (305) 555-CIGAR", href: "tel:+13055552442" },
    { icon: Mail, label: "Email Us", value: "concierge@attaiecigars.com", href: "mailto:concierge@attaiecigars.com" },
    { icon: Clock, label: "Hours", value: "Mon-Sat: 10AM-9PM, Sun: 12PM-6PM", href: "#" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      {/* Hero Section */}
      <section className="snap-section relative py-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1521193089946-7aa29d1fe776?auto=format&fit=crop&q=80&w=2000"
            alt="Cigar lounge"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2DD4BF]/20 via-transparent to-[#E8736F]/15" />
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-[#2DD4BF] text-xs tracking-[0.3em] uppercase mb-6 block" data-testid="text-contact-subtitle">
            We'd Love to Hear From You
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6" data-testid="text-contact-title">
            Get in <span className="italic bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
            Questions about our cigars? Looking to place a custom order? Our concierge team is here to assist.
          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="snap-section py-12 -mt-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-4">
            {contactInfo.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="p-6 bg-gradient-to-br from-[#2DD4BF]/10 to-[#1a6b6b]/5 backdrop-blur-sm border border-[#2DD4BF]/20 rounded-xl hover:border-[#C5A059]/40 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                data-testid={`link-contact-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className="w-6 h-6 text-[#2DD4BF] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-medium mb-1">{item.label}</h3>
                <p className="text-white/50 text-sm">{item.value}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="snap-section py-24 relative">
        <TropicalPattern opacity={0.03} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#E8736F] text-xs tracking-[0.3em] uppercase mb-4 block">
                Send a Message
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-8">
                Contact Our <span className="italic bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] bg-clip-text text-transparent">Concierge</span>
              </h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/60 text-sm">Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-white/5 border-[#2DD4BF]/20 text-white focus:border-[#2DD4BF]"
                              placeholder="Your name"
                              data-testid="input-contact-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/60 text-sm">Email *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="bg-white/5 border-[#2DD4BF]/20 text-white focus:border-[#2DD4BF]"
                              placeholder="your@email.com"
                              data-testid="input-contact-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/60 text-sm">Phone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              className="bg-white/5 border-[#2DD4BF]/20 text-white focus:border-[#2DD4BF]"
                              placeholder="+1 (555) 000-0000"
                              data-testid="input-contact-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/60 text-sm">Subject</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-white/5 border-white/10 text-white focus:border-[#C5A059]"
                              placeholder="How can we help?"
                              data-testid="input-contact-subject"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/60 text-sm">Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="bg-white/5 border-white/10 text-white focus:border-[#C5A059] min-h-[150px] resize-none"
                            placeholder="Tell us more about your inquiry..."
                            data-testid="input-contact-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full md:w-auto px-8 bg-[#C5A059] text-black font-medium uppercase tracking-wider"
                    data-testid="button-submit-contact"
                  >
                    {form.formState.isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Map placeholder */}
              <div className="aspect-video bg-[#111] rounded-lg overflow-hidden border border-white/10 relative">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200"
                  alt="Map location"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-[#C5A059] mx-auto mb-2" />
                    <p className="text-white text-sm">Miami, Florida</p>
                  </div>
                </div>
              </div>

              {/* Store Visit Info */}
              <div className="p-6 bg-[#111]/50 border border-white/10 rounded-lg">
                <h3 className="text-white text-xl font-serif mb-4">Visit Our Lounge</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  Experience the Attaie difference in person. Our Miami lounge offers a curated 
                  selection of our finest cigars, comfortable seating, and expert guidance from 
                  our passionate staff.
                </p>
                <ul className="space-y-3 text-sm text-white/60">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                    Walk-in humidor with full selection
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                    Private tasting events available
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                    Complimentary espresso bar
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                    Members-only lounge area
                  </li>
                </ul>
              </div>

              {/* Social Links */}
              <div className="flex items-center flex-wrap gap-4">
                <span className="text-white/40 text-sm">Follow Us:</span>
                {socialLinks.map((social) => (
                  <Button
                    key={social.label}
                    variant="outline"
                    size="icon"
                    className="rounded-full border-white/10 text-white/50"
                    asChild
                  >
                    <a href={social.href} aria-label={social.label} data-testid={`link-social-${social.label.toLowerCase()}`}>
                      <social.icon className="w-4 h-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="snap-section py-24 bg-gradient-to-b from-[#0A0A0A] to-[#1a6b6b]/10 text-center">
        <motion.div
          className="max-w-2xl mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
            Have Questions?
          </h2>
          <p className="text-white/50 mb-8">
            Check out our comprehensive cigar guide for answers to common questions about 
            selection, storage, and the art of enjoying a fine cigar.
          </p>
          <Button
            variant="outline"
            className="border-2 border-[#C5A059] text-[#C5A059] font-medium text-sm uppercase tracking-wider hover:bg-[#C5A059] hover:text-black"
            asChild
          >
            <a href="/guide" data-testid="link-cigar-guide">
              View Cigar Guide
            </a>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}

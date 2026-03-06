import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ExternalLink, Search, Navigation, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TropicalPattern } from "@/components/Decorations";
import { useState } from "react";

interface Retailer {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;
  isPremium: boolean;
  coordinates: { lat: number; lng: number };
}

const retailers: Retailer[] = [
  {
    id: 1,
    name: "Casa de Cigar Miami",
    address: "1234 Brickell Avenue",
    city: "Miami",
    state: "FL",
    zip: "33131",
    phone: "(305) 555-1234",
    hours: "Mon-Sat 10AM-10PM, Sun 12PM-8PM",
    isPremium: true,
    coordinates: { lat: 25.7617, lng: -80.1918 }
  },
  {
    id: 2,
    name: "The Tobacco Leaf",
    address: "567 Fifth Avenue",
    city: "New York",
    state: "NY",
    zip: "10017",
    phone: "(212) 555-5678",
    hours: "Mon-Fri 9AM-9PM, Sat-Sun 10AM-8PM",
    isPremium: true,
    coordinates: { lat: 40.7549, lng: -73.9840 }
  },
  {
    id: 3,
    name: "Beverly Hills Cigars",
    address: "9876 Rodeo Drive",
    city: "Beverly Hills",
    state: "CA",
    zip: "90210",
    phone: "(310) 555-9876",
    hours: "Daily 10AM-9PM",
    isPremium: true,
    coordinates: { lat: 34.0736, lng: -118.4004 }
  },
  {
    id: 4,
    name: "Lone Star Smoke Shop",
    address: "456 Main Street",
    city: "Houston",
    state: "TX",
    zip: "77002",
    phone: "(713) 555-4567",
    hours: "Mon-Sat 9AM-8PM, Sun 11AM-6PM",
    isPremium: false,
    coordinates: { lat: 29.7604, lng: -95.3698 }
  },
  {
    id: 5,
    name: "Windy City Tobacco",
    address: "789 Michigan Avenue",
    city: "Chicago",
    state: "IL",
    zip: "60611",
    phone: "(312) 555-7890",
    hours: "Mon-Sat 10AM-9PM, Sun 12PM-7PM",
    isPremium: false,
    coordinates: { lat: 41.8781, lng: -87.6298 }
  },
  {
    id: 6,
    name: "Capitol Cigars",
    address: "321 Pennsylvania Ave",
    city: "Washington",
    state: "DC",
    zip: "20001",
    phone: "(202) 555-3210",
    hours: "Mon-Fri 10AM-8PM, Sat 11AM-7PM",
    isPremium: false,
    coordinates: { lat: 38.9072, lng: -77.0369 }
  },
];

export default function Retailers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const states = Array.from(new Set(retailers.map(r => r.state))).sort();
  
  const filteredRetailers = retailers.filter(retailer => {
    const matchesSearch = 
      retailer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.zip.includes(searchQuery);
    
    const matchesState = !selectedState || retailer.state === selectedState;
    
    return matchesSearch && matchesState;
  });

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      {/* Hero Section - Vibrant */}
      <section className="snap-section relative py-32 flex items-center justify-center overflow-hidden">
        {/* Multi-color gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2DD4BF]/25 via-[#1a6b6b]/20 to-[#E8736F]/15" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(197,160,89,0.2)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(232,115,111,0.15)_0%,transparent_50%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(45,212,191,0.1)_0%,transparent_60%)]" />
          <TropicalPattern opacity={0.05} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-transparent to-[#0A0A0A]/80" />
        
        {/* Multi-color floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { left: 10, top: 20, size: 5, color: "#C5A059" },
            { left: 85, top: 30, size: 4, color: "#2DD4BF" },
            { left: 25, top: 70, size: 6, color: "#E8736F" },
            { left: 70, top: 60, size: 4, color: "#C5A059" },
            { left: 50, top: 15, size: 5, color: "#2DD4BF" },
            { left: 15, top: 50, size: 4, color: "#FFD4B8" },
            { left: 90, top: 75, size: 5, color: "#B8A9C9" },
            { left: 40, top: 85, size: 4, color: "#E8736F" },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, backgroundColor: p.color }}
              initial={{ y: 0, opacity: 0.4, scale: 1 }}
              animate={{ y: [0, -25, 0], opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        {/* Colorful corner flourishes */}
        <div className="absolute top-8 left-8 w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#2DD4BF] via-[#C5A059] to-transparent" />
          <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#2DD4BF] via-[#C5A059] to-transparent" />
        </div>
        <div className="absolute top-8 right-8 w-24 h-24">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#E8736F] via-[#C5A059] to-transparent" />
          <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-[#E8736F] via-[#C5A059] to-transparent" />
        </div>
        <div className="absolute bottom-8 left-8 w-24 h-24">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#B8A9C9] via-[#C5A059] to-transparent" />
          <div className="absolute bottom-0 left-0 w-[2px] h-full bg-gradient-to-t from-[#B8A9C9] via-[#C5A059] to-transparent" />
        </div>
        <div className="absolute bottom-8 right-8 w-24 h-24">
          <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#FFD4B8] via-[#C5A059] to-transparent" />
          <div className="absolute bottom-0 right-0 w-[2px] h-full bg-gradient-to-t from-[#FFD4B8] via-[#C5A059] to-transparent" />
        </div>
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.span 
            className="inline-flex items-center gap-2 text-[#2DD4BF] text-xs tracking-[0.3em] uppercase mb-6" 
            data-testid="text-retailers-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            Authorized Retailers
            <Sparkles className="w-4 h-4" />
          </motion.span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6" data-testid="text-retailers-title">
            Find <span className="italic bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] bg-clip-text text-transparent">Near You</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Discover authorized Attaie Cigars retailers in your area. Each location offers our complete collection and expert guidance.
          </p>
        </motion.div>
      </section>

      {/* Search Section - Vibrant */}
      <section className="snap-section py-8 -mt-16 relative z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <motion.div
            className="relative bg-gradient-to-r from-[#2DD4BF]/10 via-[#1a6b6b]/10 to-[#E8736F]/10 backdrop-blur-md border border-[#2DD4BF]/30 rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 to-transparent rounded-xl" />
            <div className="relative flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2DD4BF]" />
                <Input
                  type="text"
                  placeholder="Search by city, state, or zip code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-white/10 border-[#2DD4BF]/30 text-white placeholder:text-white/50 focus:border-[#C5A059] focus:ring-[#C5A059]/20"
                  data-testid="input-search-retailers"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedState === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedState(null)}
                  className={selectedState === null 
                    ? "bg-gradient-to-r from-[#2DD4BF] to-[#1a6b6b] text-white border-none" 
                    : "border-[#2DD4BF]/40 text-[#2DD4BF] hover:bg-[#2DD4BF]/10"}
                  data-testid="button-filter-all"
                >
                  All States
                </Button>
                {states.map((state, i) => {
                  const colors = ["#E8736F", "#C5A059", "#B8A9C9", "#2DD4BF", "#FFD4B8", "#1a6b6b"];
                  const color = colors[i % colors.length];
                  return (
                    <Button
                      key={state}
                      variant={selectedState === state ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedState(state)}
                      className={selectedState === state 
                        ? "text-white border-none" 
                        : "text-white/70 hover:bg-white/10"}
                      style={selectedState === state ? { backgroundColor: color } : { borderColor: `${color}60` }}
                      data-testid={`button-filter-${state.toLowerCase()}`}
                    >
                      {state}
                    </Button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Retailers Grid - Vibrant */}
      <section className="snap-section py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a6b6b]/5 to-transparent" />
        
        <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRetailers.map((retailer, index) => {
              const cardColors = [
                { gradient: "from-[#2DD4BF]/20 to-[#1a6b6b]/10", accent: "#2DD4BF", border: "#2DD4BF" },
                { gradient: "from-[#E8736F]/20 to-[#C5A059]/10", accent: "#E8736F", border: "#E8736F" },
                { gradient: "from-[#C5A059]/20 to-[#FFD4B8]/10", accent: "#C5A059", border: "#C5A059" },
                { gradient: "from-[#B8A9C9]/20 to-[#E8736F]/10", accent: "#B8A9C9", border: "#B8A9C9" },
                { gradient: "from-[#FFD4B8]/20 to-[#C5A059]/10", accent: "#FFD4B8", border: "#FFD4B8" },
                { gradient: "from-[#1a6b6b]/20 to-[#2DD4BF]/10", accent: "#2DD4BF", border: "#1a6b6b" },
              ];
              const colorScheme = cardColors[index % cardColors.length];
              
              return (
                <motion.div
                  key={retailer.id}
                  className="group relative rounded-xl overflow-hidden hover-elevate"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`card-retailer-${retailer.id}`}
                >
                  {/* Card background with gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.gradient}`} />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                  <div className="absolute inset-[1px] rounded-xl border" style={{ borderColor: `${colorScheme.border}30` }} />
                  
                  {/* Premium badge */}
                  {retailer.isPremium && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#C5A059] to-[#E8736F] rounded-full text-[10px] text-white uppercase tracking-wider font-medium shadow-lg">
                        <Star className="w-3 h-3 fill-current" />
                        Premium
                      </div>
                    </div>
                  )}

                  {/* Map placeholder with gradient */}
                  <div className={`relative h-36 bg-gradient-to-br ${colorScheme.gradient}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <MapPin className="w-10 h-10" style={{ color: colorScheme.accent }} />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative p-6">
                    <h3 className="text-xl font-serif text-white mb-3" data-testid={`text-retailer-name-${retailer.id}`}>
                      {retailer.name}
                    </h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3 text-white/70">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: colorScheme.accent }} />
                        <span>
                          {retailer.address}<br />
                          {retailer.city}, {retailer.state} {retailer.zip}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-white/70">
                        <Phone className="w-4 h-4 shrink-0" style={{ color: colorScheme.accent }} />
                        <a href={`tel:${retailer.phone.replace(/\D/g, '')}`} className="hover:text-white transition-colors">
                          {retailer.phone}
                        </a>
                      </div>
                      
                      <div className="flex items-start gap-3 text-white/70">
                        <Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: colorScheme.accent }} />
                        <span>{retailer.hours}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-white"
                        style={{ borderColor: `${colorScheme.border}50` }}
                        data-testid={`button-directions-${retailer.id}`}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Directions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white"
                        style={{ borderColor: `${colorScheme.border}50` }}
                        data-testid={`button-call-${retailer.id}`}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Hover accent */}
                  <motion.div 
                    className="absolute bottom-0 left-0 w-0 h-1 group-hover:w-full transition-all duration-500"
                    style={{ background: `linear-gradient(to right, ${colorScheme.accent}, #C5A059)` }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* No results */}
          {filteredRetailers.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MapPin className="w-12 h-12 text-[#2DD4BF]/40 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-white mb-2">No Retailers Found</h3>
              <p className="text-white/50">Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Become a Retailer CTA - Vibrant */}
      <section className="snap-section py-24 relative overflow-hidden">
        {/* Multi-color gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2DD4BF]/20 via-[#C5A059]/15 to-[#E8736F]/20" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2DD4BF]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#E8736F]/10 rounded-full blur-3xl" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { left: 20, top: 30, color: "#C5A059" },
            { left: 80, top: 20, color: "#2DD4BF" },
            { left: 60, top: 70, color: "#E8736F" },
            { left: 30, top: 80, color: "#B8A9C9" },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{ left: `${p.left}%`, top: `${p.top}%`, backgroundColor: p.color }}
              initial={{ y: 0, opacity: 0.3 }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 text-[#E8736F] text-xs tracking-[0.3em] uppercase mb-4">
              <Sparkles className="w-4 h-4" />
              Partner With Us
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">
              Become an <span className="italic bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] bg-clip-text text-transparent">Authorized Retailer</span>
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
              Join our exclusive network of premium cigar retailers. Get access to our complete collection, marketing support, and dedicated account management.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#E8736F] via-[#C5A059] to-[#2DD4BF] text-white text-xs tracking-[0.2em] uppercase font-bold border-none shadow-lg hover:shadow-xl transition-shadow"
              data-testid="button-become-retailer"
            >
              <a href="/contact">
                Apply Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

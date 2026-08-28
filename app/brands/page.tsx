import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    alternates: { canonical: "https://www.1martianway.com/brands" },
    title: "Our Brands & Divisions | 1 Martian Way",
    description:
 "Discover 1 Martian Way's innovative brands including IDRL Drone Racing India, Consciousness Labs, and Integration Studios - pioneering the future of AI and robotics.",
};

export default function Brands() {
    return (
        <>
            <div className="mx-auto max-w-7xl px-6 py-6 sm:py-8 lg:px-8">
                {/* Hero Section */}
                <div className="mx-auto max-w-4xl text-center mb-16">
                    <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                        Our <span className="gradient-text-primary">Innovation</span> Ecosystem
                    </h1>
                    <p className="text-lg leading-8 text-white/80 max-w-2xl mx-auto mb-8">
                        From cutting-edge drone racing technology to conscious AI development, 
                        our brands are pushing the boundaries of what's possible in robotics and automation.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-white/60">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-sunk rounded-full"></span>
                            Racing Technology
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-soft rounded-full"></span>
                            AI Research
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-soft rounded-full"></span>
                            Human-Robot Integration
                        </span>
                    </div>
                </div>

                {/* Featured Brand - IDRL */}
                <div className="mb-16">
                    <div className="glass-card rounded-3xl overflow-hidden">
                        <div className="bg-gradient-to-br from-blue via-blue to-canvas/40 p-12">
                            <div className="flex flex-col lg:flex-row items-center gap-12">
                                <div className="flex-1 text-center lg:text-left">
                                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                                        <div className="text-6xl">🏁</div>
                                        <div>
                                            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-2">
                                                <span className="gradient-text-orange">IDRL</span>
                                            </h2>
                                            <p className="text-xl text-fg-muted font-semibold">Indian Drone Racing League</p>
                                            <p className="text-fg-muted/80 text-sm">Featured Brand</p>
                                        </div>
                                    </div>
                                    <p className="text-lg text-white/90 mb-6 leading-relaxed">
                                        India's premier autonomous drone racing platform, where AI meets extreme sports. 
                                        IDRL combines our advanced AI consciousness technology with high-speed autonomous flight, 
                                        creating the world's most sophisticated racing drones.
                                    </p>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                        {[
                                            { value: "300+", label: "Racing Events", icon: "🏆" },
                                            { value: "50ms", label: "AI Response Time", icon: "⚡" },
                                            { value: "200+", label: "Km/h Max Speed", icon: "🚀" },
                                            { value: "15+", label: "Racing Teams", icon: "👥" },
                                        ].map((stat, index) => (
                                            <div key={index} className="glass rounded-xl p-4 text-center">
                                                <div className="text-2xl mb-2">{stat.icon}</div>
                                                <div className="text-xl font-bold gradient-text-orange font-display mb-1">
                                                    {stat.value}
                                                </div>
                                                <div className="text-xs text-white/70">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                        <a
                                            href="https://droneracingindia.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r from-blue via-blue to-blue hover:from-blue hover:via-blue hover:to-blue transition-all-smooth hover:scale-105 shadow-xl"
                                        >
                                            <span className="flex items-center gap-2">
                                                🌐 Visit IDRL Website
                                                <ArrowTopRightIcon className="h-5 w-5" />
                                            </span>
                                        </a>
                                        <Link
                                            href="/contact"
                                            className="group px-8 py-4 text-lg font-semibold text-white/90 hover:text-white glass rounded-2xl hover:glass-card transition-all-smooth"
                                        >
                                            <span className="flex items-center gap-2">
                                                🤝 Partner with IDRL
                                                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="glass rounded-3xl p-8 text-center max-w-sm">
                                        <div className="mb-8 flex justify-center">
                                            <svg width="100" height="100" viewBox="0 0 100 100" className="text-fg-muted">
                                                {/* Racing drone body */}
                                                <rect x="35" y="40" width="30" height="20" rx="4" fill="currentColor" />
                                                
                                                {/* Propeller arms */}
                                                <line x1="20" y1="30" x2="80" y2="70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                                <line x1="20" y1="70" x2="80" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                                
                                                {/* Propellers */}
                                                <circle cx="20" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
                                                <circle cx="80" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
                                                <circle cx="20" cy="70" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
                                                <circle cx="80" cy="70" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
                                                
                                                {/* Center camera/gimbal */}
                                                <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.8" />
                                                
                                                {/* Racing stripes */}
                                                <rect x="37" y="42" width="26" height="2" fill="white" opacity="0.6" />
                                                <rect x="37" y="56" width="26" height="2" fill="white" opacity="0.6" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4">Autonomous Racing Technology</h3>
                                        <p className="text-sm text-white/80 mb-6">
                                            Revolutionary AI-powered racing drones with real-time decision making, 
                                            obstacle avoidance, and competitive intelligence.
                                        </p>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
 "Neural Flight Control",
 "Real-time Path Planning",
 "Competitive AI Strategy",
 "Safety-First Protocols"
                                            ].map((feature, i) => (
                                                <div key={i} className="glass rounded-lg p-3 text-xs text-white/80">
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Research Divisions */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-4">
                            Research <span className="gradient-text-primary">Divisions</span>
                        </h2>
                        <p className="text-lg text-white/80 max-w-3xl mx-auto">
                            Our specialized research divisions advancing the frontiers of AI consciousness and human-robot collaboration.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Martian Consciousness Labs */}
                        <div className="glass-card rounded-3xl overflow-hidden hover:scale-105 transition-all-smooth group">
                            <div className="aspect-video bg-gradient-to-br from-blue via-blue to-canvas relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">🧠</div>
                                        <h3 className="text-2xl font-bold text-white gradient-text-primary">
                                            Consciousness Labs
                                        </h3>
                                        <p className="text-white/70 mt-2">AI Consciousness Research</p>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            <div className="p-8">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-white mb-4 gradient-text-primary">
                                        Martian Consciousness Labs
                                    </h3>
                                    <p className="text-base text-white/80 mb-4">
                                        Pioneering the development of artificial consciousness for humanoid robots. 
                                        Our research focuses on neural networks, emotional intelligence, and self-aware AI systems.
                                    </p>
                                    
                                    {/* Key Achievements */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {[
 "Neural Consciousness Engine",
 "Emotional AI Processing",
 "Autonomous Learning Systems",
 "Ethical AI Framework"
                                        ].map((achievement, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                                                <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue to-blue rounded-full"></span>
                                                {achievement}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Link
                                        href="/artificialintelligence"
                                        className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white rounded-2xl bg-gradient-to-r from-blue to-blue hover:from-blue hover:to-blue transition-all-smooth hover:scale-105 shadow-lg"
                                    >
                                        Explore AI Research
                                        <ArrowTopRightIcon className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Humanoid Integration Studios */}
                        <div className="glass-card rounded-3xl overflow-hidden hover:scale-105 transition-all-smooth group">
                            <div className="aspect-video bg-gradient-to-br from-blue via-blue to-canvas relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">🤖</div>
                                        <h3 className="text-2xl font-bold text-white gradient-text-cyan">
                                            Integration Studios
                                        </h3>
                                        <p className="text-white/70 mt-2">Human-Robot Collaboration</p>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            <div className="p-8">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-white mb-4 gradient-text-cyan">
                                        Humanoid Integration Studios
                                    </h3>
                                    <p className="text-base text-white/80 mb-4">
                                        Designing seamless human-robot collaboration experiences through advanced 
                                        interaction protocols, social behavior systems, and collaborative frameworks.
                                    </p>
                                    
                                    {/* Key Services */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {[
 "Collaboration Protocols",
 "Social Behavior Design",
 "Integration Training",
 "Custom Robot Solutions"
                                        ].map((service, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                                                <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue to-blue rounded-full"></span>
                                                {service}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white rounded-2xl bg-gradient-to-r from-blue to-blue hover:from-blue hover:to-blue transition-all-smooth hover:scale-105 shadow-lg"
                                    >
                                        Schedule Integration
                                        <ArrowTopRightIcon className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Innovation Showcase */}
                <div className="mb-16">
                    <div className="glass-card rounded-3xl p-12">
                        <div className="text-center mb-12">
                            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-4">
                                Innovation <span className="gradient-text-cyan">Showcase</span>
                            </h2>
                            <p className="text-lg text-white/80 max-w-3xl mx-auto">
                                Cross-brand collaborations and breakthrough technologies emerging from our ecosystem.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "AI-Powered Racing",
                                    description: "IDRL's racing algorithms adapted for humanoid robot navigation",
                                    icon: "🏎️",
                                    brands: ["IDRL", "Consciousness Labs"],
                                    status: "Active Development"
                                },
                                {
                                    title: "Collaborative Swarms",
                                    description: "Multi-robot consciousness networks for coordinated operations",
                                    icon: "🌐",
                                    brands: ["Consciousness Labs", "Integration Studios"],
                                    status: "Research Phase"
                                },
                                {
                                    title: "Racing-Grade Reflexes",
                                    description: "Ultra-fast response systems for humanoid safety protocols",
                                    icon: "⚡",
                                    brands: ["IDRL", "Integration Studios"],
                                    status: "Testing Phase"
                                }
                            ].map((innovation, index) => (
                                <div key={index} className="glass rounded-3xl p-6 text-center hover:scale-105 transition-all-smooth">
                                    <div className="text-5xl mb-4">{innovation.icon}</div>
                                    <h3 className="text-lg font-semibold text-white mb-2 gradient-text-primary">{innovation.title}</h3>
                                    <p className="text-sm text-white/80 mb-4">{innovation.description}</p>
                                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                                        {innovation.brands.map((brand, i) => (
                                            <span key={i} className="glass rounded-full px-3 py-1 text-xs text-red font-medium">
                                                {brand}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="text-xs text-red font-medium">{innovation.status}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Partnership CTA */}
                <div className="glass-card rounded-3xl p-12 text-center">
                    <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-6">
                        Join Our <span className="gradient-text-primary">Innovation</span> Ecosystem
                    </h2>
                    <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8">
                        Partner with our brands to access cutting-edge AI technology, racing innovations, 
                        and the future of human-robot collaboration.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/contact"
                            className="group relative px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r from-blue via-blue to-blue hover:from-blue hover:via-blue hover:to-blue transition-all-smooth hover:scale-105 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue via-blue to-blue opacity-0 group-hover:opacity-100 transition-all-smooth blur-xl"></div>
                            <span className="relative z-10">Partner With Our Brands</span>
                        </Link>
                        <Link
                            href="/press"
                            className="group text-lg font-semibold leading-6 text-white/80 hover:text-white flex items-center gap-2"
                        >
                            Latest Brand Updates
                            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

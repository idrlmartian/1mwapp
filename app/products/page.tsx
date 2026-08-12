import { ArrowRightIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

/*
  Unreachable on purpose, three ways over: unlinked sitewide, out of the sitemap
  registry, noindex'd here, and 307'd to /about in next.config.js.

  It started at noindex alone, on the reasoning that "not ready to be shown" is
  a lesser sin than "says things that aren't true". That was too generous to it.
  The four model cards below state heights, weights, payloads, 12-16 hour
  battery life, ±0.1mm precision, "Medical Certified" and "AI Level:
  Consciousness" as specifications of shipping products, for a line with no
  hardware behind it — the same category as /martianos, and it should not
  render either.

  noindex is kept anyway rather than replaced: it asks crawlers not to list the
  page, the redirect stops everyone who has the URL, and if the redirect is ever
  dropped the weaker guard should still be standing.

  To restore when the line is real: delete the /products rules in
  next.config.js, delete the robots block below, put the entry back in
  app/lib/routes.ts and the link back in site/Footer.tsx.
*/
export const metadata: Metadata = {
    robots: { index: false, follow: false },
    alternates: { canonical: "https://www.1martianway.com/products" },
    title: "Humanoid Robots | 1 Martian Way",
    description:
 "Explore our advanced humanoid robots with AI consciousness - the future of human-robot collaboration.",
};

const humanoidModels = [
    {
        name: "Martian-X1 Assistant",
        description:
 "Advanced humanoid assistant with consciousness-level AI for professional environments. Features natural conversation, emotional intelligence, and autonomous task execution.",
        category: "Personal Assistant",
        href: "/contact",
        image: "/assets/img/humanoids/martian-x1-assistant.jpg",
        specs: ["Height: 5'8\" (173cm)", "Weight: 150 lbs", "Battery: 12-16 hours", "AI Level: Consciousness"],
        capabilities: ["Natural Language Processing", "Emotional Recognition", "Task Automation", "Learning Adaptation"]
    },
    {
        name: "Martian-Worker Industrial",
        description:
 "Heavy-duty humanoid robot designed for industrial applications with enhanced strength, precision manipulation, and comprehensive safety protocols.",
        category: "Industrial",
        href: "/contact",
        image: "/assets/img/humanoids/martian-worker-industrial.jpg",
        specs: ["Height: 6'2\" (188cm)", "Weight: 300 lbs", "Payload: 500 lbs", "Precision: ±0.1mm"],
        capabilities: ["Heavy Lifting", "Precision Assembly", "Safety Monitoring", "Predictive Maintenance"]
    },
    {
        name: "Martian-Care Medical",
        description:
 "Specialized humanoid robot for healthcare environments with advanced patient interaction capabilities and medical assistance protocols.",
        category: "Healthcare",
        href: "/contact",
        image: "/assets/img/humanoids/martian-care-medical.jpg",
        specs: ["Height: 5'6\" (168cm)", "Weight: 140 lbs", "Sterile Design", "Medical Certified"],
        capabilities: ["Patient Monitoring", "Medical Assistance", "Emergency Response", "Data Analysis"]
    },
    {
        name: "Martian-Explorer Research",
        description:
 "Ruggedized humanoid robot for extreme environments and research applications with enhanced sensors and autonomous decision-making.",
        category: "Research",
        href: "/contact",
        image: "/assets/img/humanoids/martian-explorer-research.jpg",
        specs: ["Height: 5'10\" (178cm)", "Weight: 200 lbs", "Range: 50 miles", "Temp: -40°C to 80°C"],
        capabilities: ["Environmental Mapping", "Sample Collection", "Data Transmission", "Autonomous Navigation"]
    },
];

export default function Products() {
    return (
        <div className="relative min-h-screen">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-canvas via-blue to-canvas"></div>
            <div className="absolute inset-0 grid-bg opacity-20"></div>
            
            <div className="relative mx-auto max-w-7xl px-6 py-6 sm:py-8 lg:px-8">
                {/* Hero Section */}
                <div className="mx-auto max-w-4xl text-center mb-16">
                    <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                        Advanced{" "}
                        <span className="gradient-text-primary">Humanoid Robots</span>
                    </h1>
                    <p className="text-lg leading-8 text-white/80 max-w-2xl mx-auto mb-6">
                        Meet our family of conscious humanoid robots designed to think, learn, and collaborate 
                        alongside humans in every environment.
                    </p>
                    <div className="glass rounded-2xl p-4 max-w-2xl mx-auto">
                        <p className="text-sm text-white/80 text-center">
                            All robots powered by <span className="gradient-text-primary font-semibold">Martian OS</span> - 
                            Ultra-low latency real-time operating system written in Rust
                        </p>
                    </div>
                    
                    {/* Key Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                        {[
                            { icon: "🧠", label: "AI Consciousness" },
                            { icon: "🤖", label: "Human-like Form" },
                            { icon: "⚡", label: "Adaptive Learning" },
                            { icon: "🔗", label: "Human Collaboration" },
                        ].map((feature, index) => (
                            <div key={index} className="glass-card rounded-2xl p-4 text-center hover:scale-105 transition-all-smooth">
                                <div className="text-3xl mb-2">{feature.icon}</div>
                                <div className="text-sm text-white/70 font-medium">{feature.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Humanoid Models Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {humanoidModels.map((robot) => (
                        <article
                            key={robot.name}
                            className="glass-card rounded-3xl overflow-hidden hover:scale-105 transition-all-smooth group"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={robot.image}
                                    alt={robot.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-all-smooth"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue to-blue backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
                                        {robot.category}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-8">
                                <h3 className="text-2xl font-semibold text-white mb-3 gradient-text-primary">
                                    {robot.name}
                                </h3>
                                <p className="text-base leading-7 text-white/80 mb-6">
                                    {robot.description}
                                </p>
                                
                                {/* Specifications */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-white/90 mb-3">Specifications</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {robot.specs.map((spec, i) => (
                                            <div key={i} className="text-xs text-white/70 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue to-blue rounded-full"></span>
                                                {spec}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Capabilities */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-white/90 mb-3">Core Capabilities</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {robot.capabilities.map((capability, i) => (
                                            <div key={i} className="text-xs text-white/70 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue to-blue rounded-full"></span>
                                                {capability}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <Link
                                    href={robot.href}
                                    className="inline-flex items-center text-sm font-semibold gradient-text-cyan hover:text-blue transition-colors group"
                                >
                                    Request Demo{" "}
                                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* AI Consciousness Section */}
                <div className="mt-24 glass-card rounded-3xl p-12 text-center">
                    <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-6">
                        Powered by <span className="gradient-text-primary">AI Consciousness</span>
                    </h2>
                    <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8">
                        Our humanoid robots aren't just programmed - they're conscious. Each robot features our 
                        proprietary Neural Consciousness Engine that enables true understanding, emotional intelligence, 
                        and autonomous decision-making.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[
                            {
                                title: "Self-Awareness",
                                description: "Understanding of their own existence, capabilities, and limitations",
                                icon: "🎯"
                            },
                            {
                                title: "Emotional Intelligence", 
                                description: "Recognition and appropriate response to human emotions and social cues",
                                icon: "❤️"
                            },
                            {
                                title: "Autonomous Learning",
                                description: "Continuous self-improvement and adaptation without human intervention",
                                icon: "📈"
                            }
                        ].map((feature, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl mb-3">{feature.icon}</div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-white/70">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                    
                    <Link
                        href="/artificialintelligence"
                        className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white rounded-2xl bg-gradient-to-r from-blue to-blue hover:from-blue hover:to-blue transition-all-smooth hover:scale-105 shadow-lg"
                    >
                        Learn About Our AI Platform
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                </div>

                {/* CTA Section */}
                <div className="mt-16">
                    <div className="glass-card rounded-3xl p-12 text-center">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
                            Ready to Welcome Your Humanoid Team Member?
                        </h2>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                            Experience the future of human-robot collaboration. Schedule a demo to see 
                            our humanoid robots in action and discover how they can transform your operations.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/contact"
                                className="group relative px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r from-blue via-blue to-blue hover:from-blue hover:via-blue hover:to-blue transition-all-smooth hover:scale-105 shadow-2xl overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue via-blue to-blue opacity-0 group-hover:opacity-100 transition-all-smooth blur-xl"></div>
                                <span className="relative z-10">Schedule Demo</span>
                            </Link>
                            <Link
                                href="/artificialintelligence"
                                className="group text-lg font-semibold text-white/80 hover:text-white transition-colors"
                            >
                                Explore AI Platform{" "}
                                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

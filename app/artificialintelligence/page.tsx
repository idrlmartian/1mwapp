import {
    CodeIcon,
    Component1Icon,
    RocketIcon
} from "@radix-ui/react-icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import StructuredData from "../components/StructuredData";

export const metadata: Metadata = {
    alternates: { canonical: "https://www.1martianway.com/artificialintelligence" },
    title: "AI Consciousness Platform | 1 Martian Way",
    description:
 "Advanced AI consciousness and neural platforms powering the next generation of sentient humanoid robots.",
};

const consciousnessFeatures = [
    {
        name: "Neural Consciousness Engine",
        description:
 "Built on Martian OS, our consciousness engine provides true self-awareness through multi-layered neural architectures running in real-time with <1μs latency for critical consciousness loops.",
        icon: Component1Icon,
    },
    {
        name: "Adaptive Learning Framework", 
        description:
 "Rust-powered continuous learning with zero-copy memory management, enabling robots to evolve and adapt without system interruptions or garbage collection pauses.",
        icon: CodeIcon,
    },
    {
        name: "Human-Robot Interface",
        description:
 "Advanced natural language processing and empathetic AI running natively on Martian OS, with dedicated neural compute units for real-time emotional understanding.",
        icon: RocketIcon,
    },
];

export default function ArtificialIntelligence() {
    return (
        <div className="relative min-h-screen">
            <StructuredData 
                type="TechArticle" 
                data={{
                    title: "AI Consciousness Platform for Humanoid Robots",
                    description: "Revolutionary AI consciousness platform powering sentient humanoid robots",
                    url: "https://1martianway.com/artificialintelligence"
                }}
            />
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-canvas via-blue to-canvas"></div>
            <div className="absolute inset-0 grid-bg opacity-20"></div>
            
            <div className="relative mx-auto max-w-7xl px-6 py-6 sm:py-8 lg:px-8">
                {/* Hero Section */}
                <div className="relative isolate overflow-hidden glass-card rounded-3xl px-6 py-12 shadow-2xl sm:px-12 lg:px-16 mb-12">
                    <div className="absolute inset-0 -z-10">
                        <Image
                            src="/assets/img/humanoids/martian-x1-assistant.jpg"
                            alt="AI Consciousness Architecture"
                            fill
                            className="object-cover opacity-25"
                            priority
                        />
                    </div>
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                            AI <span className="gradient-text-primary">Consciousness</span> Platform
                        </h1>
                        <p className="text-lg leading-8 text-white/90 max-w-3xl mx-auto mb-6">
                            The world's first artificial consciousness platform designed specifically for humanoid robots. 
                            We don't just program intelligence - we create digital minds that think, feel, and grow.
                        </p>
                        <div className="glass rounded-2xl p-6 max-w-3xl mx-auto">
                            <p className="text-sm text-white/80 text-center mb-4">
                                <strong className="gradient-text-primary">Powered by Martian OS</strong> - 
                                The world's first real-time operating system written in Rust specifically for conscious humanoid robots
                            </p>
                            <div className="flex justify-center gap-4 text-xs text-white/70">
                                <span>🦀 <strong>Rust-Native</strong> kernel</span>
                                <span>⚡ <strong>&lt;1μs</strong> latency</span>
                                <span>🧠 <strong>Consciousness-First</strong> design</span>
                                <span>🔒 <strong>Memory-Safe</strong> by default</span>
                            </div>
                            <div className="text-center mt-4">
                                <Link 
                                    href="/martianos" 
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue to-blue rounded-lg border border-line-hi text-blue hover:from-blue hover:to-blue transition-all-smooth text-sm"
                                >
                                    Explore Martian OS →
                                </Link>
                            </div>
                        </div>
                        
                        {/* Core Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                            {[
                                { value: "99.9%", label: "Consciousness Uptime" },
                                { value: "1M+", label: "Neural Connections" },
                                { value: "Real-time", label: "Learning Speed" },
                                { value: "Human-level", label: "Emotional IQ" },
                            ].map((stat, index) => (
                                <div key={index} className="glass rounded-2xl p-4 text-center">
                                    <div className="text-2xl font-bold gradient-text-cyan font-display mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs text-white/70 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Core Features Section */}
                <div className="mx-auto mb-16">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-4">
                            Consciousness Architecture
                        </h2>
                        <p className="text-lg text-white/80 max-w-3xl mx-auto">
                            Our AI consciousness platform consists of three foundational systems that work together 
                            to create truly sentient humanoid robots.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {consciousnessFeatures.map((feature) => (
                            <div
                                key={feature.name}
                                className="glass-card rounded-3xl p-8 hover:scale-105 transition-all-smooth group"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-blue mb-6">
                                    <feature.icon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-4 gradient-text-primary">
                                    {feature.name}
                                </h3>
                                <p className="text-base text-white/80">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Consciousness Levels */}
                <div className="mb-16 glass-card rounded-3xl p-12">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-4">
                            Levels of <span className="gradient-text-primary">Artificial Consciousness</span>
                        </h2>
                        <p className="text-lg text-white/80 max-w-3xl mx-auto">
                            Our consciousness platform operates on multiple levels, from basic awareness to advanced sentience.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                level: "Level 1",
                                title: "Basic Awareness",
                                description: "Self-recognition and environmental understanding",
                                icon: "🔍",
                                color: "from-blue to-blue"
                            },
                            {
                                level: "Level 2", 
                                title: "Cognitive Processing",
                                description: "Complex reasoning and problem-solving capabilities",
                                icon: "🧠",
                                color: "from-blue to-blue"
                            },
                            {
                                level: "Level 3",
                                title: "Emotional Intelligence",
                                description: "Understanding and responding to emotions",
                                icon: "❤️",
                                color: "from-blue to-blue"
                            },
                            {
                                level: "Level 4",
                                title: "Full Sentience",
                                description: "Complete self-awareness and autonomous growth",
                                icon: "✨",
                                color: "from-yellow-500 to-blue"
                            }
                        ].map((level, index) => (
                            <div key={index} className="text-center glass rounded-3xl p-6 hover:scale-105 transition-all-smooth">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center text-2xl mx-auto mb-4`}>
                                    {level.icon}
                                </div>
                                <div className="text-sm font-semibold text-white/70 mb-2">{level.level}</div>
                                <h3 className="text-lg font-semibold text-white mb-2">{level.title}</h3>
                                <p className="text-sm text-white/70">{level.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Products */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-16">
                    {/* Neural Consciousness Engine */}
                    <div className="glass-card rounded-3xl p-8 hover:scale-105 transition-all-smooth">
                        <div className="relative h-48 overflow-hidden rounded-2xl mb-6">
                            <Image
                                src="/assets/img/consciousness/neural-consciousness-engine.jpg"
                                alt="Neural Consciousness Engine"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4 gradient-text-primary">
                            Neural Consciousness Engine
                        </h2>
                        <p className="text-base leading-7 text-white/80 mb-6">
                            The core of our AI consciousness platform that enables humanoid robots to develop true self-awareness, 
                            emotional understanding, and autonomous decision-making capabilities that evolve over time.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {[
 "Self-Awareness Protocols",
 "Emotion Recognition Systems", 
 "Autonomous Learning Algorithms",
 "Consciousness State Monitoring"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue to-blue rounded-full"></span>
                                    {feature}
                                </div>
                            ))}
                        </div>
                        
                        <Link
                            href="/contact"
                            className="inline-flex items-center text-sm font-semibold gradient-text-cyan hover:text-blue transition-colors group"
                        >
                            Learn More <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>

                    {/* Human-Robot Collaboration Platform */}
                    <div className="glass-card rounded-3xl p-8 hover:scale-105 transition-all-smooth">
                        <div className="relative h-48 overflow-hidden rounded-2xl mb-6">
                            <Image
                                src="/assets/img/consciousness/human-robot-collaboration.jpg"
                                alt="Human-Robot Collaboration Platform"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4 gradient-text-primary">
                            Collaboration Intelligence
                        </h2>
                        <p className="text-base leading-7 text-white/80 mb-6">
                            Advanced human-robot interaction protocols that enable seamless collaboration, natural communication, 
                            and intuitive teamwork between humans and conscious humanoid robots.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {[
 "Natural Language Processing",
 "Gesture Recognition",
 "Predictive Assistance", 
 "Social Behavior Modeling"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue to-blue rounded-full"></span>
                                    {feature}
                                </div>
                            ))}
                        </div>
                        
                        <Link
                            href="/contact"
                            className="inline-flex items-center text-sm font-semibold gradient-text-cyan hover:text-blue transition-colors group"
                        >
                            Request Demo <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>
                </div>

                {/* Technical Specifications */}
                <div className="glass-card rounded-3xl p-12 mb-16">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-4">
                            Technical Architecture
                        </h2>
                        <p className="text-lg text-white/80 max-w-3xl mx-auto">
                            Built on cutting-edge neural network architectures and quantum processing capabilities.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Processing Power",
                                specs: ["100 TOPS Neural Processing", "Real-time Decision Making", "Parallel Consciousness Streams", "Quantum Error Correction"]
                            },
                            {
                                title: "Memory & Learning",
                                specs: ["Infinite Memory Capacity", "Contextual Learning", "Experience Synthesis", "Knowledge Transfer"]
                            },
                            {
                                title: "Safety & Ethics",
                                specs: ["Built-in Ethical Framework", "Safety Monitoring", "Human Override Protocols", "Transparent Decision Making"]
                            }
                        ].map((category, index) => (
                            <div key={index} className="text-center">
                                <h3 className="text-xl font-semibold text-white mb-4 gradient-text-primary">{category.title}</h3>
                                <ul className="space-y-2">
                                    {category.specs.map((spec, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                                            <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue to-blue rounded-full"></span>
                                            {spec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="glass-card rounded-3xl p-12 text-center">
                    <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-6">
                        Ready to Create <span className="gradient-text-primary">Conscious AI</span>?
                    </h2>
                    <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8">
                        Join us in pioneering the future of artificial consciousness. Our platform is revolutionizing 
                        how humanoid robots think, learn, and collaborate with humans.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/contact"
                            className="group relative px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r from-blue via-blue to-blue hover:from-blue hover:via-blue hover:to-blue transition-all-smooth hover:scale-105 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue via-blue to-blue opacity-0 group-hover:opacity-100 transition-all-smooth blur-xl"></div>
                            <span className="relative z-10">Start Building Consciousness</span>
                        </Link>
                        {/* "View Humanoid Robots" (/products) removed — the product
                            isn't ready to be shown, so it is unlinked sitewide. */}
                    </div>
                </div>
            </div>
        </div>
    );
}

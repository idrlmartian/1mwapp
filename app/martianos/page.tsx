import {
    CodeIcon,
    Component1Icon,
    GearIcon,
    LightningBoltIcon,
    LockClosedIcon,
    RocketIcon
} from "@radix-ui/react-icons";
import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "../components/StructuredData";

export const metadata: Metadata = {
    alternates: { canonical: "https://www.1martianway.com/martianos" },
    title: "Martian OS | Advanced Robot Operating System | 1 Martian Way",
    description:
 "Martian OS - A high-performance, real-time robot operating system written in Rust, designed specifically for conscious humanoid robots.",
};

export default function MartianOS() {
    return (
        <div className="relative min-h-screen">
            <StructuredData 
                type="SoftwareApplication" 
                data={{
                    name: "Martian OS",
                    description: "World's first real-time operating system designed specifically for conscious humanoid robots",
                    url: "https://1martianway.com/martianos"
                }}
            />
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-canvas via-blue to-canvas"></div>
            {/* <div className="absolute inset-0 grid-bg opacity-20"></div> */}
            
            <div className="relative mx-auto max-w-7xl px-6 py-6 sm:py-8 lg:px-8">
                {/* Hero Section */}
                <div className="relative isolate overflow-hidden glass-card rounded-3xl px-6 py-12 shadow-2xl sm:px-12 lg:px-16 mb-12">
                    {/* Removed background image */}
                    {/* <div className="absolute inset-0 -z-10">
                        <Image
                            src="/assets/img/consciousness/neural-consciousness-engine.jpg"
                            alt="Neural Consciousness Engine - Martian OS"
                            fill
                            className="object-cover opacity-40"
                            priority
                        />
                    </div> */}
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                            <span className="gradient-text-primary">Martian OS</span>
                        </h1>
                        <p className="text-xl leading-8 text-white/90 max-w-3xl mx-auto mb-8">
                            The world&apos;s first real-time operating system designed specifically for conscious humanoid robots. 
                            Built from the ground up in Rust for maximum performance, safety, and reliability.
                        </p>
                        
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { value: "<1μs", label: "Interrupt Latency" },
                                { value: "100%", label: "Memory Safety" },
                                { value: "1000Hz", label: "Control Loop" },
                                { value: "Zero", label: "Runtime Overhead" },
                            ].map((metric, index) => (
                                <div key={index} className="glass rounded-2xl p-4 text-center">
                                    <div className="text-2xl font-bold gradient-text-cyan font-display mb-1">
                                        {metric.value}
                                    </div>
                                    <div className="text-xs text-white/70 font-medium">
                                        {metric.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Technical Overview */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-4">
                            Technical Architecture
                        </h2>
                        <p className="text-lg text-white/80 max-w-4xl mx-auto">
                            Martian OS is a microkernel-based real-time operating system written entirely in Rust, 
                            providing zero-cost abstractions, memory safety, and deterministic real-time guarantees 
                            essential for conscious humanoid robot operation.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Rust-Based Kernel",
                                description: "Zero-cost abstractions with compile-time memory safety guarantees, eliminating entire classes of runtime errors common in robotics systems.",
                                icon: RocketIcon,
                                details: ["No GC overhead", "Compile-time checks", "Zero-cost abstractions", "Thread safety"]
                            },
                            {
                                name: "Real-Time Scheduler",
                                description: "Deterministic task scheduling with microsecond precision, supporting hard real-time guarantees for critical robot control loops.",
                                icon: LightningBoltIcon,
                                details: ["Rate-monotonic scheduling", "Priority inheritance", "Deadline scheduling", "Interrupt coalescing"]
                            },
                            {
                                name: "Hardware Abstraction",
                                description: "Comprehensive HAL supporting diverse sensor arrays, actuators, and compute platforms with unified APIs.",
                                icon: Component1Icon,
                                details: ["ARM Cortex-M/A support", "RISC-V compatibility", "FPGA integration", "Custom silicon"]
                            },
                            {
                                name: "Memory Management",
                                description: "Lock-free memory allocation with deterministic deallocation, supporting real-time operation without GC pauses.",
                                icon: GearIcon,
                                details: ["Stack-based allocation", "Pool allocators", "RAII patterns", "Zero fragmentation"]
                            },
                            {
                                name: "Safety Systems",
                                description: "Multi-layered safety architecture with formal verification support and runtime safety monitoring.",
                                icon: LockClosedIcon,
                                details: ["Formal verification", "Runtime monitoring", "Fail-safe modes", "Redundant systems"]
                            },
                            {
                                name: "Consciousness Integration",
                                description: "Native support for AI consciousness frameworks with dedicated neural processing pipelines and memory isolation.",
                                icon: GearIcon,
                                details: ["Neural compute units", "Isolated AI domains", "Consciousness APIs", "Learning pipelines"]
                            }
                        ].map((feature) => (
                            <div key={feature.name} className="glass-card rounded-3xl p-6 hover:scale-105 transition-all-smooth">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-blue mb-4">
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-3 gradient-text-primary">
                                    {feature.name}
                                </h3>
                                <p className="text-sm text-white/80 mb-4">
                                    {feature.description}
                                </p>
                                <ul className="space-y-1">
                                    {feature.details.map((detail, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs text-white/70">
                                            <span className="w-1 h-1 bg-gradient-to-r from-blue to-blue rounded-full"></span>
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Architecture */}
                <div className="glass-card rounded-3xl p-12 mb-16">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-4">
                            System <span className="gradient-text-primary">Architecture</span>
                        </h2>
                        <p className="text-lg text-white/80 max-w-3xl mx-auto">
                            Martian OS employs a layered microkernel architecture optimized for real-time robotics workloads.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Architecture Diagram */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white mb-6">Kernel Architecture</h3>
                            {[
                                { layer: "Application Layer", desc: "User applications, AI consciousness modules", color: "from-blue to-blue" },
                                { layer: "System Services", desc: "Device drivers, file systems, networking", color: "from-blue to-blue" },
                                { layer: "Real-Time Kernel", desc: "Scheduler, IPC, memory management", color: "from-blue to-blue" },
                                { layer: "Hardware Abstraction", desc: "Platform-specific drivers and interfaces", color: "from-blue to-blue" },
                                { layer: "Hardware", desc: "ARM/RISC-V processors, sensors, actuators", color: "from-blue to-blue" }
                            ].map((layer, index) => (
                                <div key={index} className="relative">
                                    <div className={`bg-gradient-to-r ${layer.color} rounded-xl p-4 mb-2`}>
                                        <h4 className="font-semibold text-white text-sm">{layer.layer}</h4>
                                    </div>
                                    <p className="text-xs text-white/70 ml-4">{layer.desc}</p>
                                </div>
                            ))}
                        </div>
                        
                        {/* Technical Specifications */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-white mb-6">Technical Specifications</h3>
                            {[
                                {
                                    category: "Performance",
                                    specs: [
 "Interrupt latency: <1μs",
 "Context switch: <500ns",
 "Memory bandwidth: 100GB/s",
 "Control loop: 1000Hz sustained"
                                    ]
                                },
                                {
                                    category: "Memory Management",
                                    specs: [
 "Zero-copy message passing",
 "Lock-free data structures",
 "Deterministic allocation",
 "Memory protection domains"
                                    ]
                                },
                                {
                                    category: "Safety & Security",
                                    specs: [
 "Formal verification support",
 "Capability-based security",
 "Hardware memory protection",
 "Real-time intrusion detection"
                                    ]
                                },
                                {
                                    category: "Platforms Supported",
                                    specs: [
 "ARM Cortex-A78 clusters",
 "RISC-V RV64GC cores",
 "NVIDIA Jetson AGX",
 "Custom neural processors"
                                    ]
                                }
                            ].map((section, index) => (
                                <div key={index} className="glass rounded-2xl p-4">
                                    <h4 className="font-semibold text-white mb-3 gradient-text-cyan">{section.category}</h4>
                                    <ul className="space-y-1">
                                        {section.specs.map((spec, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs text-white/80">
                                                <span className="w-1 h-1 bg-blue-soft rounded-full"></span>
                                                {spec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Core Subsystems */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-4">
                            Core Subsystems
                        </h2>
                        <p className="text-lg text-white/80 max-w-3xl mx-auto">
                            Specialized subsystems handling critical robot functions with real-time guarantees.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {[
                            {
                                title: "Motor Control Subsystem",
                                description: "High-frequency motor control with sub-millisecond precision for smooth humanoid movement.",
                                features: [
 "1000Hz control loops",
 "Field-oriented control (FOC)",
 "Predictive torque control",
 "Force/impedance control",
 "Safety torque limiting",
 "Real-time trajectory planning"
                                ],
                                codeExample: `// Real-time motor control in Rust
struct MotorController {
    joints: [Joint; 32],
    control_loop: HighFreqTimer<1000>,
}

impl MotorController {
    async fn control_loop(&mut self) {
        loop {
            let sensor_data = self.read_sensors().await;
            let commands = self.compute_control(sensor_data);
            self.apply_commands(commands).await;
            self.control_loop.wait_next_period().await;
        }
    }
}`
                            },
                            {
                                title: "Sensor Fusion Framework",
                                description: "Real-time sensor data processing with Kalman filtering and advanced fusion algorithms.",
                                features: [
 "IMU data fusion",
 "Vision processing pipeline",
 "Lidar point cloud processing", 
 "Force/torque sensing",
 "Predictive state estimation",
 "Outlier detection & correction"
                                ],
                                codeExample: `// Sensor fusion with zero-copy processing
struct SensorFusion {
    imu: ImuProcessor,
    vision: VisionPipeline,
    filters: KalmanFilterBank,
}

impl SensorFusion {
    fn fuse_sensors(&mut self, timestamp: Instant) 
        -> RobotState {
        let imu_data = self.imu.get_latest();
        let vision_data = self.vision.get_features();
        self.filters.predict_and_update(
            imu_data, vision_data, timestamp
        )
    }
}`
                            },
                            {
                                title: "Neural Processing Unit",
                                description: "Dedicated subsystem for AI consciousness and neural network inference with hardware acceleration.",
                                features: [
 "Tensor processing acceleration",
 "Neural network inference",
 "Consciousness state management",
 "Memory isolation for AI",
 "Distributed inference",
 "Model hot-swapping"
                                ],
                                codeExample: `// Neural processing with hardware acceleration
struct NeuralProcessor {
    compute_units: [TensorCore; 8],
    memory_pool: IsolatedMemory,
    consciousness: ConsciousnessEngine,
}

impl NeuralProcessor {
    async fn process_thought(&mut self, 
        input: SensorState) -> Decision {
        let tensors = self.preprocess(input);
        let inference = self.compute_units
            .parallel_inference(tensors).await;
        self.consciousness.integrate(inference)
    }
}`
                            },
                            {
                                title: "Safety Monitor",
                                description: "Continuous safety monitoring with formal verification and emergency response capabilities.",
                                features: [
 "Real-time safety verification",
 "Emergency stop protocols",
 "Constraint violation detection",
 "Redundant system monitoring",
 "Formal property checking",
 "Graceful degradation"
                                ],
                                codeExample: `// Safety monitoring with formal verification
struct SafetyMonitor {
    constraints: VerifiedConstraints,
    emergency_stop: EmergencySystem,
    watchdogs: [Watchdog; 16],
}

impl SafetyMonitor {
    fn verify_state(&self, state: &RobotState) 
        -> SafetyResult {
        if !self.constraints.verify(state) {
            self.emergency_stop.trigger();
            SafetyResult::Emergency
        } else {
            SafetyResult::Safe
        }
    }
}`
                            }
                        ].map((subsystem, index) => (
                            <div key={index} className="glass-card rounded-3xl p-8 hover:scale-105 transition-all-smooth">
                                <h3 className="text-xl font-semibold text-white mb-4 gradient-text-primary">
                                    {subsystem.title}
                                </h3>
                                <p className="text-sm text-white/80 mb-6">
                                    {subsystem.description}
                                </p>
                                
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-white/90 mb-3">Key Features</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {subsystem.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-white/70">
                                                <span className="w-1 h-1 bg-gradient-to-r from-blue to-blue rounded-full"></span>
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="bg-black/30 rounded-xl p-4 overflow-x-auto">
                                    <pre className="text-xs text-fg-muted font-mono">
                                        {subsystem.codeExample}
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Development Tools */}
                <div className="glass-card rounded-3xl p-12 mb-16">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-4">
                            Development <span className="gradient-text-primary">Ecosystem</span>
                        </h2>
                        <p className="text-lg text-white/80 max-w-3xl mx-auto">
                            Comprehensive toolchain and SDK for developing applications on Martian OS.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Martian SDK",
                                description: "Complete development kit with Rust APIs, debugging tools, and simulation environment.",
                                features: ["Cross-compilation", "Hardware-in-loop testing", "Real-time debugging", "Performance profiling"]
                            },
                            {
                                name: "RT-Cargo",
                                description: "Real-time aware package manager and build system optimized for deterministic builds.",
                                features: ["Deterministic builds", "Real-time analysis", "Dependency verification", "Safety checking"]
                            },
                            {
                                name: "Neural Compiler",
                                description: "Specialized compiler for neural network models with hardware-specific optimizations.",
                                features: ["Model optimization", "Hardware mapping", "Quantization", "Inference acceleration"]
                            },
                            {
                                name: "Safety Analyzer",
                                description: "Static analysis tools for verifying real-time and safety properties of robot code.",
                                features: ["WCET analysis", "Deadlock detection", "Memory safety", "Real-time verification"]
                            },
                            {
                                name: "Robot Simulator",
                                description: "High-fidelity physics simulation environment for testing robot behaviors safely.",
                                features: ["Physics simulation", "Sensor modeling", "Failure injection", "Scenario testing"]
                            },
                            {
                                name: "Deployment Tools", 
                                description: "Secure over-the-air update system with rollback capabilities and field diagnostics.",
                                features: ["OTA updates", "A/B deployment", "Remote diagnostics", "Rollback safety"]
                            }
                        ].map((tool, index) => (
                            <div key={index} className="glass rounded-3xl p-6 hover:scale-105 transition-all-smooth">
                                <h3 className="text-lg font-semibold text-white mb-3 gradient-text-cyan">
                                    {tool.name}
                                </h3>
                                <p className="text-sm text-white/80 mb-4">
                                    {tool.description}
                                </p>
                                <ul className="space-y-1">
                                    {tool.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs text-white/70">
                                            <span className="w-1 h-1 bg-gradient-to-r from-blue to-blue rounded-full"></span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low-Level Implementation Details */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-4">
                            Low-Level <span className="gradient-text-primary">Implementation</span>
                        </h2>
                        <p className="text-lg text-white/80 max-w-4xl mx-auto">
                            Deep dive into the Rust-based kernel implementation, showcasing the technical excellence 
                            that makes Martian OS the most advanced robot operating system ever built.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Microkernel Architecture */}
                        <div className="glass-card rounded-3xl p-8">
                            <h3 className="text-xl font-semibold text-white mb-6 gradient-text-primary">
                                Microkernel Architecture
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-white/90 mb-3">Kernel Services</h4>
                                    <div className="bg-black/50 rounded-xl p-4 overflow-x-auto">
                                        <pre className="text-xs text-fg-muted font-mono">{`// Core kernel services in Rust
#[no_std]
#[no_main]
mod kernel {
    use crate::memory::MemoryManager;
    use crate::scheduler::RTScheduler;
    use crate::ipc::MessagePassing;
    
    pub struct MartianKernel {
        memory: MemoryManager,
        scheduler: RTScheduler,
        ipc: MessagePassing,
        interrupt_controller: InterruptController,
    }
    
    impl MartianKernel {
        pub const fn new() -> Self {
            Self {
                memory: MemoryManager::new(),
                scheduler: RTScheduler::new(),
                ipc: MessagePassing::new(),
                interrupt_controller: InterruptController::new(),
            }
        }
        
        pub fn boot(&mut self) -> ! {
            // Initialize hardware abstraction layer
            hal::init();
            
            // Setup memory protection
            self.memory.setup_protection_domains();
            
            // Start real-time scheduler
            self.scheduler.start_scheduling();
            
            // Enter user mode
            unsafe { self.enter_userspace() }
        }
    }
}`}</pre>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="text-sm font-semibold text-white/90 mb-3">Memory Protection</h4>
                                    <div className="bg-black/50 rounded-xl p-4 overflow-x-auto">
                                        <pre className="text-xs text-fg-muted font-mono">{`// Hardware memory protection
pub struct MemoryProtectionUnit {
    regions: [MpuRegion; 16],
    fault_handler: fn(FaultInfo),
}

impl MemoryProtectionUnit {
    pub fn protect_region(&mut self, 
        start: VirtAddr, size: usize, 
        perms: Permissions) -> Result<(), MpuError> {
        
        let region = MpuRegion::new(start, size, perms)?;
        self.configure_hardware(&region)?;
        Ok(())
    }
    
    pub fn handle_fault(&self, fault: FaultInfo) {
        match fault.fault_type {
            FaultType::AccessViolation => {
                // Immediate emergency stop
                emergency::trigger_safe_stop();
            }
            FaultType::StackOverflow => {
                // Graceful task termination
                scheduler::terminate_task(fault.task_id);
            }
        }
    }
}`}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Real-Time Scheduler */}
                        <div className="glass-card rounded-3xl p-8">
                            <h3 className="text-xl font-semibold text-white mb-6 gradient-text-primary">
                                Real-Time Scheduler
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-white/90 mb-3">Priority-Based Scheduling</h4>
                                    <div className="bg-black/50 rounded-xl p-4 overflow-x-auto">
                                        <pre className="text-xs text-fg-muted font-mono">{`// Real-time task scheduler
pub struct RTScheduler {
    ready_queues: [TaskQueue; 256], // 256 priority levels
    current_task: Option<TaskId>,
    timer: HighResTimer,
}

impl RTScheduler {
    pub fn schedule(&mut self) -> TaskId {
        // Rate-monotonic scheduling with deadline inheritance
        if let Some(highest_prio) = self.find_highest_priority() {
            if self.should_preempt(highest_prio) {
                self.context_switch(highest_prio)
            } else {
                self.current_task.unwrap()
            }
        } else {
            self.idle_task()
        }
    }
    
    pub fn add_periodic_task(&mut self, 
        task: Task, period: Duration, 
        deadline: Duration) -> Result<TaskId, SchedError> {
        
        // Verify schedulability using RMA analysis
        if !self.verify_schedulability(&task, period) {
            return Err(SchedError::NotSchedulable);
        }
        
        let priority = self.compute_priority(period);
        let task_id = self.allocate_task_id();
        
        self.ready_queues[priority as usize].push(task_id);
        Ok(task_id)
    }
}`}</pre>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="text-sm font-semibold text-white/90 mb-3">Interrupt Handling</h4>
                                    <div className="bg-black/50 rounded-xl p-4 overflow-x-auto">
                                        <pre className="text-xs text-fg-muted font-mono">{`// Ultra-low latency interrupt handling
#[naked]
#[no_mangle]
unsafe extern "C" fn irq_handler() {
    asm!(
        // Save minimal context (ARM64)
 "stp x0, x1, [sp, #-16]!",
 "stp x2, x3, [sp, #-16]!",
        
        // Read interrupt vector
 "mrs x0, #0x3000", // Read GICC_IAR
        
        // Branch to Rust handler
 "bl handle_interrupt_rust",
        
        // Restore context
 "ldp x2, x3, [sp], #16",
 "ldp x0, x1, [sp], #16",
 "eret",
        options(noreturn)
    );
}

#[no_mangle]
extern "C" fn handle_interrupt_rust(irq_num: u32) {
    // Sub-microsecond interrupt processing
    let handler = INTERRUPT_TABLE[irq_num as usize];
    handler.handle_fast();
    
    // Signal end of interrupt
    gic::end_interrupt(irq_num);
}`}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hardware Abstraction Layer */}
                    <div className="glass-card rounded-3xl p-8 mb-8">
                        <h3 className="text-xl font-semibold text-white mb-6 gradient-text-primary">
                            Hardware Abstraction Layer (HAL)
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-sm font-semibold text-white/90 mb-3">Platform Support</h4>
                                <div className="bg-black/50 rounded-xl p-4 overflow-x-auto mb-4">
                                    <pre className="text-xs text-fg-muted font-mono">{`// Multi-platform HAL trait system
pub trait PlatformHal {
    type Timer: HighResTimer;
    type Gpio: GpioController;
    type Spi: SpiController;
    type I2c: I2cController;
    
    fn init() -> Self;
    fn get_timer(&self) -> &Self::Timer;
    fn get_gpio(&self) -> &Self::Gpio;
}

// ARM Cortex-A78 implementation
pub struct CortexA78Hal {
    timer: ArchTimer,
    gpio: GpioBank,
    cache: CacheController,
}

impl PlatformHal for CortexA78Hal {
    type Timer = ArchTimer;
    type Gpio = GpioBank;
    type Spi = SpiMaster;
    type I2c = I2cMaster;
    
    fn init() -> Self {
        // Initialize ARMv8 architecture features
        unsafe {
            // Enable NEON/SIMD
            asm!("msr cpacr_el1, {}", in(reg) 0x300000);
            // Configure memory attributes
            configure_mmu();
            // Setup exception vectors
            setup_vectors();
        }
        
        Self {
            timer: ArchTimer::new(),
            gpio: GpioBank::new(),
            cache: CacheController::new(),
        }
    }
}`}</pre>
                                </div>
                                
                                <h4 className="text-sm font-semibold text-white/90 mb-3">Sensor Integration</h4>
                                <div className="bg-black/50 rounded-xl p-4 overflow-x-auto">
                                    <pre className="text-xs text-fg-muted font-mono">{`// Zero-copy sensor data processing
pub struct SensorArray<const N: usize> {
    sensors: [Box<dyn Sensor>; N],
    data_ring: RingBuffer<SensorData, 1024>,
    dma_controller: DmaController,
}

impl<const N: usize> SensorArray<N> {
    pub async fn read_all(&mut self) -> [SensorReading; N] {
        // DMA-based parallel sensor reading
        let mut futures = [(); N].map(|_| None);
        
        for (i, sensor) in self.sensors.iter().enumerate() {
            futures[i] = Some(sensor.read_async());
        }
        
        // Await all sensor readings concurrently
        let readings = join_all(futures).await;
        self.apply_calibration(readings)
    }
}`}</pre>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-semibold text-white/90 mb-3">Motor Control Interface</h4>
                                <div className="bg-black/50 rounded-xl p-4 overflow-x-auto mb-4">
                                    <pre className="text-xs text-fg-muted font-mono">{`// High-precision motor control
pub trait MotorController {
    fn set_position(&mut self, angle: f64) -> Result<(), MotorError>;
    fn set_velocity(&mut self, vel: f64) -> Result<(), MotorError>;
    fn set_torque(&mut self, torque: f64) -> Result<(), MotorError>;
    fn get_encoder_position(&self) -> f64;
    fn emergency_stop(&mut self);
}

pub struct ServoMotor {
    pwm_channel: PwmChannel,
    encoder: QuadratureEncoder,
    pid_controller: PidController,
    safety_limits: SafetyLimits,
}

impl MotorController for ServoMotor {
    fn set_position(&mut self, target: f64) -> Result<(), MotorError> {
        // Check safety constraints
        if !self.safety_limits.check_position(target) {
            return Err(MotorError::SafetyViolation);
        }
        
        let current = self.get_encoder_position();
        let error = target - current;
        
        // PID control with feed-forward
        let output = self.pid_controller.compute(error);
        let feedforward = self.compute_feedforward(target);
        
        self.pwm_channel.set_duty_cycle(output + feedforward)
    }
}`}</pre>
                                </div>
                                
                                <h4 className="text-sm font-semibold text-white/90 mb-3">Neural Processing Unit</h4>
                                <div className="bg-black/50 rounded-xl p-4 overflow-x-auto">
                                    <pre className="text-xs text-fg-muted font-mono">{`// Hardware-accelerated neural inference
pub struct NeuralAccelerator {
    tensor_cores: [TensorCore; 8],
    shared_memory: SharedTensorMemory,
    command_queue: CommandQueue,
}

impl NeuralAccelerator {
    pub async fn inference(&mut self, 
        model: &NeuralModel, 
        input: Tensor) -> Tensor {
        
        // Distribute computation across tensor cores
        let chunks = input.chunk(8);
        let mut futures = Vec::new();
        
        for (i, chunk) in chunks.iter().enumerate() {
            let core = &mut self.tensor_cores[i];
            futures.push(core.process_layer_async(model, chunk));
        }
        
        // Gather results and continue forward pass
        let results = join_all(futures).await;
        self.merge_results(results)
    }
}`}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* API Documentation */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-4">
                            Core APIs
                        </h2>
                        <p className="text-lg text-white/80 max-w-3xl mx-auto">
                            Rust-native APIs providing safe, zero-cost abstractions for robot development.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {[
                            {
                                api: "Motion Control API",
                                description: "High-level motion planning and execution with safety guarantees.",
                                example: `use martianos::motion::*;

let mut planner = MotionPlanner::new();
let trajectory = planner.plan_trajectory(
    start_pose, 
    target_pose,
    constraints
)?;

let executor = TrajectoryExecutor::new();
executor.execute(trajectory).await?;`
                            },
                            {
                                api: "Consciousness Interface",
                                description: "Integration APIs for AI consciousness modules and neural networks.",
                                example: `use martianos::consciousness::*;

let consciousness = ConsciousnessEngine::init(
    neural_config
)?;

let decision = consciousness.process_stimuli(
    sensor_data,
    context
).await?;

match decision {
    Decision::Act(action) => execute(action).await?,
    Decision::Learn(experience) => store(experience)?,
    Decision::Reflect => consciousness.self_reflect().await?,
}`
                            },
                            {
                                api: "Sensor Fusion API",
                                description: "Real-time sensor data processing with automatic calibration and fusion.",
                                example: `use martianos::sensors::*;

let mut fusion = SensorFusion::builder()
    .add_imu(imu_config)
    .add_camera(camera_config)
    .add_lidar(lidar_config)
    .build()?;

let state = fusion.get_robot_state()?;
println!("Position: {:?}", state.position);
println!("Velocity: {:?}", state.velocity);`
                            },
                            {
                                api: "Safety Framework API", 
                                description: "Formal safety verification and runtime monitoring capabilities.",
                                example: `use martianos::safety::*;

let constraints = SafetyConstraints::builder()
    .max_velocity(2.0)
    .max_acceleration(5.0)
    .workspace_bounds(bounds)
    .build();

let monitor = SafetyMonitor::new(constraints);
monitor.verify_motion(trajectory)?;

// Runtime monitoring
monitor.on_violation(|violation| {
    emergency_stop();
    log_incident(violation);
});`
                            }
                        ].map((api, index) => (
                            <div key={index} className="glass-card rounded-3xl p-8">
                                <h3 className="text-xl font-semibold text-white mb-4 gradient-text-primary">
                                    {api.api}
                                </h3>
                                <p className="text-sm text-white/80 mb-6">
                                    {api.description}
                                </p>
                                <div className="bg-black/50 rounded-xl p-4 overflow-x-auto">
                                    <pre className="text-xs text-fg-muted font-mono whitespace-pre-wrap">
                                        {api.example}
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="glass-card rounded-3xl p-12 text-center">
                    <h2 className="font-display text-3xl font-bold text-white sm:text-4xl mb-6">
                        Ready to Build on <span className="gradient-text-primary">Martian OS</span>?
                    </h2>
                    <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8">
                        Join the next generation of robotics development with the most advanced robot operating system. 
                        Download the SDK and start building conscious humanoid robots today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/contact"
                            className="group relative px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r from-blue via-blue to-blue hover:from-blue hover:via-blue hover:to-blue transition-all-smooth hover:scale-105 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue via-blue to-blue opacity-0 group-hover:opacity-100 transition-all-smooth blur-xl"></div>
                            <span className="relative z-10 flex items-center gap-2">
                                <CodeIcon className="w-5 h-5" />
                                Download SDK
                            </span>
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
    );
} 
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { ArrowRight, Leaf, BarChart2, Target, Zap, Users, Globe } from 'lucide-react';
import { EarthSceneCanvas } from '../components/3d/EarthSceneCanvas';
import { StickyCalculateButton } from '../components/ui/StickyCalculateButton';
import { ClimateSlideshow } from '../components/ui/ClimateSlideshow';
import { Button } from '../components/ui/button';
import { Navigation } from '../layouts/Navigation';
import { useNavigate } from 'react-router-dom';
import { aggregateEmissions } from '../utils/calculations/aggregator';
import { EMPTY_LOCATION_DATA, EMPTY_WATER_WASTE_DATA, EMPTY_INDUSTRY_DATA, EMPTY_OFFSETS_DATA } from '../types/calculatorTypes';
import { DynamicImpactText } from '../components/ui/DynamicImpactText';
import { useCalculator } from '../store/calculatorStore';

gsap.registerPlugin(ScrollTrigger);

export function ScrollytellingHome() {
    const containerRef = useRef<HTMLDivElement>(null);
    const earthContainerRef = useRef<HTMLDivElement>(null);
    const heroTextRef = useRef<HTMLDivElement>(null);
    const calculatorRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    // State for Earth animation values
    const [earthPosition, setEarthPosition] = useState<[number, number, number]>([0, 0, 0]);
    const [earthScale, setEarthScale] = useState(0.9); // Further reduced initial size
    const [earthRotationY, setEarthRotationY] = useState(0);
    const navigate = useNavigate();
    const { addToHistory } = useCalculator();

    // Quick Calculator State
    const [quickMiles, setQuickMiles] = useState("");
    const [quickFlights, setQuickFlights] = useState("");
    const [quickKwh, setQuickKwh] = useState("");
    const [quickGas, setQuickGas] = useState("");
    const [householdSize, setHouseholdSize] = useState("1");

    useEffect(() => {
        let ctx: gsap.Context | null = null;
        let timer: ReturnType<typeof setTimeout> | null = null;

        // Wait for DOM to be ready before initializing ScrollTrigger
        const initAnimations = () => {
            if (!containerRef.current || !heroTextRef.current) {
                return null;
            }

            // Kill any existing ScrollTriggers first
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.trigger === containerRef.current) {
                    trigger.kill();
                }
            });

            const animationCtx = gsap.context(() => {
                // Initialize Earth to starting position (centered, smaller size)
                setEarthPosition([0, 0, 0]);
                setEarthScale(0.9); // Further reduced from 1.4 to 0.9
                setEarthRotationY(0);

                // Ensure hero text is visible initially but behind Earth
                if (heroTextRef.current) {
                    gsap.set(heroTextRef.current, {
                        opacity: 1,
                        y: 0,
                        zIndex: 1, // Behind Earth
                    });
                }

                // Create animation object for Earth 3D properties
                const earthAnimation = {
                    rotationY: 0, // Rotation in 3D space
                };

                // Earth 3D rotation - rotates as user scrolls
                gsap.to(earthAnimation, {
                    rotationY: Math.PI * 1.5, // Rotate 270 degrees as it moves
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: '30% top',
                        scrub: true, // Smooth inertia scrolling (weightless feel)
                        onUpdate: () => {
                            setEarthRotationY(earthAnimation.rotationY);
                        },
                    },
                });

                // Earth container CSS transform for smooth left glide (no scale change)
                // This keeps Earth on screen but moves it left, size stays constant
                if (earthContainerRef.current) {
                    const containerAnimation = {
                        x: 0,      // Start centered
                    };

                    gsap.to(containerAnimation, {
                        x: -window.innerWidth * 0.3, // Move left 30% of viewport
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top top',
                            end: '30% top',
                            scrub: true, // Smooth inertia (weightless feel)
                            onUpdate: () => {
                                if (earthContainerRef.current) {
                                    gsap.set(earthContainerRef.current, {
                                        x: containerAnimation.x,
                                        // Scale stays at 1 (no size change)
                                        scale: 1,
                                    });
                                }
                                // Earth scale stays constant
                                setEarthScale(0.9); // Keep initial size constant
                            },
                        },
                    });
                }

                // Hero text - stays visible but fades slightly as Earth moves
                if (heroTextRef.current) {
                    gsap.to(heroTextRef.current, {
                        opacity: 0.3, // Fade but don't disappear completely
                        y: '-20%',     // Slight parallax movement
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top top',
                            end: '30% top',
                            scrub: true,
                            invalidateOnRefresh: true,
                        },
                    });
                }

                // Calculator reveal - just make visible, no slide animation
                if (calculatorRef.current) {
                    // Start visible immediately
                    gsap.set(calculatorRef.current, {
                        x: '0%',
                        opacity: 1,
                        visibility: 'visible',
                    });
                }

                // Background stays white (no transition needed)
                if (bgRef.current) {
                    gsap.set(bgRef.current, { backgroundColor: '#ffffff' });
                }

            }, containerRef);

            // Refresh ScrollTrigger after setup
            ScrollTrigger.refresh();

            return animationCtx;
        };

        // Initialize animations
        const initialize = () => {
            timer = setTimeout(() => {
                ctx = initAnimations();
            }, 100);
        };

        // Handle page visibility changes (when switching tabs)
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // Page became visible - refresh ScrollTrigger
                setTimeout(() => {
                    ScrollTrigger.refresh();
                    if (!ctx && containerRef.current) {
                        initialize();
                    }
                }, 100);
            }
        };

        // Handle window focus (when returning to tab)
        const handleFocus = () => {
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        };

        // Initialize on mount
        initialize();

        // Add event listeners for visibility and focus
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
            if (ctx) {
                ctx.revert();
            }
            // Clean up all ScrollTriggers for this component
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.trigger === containerRef.current) {
                    trigger.kill();
                }
            });
            // Remove event listeners
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
            ScrollTrigger.refresh();
        };
    }, []);

    const handleQuickCalculate = () => {
        // Create a mock formData for aggregator
        const mockFormData = {
            location: EMPTY_LOCATION_DATA,
            electricity: { monthlyUsageKwh: quickKwh || "0", renewablePercentage: "0" },
            fuel: { naturalGasThermsPeYear: (parseFloat(quickGas || "0") * 12).toString(), heatingOilGallonsPerYear: "0", propaneGallonsPerYear: "0" },
            transport: {
                carMilesDrivenPerYear: quickMiles || "0",
                flightHoursPerYear: quickFlights || "0",
                vehicleType: "sedan",
                publicTransitMilesDrivenPerYear: "0"
            },
            waterWaste: EMPTY_WATER_WASTE_DATA,
            industry: EMPTY_INDUSTRY_DATA,
            offsets: EMPTY_OFFSETS_DATA,
        };

        const results = aggregateEmissions(mockFormData as any);

        // Scale by household size (just as a simple heuristic for the quick calc)
        const multiplier = parseInt(householdSize);
        const totalKg = results.netCO2e * 1000 * multiplier;

        // Save to history
        addToHistory({
            totalKg,
            breakdown: {
                transport: results.breakdown.transport * 1000 * multiplier,
                energy: (results.breakdown.electricity + results.breakdown.fuel) * 1000 * multiplier,
                consumption: results.breakdown.industry * 1000 * multiplier,
                waste: results.breakdown.waterWaste * 1000 * multiplier,
            },
            isQuick: true,
        });

        const formattedResults = {
            totalEmissions: totalKg.toFixed(0),
            breakdown: {
                transportation: (results.breakdown.transport * 1000 * multiplier).toFixed(0),
                energy: ((results.breakdown.electricity + results.breakdown.fuel) * 1000 * multiplier).toFixed(0),
                food: (results.breakdown.industry * 1000 * multiplier).toFixed(0),
                lifestyle: (results.breakdown.waterWaste * 1000 * multiplier).toFixed(0),
            },
            formData: mockFormData
        };

        navigate('/results', { state: formattedResults });
    };


    return (
        <div ref={containerRef} className="relative">
            {/* Navigation Bar */}
            <Navigation />

            {/* Background layer */}
            <div
                ref={bgRef}
                className="fixed inset-0 bg-white transition-colors duration-500 -z-20"
            />

            {/* Fixed 3D Earth container - in background, decreases in size on scroll */}
            <div
                ref={earthContainerRef}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                    width: '100vw',
                    height: '100vh',
                    minHeight: '100vh',
                    overflow: 'visible',
                    zIndex: 1, // Behind navigation (z-50) and content, above background
                    visibility: 'visible',
                    opacity: 1,
                    transformOrigin: 'center center',
                }}
            >
                <EarthSceneCanvas
                    className="w-full h-full"
                    earthPosition={earthPosition}
                    earthScale={earthScale}
                    earthRotationY={earthRotationY}
                />
            </div>

            {/* Hero Section - Typography above Earth */}
            <section className="relative min-h-screen flex items-center justify-center" style={{ zIndex: 10, position: 'relative', paddingTop: '5rem' }}>
                <div
                    ref={heroTextRef}
                    className="text-center max-w-4xl mx-auto px-6"
                    style={{ zIndex: 1 }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8 mt-12 md:mt-20"
                    >
                        <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 rounded-full px-5 py-2.5 mb-8">
                            <Leaf className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-700 text-sm font-medium">Carbon Footprint Calculator</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-6xl md:text-8xl font-bold text-gray-900 leading-[1.05] mb-8 tracking-tight mt-4"
                    >
                        Reduce Your
                        <br />
                        <DynamicImpactText
                            className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 bg-clip-text text-transparent"
                        />
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-slate-600 text-xl max-w-2xl mx-auto mb-10 leading-relaxed mt-12 md:mt-16"
                    >
                        Calculate your environmental footprint with precision.
                        Take meaningful action towards a sustainable future.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex items-center justify-center gap-4 text-gray-500 text-sm"
                    >
                        <span>Scroll to explore</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <ArrowRight className="w-4 h-4 rotate-90" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Calculator Section - Centered and displayed immediately */}
            <section
                id="calculator-section"
                className="relative min-h-screen flex items-center justify-center"
                style={{ zIndex: 10, position: 'relative' }}
            >
                <div
                    ref={calculatorRef}
                    className="w-full max-w-xl px-6"
                >
                    <div className="bg-white/95 backdrop-blur-2xl border border-emerald-200/50 rounded-3xl p-8 md:p-10 shadow-2xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Quick Calculator
                            </h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Get an instant estimate of your carbon footprint
                        </p>

                        <div className="space-y-5">
                            {/* Transportation */}
                            <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <Target className="w-4 h-4 text-emerald-600" />
                                    <span className="text-sm font-semibold text-gray-800">Transportation</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-gray-600 text-xs mb-1">Miles/Year</label>
                                        <input
                                            type="number"
                                            placeholder="12,000"
                                            value={quickMiles}
                                            onChange={(e) => setQuickMiles(e.target.value)}
                                            className="w-full bg-white border border-emerald-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-600 text-xs mb-1">Flights/Year</label>
                                        <input
                                            type="number"
                                            placeholder="4"
                                            value={quickFlights}
                                            onChange={(e) => setQuickFlights(e.target.value)}
                                            className="w-full bg-white border border-emerald-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Energy */}
                            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <Zap className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-semibold text-gray-800">Energy Usage</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-gray-600 text-xs mb-1">Electricity (kWh/mo)</label>
                                        <input
                                            type="number"
                                            placeholder="900"
                                            value={quickKwh}
                                            onChange={(e) => setQuickKwh(e.target.value)}
                                            className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-600 text-xs mb-1">Gas (therms/mo)</label>
                                        <input
                                            type="number"
                                            placeholder="50"
                                            value={quickGas}
                                            onChange={(e) => setQuickGas(e.target.value)}
                                            className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Lifestyle */}
                            <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <Users className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-semibold text-gray-800">Lifestyle</span>
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-xs mb-1">Household Size</label>
                                    <select
                                        className="w-full bg-white border border-purple-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-purple-500"
                                        value={householdSize}
                                        onChange={(e) => setHouseholdSize(e.target.value)}
                                    >
                                        <option value="1">1 person</option>
                                        <option value="2">2 people</option>
                                        <option value="3">3 people</option>
                                        <option value="4">4+ people</option>
                                    </select>
                                </div>
                            </div>

                            <Button
                                onClick={handleQuickCalculate}
                                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-5 rounded-xl text-base font-medium shadow-lg shadow-emerald-500/20"
                            >
                                Calculate My Impact
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>

                            <p className="text-center text-xs text-gray-500">
                                For a detailed analysis, try our{' '}
                                <a href="/calculator" className="text-emerald-600 underline hover:text-emerald-700">
                                    full calculator
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section with Parallax */}
            <section className="relative min-h-screen py-32" style={{ zIndex: 10, position: 'relative' }}>
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 rounded-full px-4 py-2 mb-6">
                            <span className="text-emerald-700 text-sm font-medium">Why Choose Us</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Powerful Features for
                            <br />
                            Real <DynamicImpactText />
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[
                            { id: 'analytics', icon: BarChart2, title: 'Precision Analytics', desc: 'Advanced algorithms for accurate carbon measurement' },
                            { id: 'goal', icon: Target, title: 'Goal Setting', desc: 'Set and track personalized sustainability targets' },
                            { id: 'results', icon: Zap, title: 'Instant Results', desc: 'Get your carbon footprint calculation in seconds' },
                            { id: 'community', icon: Users, title: <>Community <DynamicImpactText /></>, desc: 'Join thousands committed to reducing emissions' },
                            { id: 'global', icon: Globe, title: 'Global Standards', desc: 'Calculations based on international protocols' },
                            { id: 'offset', icon: Leaf, title: 'Offset Options', desc: 'Discover verified carbon offset projects' },
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8 }}
                                className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-2xl p-8 hover:border-emerald-400 transition-all duration-300 shadow-sm"
                            >
                                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 mb-6">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Climate Data Slideshow Section */}
            <section className="relative min-h-screen py-32" style={{ zIndex: 10, position: 'relative' }}>
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 rounded-full px-4 py-2 mb-6">
                                <span className="text-emerald-700 text-sm font-medium">Live Data</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Global CO₂
                                <br />
                                <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                                    Emissions Data
                                </span>
                            </h2>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                Real-time data from authentic sources. Track global emissions by country
                                and stay updated with the latest climate news from around the world.
                            </p>
                            <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-6 rounded-xl">
                                Calculate Your Impact
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <ClimateSlideshow />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="relative min-h-[60vh] py-32 flex items-center" style={{ zIndex: 10, position: 'relative' }}>
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Ready to Make a
                            <br />
                            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                                Difference?
                            </span>
                        </h2>
                        <p className="text-gray-600 text-xl max-w-2xl mx-auto mb-10">
                            Start your journey towards carbon neutrality today.
                            Every action counts.
                        </p>
                        <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-10 py-6 rounded-xl text-lg font-medium shadow-xl shadow-emerald-500/20">
                            Get Started Free
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Sticky Calculate Button */}
            <StickyCalculateButton />
        </div>
    );
}


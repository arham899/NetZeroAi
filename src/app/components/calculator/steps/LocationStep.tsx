import { MapPin, Navigation } from "lucide-react";
import { useCalculator } from "../../../store/calculatorStore";
import { Button } from "../../ui/button";
import { useState } from "react";
import { motion } from "motion/react";

export default function LocationStep() {
    const { formData, updateLocation } = useCalculator();
    const [isDetecting, setIsDetecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const detectLocation = () => {
        setIsDetecting(true);
        setError(null);

        if (!("geolocation" in navigator)) {
            setError("Geolocation is not supported by your browser");
            setIsDetecting(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                updateLocation({
                    coordinates: { lat: latitude, lng: longitude },
                });

                try {
                    // Reverse geocoding using Nominatim
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=en`
                    );
                    const data = await response.json();

                    if (data.address) {
                        const city =
                            data.address.city ||
                            data.address.town ||
                            data.address.village ||
                            data.address.municipality ||
                            data.address.suburb ||
                            "";

                        const state = data.address.state || data.address.province || data.address.region || "";
                        const country = data.address.country || "";
                        const postcode = data.address.postcode || "";

                        // Capture house number and road for the main address if available
                        const houseNumber = data.address.house_number || "";
                        const road = data.address.road || "";
                        const streetAddress = [houseNumber, road].filter(Boolean).join(' ');

                        updateLocation({
                            address: streetAddress || data.display_name.split(',')[0],
                            city: city,
                            state: state,
                            country: country,
                            postalCode: postcode,
                        });
                    }
                } catch (err) {
                    console.error("Reverse geocoding failed:", err);
                    setError("Failed to resolve address details. Please enter manually.");
                } finally {
                    setIsDetecting(false);
                }
            },
            (err) => {
                let message = "Failed to detect location.";
                if (err.code === 1) message = "Location access denied. Please allow location permissions.";
                else if (err.code === 2) message = "Location unavailable. Please check your GPS/Network.";
                else if (err.code === 3) message = "Detection timed out. Please try again.";

                setError(message);
                setIsDetecting(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 0
            }
        );
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Where are you located?</h3>
                <p className="text-gray-600">
                    Help us identify your local energy grid and emission standards with a specific location.
                </p>
            </div>

            <div className="space-y-8">
                {/* 1. Primary Manual Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Street Address</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="e.g. 123 Green Avenue"
                                value={formData.location.address}
                                onChange={(e) => updateLocation({ address: e.target.value })}
                                className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Postal Code</label>
                        <input
                            type="text"
                            placeholder="ZIP / Postcode"
                            value={formData.location.postalCode}
                            onChange={(e) => updateLocation({ postalCode: e.target.value })}
                            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">City</label>
                        <input
                            type="text"
                            placeholder="City"
                            value={formData.location.city}
                            onChange={(e) => updateLocation({ city: e.target.value })}
                            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">State / Province</label>
                        <input
                            type="text"
                            placeholder="State"
                            value={formData.location.state}
                            onChange={(e) => updateLocation({ state: e.target.value })}
                            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Country</label>
                        <input
                            type="text"
                            placeholder="Country"
                            value={formData.location.country}
                            onChange={(e) => updateLocation({ country: e.target.value })}
                            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-2"
                    >
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        {error}
                    </motion.p>
                )}

                {/* 2. Detection Action - Now at the bottom row */}
                <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Instant Detection</h4>
                        <p className="text-sm text-gray-500">Auto-fill all fields using your device's high-precision GPS.</p>
                    </div>
                    <Button
                        onClick={detectLocation}
                        disabled={isDetecting}
                        className="w-full md:w-auto px-8 bg-emerald-600 hover:bg-emerald-700 h-14 text-lg items-center gap-2 shadow-lg shadow-emerald-600/10 rounded-2xl"
                    >
                        <Navigation className={`w-5 h-5 ${isDetecting ? "animate-pulse" : ""}`} />
                        {isDetecting ? "Pinpointing..." : "Detect Precise Location"}
                    </Button>
                </div>

                {/* 3. Results and Precision Details */}
                {(formData.location.city || formData.location.country) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 text-right">
                            {formData.location.coordinates.lat && (
                                <div className="hidden md:block">
                                    <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Precision Coords</p>
                                    <p className="text-[10px] font-mono text-emerald-600/70">
                                        {formData.location.coordinates.lat.toFixed(6)}, {formData.location.coordinates.lng?.toFixed(6)}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Active Carbon Zone Identified</p>
                                <p className="text-gray-900 font-semibold text-lg">
                                    {formData.location.address ? `${formData.location.address}, ` : ""}
                                    {formData.location.city}, {formData.location.state} {formData.location.postalCode}
                                </p>
                                <p className="text-gray-500 font-medium">{formData.location.country}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

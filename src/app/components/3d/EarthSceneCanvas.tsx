import { Canvas } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import { HyperrealisticEarth } from './HyperrealisticEarth';

interface EarthSceneCanvasProps {
    className?: string;
    earthPosition?: [number, number, number];
    earthScale?: number;
    earthRotationY?: number;
}

export function EarthSceneCanvas({
    className = '',
    earthPosition = [0, 0, 0],
    earthScale = 2.2,
    earthRotationY = 0
}: EarthSceneCanvasProps) {
    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    {/* Lighting for realistic Earth */}
                    <ambientLight intensity={0.3} />
                    <directionalLight
                        position={[10, 5, 8]}
                        intensity={2.0}
                        color="#ffffff"
                        castShadow
                    />
                    <directionalLight
                        position={[-5, -3, -5]}
                        intensity={0.2}
                        color="#88aaff"
                    />
                    <pointLight
                        position={[0, 0, 10]}
                        intensity={0.3}
                        color="#ffffff"
                    />

                    {/* Stars background */}
                    <Stars
                        radius={100}
                        depth={50}
                        count={3000}
                        factor={3}
                        saturation={0}
                        fade
                        speed={0.5}
                    />

                    {/* Environment for reflections */}
                    <Environment preset="sunset" />

                    {/* Hyperrealistic Earth with NASA textures */}
                    <HyperrealisticEarth
                        position={earthPosition}
                        scale={earthScale}
                        rotationY={earthRotationY}
                        enableRealTimeRotation={true}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}

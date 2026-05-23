import { Canvas } from '@react-three/fiber';
import { Environment, Stars, Float } from '@react-three/drei';
import { Suspense } from 'react';
import { Earth } from './Earth';

interface SceneProps {
    earthPosition?: [number, number, number];
    earthScale?: number;
    className?: string;
}

function SceneContent({ earthPosition, earthScale }: Omit<SceneProps, 'className'>) {
    return (
        <>
            {/* Ambient and directional lighting - natural white light */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#ffffff" />
            <pointLight position={[0, 0, 10]} intensity={0.4} color="#ffffff" />

            {/* Star field background - subtle for white theme */}
            <Stars radius={100} depth={50} count={3000} factor={2} saturation={0} fade speed={1} />

            {/* Environment for reflections - use sunlit preset for brighter look */}
            <Environment preset="sunset" />

            {/* Floating Earth */}
            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
                <Earth position={earthPosition} scale={earthScale} />
            </Float>
        </>
    );
}

export function Scene({ earthPosition = [0, 0, 0], earthScale = 1, className = '' }: SceneProps) {
    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    <SceneContent earthPosition={earthPosition} earthScale={earthScale} />
                </Suspense>
            </Canvas>
        </div>
    );
}

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarFieldProps {
    count?: number;
    radius?: number;
}

export function StarField({ count = 5000, radius = 100 }: StarFieldProps) {
    const points = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
            // Spherical distribution for stars
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = radius + Math.random() * radius * 0.5;

            positions[i] = r * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = r * Math.cos(phi);
        }
        return positions;
    }, [count, radius]);

    const sizes = useMemo(() => {
        const sizes = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            sizes[i] = Math.random() * 2 + 0.5;
        }
        return sizes;
    }, [count]);

    useFrame(() => {
        if (points.current) {
            points.current.rotation.y += 0.0001;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                    count={count}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[sizes, 1]}
                    count={count}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.5}
                color="#ffffff"
                sizeAttenuation={true}
                transparent
                opacity={0.8}
            />
        </points>
    );
}


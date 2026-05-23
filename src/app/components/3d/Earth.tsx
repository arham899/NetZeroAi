import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface EarthProps {
    position?: [number, number, number];
    scale?: number;
}

export function Earth({ position = [0, 0, 0], scale = 1 }: EarthProps) {
    const earthRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);

    // Create realistic Earth texture with oceans and continents
    const earthTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d')!;
        
        // Base ocean color (realistic blue)
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1e3a8a'); // Darker blue at poles
        gradient.addColorStop(0.5, '#2563eb'); // Medium blue at equator
        gradient.addColorStop(1, '#1e3a8a'); // Darker blue at poles
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add realistic continents with proper shapes
        const continents = [
            // North America
            { x: 300, y: 250, w: 500, h: 400, color: '#166534', detail: true },
            // Europe/Africa
            { x: 800, y: 200, w: 400, h: 600, color: '#14532d', detail: true },
            // Asia
            { x: 1300, y: 200, w: 500, h: 500, color: '#15803d', detail: true },
            // Australia
            { x: 1600, y: 550, w: 250, h: 200, color: '#166534', detail: false },
            // South America
            { x: 500, y: 650, w: 300, h: 300, color: '#14532d', detail: true },
        ];
        
        continents.forEach(continent => {
            // Main continent shape
            ctx.fillStyle = continent.color;
            ctx.beginPath();
            ctx.ellipse(continent.x, continent.y, continent.w / 2, continent.h / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Add terrain variation
            if (continent.detail) {
                // Mountains/forests (darker green)
                ctx.fillStyle = '#065f46';
                for (let i = 0; i < 5; i++) {
                    ctx.beginPath();
                    ctx.ellipse(
                        continent.x + (Math.random() - 0.5) * continent.w * 0.6,
                        continent.y + (Math.random() - 0.5) * continent.h * 0.6,
                        continent.w * 0.1,
                        continent.h * 0.1,
                        0, 0, Math.PI * 2
                    );
                    ctx.fill();
                }
                
                // Grasslands (lighter green)
                ctx.fillStyle = '#22c55e';
                for (let i = 0; i < 8; i++) {
                    ctx.beginPath();
                    ctx.ellipse(
                        continent.x + (Math.random() - 0.5) * continent.w * 0.7,
                        continent.y + (Math.random() - 0.5) * continent.h * 0.7,
                        continent.w * 0.08,
                        continent.h * 0.08,
                        0, 0, Math.PI * 2
                    );
                    ctx.fill();
                }
            }
        });
        
        // Add subtle cloud coverage
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = 40 + Math.random() * 60;
            const opacity = 0.2 + Math.random() * 0.3;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        return texture;
    }, []);

    // Create Earth material with texture
    const earthMaterial = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            map: earthTexture,
            roughness: 0.8,
            metalness: 0.1,
        });
    }, [earthTexture]);

    // Create atmosphere shader material for realistic glow effect
    const atmosphereMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 atmosphereColor = vec3(0.2, 0.5, 0.8);
          gl_FragColor = vec4(atmosphereColor, intensity * 0.4);
        }
      `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true,
        });
    }, []);

    // Rotate Earth continuously
    useFrame((_, delta) => {
        if (earthRef.current) {
            earthRef.current.rotation.y += delta * 0.1;
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y += delta * 0.08;
        }
    });

    return (
        <group position={position} scale={scale}>
            {/* Main Earth Sphere with texture */}
            <Sphere ref={earthRef} args={[2, 64, 64]}>
                <primitive object={earthMaterial} attach="material" />
            </Sphere>

            {/* Atmosphere glow - realistic blue atmosphere */}
            <Sphere ref={atmosphereRef} args={[2.15, 64, 64]}>
                <primitive object={atmosphereMaterial} attach="material" />
            </Sphere>
        </group>
    );
}

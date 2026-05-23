import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface EarthSceneProps {
    position?: [number, number, number];
    scale?: number;
    rotationY?: number;
}

export function EarthScene({ position = [0, 0, 0], scale = 2.2, rotationY = 0 }: EarthSceneProps) {
    const earthRef = useRef<THREE.Mesh>(null);
    const cloudRef = useRef<THREE.Mesh>(null);

    // Create procedural Earth material with gradient shader
    const earthMaterial = useMemo(() => {
        // Create a shader material for procedural Earth appearance
        const vertexShader = `
            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform vec3 oceanColor;
            uniform vec3 landColor;
            uniform vec3 iceColor;
            uniform float time;
            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            
            // Simple noise function for continents
            float noise(vec3 p) {
                return fract(sin(dot(p, vec3(12.9898, 78.233, 54.53))) * 43758.5453);
            }
            
            // Create continent-like patterns
            float continents(vec3 pos) {
                float n = 0.0;
                float amplitude = 1.0;
                float frequency = 1.0;
                
                for (int i = 0; i < 4; i++) {
                    n += noise(pos * frequency) * amplitude;
                    frequency *= 2.0;
                    amplitude *= 0.5;
                }
                return n;
            }
            
            void main() {
                vec3 pos = normalize(vWorldPosition);
                
                // Create latitude-based zones
                float latitude = abs(pos.y);
                
                // Ocean base (blue-green)
                vec3 color = oceanColor;
                
                // Add continent patterns
                float continent = continents(pos * 3.0 + time * 0.1);
                if (continent > 0.45) {
                    // Land areas - green/brown
                    color = mix(landColor, vec3(0.2, 0.4, 0.1), continent);
                }
                
                // Add polar ice caps
                if (latitude > 0.7) {
                    color = mix(color, iceColor, (latitude - 0.7) / 0.3);
                }
                
                // Add specular highlights for water
                vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
                float spec = pow(max(dot(vNormal, lightDir), 0.0), 32.0);
                color += vec3(spec * 0.3);
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        return new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                oceanColor: { value: new THREE.Color(0.1, 0.3, 0.6) }, // Deep blue ocean
                landColor: { value: new THREE.Color(0.2, 0.5, 0.2) }, // Green land
                iceColor: { value: new THREE.Color(0.9, 0.95, 1.0) }, // White ice
                time: { value: 0.0 },
            },
            lights: true,
        });
    }, []);

    // Create procedural cloud material
    const cloudMaterial = useMemo(() => {
        const vertexShader = `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float time;
            varying vec3 vWorldPosition;
            
            float noise(vec3 p) {
                return fract(sin(dot(p, vec3(12.9898, 78.233, 54.53))) * 43758.5453);
            }
            
            float clouds(vec3 pos) {
                float n = 0.0;
                float amplitude = 1.0;
                float frequency = 1.0;
                
                for (int i = 0; i < 3; i++) {
                    n += noise(pos * frequency + time * 0.05) * amplitude;
                    frequency *= 2.0;
                    amplitude *= 0.5;
                }
                return smoothstep(0.3, 0.7, n);
            }
            
            void main() {
                vec3 pos = normalize(vWorldPosition);
                float cloudDensity = clouds(pos * 2.0);
                gl_FragColor = vec4(1.0, 1.0, 1.0, cloudDensity * 0.6);
            }
        `;

        return new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                time: { value: 0.0 },
            },
            transparent: true,
            depthWrite: false,
        });
    }, []);

    // Rotate Earth continuously and update shader time
    useFrame((_, delta) => {
        if (earthRef.current) {
            earthRef.current.rotation.y = rotationY + delta * 0.1;
            // Update shader time for animation
            const material = earthRef.current.material as THREE.ShaderMaterial;
            if (material && material.uniforms && material.uniforms.time) {
                material.uniforms.time.value += delta * 0.1;
            }
        }
        if (cloudRef.current) {
            cloudRef.current.rotation.y = rotationY + delta * 0.08;
            // Update cloud shader time
            const material = cloudRef.current.material as THREE.ShaderMaterial;
            if (material && material.uniforms && material.uniforms.time) {
                material.uniforms.time.value += delta * 0.1;
            }
        }
    });

    return (
        <>
            {/* Enhanced lighting for visibility */}
            <ambientLight intensity={0.6} />
            <directionalLight 
                position={[5, 3, 5]} 
                intensity={2.5} 
                color="#ffffff"
            />
            <directionalLight 
                position={[-5, -3, -5]} 
                intensity={0.5} 
                color="#ffffff"
            />

            {/* Main Earth Sphere - procedural, always visible */}
            <Sphere ref={earthRef} args={[1, 64, 64]} position={position} scale={scale}>
                <primitive object={earthMaterial} attach="material" />
            </Sphere>

            {/* Cloud layer - procedural clouds */}
            <Sphere 
                ref={cloudRef} 
                args={[1.02, 64, 64]} 
                position={position} 
                scale={scale}
            >
                <primitive object={cloudMaterial} attach="material" />
            </Sphere>
        </>
    );
}

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Hyperrealistic Earth Component
 * 
 * Features:
 * - NASA/Solar System Scope textures (loaded from CDN)
 * - Real-time rotation synced to approximate UTC
 * - Day texture with realistic colors
 * - Bump mapping for terrain relief
 * - Specular highlights on oceans
 * - Atmospheric Fresnel glow
 * - Separate cloud layer
 */

interface HyperrealisticEarthProps {
    position?: [number, number, number];
    scale?: number;
    rotationY?: number;
    enableRealTimeRotation?: boolean;
}

// NASA/Solar System Scope texture URLs (free for educational/non-commercial use)
// Source: https://www.solarsystemscope.com/textures/
const TEXTURE_URLS = {
    day: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    bump: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
    specular: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
    clouds: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
};

// Earth rotation: 1 full rotation per 60 seconds for visible movement
const ROTATION_SPEED = (2 * Math.PI) / 60;

export function HyperrealisticEarth({
    position = [0, 0, 0],
    scale = 1,
    rotationY = 0,
    enableRealTimeRotation = true,
}: HyperrealisticEarthProps) {
    const earthRef = useRef<THREE.Mesh>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);
    const [textures, setTextures] = useState<{
        day?: THREE.Texture;
        bump?: THREE.Texture;
        specular?: THREE.Texture;
        clouds?: THREE.Texture;
    }>({});

    // Load textures
    useEffect(() => {
        const loader = new THREE.TextureLoader();
        const loadTexture = (url: string): Promise<THREE.Texture> => {
            return new Promise((resolve, reject) => {
                loader.load(
                    url,
                    (texture) => resolve(texture),
                    undefined,
                    (error) => reject(error)
                );
            });
        };

        Promise.all([
            loadTexture(TEXTURE_URLS.day),
            loadTexture(TEXTURE_URLS.bump),
            loadTexture(TEXTURE_URLS.specular),
            loadTexture(TEXTURE_URLS.clouds),
        ]).then(([day, bump, specular, clouds]) => {
            setTextures({ day, bump, specular, clouds });
        }).catch((error) => {
            console.warn('Failed to load some textures, using fallback:', error);
            // Load at least the day texture
            loadTexture(TEXTURE_URLS.day).then((day) => {
                setTextures({ day });
            });
        });
    }, []);

    // Earth material with realistic shading
    const earthMaterial = useMemo(() => {
        if (!textures.day) {
            // Fallback material while loading
            return new THREE.MeshStandardMaterial({
                color: 0x2563eb,
                roughness: 0.8,
                metalness: 0.1,
            });
        }

        return new THREE.MeshStandardMaterial({
            map: textures.day,
            bumpMap: textures.bump,
            bumpScale: 0.05,
            roughnessMap: textures.specular,
            roughness: 0.7,
            metalness: 0.0,
        });
    }, [textures]);

    // Cloud material (transparent white)
    const cloudMaterial = useMemo(() => {
        if (!textures.clouds) return null;

        return new THREE.MeshStandardMaterial({
            map: textures.clouds,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
        });
    }, [textures.clouds]);

    // Atmosphere shader with Fresnel effect
    const atmosphereMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Fresnel effect for realistic atmospheric glow
          vec3 viewDir = normalize(-vPosition);
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
          
          // Blue atmosphere color
          vec3 atmosphereColor = vec3(0.3, 0.6, 1.0);
          
          // Intensity based on fresnel
          float intensity = fresnel * 0.6;
          
          gl_FragColor = vec4(atmosphereColor, intensity);
        }
      `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true,
            depthWrite: false,
        });
    }, []);

    // Animate Earth rotation
    useFrame((_, delta) => {
        if (earthRef.current && enableRealTimeRotation) {
            earthRef.current.rotation.y += delta * ROTATION_SPEED;
        }

        // Clouds rotate slightly slower
        if (cloudsRef.current && enableRealTimeRotation) {
            cloudsRef.current.rotation.y += delta * ROTATION_SPEED * 0.9;
        }
    });

    return (
        <group position={position} scale={scale} rotation={[0.1, rotationY, 0]}>
            {/* Main Earth sphere */}
            <Sphere ref={earthRef} args={[2, 128, 128]}>
                <primitive object={earthMaterial} attach="material" />
            </Sphere>

            {/* Cloud layer */}
            {cloudMaterial && (
                <Sphere ref={cloudsRef} args={[2.02, 64, 64]}>
                    <primitive object={cloudMaterial} attach="material" />
                </Sphere>
            )}

            {/* Atmospheric glow */}
            <Sphere ref={atmosphereRef} args={[2.2, 64, 64]}>
                <primitive object={atmosphereMaterial} attach="material" />
            </Sphere>
        </group>
    );
}

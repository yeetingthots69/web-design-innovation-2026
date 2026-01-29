"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ElementType, ELEMENT_TYPES } from "@/data/elements";

interface ElementMeshProps {
    type: ElementType;
    position: [number, number, number];
    isGlitching?: boolean;
    bloomIntensity?: number;
}

/**
 * ElementMesh Component
 * Renders the appropriate 3D primitive based on element type.
 * Includes levitation animation and emissive materials for neon glow.
 */
export function ElementMesh({
    type,
    position,
    isGlitching = false,
    bloomIntensity = 1,
}: ElementMeshProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const config = ELEMENT_TYPES[type];
    const initialY = position[1];

    // Animation: levitation and rotation
    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.elapsedTime;

        // Levitation (sine wave on Y-axis)
        meshRef.current.position.y =
            initialY + Math.sin(time * 1.5 + position[0] + position[2]) * 0.15;

        // Slow rotation
        meshRef.current.rotation.y += 0.005;

        // Glitch shake effect
        if (isGlitching) {
            meshRef.current.position.x =
                position[0] + (Math.random() - 0.5) * 0.1;
            meshRef.current.position.z =
                position[2] + (Math.random() - 0.5) * 0.1;
        } else {
            meshRef.current.position.x = position[0];
            meshRef.current.position.z = position[2];
        }
    });

    // Material with emissive glow
    const material = useMemo(() => {
        const color = new THREE.Color(config.color);

        if (type === "wood") {
            // Wireframe for wood
            return (
                <meshBasicMaterial
                    color={config.color}
                    wireframe
                    transparent
                    opacity={0.9}
                />
            );
        }

        if (type === "water") {
            // Glass-like for water
            return (
                <meshPhysicalMaterial
                    color={config.color}
                    transparent
                    opacity={0.6}
                    roughness={0.1}
                    metalness={0.1}
                    transmission={0.8}
                    thickness={1}
                    emissive={color}
                    emissiveIntensity={config.emissiveIntensity * bloomIntensity}
                />
            );
        }

        if (type === "metal") {
            // Chrome/metallic for metal
            return (
                <meshStandardMaterial
                    color={config.color}
                    roughness={0.1}
                    metalness={0.9}
                    emissive={color}
                    emissiveIntensity={config.emissiveIntensity * bloomIntensity * 0.5}
                />
            );
        }

        // Default emissive material for fire and earth
        return (
            <meshStandardMaterial
                color={config.color}
                emissive={color}
                emissiveIntensity={config.emissiveIntensity * bloomIntensity}
                roughness={0.4}
                metalness={0.2}
            />
        );
    }, [type, config, bloomIntensity]);

    // Render appropriate geometry based on shape
    const renderGeometry = () => {
        switch (config.shape) {
            case "tetrahedron":
                return <tetrahedronGeometry args={[0.5, 0]} />;
            case "sphere":
                return <sphereGeometry args={[0.4, 32, 32]} />;
            case "box":
                return <boxGeometry args={[0.6, 0.6, 0.6]} />;
            case "octahedron":
                return <octahedronGeometry args={[0.45, 0]} />;
            case "cylinder":
                return <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />;
            default:
                return <sphereGeometry args={[0.4, 32, 32]} />;
        }
    };

    return (
        <mesh ref={meshRef} position={position} castShadow receiveShadow>
            {renderGeometry()}
            {material}
        </mesh>
    );
}

"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Floating dust particles for ambient atmosphere
 */
export function DustParticles({ count = 100 }: { count?: number }) {
    const pointsRef = useRef<THREE.Points>(null);

    // Generate random particle positions
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities: number[] = [];

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = Math.random() * 8;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

            velocities.push(
                (Math.random() - 0.5) * 0.002,
                (Math.random() - 0.5) * 0.001,
                (Math.random() - 0.5) * 0.002
            );
        }

        return { positions, velocities };
    }, [count]);

    // Animate particles
    useFrame(() => {
        if (!pointsRef.current) return;

        const positions = pointsRef.current.geometry.attributes.position
            .array as Float32Array;

        for (let i = 0; i < count; i++) {
            positions[i * 3] += particles.velocities[i * 3];
            positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
            positions[i * 3 + 2] += particles.velocities[i * 3 + 2];

            // Wrap around bounds
            if (Math.abs(positions[i * 3]) > 7.5) {
                positions[i * 3] *= -0.9;
            }
            if (positions[i * 3 + 1] < 0 || positions[i * 3 + 1] > 8) {
                particles.velocities[i * 3 + 1] *= -1;
            }
            if (Math.abs(positions[i * 3 + 2]) > 7.5) {
                positions[i * 3 + 2] *= -0.9;
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#00f2ff"
                size={0.03}
                transparent
                opacity={0.4}
                sizeAttenuation
            />
        </points>
    );
}

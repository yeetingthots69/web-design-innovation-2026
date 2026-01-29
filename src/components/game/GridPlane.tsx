"use client";

import {useRef, useState} from "react";
import {ThreeEvent} from "@react-three/fiber";
import * as THREE from "three";
import {useGameStore} from "@/stores/gameStore";
import {ElementMesh} from "./ElementMesh";

interface TileProps {
    x: number;
    z: number;
}

/**
 * Individual grid tile
 */
function Tile({x, z}: TileProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [isHovered, setIsHovered] = useState(false);

    const {grid, activeElement, placeElement, removeElement, setHoveredTile} =
        useGameStore();

    const cell = grid[x][z];
    const worldX = (x - 1.5) * 1.2;
    const worldZ = (z - 1.5) * 1.2;

    // Don't render disabled tiles
    if (!cell.isEnabled) {
        return null;
    }


    const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setIsHovered(true);
        setHoveredTile({x, z});
    };

    const handlePointerOut = () => {
        setIsHovered(false);
        setHoveredTile(null);
    };

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();

        if (cell.element) {
            // Right click or ctrl+click to remove
            if (e.nativeEvent.ctrlKey || e.nativeEvent.button === 2) {
                removeElement(x, z);
            }
        } else if (activeElement) {
            placeElement(x, z, activeElement);
        }
    };

    return (
        <group position={[worldX, 0, worldZ]}>
            {/* Base tile - completely invisible, only for interaction */}
            <mesh
                ref={meshRef}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onContextMenu={(e) => {
                    e.stopPropagation();
                    if (cell.element) removeElement(x, z);
                }}
            >
                <planeGeometry args={[1.1, 1.1]}/>
                <meshBasicMaterial
                    visible={false}
                />
            </mesh>

            {/* Grid lines - hollow outline, rendered on top */}
            <lineSegments
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.001, 0]}
                renderOrder={1}
            >
                <edgesGeometry
                    args={[new THREE.PlaneGeometry(1.1, 1.1)]}
                />
                <lineBasicMaterial
                    color={isHovered ? "#00f2ff" : "#3a3a3a"}
                    transparent={false}
                />
            </lineSegments>

            {/* Holographic cursor effect when hovered */}
            {isHovered && (
                <mesh
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 0.002, 0]}
                    renderOrder={2}
                >
                    <planeGeometry args={[1.05, 1.05]}/>
                    <meshBasicMaterial
                        color="#00f2ff"
                        transparent
                        opacity={0.15}
                        depthWrite={false}
                    />
                </mesh>
            )}

            {/* Render element if present */}
            {cell.element && (
                <ElementMesh
                    type={cell.element}
                    position={[0, 0.5, 0]}
                    isGlitching={cell.isGlitching}
                    bloomIntensity={cell.bloomIntensity}
                />
            )}
        </group>
    );
}

/**
 * GridPlane Component
 * Creates a 4x4 grid of interactive tiles for element placement.
 * Respects the isEnabled property of each cell for custom grid shapes.
 */
export function GridPlane() {
    const {grid} = useGameStore();
    const tiles = [];

    for (let x = 0; x < 4; x++) {
        for (let z = 0; z < 4; z++) {
            tiles.push(<Tile key={`${x}-${z}`} x={x} z={z}/>);
        }
    }

    return (
        <group>
            {tiles}

            {/* Center platform glow */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
                <planeGeometry args={[5.5, 5.5]}/>
                <meshBasicMaterial
                    color="#00f2ff"
                    transparent
                    opacity={0.03}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}

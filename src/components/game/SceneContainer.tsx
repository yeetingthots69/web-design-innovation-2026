"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { GridPlane } from "./GridPlane";
import { DustParticles } from "./DustParticles";

/**
 * Hook to get responsive zoom level based on screen size
 */
function useResponsiveZoom() {
    const [zoom, setZoom] = useState(50);

    useEffect(() => {
        const updateZoom = () => {
            const width = window.innerWidth;
            if (width < 576) {
                setZoom(35); // Mobile: zoom out to fit grid
            } else if (width < 768) {
                setZoom(40); // Small tablets
            } else if (width < 992) {
                setZoom(45); // Tablets
            } else {
                setZoom(50); // Desktop
            }
        };

        updateZoom();
        window.addEventListener("resize", updateZoom);
        return () => window.removeEventListener("resize", updateZoom);
    }, []);

    return zoom;
}

/**
 * SceneContainer Component
 * Main 3D scene setup with isometric camera, lighting, and post-processing effects.
 */
export function SceneContainer() {
    const zoom = useResponsiveZoom();

    return (
        <div className="canvas-container">
            <Canvas
                shadows
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: false }}
                style={{ background: "#050505" }}
            >
                <Suspense fallback={null}>
                    {/* Isometric Orthographic Camera */}
                    <OrthographicCamera
                        makeDefault
                        position={[20, 20, 20]}
                        zoom={zoom}
                        near={-100}
                        far={200}
                    />

                    {/* Allow subtle camera rotation */}
                    <OrbitControls
                        enablePan={false}
                        enableZoom={true}
                        minZoom={25}
                        maxZoom={80}
                        enableRotate={true}
                        minPolarAngle={Math.PI / 6}
                        maxPolarAngle={Math.PI / 3}
                        minAzimuthAngle={-Math.PI / 6}
                        maxAzimuthAngle={Math.PI / 6}
                    />

                    {/* Minimal ambient lighting - most light from emissive materials */}
                    <ambientLight intensity={0.1} />
                    <directionalLight
                        position={[10, 20, 10]}
                        intensity={0.3}
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />

                    {/* Main game grid */}
                    <GridPlane />

                    {/* Floating dust particles for atmosphere */}
                    <DustParticles count={80} />

                    {/* Post-processing effects */}
                    <EffectComposer>
                        <Bloom
                            luminanceThreshold={0.8}
                            luminanceSmoothing={0.9}
                            intensity={1.5}
                            mipmapBlur
                        />
                        <Noise opacity={0.03} />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </div>
    );
}

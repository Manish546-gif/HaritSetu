import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { ThreeErrorBoundary } from "./ThreeErrorBoundary";
import { Leaf } from "lucide-react";

function LeafModel() {
    const meshRef = useRef<any>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 0.15;
            meshRef.current.rotation.z = Math.sin(t * 0.6) * 0.15;
            meshRef.current.rotation.x = Math.cos(t * 0.4) * 0.1;

            // Subtle breathing scale
            const s = 1 + Math.sin(t * 0.8) * 0.04;
            meshRef.current.scale.set(s, s, s);
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1, 15]} />
                <MeshDistortMaterial
                    color="#2e7d32"
                    speed={2}
                    distort={0.3}
                    radius={1}
                    emissive="#1b5e20"
                    emissiveIntensity={0.2}
                    roughness={0.4}
                    metalness={0.1}
                />
            </mesh>
        </Float>
    );
}

const Fallback = () => (
    <div className="w-64 h-64 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
        <Leaf className="w-32 h-32 text-green-600 opacity-20" />
    </div>
);

export const About3DLeaf = () => {
    return (
        <div className="w-full h-[400px] relative">
            <ThreeErrorBoundary fallback={<Fallback />}>
                <Canvas camera={{ position: [0, 0, 5], fov: 40 }} gl={{ alpha: true }}>
                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <LeafModel />
                </Canvas>
            </ThreeErrorBoundary>
        </div>
    );
};

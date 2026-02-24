import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Cylinder, Text, MeshDistortMaterial } from "@react-three/drei";
import { ThreeErrorBoundary } from "./ThreeErrorBoundary";
import { Wallet } from "lucide-react";
import * as THREE from "three";

function Coin() {
    const meshRef = useRef<any>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 1.5;
            meshRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.15;
            meshRef.current.rotation.z = Math.cos(t * 0.3) * 0.1;

            // Breathing scale and shimmer intensity
            const s = 1 + Math.sin(t * 1.2) * 0.05;
            meshRef.current.scale.set(s, s, s);

            if (meshRef.current.material) {
                (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2 + Math.abs(Math.sin(t * 2)) * 0.3;
            }
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
                <meshStandardMaterial
                    color="#ffd700"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#ffb300"
                    emissiveIntensity={0.2}
                />
                {/* Leaf Symbol (approximated) */}
                <mesh position={[0, 0.11, 0]}>
                    <boxGeometry args={[0.8, 0.05, 0.4]} />
                    <meshStandardMaterial color="#2e7d32" />
                </mesh>
            </mesh>
        </Float>
    );
}

const Fallback = () => (
    <div className="w-64 h-64 bg-yellow-50 rounded-full flex items-center justify-center animate-pulse">
        <Wallet className="w-32 h-32 text-yellow-600 opacity-20" />
    </div>
);

export const Wallet3DCoin = () => {
    return (
        <div className="w-full h-[400px] relative">
            <ThreeErrorBoundary fallback={<Fallback />}>
                <Canvas camera={{ position: [0, 0, 5], fov: 40 }} gl={{ alpha: true }}>
                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, 10]} intensity={2} />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#ffd700" />
                    <Coin />
                </Canvas>
            </ThreeErrorBoundary>
        </div>
    );
};

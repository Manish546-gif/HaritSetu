import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Stars } from "@react-three/drei";
import { ThreeErrorBoundary } from "./ThreeErrorBoundary";
import { ShoppingBag } from "lucide-react";
import * as THREE from "three";

function CloudNode({ position, color = "#66bb6a" }: { position: [number, number, number], color?: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            // Subtle breathing scale
            const s = 1 + Math.sin(t * 1.2 + position[0]) * 0.05;
            meshRef.current.scale.set(s, s, s);
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5} position={position}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </mesh>
        </Float>
    );
}

function Connections() {
    const groupRef = useRef<THREE.Group>(null);
    const points = useMemo(() => [
        new THREE.Vector3(-2, 1, 0),
        new THREE.Vector3(2, 2, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(-3, -2, 0),
        new THREE.Vector3(3, -1, 0),
    ], []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.05;
            groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {points.map((p, i) => (
                <CloudNode key={i} position={[p.x, p.y, p.z]} color={i % 2 === 0 ? "#2e7d32" : "#81c784"} />
            ))}
        </group>
    );
}

const Fallback = () => (
    <div className="w-64 h-64 bg-green-50 rounded-full flex items-center justify-center animate-pulse">
        <ShoppingBag className="w-32 h-32 text-green-600 opacity-10" />
    </div>
);

export const Marketplace3D = () => {
    return (
        <div className="w-full h-[400px] relative">
            <ThreeErrorBoundary fallback={<Fallback />}>
                <Canvas camera={{ position: [0, 0, 8], fov: 40 }} gl={{ alpha: true }}>
                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <Connections />
                </Canvas>
            </ThreeErrorBoundary>
        </div>
    );
};

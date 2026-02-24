import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Box, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { ThreeErrorBoundary } from "./ThreeErrorBoundary";
import { Calculator } from "lucide-react";
import * as THREE from "three";

function GrowthBar({ index, growth }: { index: number; growth: number }) {
    const ref = useRef<any>(null);
    const targetHeight = 1 + growth * (1 + Math.sin(index) * 0.5);

    useFrame((state) => {
        if (ref.current) {
            ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, targetHeight, 0.1);
            ref.current.position.y = ref.current.scale.y / 2;

            // Subtle breathing scale on the X/Z axis
            const t = state.clock.getElapsedTime();
            const pulse = 1 + Math.sin(t * 1.5 + index) * 0.05;
            ref.current.scale.x = 0.8 * pulse;
            ref.current.scale.z = 0.8 * pulse;
        }
    });

    return (
        <mesh ref={ref} position={[index * 1.2 - 1.2, 0, 0]}>
            <boxGeometry args={[0.8, 1, 0.8]} />
            <meshStandardMaterial
                color={new THREE.Color().setHSL(0.2 + growth * 0.15, 0.6, 0.5)}
                emissive={new THREE.Color().setHSL(0.2 + growth * 0.15, 0.6, 0.2)}
            />
        </mesh>
    );
}

function Scene({ growth = 0.5 }) {
    return (
        <group position={[0, -2, 0]}>
            <GrowthBar index={0} growth={growth} />
            <GrowthBar index={1} growth={growth} />
            <GrowthBar index={2} growth={growth} />

            <Float speed={2} position={[0, 4, 0]}>
                <mesh>
                    <icosahedronGeometry args={[0.6, 4]} />
                    <MeshDistortMaterial color="#2e7d32" speed={3} distort={0.4} />
                </mesh>
            </Float>
        </group>
    );
}

const Fallback = () => (
    <div className="w-64 h-64 bg-green-50 rounded-full flex items-center justify-center animate-pulse">
        <Calculator className="w-32 h-32 text-green-600 opacity-10" />
    </div>
);

export const Calculator3D = ({ growth = 0.5 }) => {
    return (
        <div className="w-full h-[400px] relative">
            <ThreeErrorBoundary fallback={<Fallback />}>
                <Canvas camera={{ position: [0, 3, 10], fov: 40 }} gl={{ alpha: true }}>
                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <Scene growth={growth} />
                </Canvas>
            </ThreeErrorBoundary>
        </div>
    );
};

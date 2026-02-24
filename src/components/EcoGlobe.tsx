import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function RotatingGlobe() {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        // Dynamic rotations
        if (meshRef.current) meshRef.current.rotation.y = t * 0.12;
        if (innerRef.current) innerRef.current.rotation.y = -t * 0.08;

        // Breathing & Wobble effect on the whole group
        if (groupRef.current) {
            // Subtle breathing (scale)
            const scale = 1 + Math.sin(t * 0.8) * 0.03;
            groupRef.current.scale.set(scale, scale, scale);

            // Slight organic wobble
            groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.05;
            groupRef.current.rotation.z = Math.cos(t * 0.3) * 0.03;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Core */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[1.4, 48, 48]} />
                <meshStandardMaterial
                    color="#2e7d32"
                    roughness={0.5}
                    metalness={0.15}
                    emissive="#1b5e20"
                    emissiveIntensity={0.25}
                />
            </mesh>
            {/* Atmosphere */}
            <mesh ref={innerRef}>
                <sphereGeometry args={[1.6, 32, 32]} />
                <meshStandardMaterial
                    color="#81c784"
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                />
            </mesh>
            {/* Outer halo */}
            <mesh>
                <sphereGeometry args={[1.75, 32, 32]} />
                <meshStandardMaterial
                    color="#a5d6a7"
                    transparent
                    opacity={0.04}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
}

function OrbitRing() {
    const ref = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.rotation.z = clock.getElapsedTime() * 0.05;
        }
    });
    return (
        <mesh ref={ref} rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[2.1, 0.012, 12, 100]} />
            <meshBasicMaterial color="#66bb6a" transparent opacity={0.5} />
        </mesh>
    );
}

function OrbitRing2() {
    const ref = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.rotation.z = -clock.getElapsedTime() * 0.03;
        }
    });
    return (
        <mesh ref={ref} rotation={[Math.PI / 5, Math.PI / 4, 0]}>
            <torusGeometry args={[2.3, 0.008, 12, 100]} />
            <meshBasicMaterial color="#a5d6a7" transparent opacity={0.3} />
        </mesh>
    );
}

function StarField() {
    const positions = useMemo(() => {
        const arr = new Float32Array(1500 * 3);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = (Math.random() - 0.5) * 120;
        }
        return arr;
    }, []);
    const geo = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        return g;
    }, [positions]);

    return (
        <points geometry={geo}>
            <pointsMaterial color="#c8e6c9" size={0.08} transparent opacity={0.7} />
        </points>
    );
}

function Particles() {
    const ref = useRef<THREE.Points>(null);
    const geo = useMemo(() => {
        const count = 60;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            positions[i * 3] = 1.9 * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = 1.9 * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = 1.9 * Math.cos(phi);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        return g;
    }, []);

    useFrame(({ clock }) => {
        if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.07;
    });

    return (
        <points ref={ref} geometry={geo}>
            <pointsMaterial color="#a5d6a7" size={0.05} transparent opacity={0.9} />
        </points>
    );
}

const EcoGlobe = () => {
    return (
        <div style={{ width: "100%", height: "100%", minHeight: "400px" }}>
            <Canvas
                camera={{ position: [0, 0, 4.5], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={0.7} color="#c8e6c9" />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <pointLight position={[-4, -4, -4]} intensity={0.5} color="#81c784" />

                <Suspense fallback={null}>
                    <StarField />
                    <RotatingGlobe />
                    <OrbitRing />
                    <OrbitRing2 />
                    <Particles />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate={false}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default EcoGlobe;

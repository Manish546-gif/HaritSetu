import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 150, color = "#81c784" }) {
    const points = useRef<THREE.Points>(null);

    const { positions, velocities } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

            vel[i * 3] = (Math.random() - 0.5) * 0.01;
            vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
        }
        return { positions: pos, velocities: vel };
    }, [count]);

    useFrame((state) => {
        if (!points.current || !points.current.geometry) return;

        const attr = points.current.geometry.attributes.position;
        if (!attr) return;

        for (let i = 0; i < count; i++) {
            attr.array[i * 3] += velocities[i * 3];
            attr.array[i * 3 + 1] += velocities[i * 3 + 1];
            attr.array[i * 3 + 2] += velocities[i * 3 + 2];

            if (Math.abs(attr.array[i * 3]) > 10) velocities[i * 3] *= -1;
            if (Math.abs(attr.array[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -1;
            if (Math.abs(attr.array[i * 3 + 2]) > 7) velocities[i * 3 + 2] *= -1;
        }
        attr.needsUpdate = true;

        if (points.current) {
            points.current.rotation.y = THREE.MathUtils.lerp(points.current.rotation.y, state.mouse.x * 0.4, 0.05);
            points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, -state.mouse.y * 0.4, 0.05);
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                color={color}
                transparent
                opacity={0.3}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export const GlobalEcoBackground = () => {
    if (typeof window === 'undefined') return null;

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none" style={{ opacity: 0.6 }}>
            <Canvas
                camera={{ position: [0, 0, 10], fov: 45 }}
                gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
                dpr={[1, 2]}
                onError={(e) => console.error("R3F Canvas Error:", e)}
            >
                <ambientLight intensity={0.5} />
                <Particles count={150} />
            </Canvas>
        </div>
    );
};

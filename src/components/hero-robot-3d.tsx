import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import type { Group } from "three";

const MODEL_URL = "/models/robot.glb";
const ANIMATION_HOLD_SECONDS = 3.5;

function RobotModel() {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions, names } = useAnimations(animations, group);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!names.length) return undefined;
    const action = actions[names[index]];
    action?.reset().fadeIn(0.6).play();
    const timer = setTimeout(() => {
      action?.fadeOut(0.6);
      setIndex((i) => (i + 1) % names.length);
    }, ANIMATION_HOLD_SECONDS * 1000);
    return () => {
      clearTimeout(timer);
      action?.fadeOut(0.3);
    };
  }, [index, names, actions]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15;
  });

  return <primitive ref={group} object={scene} scale={2.1} position={[0, -1, 0]} />;
}

useGLTF.preload(MODEL_URL);

export function HeroRobot3D({ fallback }: { fallback: ReactNode }) {
  return (
    <Suspense fallback={fallback}>
      <Canvas
        camera={{ position: [0, 0.1, 3], fov: 32 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        className="h-full w-full"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 4, 2]} intensity={1.6} color="#ffb385" />
        <directionalLight position={[-3, 1.5, -2]} intensity={0.6} color="#7ea8ff" />
        <RobotModel />
      </Canvas>
    </Suspense>
  );
}

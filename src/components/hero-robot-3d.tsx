import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import type { Group } from "three";

const MODEL_URL = "/models/robot-v1.glb";
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

  return (
    <primitive
      ref={group}
      object={scene}
      scale={1.3}
      position={[0, -0.65, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

useGLTF.preload(MODEL_URL);

// Any WebGL/3D failure (e.g. the browser's per-process WebGL context limit hit when many
// tabs are open) must never take down the whole page — fall back to the static image.
class RobotErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error("3D robot failed to render, falling back to static image:", error);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export function HeroRobot3D({ fallback }: { fallback: ReactNode }) {
  return (
    <RobotErrorBoundary fallback={fallback}>
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
    </RobotErrorBoundary>
  );
}

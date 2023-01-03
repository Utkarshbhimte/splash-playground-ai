import { Scroll, ScrollControls } from "@react-three/drei";
import { useFrame, useThree, Canvas } from "@react-three/fiber";
import React, { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";
import styles from "./styles.module.css";
import { Point, Points, useIntersect } from "@react-three/drei";

function Html() {
  return (
    <div
      style={{
        background: "white",
        fontFamily: "sans-serif",
        fontSize: "64px",
        lineHeight: 0.75
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50vh",
          left: "50vw",
          transform: "translateX(-50%)",
          color: "#292828",
          margin: 0,
          width: "60vw",

          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <h1>Build w/ AI is here</h1>
      </div>
      {/* <h1
        style={{
          position: 'absolute',
          top: '140vh',
          left: '50vw',
          transform: 'translateX(-65%)',
          color: '#f4b677',
          margin: 0,
        }}>
        Your Future
      </h1>
      <h1
        style={{
          position: 'absolute',
          top: '250vh',
          left: '50vw',
          transform: 'translateX(-50%)',
          color: '#673ab7',
          margin: 0,
        }}>
        Awaits
      </h1> */}
    </div>
  );
}

function Objects() {
  const { height, width } = useThree((state) => state.viewport);
  return (
    <>
      <pointLight color="blue" position={[8, -25, 5]} intensity={20} />
      <pointLight
        color="red"
        position={[0, -height * 2.25, 5]}
        intensity={10}
      />
      <Item color="red" position={[0, 1, 0]}>
        <boxGeometry />
      </Item>
      {/* <Item color="blue" position={[width / 6, -height * 1, 0]}>
        <dodecahedronGeometry />
      </Item>
      <Item color="gray" position={[-width / 5, -height * 1.8, -2]}>
        <coneGeometry args={[1, 1, 6]} />
      </Item>
      <Item color="purple" position={[width / 4, -height * 2, 0]}>
        <coneGeometry args={[1.5, 2, 3]} />
      </Item>
      <Item color="orange" position={[-width / 12, -height * 2.25, 0.5]}>
        <coneGeometry args={[0.75, 2.5, 12]} />
      </Item> */}
    </>
  );
}

function Item({ color, position, children }) {
  const visible = useRef();
  const ref = useIntersect((isVisible) => (visible.current = isVisible));
  const [xRandomFactor, yRandomFactor] = useMemo(
    () => [(0.5 - Math.random()) * 0.5, (0.5 - Math.random()) * 0.5],
    []
  );
  useFrame(({ clock }, delta) => {
    const elapsedTime = clock.getElapsedTime();
    ref.current.rotation.x = elapsedTime * xRandomFactor;
    ref.current.rotation.y = elapsedTime * yRandomFactor;
    const scale = THREE.MathUtils.damp(
      ref.current.scale.x,
      visible.current ? 1.5 : 0.2,
      5,
      delta
    );
    ref.current.scale.set(scale, scale, scale);
  });
  return (
    <mesh ref={ref} position={position}>
      {children}
      <meshPhysicalMaterial transparent color={color} />
    </mesh>
  );
}

const particleColors = [
  "#673ab7",
  "#f4b677",
  "orange",
  "blue",
  "#8bc34a",
  "purple"
];

export function Particles({ size = 5000 }) {
  const { width, height } = useThree((state) => state.viewport);
  return (
    <Points limit={size}>
      <pointsMaterial size={0.05} vertexColors />
      {Array.from({ length: size }).map((_, i) => (
        <Point
          key={i}
          position={[
            (0.5 - Math.random()) * width * 2,
            0.5 * height + Math.random() ** 0.25 * height * -2,
            (0.5 - Math.random()) * 25
          ]}
          color={
            particleColors[
              Math.floor(Math.random() * (particleColors.length - 1))
            ]
          }
        />
      ))}
    </Points>
  );
}

function ScrollBasedAnimation() {
  useFrame(({ mouse, camera }) => {
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mouse.x * 0.5,
      0.03
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      mouse.y * 0.8,
      0.01
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      Math.max(4, Math.abs(mouse.x * mouse.y * 8)),
      0.01
    );
    camera.rotation.y = THREE.MathUtils.lerp(
      camera.rotation.y,
      mouse.x * -Math.PI * 0.025,
      0.001
    );
  });

  return (
    <ScrollControls pages={3}>
      <Scroll>
        <Particles />
        <Objects />
      </Scroll>
      <Scroll html>
        <Html />
      </Scroll>
    </ScrollControls>
  );
}

export default function App() {
  return (
    <Canvas dpr={[1, 2]} className={styles.canvas}>
      <ambientLight />
      <directionalLight color="red" intensity={10} />
      <Suspense fallback={null}>
        <ScrollBasedAnimation />
      </Suspense>
    </Canvas>
  );
}

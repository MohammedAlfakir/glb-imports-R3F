import React from "react";
import { useGLTF } from "@react-three/drei";

export default function ModelUseGLTF({ url }) {
  // Method 2: The 'drei' way - abstractions that make life easier
  // useGLTF handles caching, Draco compression (often), and is shorter
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} />;
}

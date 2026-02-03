import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function ModelUseLoader({ url }) {
  // Method 1: The standard R3F way to use Three.js loaders
  const gltf = useLoader(GLTFLoader, url);
  return <primitive object={gltf.scene} />;
}

import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

export default function ModelUseLoader({ url }) {
  // Method 1: The standard R3F way to use Three.js loaders
  const isObj = url.toLowerCase().endsWith(".obj");
  const Loader = isObj ? OBJLoader : GLTFLoader;
  const object = useLoader(Loader, url);

  // OBJLoader returns a generic Group, GLTFLoader returns an object with a .scene property
  const scene = isObj ? object : object.scene;

  return <primitive object={scene} />;
}

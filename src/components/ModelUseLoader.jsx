import React, { useLayoutEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export default function ModelUseLoader({ url }) {
  // Method 1: The standard R3F way to use Three.js loaders
  const isObj = url.toLowerCase().endsWith(".obj");
  const Loader = isObj ? OBJLoader : GLTFLoader;
  const object = useLoader(Loader, url);
  const [partNames, setPartNames] = useState([]);

  // OBJLoader returns a generic Group, GLTFLoader returns an object with a .scene property
  const scene = isObj ? object : object.scene;

  useLayoutEffect(() => {
    if (isObj) {
      const names = [];
      scene.traverse(child => {
        if (child.isMesh) {
          names.push(child.name || "Unnamed Mesh");
          // Random color for debugging
          const randomColor = Math.random() * 0xffffff;
          child.material = new THREE.MeshStandardMaterial({
            color: randomColor,
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      setPartNames(names);
    }
  }, [scene, isObj]);

  return (
    <group>
      <primitive object={scene} />
      {isObj && partNames.length > 0 && (
        <Html
          position={[2, 2, 0]}
          style={{
            color: "white",
            background: "rgba(0,0,0,0.7)",
            padding: "10px",
            borderRadius: "5px",
            width: "200px",
          }}
        >
          <h3>Detected Parts:</h3>
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            {partNames.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        </Html>
      )}
    </group>
  );
}

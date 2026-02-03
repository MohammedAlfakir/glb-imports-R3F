import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

/*
  Method 3: gltfjsx
  
  This component represents what you would get if you ran:
  npx gltfjsx model.glb

  It creates a declarative graph of your model, allowing you to:
  - Access specific nodes (e.g. to animate a specific part)
  - Change materials specifically
  - Add events to specific parts
*/

export default function ModelGltfJsx({ url, ...props }) {
  const group = useRef();
  // In a real gltfjsx component, you would import the specific glb url or path
  const { scene /*, nodes, materials */ } = useGLTF(url);

  return (
    <group ref={group} {...props} dispose={null}>
      {/* 
        Normally here you would see something like:
        <mesh geometry={nodes.Robot.geometry} material={materials.Metal} />
        
        Since we are generic here, we just render the scene:
      */}
      <primitive object={scene} />
    </group>
  );
}

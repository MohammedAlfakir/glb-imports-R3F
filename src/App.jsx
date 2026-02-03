import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import ModelUseLoader from "./components/ModelUseLoader";
import ModelUseGLTF from "./components/ModelUseGLTF";
import ModelGltfJsx from "./components/ModelGltfJsx";
import "./index.css";

const MODES = {
  USE_LOADER: "useLoader (Standard)",
  USE_GLTF: "useGLTF (Drei)",
  GLTF_JSX: "gltfjsx (Component)",
};

const MODELS_LIST = ["model.glb"];

export default function App() {
  const [mode, setMode] = useState("USE_GLTF");
  const [selectedModel, setSelectedModel] = useState(MODELS_LIST[0]);

  // Dynamic path based on selection
  const modelUrl = `/assets/${selectedModel}`;

  return (
    <>
      <div className="ui-panel">
        <h1>R3F GLB Import Methods</h1>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", fontSize: "0.9em" }}
          >
            Select Model:
          </label>
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              background: "rgba(0,0,0,0.3)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              cursor: "pointer",
            }}
          >
            {MODELS_LIST.map(model => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <p>
          Current Mode: <strong>{MODES[mode]}</strong>
        </p>
        <div className="button-group">
          {Object.entries(MODES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={mode === key ? "active" : ""}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <ambientLight intensity={2} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <Center>
            {mode === "USE_LOADER" && <ModelUseLoader url={modelUrl} />}
            {mode === "USE_GLTF" && <ModelUseGLTF url={modelUrl} />}
            {mode === "GLTF_JSX" && <ModelGltfJsx url={modelUrl} />}
          </Center>
        </Suspense>

        <OrbitControls makeDefault />
        <Perf position="bottom-left" />
      </Canvas>
    </>
  );
}

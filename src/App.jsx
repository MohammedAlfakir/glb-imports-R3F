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
import { GeneratedModel } from "./components/GeneratedModel";
import { Model as AEBDoorDrawing } from "./components/AEBDoorDrawing";
import { Model as AEBT1003DModel } from "./components/AEBT1003DModel";
import "./index.css";

const MODES = {
  USE_LOADER: "useLoader (Standard)",
  USE_GLTF: "useGLTF (Drei)",
  GLTF_JSX: "gltfjsx (Component)",
};

// Auto-discover models from public/assets
const modelsGlob = import.meta.glob("/public/assets/*");
const MODELS_LIST = Object.keys(modelsGlob).map(path => {
  // Extract filename from path (e.g., "/public/assets/model.glb" -> "model.glb")
  return path.split("/").pop();
});

export default function App() {
  // Initialize state based on first model
  const [selectedModel, setSelectedModel] = useState(MODELS_LIST[0]);

  const initialIsObj =
    MODELS_LIST[0] && MODELS_LIST[0].toLowerCase().endsWith(".obj");
  const [mode, setMode] = useState(initialIsObj ? "USE_LOADER" : "USE_GLTF");

  // Dynamic path based on selection
  const modelUrl = selectedModel ? `/assets/${selectedModel}` : "";
  const isObj = selectedModel
    ? selectedModel.toLowerCase().endsWith(".obj")
    : false;

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
            onChange={e => {
              const newVal = e.target.value;
              setSelectedModel(newVal);
              if (newVal.toLowerCase().endsWith(".obj")) {
                setMode("USE_LOADER");
              }
            }}
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
          {Object.entries(MODES).map(([key, label]) => {
            const isDisabled = isObj && key !== "USE_LOADER";
            return (
              <button
                key={key}
                onClick={() => setMode(key)}
                disabled={isDisabled}
                className={mode === key ? "active" : ""}
                style={
                  isDisabled ? { opacity: 0.5, cursor: "not-allowed" } : {}
                }
              >
                {label}
              </button>
            );
          })}
        </div>

        {!isObj && (
          <div
            style={{
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <p style={{ marginBottom: "5px", fontSize: "0.9em" }}>
              <strong>To Component (gltfjsx):</strong>
            </p>
            <div
              style={{
                background: "rgba(0,0,0,0.5)",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "0.8em",
                overflowX: "auto",
              }}
            >
              <code>npx gltfjsx public/assets/{selectedModel}</code>
            </div>
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  `npx gltfjsx public/assets/${selectedModel}`,
                )
              }
              style={{
                marginTop: "5px",
                width: "100%",
                background: "#646cff",
                fontSize: "0.8em",
                padding: "5px",
              }}
            >
              Copy Command
            </button>
          </div>
        )}
      </div>

      <Canvas camera={{ position: [0, 0, 150], fov: 50 }}>
        <ambientLight intensity={2} />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <Center>
            {mode === "USE_LOADER" && modelUrl && (
              <ModelUseLoader url={modelUrl} />
            )}

            {(mode === "USE_GLTF" || mode === "GLTF_JSX") && isObj ? (
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="red" />
              </mesh>
            ) : (
              <>
                {mode === "USE_GLTF" && modelUrl && (
                  <ModelUseGLTF url={modelUrl} />
                )}
                {mode === "GLTF_JSX" &&
                  modelUrl &&
                  (selectedModel === "model.glb" ? (
                    <GeneratedModel />
                  ) : selectedModel === "AEBDoorDrawing.glb" ? (
                    <AEBDoorDrawing />
                  ) : selectedModel === "AEBT1003DModel.glb" ? (
                    <AEBT1003DModel />
                  ) : (
                    <ModelGltfJsx url={modelUrl} />
                  ))}
              </>
            )}
          </Center>
        </Suspense>

        <OrbitControls makeDefault />
        <Perf position="bottom-left" />
      </Canvas>

      {isObj && (mode === "USE_GLTF" || mode === "GLTF_JSX") && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.8)",
            color: "red",
            padding: "20px",
            borderRadius: "8px",
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          <h2>Format Not Supported</h2>
          <p>Creating a Red Box placeholder</p>
          <p>
            Start switching to <strong>useLoader</strong> mode to view .obj
            files
          </p>
        </div>
      )}
    </>
  );
}

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, TransformControls, Grid } from "@react-three/drei";
import { useState, useRef } from "react";
import * as THREE from "three";
import type { Board3D, Component3D } from "../types";

interface Board3DViewerProps {
  board: Board3D;
  selectedComponentId?: string;
  onSelectComponent?: (id: string) => void;
  onComponentUpdate?: (id: string, updates: Partial<Component3D>) => void;
  editMode?: boolean;
}

function ComponentMesh({
  component,
  isSelected,
  editMode,
  onSelect,
  onUpdate,
}: {
  component: Component3D;
  isSelected: boolean;
  editMode: boolean;
  onSelect: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Component3D>) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);

  const snapToGrid = (value: number, gridSize: number = 5) => {
    return Math.round(value / gridSize) * gridSize;
  };

  const handleTransformEnd = () => {
    if (meshRef.current && onUpdate) {
      const position = meshRef.current.position;
      const rotation = meshRef.current.rotation;
      
      // Snap position to grid
      const snappedPosition = {
        x: snapToGrid(position.x),
        y: component.position.y, // Keep Y fixed for now
        z: snapToGrid(position.z),
      };

      onUpdate(component.id, {
        position: snappedPosition,
        rotation: {
          x: rotation.x,
          y: rotation.y,
          z: rotation.z,
        },
      });
    }
    setIsDragging(false);
  };

  return (
    <group>
      {isSelected && editMode && meshRef.current && (
        <TransformControls
          object={meshRef.current}
          mode="translate"
          translationSnap={5}
          rotationSnap={Math.PI / 2}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={handleTransformEnd}
        />
      )}
      <mesh
        ref={meshRef}
        position={[component.position.x, component.position.y, component.position.z]}
        rotation={[component.rotation.x, component.rotation.y, component.rotation.z]}
        onClick={(e) => {
          e.stopPropagation();
          if (!isDragging) {
            onSelect(component.id);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!editMode) {
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[component.size.x, component.size.y, component.size.z]} />
        <meshStandardMaterial
          color={isSelected ? "#ffcc00" : "#cccccc"}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <Text
        position={[component.position.x, component.position.y + component.size.y / 2 + 2, component.position.z]}
        fontSize={2}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        {component.refDes}
      </Text>
    </group>
  );
}

export function Board3DViewer({
  board,
  selectedComponentId,
  onSelectComponent,
  onComponentUpdate,
  editMode = false,
}: Board3DViewerProps) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 80, 120], fov: 35 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[50, 100, 50]} intensity={0.8} />

        {/* Grid overlay */}
        {editMode && (
          <Grid
            args={[board.width, board.height]}
            cellSize={5}
            cellThickness={0.5}
            cellColor="#6e6e6e"
            sectionSize={10}
            sectionThickness={1}
            sectionColor="#8c8c8c"
            fadeDistance={200}
            fadeStrength={1}
            position={[0, 0.1, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          />
        )}

        {/* PCB board */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[board.width, board.thickness, board.height]} />
          <meshStandardMaterial color="#0b5c3b" />
        </mesh>

        {/* Draw nets as simple lines */}
        {board.components.map((c1, i) =>
          board.components.slice(i + 1).map((c2) => {
            const sharedNets = c1.netIds.filter((net) => c2.netIds.includes(net));
            return sharedNets.map((netId) => {
              const positions = new Float32Array([
                c1.position.x,
                c1.position.y + c1.size.y / 2,
                c1.position.z,
                c2.position.x,
                c2.position.y + c2.size.y / 2,
                c2.position.z,
              ]);
              return (
                <line key={`${c1.id}-${c2.id}-${netId}`}>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={positions}
                      itemSize={3}
                      args={[positions, 3]}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial color="#ff6b6b" />
                </line>
              );
            });
          })
        )}

        {/* Components */}
        {board.components.map((c) => (
          <ComponentMesh
            key={c.id}
            component={c}
            isSelected={c.id === selectedComponentId}
            editMode={editMode}
            onSelect={onSelectComponent || (() => {})}
            onUpdate={onComponentUpdate}
          />
        ))}

        <OrbitControls makeDefault enabled={!editMode || !selectedComponentId} />
      </Canvas>
    </div>
  );
}

export default Board3DViewer;

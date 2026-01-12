import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import type { Board3D } from "../types";

interface Board3DViewerProps {
  board: Board3D;
  selectedComponentId?: string;
  onSelectComponent?: (id: string) => void;
}

export function Board3DViewer({
  board,
  selectedComponentId,
  onSelectComponent,
}: Board3DViewerProps) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 80, 120], fov: 35 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[50, 100, 50]} intensity={0.8} />

        {/* PCB board */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry
            args={[board.width, board.thickness, board.height]}
          />
          <meshStandardMaterial color="#0b5c3b" />
        </mesh>

        {/* Components as boxes for now */}
        {board.components.map((c) => (
          <group key={c.id}>
            <mesh
              position={[c.position.x, c.position.y, c.position.z]}
              rotation={[c.rotation.x, c.rotation.y, c.rotation.z]}
              onClick={() => onSelectComponent?.(c.id)}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'default';
              }}
            >
              <boxGeometry
                args={[c.size.x, c.size.y, c.size.z]}
              />
              <meshStandardMaterial
                color={c.id === selectedComponentId ? "#ffcc00" : "#cccccc"}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
            {/* Component label */}
            <Text
              position={[c.position.x, c.position.y + c.size.y / 2 + 2, c.position.z]}
              fontSize={2}
              color="#333333"
              anchorX="center"
              anchorY="middle"
            >
              {c.refDes}
            </Text>
          </group>
        ))}

        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}

export default Board3DViewer;

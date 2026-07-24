"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { AdaptiveDpr, Preload } from "@react-three/drei"
import { NodeNetwork } from "./node-network"

export default function SceneCanvas({ 
  scene, 
  accent, 
  onBlockClick 
}: { 
  scene: string; 
  accent: string; 
  onBlockClick?: () => void 
}) {
  const pointer = useRef({ x: 0, y: 0 })
  const [nodeCount, setNodeCount] = useState(150)

  useEffect(() => {
    setNodeCount(window.innerWidth < 768 ? 50 : 150)
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  return (
    <div className="fixed inset-0 -z-0" style={{ background: "radial-gradient(circle at 50% 30%, var(--pf-bg-panel), var(--pf-bg-deep))" }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <NodeNetworkBridge scene={scene} accent={accent} nodeCount={nodeCount} pointerRef={pointer} onBlockClick={onBlockClick} />
        <AdaptiveDpr pixelated />
        <Preload all />
      </Canvas>
    </div>
  )
}

function NodeNetworkBridge({ 
  scene, 
  accent, 
  nodeCount, 
  pointerRef, 
  onBlockClick 
}: {
  scene: string; 
  accent: string; 
  nodeCount: number; 
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  onBlockClick?: () => void;
}) {
  return (
    <NodeNetwork 
      scene={scene} 
      accent={accent} 
      nodeCount={nodeCount} 
      pointer={pointerRef.current} 
      onBlockClick={onBlockClick} 
    />
  )
}

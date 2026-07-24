"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

// deterministic pseudo-random from index — stable across frames
function jitter(i: number, seed: number): number {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453
  return (x - Math.floor(x)) - 0.5
}

function formation(scene: string, i: number, n: number): THREE.Vector3 {
  const t = i / n
  const a = t * Math.PI * 2 * 6
  switch (scene) {
    case "tech": { // lattice grid
      const cols = Math.ceil(Math.sqrt(n))
      const x = (i % cols) - cols / 2
      const y = Math.floor(i / cols) - cols / 2
      return new THREE.Vector3(x * 0.6, y * 0.6, 0)
    }
    case "projects": { // clusters
      const cluster = i % 5
      const cx = Math.cos((cluster / 5) * Math.PI * 2) * 3
      const cy = Math.sin((cluster / 5) * Math.PI * 2) * 3
      return new THREE.Vector3(cx + jitter(i, 1) * 1.4, cy + jitter(i, 2) * 1.4, jitter(i, 3) * 1.4)
    }
    case "experience": { // vertical chain — tight helix
      const hy = (t - 0.5) * 11
      const hr = 0.9
      return new THREE.Vector3(Math.cos(a) * hr, hy, Math.sin(a) * hr)
    }
    case "contact": { // converge sphere
      const r = 1.4
      const phi = Math.acos(1 - 2 * t)
      return new THREE.Vector3(r * Math.sin(phi) * Math.cos(a), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(a))
    }
    default: { // hero — structured orbital rings (Fibonacci sphere shell)
      const golden = Math.PI * (3 - Math.sqrt(5))
      const y = 1 - (i / (n - 1)) * 2
      const radius = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = golden * i
      const shell = 3.2
      return new THREE.Vector3(Math.cos(theta) * radius * shell, y * shell * 0.6, Math.sin(theta) * radius * shell)
    }
  }
}

export function NodeNetwork({
  nodeCount = 300,
  scene = "hero",
  pointer = { x: 0, y: 0 },
  accent = "#E8785B",
}: {
  nodeCount?: number
  scene?: string
  pointer?: { x: number; y: number }
  accent?: string
}) {
  const group = useRef<THREE.Group>(null)
  const inst = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const current = useMemo(
    () => Array.from({ length: nodeCount }, (_, i) => formation("hero", i, nodeCount)),
    [nodeCount]
  )
  const target = useMemo(
    () => Array.from({ length: nodeCount }, (_, i) => formation(scene, i, nodeCount)),
    [scene, nodeCount]
  )

  useFrame((_, delta) => {
    const mesh = inst.current
    if (!mesh) return
    const lerp = Math.min(1, delta * 2)
    for (let i = 0; i < nodeCount; i++) {
      current[i].lerp(target[i], lerp)
      dummy.position.copy(current[i])
      dummy.scale.setScalar(0.04)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
    if (group.current) {
      group.current.rotation.y += (pointer.x * 0.4 - group.current.rotation.y) * 0.05
      group.current.rotation.x += (pointer.y * 0.3 - group.current.rotation.x) * 0.05
    }
  })

  return (
    <group ref={group}>
      <instancedMesh ref={inst} args={[undefined as any, undefined as any, nodeCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </instancedMesh>
    </group>
  )
}

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
    case "tech": { // concentric tech orbits representing server/database clusters
      const ringIndex = i % 4
      const radius = (ringIndex + 1) * 1.5
      const angle = (i / n) * Math.PI * 2 * (12 / (ringIndex + 1))
      return new THREE.Vector3(
        Math.cos(angle) * radius + jitter(i, 1) * 0.2,
        Math.sin(angle) * radius + jitter(i, 2) * 0.2,
        jitter(i, 3) * 0.4
      )
    }
    case "projects": { // block clusters (blockchain nodes)
      const clusterCount = 4
      const cluster = i % clusterCount
      const cx = (cluster - (clusterCount - 1) / 2) * 3.2
      const cy = jitter(i, 4) * 0.8
      const cz = jitter(i, 5) * 0.8
      return new THREE.Vector3(
        cx + jitter(i, 6) * 0.8,
        cy + jitter(i, 7) * 0.4,
        cz + jitter(i, 8) * 0.4
      )
    }
    case "experience": { // immutable double helix trail
      const strand = i % 2
      const angle = t * Math.PI * 6 + strand * Math.PI
      const hx = Math.cos(angle) * 1.6
      const hz = Math.sin(angle) * 1.6
      const hy = (t - 0.5) * 12
      return new THREE.Vector3(hx, hy, hz)
    }
    case "contact": { // dense central consensus core
      const golden = Math.PI * (3 - Math.sqrt(5))
      const y = 1 - (i / (n - 1)) * 2
      const radius = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = golden * i
      const shell = 0.6
      return new THREE.Vector3(
        Math.cos(theta) * radius * shell,
        y * shell,
        Math.sin(theta) * radius * shell
      )
    }
    default: { // hero — global consensus sphere
      const golden = Math.PI * (3 - Math.sqrt(5))
      const y = 1 - (i / (n - 1)) * 2
      const radius = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = golden * i
      const shell = 3.6
      return new THREE.Vector3(
        Math.cos(theta) * radius * shell,
        y * shell * 0.8,
        Math.sin(theta) * radius * shell
      )
    }
  }
}

// Target states for the floating 3D blockchain block cubes
function getBlockTransform(scene: string, index: number): { position: THREE.Vector3; rotation: THREE.Euler; scale: number } {
  const pos = new THREE.Vector3()
  const rot = new THREE.Euler()
  let scale = 1.0

  switch (scene) {
    case "tech":
      // 2x3 Server Array layout in background
      const col = index % 3
      const row = Math.floor(index / 3)
      pos.set((col - 1) * 3.0, (row - 0.5) * 2.8, -2)
      rot.set(0.2, 0.4, 0)
      scale = 0.5
      break
    case "projects":
      // A horizontal blockchain connected in a line
      pos.set((index - 2.5) * 2.8, 0, 0)
      rot.set(0, 0.5, 0.2)
      scale = 0.6
      break
    case "experience":
      // Vertical block stack representing historical records
      pos.set(-3.5, (index - 2.5) * 2.2, 0)
      rot.set(0.3, 0.3, 0.1)
      scale = 0.5
      break
    case "contact":
      // Orbiting very tightly around the central validator core
      const angle = (index / 6) * Math.PI * 2
      pos.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0)
      rot.set(0, 0, angle)
      scale = 0.25
      break
    default:
      // Hero: hide blocks entirely to avoid cluttering text
      pos.set(0, 0, 0)
      rot.set(0, 0, 0)
      scale = 0.0
      break
  }

  return { position: pos, rotation: rot, scale }
}

export function NodeNetwork({
  nodeCount = 150,
  scene = "hero",
  pointer = { x: 0, y: 0 },
  accent = "#6366f1",
  onBlockClick,
}: {
  nodeCount?: number
  scene?: string
  pointer?: { x: number; y: number }
  accent?: string
  onBlockClick?: () => void
}) {
  const group = useRef<THREE.Group>(null)
  const inst = useRef<THREE.InstancedMesh>(null)
  const ringsGroup = useRef<THREE.Group>(null)

  // Floating blockchain block elements
  const blockGroup = useRef<THREE.Group>(null)
  const blocks = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    currentPos: new THREE.Vector3(),
    currentRot: new THREE.Euler(),
    currentScale: 1.0,
  })), [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Create starting position matrices
  const current = useMemo(
    () => Array.from({ length: nodeCount }, (_, i) => formation("hero", i, nodeCount)),
    [nodeCount]
  )
  const target = useMemo(
    () => Array.from({ length: nodeCount }, (_, i) => formation(scene, i, nodeCount)),
    [scene, nodeCount]
  )

  // Setup static constellation lines between adjacent particles for visual depth
  const lineIndices = useMemo(() => {
    const indices: number[] = []
    for (let i = 0; i < nodeCount; i++) {
      if (i % 8 === 0 && i < nodeCount - 1) {
        indices.push(i, i + 1)
      }
      if (i % 15 === 0 && i < nodeCount - 5) {
        indices.push(i, i + 5)
      }
    }
    return indices
  }, [nodeCount])

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(nodeCount * 3)
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    return geo
  }, [nodeCount])

  useFrame((state, delta) => {
    const mesh = inst.current
    if (!mesh) return
    const lerp = Math.min(1, delta * 3.5)

    // Read global scroll progress (continuous 0 to 1 float)
    const scroll = typeof window !== "undefined" ? ((window as any).scrollProgress || 0) : 0

    // Lerp particle nodes
    const positionAttr = lineGeometry.getAttribute("position") as THREE.BufferAttribute
    const positions = positionAttr.array as Float32Array

    for (let i = 0; i < nodeCount; i++) {
      current[i].lerp(target[i], lerp)
      dummy.position.copy(current[i])
      dummy.scale.setScalar(scene === "contact" ? 0.012 : 0.016)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      // update positions buffer for constellation lines
      positions[i * 3] = current[i].x
      positions[i * 3 + 1] = current[i].y
      positions[i * 3 + 2] = current[i].z
    }
    mesh.instanceMatrix.needsUpdate = true
    positionAttr.needsUpdate = true

    // Rotate consensus rings (influenced by scroll depth)
    if (ringsGroup.current) {
      ringsGroup.current.rotation.z += delta * 0.15 + scroll * 0.05
      ringsGroup.current.rotation.y += delta * 0.08 + scroll * 0.03
      // Scale rings group based on current scene (shrink during contact, tech stack hides it)
      const targetRingsScale = scene === "tech" ? 0 : scene === "contact" ? 0.3 : 1.0
      ringsGroup.current.scale.setScalar(
        THREE.MathUtils.lerp(ringsGroup.current.scale.x, targetRingsScale, lerp)
      )
    }

    // Lerp and animate 3D blockchain block cubes
    if (blockGroup.current) {
      blockGroup.current.children.forEach((child, index) => {
        const t = getBlockTransform(scene, index)
        const bl = blocks[index]

        bl.currentPos.lerp(t.position, lerp)
        bl.currentScale = THREE.MathUtils.lerp(bl.currentScale, t.scale, lerp)

        child.position.copy(bl.currentPos)
        // Cubes spin extra in response to scrolling
        child.rotation.x = THREE.MathUtils.lerp(child.rotation.x, t.rotation.x + state.clock.getElapsedTime() * 0.15 + scroll * Math.PI, lerp)
        child.rotation.y = THREE.MathUtils.lerp(child.rotation.y, t.rotation.y + state.clock.getElapsedTime() * 0.2 + scroll * Math.PI, lerp)
        child.rotation.z = THREE.MathUtils.lerp(child.rotation.z, t.rotation.z, lerp)
        child.scale.setScalar(bl.currentScale)
      })
    }

    // Scroll-linked scrubbing 3D rotation & depth zoom + Parallax mouse follow
    if (group.current) {
      const targetScrollRotY = scroll * Math.PI * 1.5 // Rotate 1.5 full turns on scroll
      const targetScrollPosZ = Math.sin(scroll * Math.PI) * 2.2 // Fly forward, then back out
      
      group.current.rotation.y += (targetScrollRotY + pointer.x * 0.25 - group.current.rotation.y) * 0.06
      group.current.rotation.x += (pointer.y * 0.15 - group.current.rotation.x) * 0.06
      group.current.position.z += (targetScrollPosZ - group.current.position.z) * 0.06
    }
  })

  // Faint teal and indigo accents
  const tealColor = "#14b8a6"
  const lineOpacity = scene === "contact" ? 0.03 : 0.08

  return (
    <group ref={group}>
      {/* Node particles - very clean, faint dark-indigo */}
      <instancedMesh ref={inst} args={[null as any, null as any, nodeCount]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#4f46e5" toneMapped={false} transparent opacity={0.25} />
      </instancedMesh>

      {/* Constellation line links - very soft */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#4f46e5" transparent opacity={lineOpacity} linewidth={1} />
      </lineSegments>

      {/* Central Cryptographic Orbiting Rings */}
      <group ref={ringsGroup}>
        {/* Ring 1: Inner consensus circle */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 2.03, 64]} />
          <meshBasicMaterial color="#6366f1" toneMapped={false} transparent opacity={0.06} side={THREE.DoubleSide} />
        </mesh>
        {/* Ring 2: Outer blockchain epoch ring */}
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <ringGeometry args={[3.2, 3.23, 64]} />
          <meshBasicMaterial color={tealColor} toneMapped={false} transparent opacity={0.04} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <group ref={blockGroup}>
        {Array.from({ length: 6 }).map((_, i) => (
          <group 
            key={i}
            onClick={(e) => {
              e.stopPropagation()
              onBlockClick?.()
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = "pointer"
            }}
            onPointerOut={(e) => {
              e.stopPropagation()
              document.body.style.cursor = "default"
            }}
          >
            {/* Outer wireframe block cube */}
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={accent} wireframe transparent opacity={0.15} />
            </mesh>
            {/* Glowing consensus core inside cube */}
            <mesh>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshBasicMaterial color={tealColor} toneMapped={false} transparent opacity={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

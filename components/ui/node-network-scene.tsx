"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const NODE_COUNT = 60
const CONNECT_DISTANCE = 2.6
const RADIUS = 3.2

function generateNodes(count: number, radius: number): THREE.Vector3[] {
  const positions: THREE.Vector3[] = []
  for (let i = 0; i < count; i++) {
    // Fibonacci sphere distribution — even spread with no clustering at the poles
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    const x = Math.cos(theta) * r
    const z = Math.sin(theta) * r
    positions.push(new THREE.Vector3(x * radius, y * radius, z * radius))
  }
  return positions
}

export default function NodeNetworkScene() {
  const groupRef = useRef<THREE.Group>(null)

  const nodes = useMemo(() => generateNodes(NODE_COUNT, RADIUS), [])

  const nodePositions = useMemo(() => {
    const arr = new Float32Array(nodes.length * 3)
    nodes.forEach((v, i) => {
      arr[i * 3] = v.x
      arr[i * 3 + 1] = v.y
      arr[i * 3 + 2] = v.z
    })
    return arr
  }, [nodes])

  const edgePositions = useMemo(() => {
    const points: number[] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < CONNECT_DISTANCE) {
          points.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z)
        }
      }
    }
    return new Float32Array(points)
  }, [nodes])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.08
    groupRef.current.rotation.x += delta * 0.015
  })

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#4F8CFF" transparent opacity={0.25} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#22E5A0" size={0.09} sizeAttenuation transparent opacity={0.9} />
      </points>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={40} color="#8B5CF6" />
    </group>
  )
}

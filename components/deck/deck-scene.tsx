"use client"

import { useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const COUNT = 90
const RADIUS = 3.2

// Formation generators — each returns COUNT vec3s.
function sphereFormation(): THREE.Vector3[] {
  const out: THREE.Vector3[] = []
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    out.push(new THREE.Vector3(Math.cos(theta) * r * RADIUS, y * RADIUS, Math.sin(theta) * r * RADIUS))
  }
  return out
}

function gridFormation(): THREE.Vector3[] {
  const out: THREE.Vector3[] = []
  const per = Math.ceil(Math.sqrt(COUNT))
  for (let i = 0; i < COUNT; i++) {
    const gx = (i % per) - (per - 1) / 2
    const gy = Math.floor(i / per) - (per - 1) / 2
    out.push(new THREE.Vector3(gx * 0.9, gy * 0.9, Math.sin(i) * 0.4))
  }
  return out
}

function clusterFormation(): THREE.Vector3[] {
  const out: THREE.Vector3[] = []
  const centers = [
    new THREE.Vector3(-2.4, 1.2, 0),
    new THREE.Vector3(2.4, 1.0, -0.5),
    new THREE.Vector3(0, -1.8, 0.5),
    new THREE.Vector3(-1.5, -1.2, -1),
  ]
  for (let i = 0; i < COUNT; i++) {
    const c = centers[i % centers.length]
    out.push(
      c.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.6))
    )
  }
  return out
}

function chainFormation(): THREE.Vector3[] {
  const out: THREE.Vector3[] = []
  for (let i = 0; i < COUNT; i++) {
    const t = i / (COUNT - 1)
    const y = (0.5 - t) * 8
    out.push(new THREE.Vector3(Math.sin(t * Math.PI * 4) * 1.6, y, Math.cos(t * Math.PI * 4) * 1.6))
  }
  return out
}

function ringFormation(): THREE.Vector3[] {
  const out: THREE.Vector3[] = []
  for (let i = 0; i < COUNT; i++) {
    const ring = i % 3
    const a = (i / COUNT) * Math.PI * 2 * 3
    const rad = 1.6 + ring * 0.9
    out.push(new THREE.Vector3(Math.cos(a) * rad, (ring - 1) * 0.8, Math.sin(a) * rad))
  }
  return out
}

function fieldFormation(): THREE.Vector3[] {
  const out: THREE.Vector3[] = []
  for (let i = 0; i < COUNT; i++) {
    out.push(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 6))
  }
  return out
}

// Camera station per slide index [x,y,z].
const STATIONS: [number, number, number][] = [
  [0, 0, 8], // home
  [1.5, 0.5, 7], // projects
  [-1.5, 0.5, 7.5], // skills
  [0, 0, 9], // experience
  [1.2, -0.5, 7], // education
  [-1.2, 0.5, 6.5], // certs
  [0, 0, 11], // contact
]

export function DeckScene({ activeIndex }: { activeIndex: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  const formations = useMemo(
    () => [
      sphereFormation(),
      gridFormation(),
      clusterFormation(),
      chainFormation(),
      ringFormation(),
      clusterFormation(),
      fieldFormation(),
    ],
    []
  )

  // Live positions (start at sphere) + geometry buffer.
  const live = useMemo(() => formations[0].map((v) => v.clone()), [formations])
  const positions = useMemo(() => new Float32Array(COUNT * 3), [])
  const geomRef = useRef<THREE.BufferGeometry>(null)

  useFrame((_, delta) => {
    const target = formations[Math.min(activeIndex, formations.length - 1)]
    const damp = 1 - Math.pow(0.001, delta)
    for (let i = 0; i < COUNT; i++) {
      live[i].lerp(target[i], damp)
      positions[i * 3] = live[i].x
      positions[i * 3 + 1] = live[i].y
      positions[i * 3 + 2] = live[i].z
    }
    if (geomRef.current) {
      geomRef.current.attributes.position.needsUpdate = true
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
    const [cx, cy, cz] = STATIONS[Math.min(activeIndex, STATIONS.length - 1)]
    camera.position.x += (cx - camera.position.x) * damp
    camera.position.y += (cy - camera.position.y) * damp
    camera.position.z += (cz - camera.position.z) * damp
    camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry ref={geomRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#22E5A0" size={0.08} sizeAttenuation transparent opacity={0.85} />
      </points>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={40} color="#8B5CF6" />
    </group>
  )
}

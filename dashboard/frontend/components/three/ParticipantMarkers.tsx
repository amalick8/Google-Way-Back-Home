'use client'

/**
 * Participant Markers
 * 3D markers showing explorers on the planet surface
 */

import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { useMapStore, coordsToSphere, getLevelColor, getLevelName } from '@/lib/store'
import type { ParticipantOnMap } from '@/lib/api'

interface MarkerProps {
  participant: ParticipantOnMap
  planetRadius?: number
  isCurrentUser?: boolean
}

/**
 * Individual participant marker
 */
export function ParticipantMarker({ 
  participant, 
  planetRadius = 2,
  isCurrentUser = false 
}: MarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  const { setSelectedParticipant, selectedParticipant } = useMapStore()
  const isSelected = selectedParticipant?.participant_id === participant.participant_id
  
  // Calculate 3D position from 2D coordinates
  // x is 0-360 (longitude), y is 0-180 (latitude) - normalize to 0-1
  const position = coordsToSphere(
    participant.x / 360,
    participant.y / 180,
    planetRadius * 1.02 // Slightly above surface
  )
  
  // For now, use a simple level based on registration status
  const level = participant.location_confirmed ? 1 : 0
  const levelColor = getLevelColor(level)
  
  // Animate the marker
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle bobbing
      const bob = Math.sin(state.clock.elapsedTime * 2 + participant.participant_id.charCodeAt(0)) * 0.02
      meshRef.current.position.y = position[1] + bob
      
      // Scale on hover
      const targetScale = hovered || isSelected ? 1.5 : 1
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      )
    }
    
    if (glowRef.current && (isCurrentUser || isSelected)) {
      // Pulsing glow for current user or selected
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      glowRef.current.scale.setScalar(pulse * 0.15)
    }
  })
  
  return (
    <group position={position}>
      {/* Glow effect for current user or selected */}
      {(isCurrentUser || isSelected) && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial 
            color={isCurrentUser ? '#FF9F43' : levelColor} 
            transparent 
            opacity={0.3}
          />
        </mesh>
      )}
      
      {/* Main marker */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setSelectedParticipant(participant)}
      >
        {/* Marker body - cute rounded shape */}
        <capsuleGeometry args={[0.04, 0.06, 4, 8]} />
        <meshStandardMaterial 
          color={levelColor}
          roughness={0.4}
          metalness={0.1}
          emissive={levelColor}
          emissiveIntensity={hovered || isSelected ? 0.5 : 0.2}
        />
      </mesh>
      
      {/* Pin point at bottom */}
      <mesh position={[0, -0.08, 0]}>
        <coneGeometry args={[0.02, 0.04, 4]} />
        <meshStandardMaterial color={levelColor} />
      </mesh>
      
      {/* Avatar image or username label */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <Html
          center
          distanceFactor={6}
          style={{
            transition: 'all 0.2s',
            opacity: hovered || isSelected ? 1 : 0.8,
            transform: `scale(${hovered || isSelected ? 1.1 : 1})`,
          }}
        >
          <div 
            className={`
              flex flex-col items-center gap-1 pointer-events-none
              ${isSelected ? 'scale-110' : ''}
            `}
          >
            {/* Avatar */}
            <div 
              className={`
                w-8 h-8 rounded-full overflow-hidden
                border-2 shadow-lg
                ${isCurrentUser 
                  ? 'border-space-orange shadow-glow-orange' 
                  : 'border-space-cream/50'
                }
              `}
              style={{ borderColor: isCurrentUser ? undefined : levelColor }}
            >
              {participant.icon_url ? (
                <img 
                  src={participant.icon_url} 
                  alt={participant.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-xs font-bold text-space-void"
                  style={{ backgroundColor: levelColor }}
                >
                  {participant.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            {/* Name badge (on hover/select) */}
            {(hovered || isSelected) && (
              <div className="px-2 py-1 rounded-full bg-space-void/80 backdrop-blur-sm text-space-cream text-xs whitespace-nowrap">
                {participant.username}
              </div>
            )}
          </div>
        </Html>
      </Billboard>
    </group>
  )
}

/**
 * All participant markers
 */
export function ParticipantMarkers({ planetRadius = 2 }: { planetRadius?: number }) {
  const { participants, currentUserId } = useMapStore()
  
  // Only render markers for participants with valid coordinates
  const participantsWithLocation = participants.filter(
    (p) => typeof p.x === 'number' && typeof p.y === 'number'
  )
  
  return (
    <group>
      {participantsWithLocation.map((participant) => (
        <ParticipantMarker
          key={participant.participant_id}
          participant={participant}
          planetRadius={planetRadius}
          isCurrentUser={participant.participant_id === currentUserId}
        />
      ))}
    </group>
  )
}

export default ParticipantMarkers
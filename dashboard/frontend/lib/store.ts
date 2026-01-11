/**
 * Global State Store
 * Using Zustand for simple, performant state management
 */

import { create } from 'zustand'
import type { ParticipantOnMap, Event } from './api'

interface MapState {
  // Event data
  event: Event | null
  setEvent: (event: Event) => void
  
  // Participants
  participants: ParticipantOnMap[]
  setParticipants: (participants: ParticipantOnMap[]) => void
  
  // Selected participant (for detail view)
  selectedParticipant: ParticipantOnMap | null
  setSelectedParticipant: (participant: ParticipantOnMap | null) => void
  
  // Current user (if viewing their own profile)
  currentUserId: string | null
  setCurrentUserId: (id: string | null) => void
  
  // UI State
  showParticipantList: boolean
  toggleParticipantList: () => void
  
  // Camera controls
  autoRotate: boolean
  setAutoRotate: (value: boolean) => void
  
  // Loading states
  isLoading: boolean
  setIsLoading: (value: boolean) => void
}

export const useMapStore = create<MapState>((set) => ({
  // Event
  event: null,
  setEvent: (event) => set({ event }),
  
  // Participants
  participants: [],
  setParticipants: (participants) => set({ participants }),
  
  // Selection
  selectedParticipant: null,
  setSelectedParticipant: (participant) => set({ selectedParticipant: participant }),
  
  // Current user
  currentUserId: null,
  setCurrentUserId: (id) => set({ currentUserId: id }),
  
  // UI
  showParticipantList: false,
  toggleParticipantList: () => set((state) => ({ showParticipantList: !state.showParticipantList })),
  
  // Camera
  autoRotate: true,
  setAutoRotate: (value) => set({ autoRotate: value }),
  
  // Loading
  isLoading: true,
  setIsLoading: (value) => set({ isLoading: value }),
}))

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Convert 2D map coordinates to 3D sphere position
 * x, y are in range [0, 1]
 */
export function coordsToSphere(x: number, y: number, radius: number = 2): [number, number, number] {
  // Map x to longitude (0-360 degrees -> 0-2π)
  const longitude = x * Math.PI * 2
  
  // Map y to latitude (-90 to 90 degrees -> -π/2 to π/2)
  const latitude = (y - 0.5) * Math.PI
  
  // Convert spherical to Cartesian
  const posX = radius * Math.cos(latitude) * Math.cos(longitude)
  const posY = radius * Math.sin(latitude)
  const posZ = radius * Math.cos(latitude) * Math.sin(longitude)
  
  return [posX, posY, posZ]
}

/**
 * Get level color based on progress
 */
export function getLevelColor(level: number): string {
  const colors = [
    '#E8A87C', // Level 0 - Terracotta (just landed)
    '#A8E6CF', // Level 1 - Mint (making progress)
    '#C4B5E0', // Level 2 - Lavender (advancing)
    '#F8B4B4', // Level 3 - Peach (almost there)
    '#FF9F43', // Level 4+ - Orange (home!)
  ]
  return colors[Math.min(level, colors.length - 1)]
}

/**
 * Get level name
 */
export function getLevelName(level: number): string {
  const names = [
    'Stranded',
    'Survivor',
    'Explorer',
    'Navigator',
    'Homebound',
  ]
  return names[Math.min(level, names.length - 1)]
}
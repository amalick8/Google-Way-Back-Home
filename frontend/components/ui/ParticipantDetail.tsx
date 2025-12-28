'use client'

/**
 * Participant Detail Panel
 * Shows when a participant marker is clicked
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useMapStore, getLevelColor, getLevelName } from '@/lib/store'

export function ParticipantDetail() {
  const { selectedParticipant, setSelectedParticipant, currentUserId } = useMapStore()
  
  const isCurrentUser = selectedParticipant?.participant_id === currentUserId
  const level = selectedParticipant?.location_confirmed ? 1 : 0
  const levelColor = selectedParticipant ? getLevelColor(level) : ''
  const levelName = selectedParticipant ? getLevelName(level) : ''
  
  return (
    <AnimatePresence>
      {selectedParticipant && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="glass-panel p-5 w-72"
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedParticipant(null)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-space-void-lighter/50 
                       flex items-center justify-center text-space-lavender/60 
                       hover:text-space-cream hover:bg-space-void-lighter transition-colors"
          >
            ✕
          </button>
          
          {/* Avatar and name */}
          <div className="flex items-start gap-4 mb-4">
            <div 
              className={`
                w-16 h-16 rounded-xl overflow-hidden border-2 shadow-lg
                ${isCurrentUser ? 'border-space-orange shadow-glow-orange' : 'border-space-cream/30'}
              `}
            >
              {selectedParticipant.icon_url ? (
                <img 
                  src={selectedParticipant.icon_url}
                  alt={selectedParticipant.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-2xl font-bold text-space-void"
                  style={{ backgroundColor: levelColor }}
                >
                  {selectedParticipant.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-semibold text-space-cream truncate">
                {selectedParticipant.username}
              </h3>
              <p className="text-space-lavender/60 text-sm font-mono">
                @{selectedParticipant.username}
              </p>
              {isCurrentUser && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full 
                               bg-space-orange/20 text-space-orange text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-space-orange animate-pulse" />
                  You
                </span>
              )}
            </div>
          </div>
          
          {/* Level badge */}
          <div className="mb-4">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ 
                backgroundColor: `${levelColor}20`,
                color: levelColor,
              }}
            >
              <span className="text-sm">Level {level}</span>
              <span className="text-xs opacity-70">•</span>
              <span className="text-sm font-medium">{levelName}</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-space-lavender/60 mb-1">
              <span>Journey Progress</span>
              <span>{Math.min(level * 25, 100)}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(level * 25, 100)}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="progress-bar-fill"
              />
            </div>
          </div>
          
          {/* Coordinates */}
          <div className="coord-badge">
            <span className="text-space-lavender/40">📍</span>
            <span>
              {(selectedParticipant.x - 180).toFixed(1)}°, 
              {(selectedParticipant.y - 90).toFixed(1)}°
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Progress tracker showing all levels
 */
export function ProgressTracker({ currentLevel = 0 }: { currentLevel?: number }) {
  const levels = [
    { id: 0, name: 'Identity', icon: '🧑‍🚀', description: 'Create your explorer avatar' },
    { id: 1, name: 'Signal', icon: '📡', description: 'Establish communication' },
    { id: 2, name: 'Navigate', icon: '🧭', description: 'Chart your course' },
    { id: 3, name: 'Journey', icon: '🚀', description: 'Begin the voyage' },
    { id: 4, name: 'Home', icon: '🏠', description: 'Reach your destination' },
  ]
  
  return (
    <div className="glass-panel p-4">
      <h3 className="font-display text-sm font-semibold text-space-lavender mb-3">
        Your Journey
      </h3>
      
      <div className="space-y-2">
        {levels.map((level, index) => {
          const isCompleted = currentLevel > level.id
          const isCurrent = currentLevel === level.id
          const isLocked = currentLevel < level.id
          
          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                flex items-center gap-3 p-2 rounded-lg transition-colors
                ${isCurrent ? 'bg-space-orange/10' : ''}
                ${isLocked ? 'opacity-50' : ''}
              `}
            >
              {/* Status indicator */}
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm
                  ${isCompleted 
                    ? 'bg-space-mint text-space-void' 
                    : isCurrent 
                      ? 'bg-space-orange text-space-void animate-pulse-soft'
                      : 'bg-space-void-lighter text-space-lavender/40'
                  }
                `}
              >
                {isCompleted ? '✓' : level.icon}
              </div>
              
              {/* Level info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`
                    text-sm font-medium
                    ${isCurrent ? 'text-space-orange' : 'text-space-cream'}
                  `}>
                    {level.name}
                  </span>
                  {isCurrent && (
                    <span className="px-1.5 py-0.5 rounded text-xs bg-space-orange/20 text-space-orange">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-space-lavender/50 truncate">
                  {level.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default ParticipantDetail
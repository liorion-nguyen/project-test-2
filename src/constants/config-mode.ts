import { getRandomElements } from '@/utils'
import { listIcons } from './IconFlipGame'

export const getLevelConfig = (level: number) => {
  return {
    level,
    timeLimit: Math.max(20, 100 - level * 3), // Decreasing from 100s to 20s
    maxMistakes: Math.max(20, 60 - level * 2), // Decreasing from 60 to 20
    swapCards: level >= 11, // Swap cards from level 11
    trapCards: level >= 16, // Traps appear from level 16
    listCards: getRandomElements(listIcons, 8),
  }
}

export const getLevelColorConfig = (level: number) => {
  return {
    level,
    gridSize: Math.min(3 + Math.floor(level / 5), 10), // Grid size increases up to 10x10
    timeLimit: Math.max(4, Math.ceil((16 - level * 0.5) / 2) * 2), // Decreasing from 15s to 4s
    maxMistakes: Math.max(1, 5 - Math.floor(level / 10)), // Mistakes decrease from 5 to 1
    totalTurns: Math.min(4, 1 + Math.floor(level / 10)), // Total turns increase over levels
    stagesPerLevel: Math.max(3, 6 - Math.floor(level / 10)), // Stages start at 6 and decrease to a minimum of 3
  }
}

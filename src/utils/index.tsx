export function calculateStars(
  timeRemaining: number,
  totalTime: number,
  mistakesRemaining: number,
  totalMistakes: number,
) {
  const timePercentage = timeRemaining === 0 ? 0 : (timeRemaining / totalTime) * 100
  const mistakesPercentage = mistakesRemaining === 0 ? 0 : (mistakesRemaining / totalMistakes) * 100

  if (timeRemaining === 0 || mistakesRemaining === 0) {
    return 0 // Hết thời gian hoặc sai hết → 0 sao
  }

  if (timePercentage >= 70 && mistakesPercentage >= 70) {
    return 3 // Thời gian còn >= 70% + lượt sai còn >= 70% → 3 sao
  }

  if (timePercentage >= 40 && mistakesPercentage >= 40) {
    return 2 // Thời gian còn >= 40% + lượt sai còn >= 40% → 2 sao
  }

  return 1 // Hoàn thành nhưng sát nút hoặc sai nhiều → 1 sao
}

export function calculateStarsColor(
  timeRemaining: number,
  totalTime: number,
  mistakesRemaining: number,
  totalMistakes: number,
  currentStage: number,
  stagesPerLevel: number,
) {
  const timePercentage = timeRemaining === 0 ? 0 : (timeRemaining / totalTime) * 100
  const mistakesPercentage = mistakesRemaining === 0 ? 0 : (mistakesRemaining / totalMistakes) * 100
  const stagePercentage = (currentStage / stagesPerLevel) * 100

  if (timeRemaining === 0 || mistakesRemaining === 0 || currentStage === 0) {
    return 0 // Hết thời gian, sai hết hoặc chưa qua màn nào → 0 sao
  }

  if (timePercentage >= 70 && mistakesPercentage >= 70 && stagePercentage >= 70) {
    return 3 // Thời gian, lượt sai và số màn hoàn thành >= 70% → 3 sao
  }

  if (timePercentage >= 40 && mistakesPercentage >= 40 && stagePercentage >= 40) {
    return 2 // Thời gian, lượt sai và số màn hoàn thành >= 40% → 2 sao
  }

  return 1 // Hoàn thành nhưng sát nút hoặc sai nhiều → 1 sao
}

export const getRandomElements = <T,>(array: T[], count: number): T[] => {
  if (count >= array.length) return [...array] // If count is larger, return whole array

  const result: T[] = []
  const tempArray = [...array] // Copy to avoid modifying original array

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length)
    result.push(tempArray[randomIndex])
    tempArray.splice(randomIndex, 1) // Remove used element to prevent duplicates
  }

  return result
}

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

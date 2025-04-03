import { getData, saveData, STORAGE_KEYS } from '.'

export enum EGameMode {
  FIND_PAIR = 'find_pairs',
  FIND_COLOR = 'find_color',
}

export type GameMode = EGameMode.FIND_PAIR | EGameMode.FIND_COLOR

export type ProgressData = Record<string, number> // Ví dụ: { "level_1": 3, "level_2": 2 }

export interface ProgressStorage {
  [EGameMode.FIND_PAIR]: ProgressData
  [EGameMode.FIND_COLOR]: ProgressData
}

/**
 * Lưu tiến độ chơi cho từng chế độ và level
 */
export const saveProgress = async (mode: GameMode, level: number, stars: number) => {
  const progress = await getProgress()

  if (!progress[mode]) progress[mode] = {}

  const levelKey = `level_${level}`

  // Chỉ lưu nếu đạt nhiều sao hơn trước
  if (!progress[mode][levelKey] || progress[mode][levelKey] < stars) {
    progress[mode][levelKey] = stars
  }

  await saveData(STORAGE_KEYS.PROGRESS, progress)
}
/**
 * Lấy tiến độ chơi
 */
export const getProgress = async (): Promise<ProgressStorage> => {
  const data = await getData<ProgressStorage>(STORAGE_KEYS.PROGRESS)
  return data || { [EGameMode.FIND_PAIR]: {}, [EGameMode.FIND_COLOR]: {} }
}

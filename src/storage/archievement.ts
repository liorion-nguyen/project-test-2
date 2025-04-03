import { getData, saveData, STORAGE_KEYS } from '.'
import { EGameMode, getProgress } from './progress'

export enum EAchievement {
  TAN_BINH = 'tan_binh', // Hoàn thành level đầu tiên
  SIEU_NHI = 'sieu_nhi', // Đạt 3 sao lần đầu tiên
  CHAM_CHI = 'cham_chi', // Hoàn thành 15 level
  CAO_THU = 'cao_thu', // Đạt 3 sao trong 10 level bất kỳ
  HOAN_HAO = 'hoan_hao', // Đạt 3 sao tất cả 30 level
  TOC_DO = 'toc_do', // Hoàn thành 1 level dưới 30s
  KHONG_THE_CAN_PHA = 'khong_the_can_pha', // Đạt 3 sao trong 10 level liên tiếp
}

/**
 * Lấy danh sách thành tựu đã đạt được
 */
export const getAchievements = async (): Promise<Record<EAchievement, boolean>> => {
  const data = await getData<Record<EAchievement, boolean>>(STORAGE_KEYS.ACHIEVEMENTS)
  return (
    data || {
      [EAchievement.TAN_BINH]: false,
      [EAchievement.SIEU_NHI]: false,
      [EAchievement.CHAM_CHI]: false,
      [EAchievement.CAO_THU]: false,
      [EAchievement.HOAN_HAO]: false,
      [EAchievement.TOC_DO]: false,
      [EAchievement.KHONG_THE_CAN_PHA]: false,
    }
  )
}

/**
 * Lưu thành tựu vào AsyncStorage
 */
export const saveAchievements = async (newAchievements: Record<EAchievement, boolean>) => {
  await saveData(STORAGE_KEYS.ACHIEVEMENTS, newAchievements)
}

export interface IAchievement {
  id: EAchievement // ID của thành tựu (Enum)
  description: string // Mô tả thành tựu
  condition: (progress: Record<string, number>) => boolean // Hàm kiểm tra điều kiện
  text: string // Text hiển thị
}

/**
 * Danh sách thành tựu với điều kiện kiểm tra
 */
const ACHIEVEMENT_LIST: IAchievement[] = [
  {
    id: EAchievement.TAN_BINH,
    description: '🏅 Tân binh - Hoàn thành level đầu tiên!',
    text: 'Tân Binh',
    condition: (progress: Record<string, number>) => Object.keys(progress).length > 0,
  },
  {
    id: EAchievement.SIEU_NHI,
    description: '🌟 Siêu nhí - Đạt 3 sao lần đầu tiên!',
    condition: (progress: Record<string, number>) =>
      Object.values(progress).some((stars) => stars === 3),
    text: 'Siêu Nhí',
  },
  {
    id: EAchievement.CHAM_CHI,
    description: '🔥 Chăm chỉ - Hoàn thành ít nhất 15/30 level!',
    condition: (progress: Record<string, number>) => Object.keys(progress).length >= 15,
    text: 'Chăm Chỉ',
  },
  {
    id: EAchievement.CAO_THU,
    description: '🎯 Cao thủ - Đạt 3 sao trong 10 level bất kỳ!',
    condition: (progress: Record<string, number>) =>
      Object.values(progress).filter((stars) => stars === 3).length >= 10,
    text: 'Cao Thủ',
  },
  {
    id: EAchievement.HOAN_HAO,
    description: '💎 Hoàn hảo - Đạt 3 sao tất cả 30 level!',
    condition: (progress: Record<string, number>) =>
      Object.keys(progress).length === 30 && Object.values(progress).every((stars) => stars === 3),
    text: 'Hoàn Hảo',
  },
  {
    id: EAchievement.KHONG_THE_CAN_PHA,
    description: '🚀 Không thể cản phá - Đạt 3 sao trong 10 level liên tiếp!',
    condition: (progress: Record<string, number>) => {
      const levels = Object.keys(progress)
        .map((key) => Number(key.replace('level_', '')))
        .sort((a, b) => a - b)

      let consecutiveCount = 0
      for (const level of levels) {
        if (progress[`level_${level}`] === 3) {
          consecutiveCount++
          if (consecutiveCount >= 10) return true
        } else {
          consecutiveCount = 0
        }
      }
      return false
    },
    text: 'Không Thể Cản Phá',
  },
]

export const checkAchievements = async (
  progress: Record<string, number>,
): Promise<IAchievement[]> => {
  const achievements = await getAchievements()
  let newAchievements: IAchievement[] = []

  // Duyệt qua tất cả thành tựu và kiểm tra điều kiện
  for (const achievement of ACHIEVEMENT_LIST) {
    if (!achievements[achievement.id] && achievement.condition(progress)) {
      achievements[achievement.id] = true
      newAchievements.push(achievement)
    }
  }

  // Nếu có thành tựu mới đạt được, lưu lại
  if (newAchievements.length > 0) {
    await saveAchievements(achievements)
  }

  return newAchievements // Trả về danh sách thành tựu mới đạt để hiển thị modal
}

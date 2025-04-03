import AsyncStorage from '@react-native-async-storage/async-storage'

export const STORAGE_KEYS = {
  PROGRESS: 'PROGRESS', // Tiến độ chơi
  ACHIEVEMENTS: 'ACHIEVEMENTS', // Thành tựu
  SETTINGS: 'SETTINGS', // Cài đặt game
} as const

type StorageKey = keyof typeof STORAGE_KEYS

export const saveData = async <T>(key: StorageKey, value: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value))
  } catch (error) {
    console.error(`❌ Lỗi khi lưu dữ liệu vào key: ${key}`, error)
  }
}

export const getData = async <T>(key: StorageKey): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS[key])
    return value ? (JSON.parse(value) as T) : null
  } catch (error) {
    console.error(`❌ Lỗi khi lấy dữ liệu từ key: ${key}`, error)
    return null
  }
}

export const removeData = async (key: StorageKey): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS[key])
  } catch (error) {
    console.error(`❌ Lỗi khi xóa dữ liệu từ key: ${key}`, error)
  }
}

export const checkIfExists = async (key: StorageKey): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS[key])
    return value !== null
  } catch (error) {
    console.error(`❌ Lỗi khi kiểm tra dữ liệu của key: ${key}`, error)
    return false
  }
}

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear()
  } catch (error) {
    console.error('❌ Lỗi khi xóa toàn bộ dữ liệu trong AsyncStorage', error)
  }
}

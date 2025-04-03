import { ImageBackground, StatusBar, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Footer from '@/components/Footer'
import IconBack from '~/assets/icons/IconBack'
import IconSetting from '~/assets/icons/IconSetting'
import { useRouter } from 'expo-router'
import IconTextFlipCard from '~/assets/icons/IconTextFlipCard'
import BroadLevel from '@/components/BroadLevel'
import ModalSetting from '@/modal/ModalSetting'
import { useImageCache } from '@/context/ImageCacheContext'
import { EGameMode, getProgress } from '@/storage/progress'
import { useIsFocused } from '@react-navigation/native'
import { ERouteTable } from '@/constants/route-table'
import { checkAchievements } from '@/storage/archievement'
import ModalAchievement from '@/modal/ModalAchievement'
import AnimatedComponent from '@/components/AnimatedComponent'
import ButtonSound from '@/components/ButtonSound'

const TOTAL_LEVELS = 30
const gameMode = EGameMode.FIND_PAIR // pass from navigation props

export interface LevelItem {
  level: number
  star: number
  locked: boolean
  timeLimit: number
}

const LevelFlipCard = () => {
  const router = useRouter()
  const [modalSetting, setModalSetting] = useState(false)
  const { getCachedImage } = useImageCache()
  const [levels, setLevels] = useState<LevelItem[]>([])
  const isFocused = useIsFocused()
  const [modalAchievement, setModalAchievement] = useState(false)
  const [dataAchievement, setDataAchievement] = useState<any>([])

  useEffect(() => {
    const loadLevels = async () => {
      const progress = await getProgress()
      const playedLevels = progress[gameMode] || {}

      let lastUnlockedLevel = 1 // Level 1 luôn mở khóa

      // Xác định level mở khóa dựa trên số sao đạt được
      for (let i = 1; i <= TOTAL_LEVELS; i++) {
        const levelKey = `level_${i}`
        const star = playedLevels[levelKey] || 0

        // Nếu level trước đó đạt >= 1 sao → mở khóa level tiếp theo
        if (star >= 1) {
          lastUnlockedLevel = i + 1
        }
      }

      // Merge dữ liệu tiến độ vào danh sách level
      const newLevels: LevelItem[] = Array.from({ length: TOTAL_LEVELS }, (_, i) => {
        const levelNumber = i + 1
        return {
          level: levelNumber,
          star: playedLevels[`level_${levelNumber}`] || 0,
          locked: levelNumber > lastUnlockedLevel,
          timeLimit: Math.max(20, 100 - (i + 1) * 3),
        }
      })

      setLevels(newLevels)
    }

    loadLevels()
  }, [isFocused])

  useEffect(() => {
    const checkAchievement = async () => {
      const progress = await getProgress()
      const a = await checkAchievements(progress[gameMode])
      if (a.length > 0) {
        setDataAchievement(a)
        setModalAchievement(true)
      }
    }
    checkAchievement()
  }, [isFocused])

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <ImageBackground source={getCachedImage('bgFlipCard')} resizeMode="cover" className="h-full">
        <AnimatedComponent className="h-full">
          <View className="flex items-center mt-[60px]">
            <IconTextFlipCard />
            {levels && <BroadLevel pathname={ERouteTable.PLAY_FLIP_CARD} data={levels} />}
          </View>
          <Footer>
            <ButtonSound onPress={() => router.back()}>
              <IconBack />
            </ButtonSound>
            <ButtonSound onPress={() => setModalSetting(true)}>
              <IconSetting />
            </ButtonSound>
          </Footer>
          <ModalSetting onClose={() => setModalSetting(false)} visible={modalSetting} />
          <ModalAchievement
            data={dataAchievement}
            visible={modalAchievement}
            onClose={() => setModalAchievement(false)}
          />
        </AnimatedComponent>
      </ImageBackground>
    </View>
  )
}

export default LevelFlipCard

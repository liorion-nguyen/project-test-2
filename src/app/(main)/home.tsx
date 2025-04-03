import { Image, ImageBackground, StatusBar, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import IconStart from '~/assets/icons/IconStart'
import IconAchievement from '~/assets/icons/IconAchievement'
import IconTutorial from '~/assets/icons/IconTutorial'
import IconSetting from '~/assets/icons/IconSetting'
import LogoComponent from '@/components/LogoConponent'
import ModalSetting from '@/modal/ModalSetting'
import { useImageCache } from '@/context/ImageCacheContext'
import { ERouteTable } from '@/constants/route-table'
import AnimatedComponent from '@/components/AnimatedComponent'
import ButtonSound from '@/components/ButtonSound'

const SplashScreen = () => {
  const { getCachedImage } = useImageCache()
  const router = useRouter()
  const [modalSetting, setModalSetting] = useState(false)

  const onStart = async () => {
    router.push(ERouteTable.GAME_MODE)
  }

  const onAchievement = async () => {
    router.push(ERouteTable.ACHIEVEMENT)
  }

  const onTutorial = async () => {
    router.push(ERouteTable.TUTORIAL)
  }

  return (
    <View className="flex-1">
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <ImageBackground source={getCachedImage('bgHome')} resizeMode="cover" className="h-full">
        <AnimatedComponent className="h-full">
          <View className="flex items-center">
            <LogoComponent />
            <Image source={getCachedImage('rope')} className="h-12 w-[90%]" resizeMode="cover" />
            <ButtonSound onPress={onStart}>
              <IconStart />
            </ButtonSound>
            <Image source={getCachedImage('rope')} className="h-6 w-[90%]" resizeMode="cover" />
            <ButtonSound onPress={onAchievement}>
              <IconAchievement />
            </ButtonSound>
            <Image source={getCachedImage('rope')} className="h-6 w-[90%]" resizeMode="cover" />
            <ButtonSound onPress={onTutorial}>
              <IconTutorial />
            </ButtonSound>
            <View className="mt-8">
              <ButtonSound onPress={() => setModalSetting(true)}>
                <IconSetting />
              </ButtonSound>
            </View>
          </View>
          <ModalSetting onClose={() => setModalSetting(false)} visible={modalSetting} />
        </AnimatedComponent>
      </ImageBackground>
    </View>
  )
}

export default SplashScreen

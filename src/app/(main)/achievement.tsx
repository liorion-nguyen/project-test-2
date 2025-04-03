import { ImageBackground, StatusBar, View } from 'react-native'
import React, { useState } from 'react'
import Footer from '@/components/Footer'
import IconBack from '~/assets/icons/IconBack'
import IconSetting from '~/assets/icons/IconSetting'
import { useRouter } from 'expo-router'
import LogoAchievement from '~/assets/icons/LogoAchievement'
import AchievementComponent from '@/components/AchievementComponent'
import IconInformation from '~/assets/icons/IconInformation'
import ModalComponent from '@/components/ModalComponent'
import IconClose from '~/assets/icons/IconClose'
import BannerInformation from '~/assets/icons/BannerInformation'
import ModalSetting from '@/modal/ModalSetting'
import { useImageCache } from '@/context/ImageCacheContext'
import AnimatedComponent from '@/components/AnimatedComponent'
import ButtonSound from '@/components/ButtonSound'

export default function Achievement() {
  const router = useRouter()
  const [modalInformation, setModalInformation] = useState(false)
  const [modalSetting, setModalSetting] = useState(false)
  const { getCachedImage } = useImageCache()

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <ImageBackground source={getCachedImage('bgHome')} resizeMode="cover" className="h-full">
        <AnimatedComponent className="h-full">
          <View className="items-center justify-center">
            <LogoAchievement />
            <AchievementComponent />
          </View>
          <Footer>
            <ButtonSound onPress={() => router.back()}>
              <IconBack />
            </ButtonSound>
            <View className="flex-row gap-2">
              <ButtonSound onPress={() => setModalInformation(true)}>
                <IconInformation />
              </ButtonSound>
              <ButtonSound onPress={() => setModalSetting(true)}>
                <IconSetting />
              </ButtonSound>
            </View>
          </Footer>
          <ModalComponent visible={modalInformation} onClose={() => setModalInformation(false)}>
            <View className="relative">
              <BannerInformation />
              <ButtonSound
                className="absolute -right-2 -top-2"
                onPress={() => setModalInformation(false)}
              >
                <IconClose />
              </ButtonSound>
            </View>
          </ModalComponent>
          <ModalSetting onClose={() => setModalSetting(false)} visible={modalSetting} />
        </AnimatedComponent>
      </ImageBackground>
    </View>
  )
}

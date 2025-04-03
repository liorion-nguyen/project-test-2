import { Image, ImageBackground, TouchableOpacity, View, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import IconBack from '~/assets/icons/IconBack'
import IconSetting from '~/assets/icons/IconSetting'
import Footer from '@/components/Footer'
import LogoComponent from '@/components/LogoConponent'
import ModalSetting from '@/modal/ModalSetting'
import { ERouteTable } from '@/constants/route-table'
import { useImageCache } from '@/context/ImageCacheContext'
import AnimatedComponent from '@/components/AnimatedComponent'
import ButtonSound from '@/components/ButtonSound'

const GameMode = () => {
  const router = useRouter()
  const [modalSetting, setModalSetting] = useState(false)
  const { getCachedImage } = useImageCache()

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <ModalSetting onClose={() => setModalSetting(false)} visible={modalSetting} />
      <ImageBackground source={getCachedImage('bgHome')} resizeMode="cover" className="h-full">
        <AnimatedComponent className="h-full">
          <View className="items-center justify-center">
            <LogoComponent />
          </View>
          <View className="mt-[60px] items-center justify-center">
            <ButtonSound onPress={() => router.push(ERouteTable.LEVEL_FLIP_CARD)}>
              <Image
                source={getCachedImage('gameFlipCard')}
                className="h-[170px] w-[300px]"
                resizeMode="stretch"
              />
            </ButtonSound>
            <ButtonSound className="mt-6" onPress={() => router.push(ERouteTable.LEVEL_FIND_COLOR)}>
              <Image
                source={getCachedImage('gameFindColor')}
                className="h-[170px] w-[300px]"
                resizeMode="stretch"
              />
            </ButtonSound>
          </View>
          <Footer>
            <ButtonSound onPress={() => router.back()}>
              <IconBack />
            </ButtonSound>
            <ButtonSound onPress={() => setModalSetting(true)}>
              <IconSetting />
            </ButtonSound>
          </Footer>
        </AnimatedComponent>
      </ImageBackground>
    </View>
  )
}

export default GameMode

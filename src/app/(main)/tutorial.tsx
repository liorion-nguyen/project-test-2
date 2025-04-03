import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import IconBack from '~/assets/icons/IconBack'
import IconSetting from '~/assets/icons/IconSetting'
import Footer from '@/components/Footer'
import { useRouter } from 'expo-router'
import LogoTutorial from '~/assets/icons/LogoTutorial'
import ModalSetting from '@/modal/ModalSetting'
import { useVideoPlayer, VideoView } from 'expo-video';
import IconButtonFlipCard from '~/assets/icons/IconButtonFlipCard'
import IconButtonFindColor from '~/assets/icons/IconButtonFindColor'
import { useImageCache } from '@/context/ImageCacheContext'
import AnimatedComponent from '@/components/AnimatedComponent'
import ButtonSound from '@/components/ButtonSound'
import soundManager from '@/utils/soundManager'
import sound from '@/constants/sound'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'

export default function Tutorial() {
  const router = useRouter()
  const [modalSetting, setModalSetting] = useState(false)
  const [status, setStatus] = useState(1)
  const { getCachedImage } = useImageCache()
  const backgroundSound = useSelector((state: RootState) => state.sound.backgroundSound)


  useEffect(() => {
    if (backgroundSound) {
      const stopSound = async () => {
        await soundManager.stopBackgroundSound()
      }
      stopSound()

      return () => {
        soundManager.playBackgroundSound(sound.bgSound)
      }
    }
  }, []);


  const handleChangeVideo = (newStatus: number) => {
    setStatus(newStatus);
  };

  const videoSource = status === 0
    ? 'https://firebasestorage.googleapis.com/v0/b/expo-template-9687b.appspot.com/o/demo-game-find-color.mp4?alt=media&token=91351466-465a-4b94-8431-0ca000532023'
    : 'https://firebasestorage.googleapis.com/v0/b/expo-template-9687b.appspot.com/o/demo-game-flip-card.mp4?alt=media&token=d7fd6014-dd3c-4634-9a55-4d74cc6d270d';

  const player = useVideoPlayer({ uri: videoSource }, (player) => {
    player.loop = true;
  });

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <ImageBackground source={getCachedImage('bgMode')} resizeMode="cover" className="h-full">
        <AnimatedComponent className="h-full">
          <View className="items-center justify-center">
            <LogoTutorial />
            <ImageBackground
              source={getCachedImage('bgModal')}
              resizeMode="cover"
              style={styles.container}
            >
              <View className="items-center" style={{ marginTop: 30 }}>
                <VideoView
                  style={styles.video}
                  player={player}
                  allowsFullscreen
                  allowsPictureInPicture
                />
              </View>
            </ImageBackground>
            <View style={styles.containerButton}>
              <ButtonSound onPress={() => handleChangeVideo(1)}>
                <IconButtonFlipCard />
              </ButtonSound>
              <ButtonSound onPress={() => handleChangeVideo(0)}>
                <IconButtonFindColor />
              </ButtonSound>
            </View>
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
        </AnimatedComponent>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 345,
    height: 256,
    marginTop: 110,
  },
  labelRadioItem: {
    fontFamily: 'SVN-ToySans',
    fontSize: 32,
    color: '#5C4229',
  },
  iconRadio: {
    marginRight: 10,
  },
  video: {
    borderWidth: 5,
    borderColor: 'white',
    height: 200,
    borderRadius: 40,
    width: Dimensions.get('window').width - 120,
  },
  containerButton: {
    flexDirection: 'row',
    columnGap: 10,
    marginTop: 20,
  },
})

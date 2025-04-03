import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import ModalComponent from '@/components/ModalComponent'
import { useRouter } from 'expo-router'
import IconTextLose from '~/assets/icons/IconTextLose'
import IconTextWin from '~/assets/icons/IconTextWin'
import React, { useEffect } from 'react'
import IconBack from '~/assets/icons/IconBack'
import IconRollBack from '~/assets/icons/IconRollBack'
import IconButtonContinueGame from '~/assets/icons/IconButtonContinueGame'
import { useImageCache } from '@/context/ImageCacheContext'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'
import soundManager from '@/utils/soundManager'
import sound from '@/constants/sound'
import ButtonSound from '@/components/ButtonSound'

interface IModalPauseProps {
  onClose: () => void
  visible: boolean
  level?: number
  star?: number
  handleResetGame: () => void
  handleNextGame: () => void
  gameFinished: boolean
}

export default function ModalGameResult({
  onClose,
  visible,
  level = 1,
  star = 0,
  handleResetGame,
  handleNextGame,
  gameFinished,
}: IModalPauseProps) {
  const router = useRouter()
  const { getCachedImage } = useImageCache()
  const gameSound = useSelector((state: RootState) => state.sound.gameSound)

  const renderStar = () => {
    switch (star) {
      case 1:
        return (
          <View className="flex-row items-center">
            <Image
              source={getCachedImage('starLeftActive')}
              style={{ height: 56, width: 56 }}
              resizeMode="contain"
            />
            <Image
              source={getCachedImage('starCenter')}
              style={{ height: 72, width: 72 }}
              resizeMode="contain"
            />
            <Image
              source={getCachedImage('starRight')}
              style={{ height: 56, width: 56 }}
              resizeMode="contain"
            />
          </View>
        )
      case 2:
        return (
          <View className="flex-row items-center">
            <Image
              source={getCachedImage('starLeftActive')}
              style={{ height: 56, width: 56 }}
              resizeMode="contain"
            />
            <Image
              source={getCachedImage('starCenterActive')}
              style={{ height: 72, width: 72 }}
              resizeMode="contain"
            />
            <Image
              source={getCachedImage('starRight')}
              style={{ height: 56, width: 56 }}
              resizeMode="contain"
            />
          </View>
        )
      case 3:
        return (
          <View className="flex-row items-center">
            <Image
              source={getCachedImage('starLeftActive')}
              style={{ height: 56, width: 56 }}
              resizeMode="contain"
            />
            <Image
              source={getCachedImage('starCenterActive')}
              style={{ height: 72, width: 72 }}
              resizeMode="contain"
            />
            <Image
              source={getCachedImage('starRightActive')}
              style={{ height: 56, width: 56 }}
              resizeMode="contain"
            />
          </View>
        )
      default:
        return (
          <View className="flex-row items-center">
            <Image
              source={getCachedImage('starLeft')}
              style={{ height: 56, width: 56 }}
              resizeMode="contain"
            />
            <Image
              source={getCachedImage('starCenter')}
              style={{ height: 72, width: 72 }}
              resizeMode="contain"
            />
            <Image
              source={getCachedImage('starRight')}
              style={{ height: 56, width: 56 }}
              resizeMode="contain"
            />
          </View>
        )
    }
  }

  useEffect(() => {
    const callSound = async () => {
      if (gameSound === 1 && gameFinished) {
        if (star === 0) {
          await soundManager.playSFX(sound.loseGame)
        } else if (star > 0) {
          await soundManager.playSFX(sound.winGame)
        }
      }
    }
    callSound()
  }, [star, gameSound, gameFinished])

  return (
    <ModalComponent onClose={onClose} visible={visible}>
      <ImageBackground
        source={getCachedImage('bgModal')}
        resizeMode="cover"
        style={styles.container}
      >
        <View className="items-center" style={{ marginTop: -40 }}>
          {star > 0 ? <IconTextWin /> : <IconTextLose />}
          <Text style={styles.textModal}>Cấp độ {level}</Text>
          <View>{renderStar()}</View>
          <View className="flex-row items-center" style={{ marginTop: 100 }}>
            <ButtonSound
              style={{ marginRight: 10 }}
              onPress={() => {
                onClose()
                router.back()
              }}
            >
              <IconBack />
            </ButtonSound>
            {star > 0 && (
              <ButtonSound style={{ marginRight: 10 }} onPress={handleNextGame}>
                <IconButtonContinueGame />
              </ButtonSound>
            )}
            <ButtonSound onPress={handleResetGame}>
              <IconRollBack />
            </ButtonSound>
          </View>
        </View>
      </ImageBackground>
    </ModalComponent>
  )
}
const styles = StyleSheet.create({
  container: {
    width: 345,
    height: 256,
    position: 'relative',
  },
  iconCloseStyle: {
    position: 'absolute',
    right: 0,
  },
  textModal: {
    fontFamily: 'SVN-ToySans',
    fontSize: 36,
    color: '#5C4229',
    // box shadow text
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
    marginTop: 12,
    marginBottom: 8,
  },
})

import ModalComponent from '@/components/ModalComponent'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import IconClose from '~/assets/icons/IconClose'
import TextSetting from '~/assets/icons/TextSetting'
import IconRadioDeActive from '~/assets/icons/IconRadioDeActive'
import IconRadioActive from '~/assets/icons/IconRadioActive'
import soundManager from '@/utils/soundManager'
import sound from '@/constants/sound'
import { useImageCache } from '@/context/ImageCacheContext'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { toggleBackgroundSound, toggleGameSound } from '@/redux/features/soundSlice'
import ButtonSound from '@/components/ButtonSound'

interface IModalSettingProps {
  onClose: () => void
  visible: boolean
}

export default function ModalSetting({ onClose, visible }: IModalSettingProps) {
  const { getCachedImage } = useImageCache()
  const dispatch = useDispatch()
  const backgroundSound = useSelector((state: RootState) => state.sound.backgroundSound)
  const gameSound = useSelector((state: RootState) => state.sound.gameSound)

  const handlePlaySoundBackground = async () => {
    dispatch(toggleBackgroundSound())
    if (backgroundSound === 0) {
      await soundManager.playBackgroundSound(sound.bgSound)
    } else {
      await soundManager.stopBackgroundSound()
    }
  }

  return (
    <ModalComponent onClose={onClose} visible={visible}>
      <ImageBackground
        source={getCachedImage('bgModal')}
        resizeMode="cover"
        style={styles.container}
      >
        <ButtonSound style={styles.iconCloseStyle} onPress={onClose}>
          <IconClose />
        </ButtonSound>
        <View className="items-center" style={{ marginTop: 40 }}>
          <TextSetting />
          <ButtonSound
            className="flex-row items-center"
            style={{ marginTop: 20 }}
            onPress={handlePlaySoundBackground}
          >
            <View style={styles.iconRadio}>
              {backgroundSound === 0 ? <IconRadioDeActive /> : <IconRadioActive />}
            </View>
            <Text className="text-center" style={styles.labelRadioItem}>
              Nhạc nền
            </Text>
          </ButtonSound>
          <ButtonSound
            className="flex-row items-center"
            style={{ marginTop: 10 }}
            onPress={() => dispatch(toggleGameSound())}
          >
            <View style={styles.iconRadio}>
              {gameSound === 0 ? <IconRadioDeActive /> : <IconRadioActive />}
            </View>
            <Text className="text-center" style={styles.labelRadioItem}>
              Âm thanh
            </Text>
          </ButtonSound>
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
  labelRadioItem: {
    fontFamily: 'SVN-ToySans',
    fontSize: 32,
    color: '#5C4229',
  },
  iconRadio: {
    marginRight: 10,
  },
  iconCloseStyle: {
    position: 'absolute',
    right: 0,
  },
})

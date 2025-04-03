import ModalComponent from '@/components/ModalComponent'
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native'
import IconClose from '~/assets/icons/IconClose'
import IconButtonRetry from '~/assets/icons/IconButtonRetry'
import IconButtonQuits from '~/assets/icons/IconButtonQuits'
import IconButtonContinue from '~/assets/icons/IconButtonContinue'
import { useRouter } from 'expo-router'
import { useImageCache } from '@/context/ImageCacheContext'
import ButtonSound from '@/components/ButtonSound'

interface IModalPauseProps {
  onClose: () => void
  visible: boolean
  handleRetry: () => void
}

export default function ModalPause({ onClose, visible, handleRetry }: IModalPauseProps) {
  const router = useRouter()
  const { getCachedImage } = useImageCache()

  const handleQuit = () => {
    onClose()
    router.back()
  }

  const handleContinue = () => {
    onClose()
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
          <ButtonSound onPress={handleRetry}>
            <IconButtonRetry />
          </ButtonSound>
          <ButtonSound style={{ marginVertical: 12 }} onPress={handleQuit}>
            <IconButtonQuits />
          </ButtonSound>
          <ButtonSound onPress={handleContinue}>
            <IconButtonContinue />
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
  iconCloseStyle: {
    position: 'absolute',
    right: 0,
  },
})

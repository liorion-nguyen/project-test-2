import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ModalComponent from '@/components/ModalComponent'
import React from 'react'
import { useRouter } from 'expo-router'
import { useImageCache } from '@/context/ImageCacheContext'
import IconClose from '~/assets/icons/IconClose'
import CardItem from '@/components/AchievementComponent/CardItem'
import ButtonSound from '@/components/ButtonSound'

interface IModalAchievementProps {
  onClose: () => void
  visible: boolean
  data: any
}

export default function ModalAchievement({ onClose, visible, data }: IModalAchievementProps) {
  const router = useRouter()
  const { getCachedImage } = useImageCache()

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
        <Text style={styles.textModal}>Chúc mừng bạn đã mở khoá {'\n'} thành tựu mới!</Text>
        <View style={styles.cardItem}>
          {data.map((item: any, index: number) => (
            <View key={index}>
              <CardItem icon={item.id} text={item.text} isActive={true} />
            </View>
          ))}
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
    fontSize: 20,
    color: '#5C4229',
    // box shadow text
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
    marginTop: 30,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardItem: {
    alignItems: 'center',
    marginTop: 10,
  },
})

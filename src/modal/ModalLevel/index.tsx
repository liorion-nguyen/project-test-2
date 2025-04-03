import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ModalComponent from '@/components/ModalComponent'
import { useRouter } from 'expo-router'
import React from 'react'
import IconClose from '~/assets/icons/IconClose'
import IconButtonStart from '~/assets/icons/IconButtonStart'
import { ERouteTable } from '@/constants/route-table'
import { useImageCache } from '@/context/ImageCacheContext'
import { ImageKeys } from '@/constants/images'
import { LevelItem } from '@/app/(main)/level-flip-card'

interface IModalLevelProps {
  onClose: () => void
  visible: boolean
  pathname: ERouteTable
  item: LevelItem
}

export default function ModalLevel({ onClose, visible, item, pathname }: IModalLevelProps) {
  const router = useRouter()
  const { getCachedImage } = useImageCache()

  const starStates = ['starLeft', 'starCenter', 'starRight'].map((star, index) => {
    const iconStar = (index < item?.star ? `${star}Active` : star) as ImageKeys
    return getCachedImage(iconStar)
  })

  const onNavvigateGameScreen = () => {
    onClose()
    router.push({ pathname: pathname, params: { level: item.level.toString() } })
  }

  return (
    <ModalComponent onClose={onClose} visible={visible}>
      <ImageBackground
        source={getCachedImage('bgModal')}
        resizeMode="cover"
        style={styles.container}
      >
        <TouchableOpacity style={styles.iconCloseStyle} onPress={onClose}>
          <IconClose />
        </TouchableOpacity>
        <View className="items-center" style={{ marginTop: 20 }}>
          <Text style={styles.textModal}>Cấp độ {item?.level}</Text>
          <View className="flex-row items-center">
            {starStates.map((source, index) => (
              <Image
                key={index}
                source={source}
                style={{ height: index === 1 ? 72 : 56, width: index === 1 ? 72 : 56 }}
                resizeMode="contain"
              />
            ))}
          </View>
          <View className="items-center">
            <Text style={styles.textTime}>Thời gian: {item?.timeLimit}s</Text>
            <TouchableOpacity onPress={onNavvigateGameScreen}>
              <IconButtonStart />
            </TouchableOpacity>
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
  textTime: {
    fontFamily: 'SVN-ToySans',
    fontSize: 18,
    color: '#5C4229',
    // box shadow text
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
    marginTop: 12,
    marginBottom: 8,
    fontWeight: '400',
  },
})

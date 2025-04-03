import { Image, StyleSheet, Text, View } from 'react-native'
import { useImageCache } from '@/context/ImageCacheContext'

interface ILevelNumberProps {
  icon?: any
  text?: string
  isActive?: boolean
}

export default function CardItem({ icon, text, isActive }: ILevelNumberProps) {
  const { getCachedImage } = useImageCache()

  return (
    <View style={{ opacity: !isActive ? 0.6 : 1 }}>
      <Image source={getCachedImage(icon)} resizeMode="cover" style={styles.container} />
      <Text style={styles.textAchievement}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 76,
    height: 76,
  },
  textAchievement: {
    fontFamily: 'SVN-ToySans',
    fontSize: 16,
    color: '#5C4229',
    textAlign: 'center',
    flexWrap: 'wrap',
    // box shadow text
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
  },
})

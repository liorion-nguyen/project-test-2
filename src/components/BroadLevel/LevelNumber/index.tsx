import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import { useImageCache } from '@/context/ImageCacheContext'

interface ILevelNumberProps {
  star?: number
  level: number
}

export default function LevelNumber({ star = 1, level }: ILevelNumberProps) {
  const { getCachedImage } = useImageCache()

  const renderStar = () => {
    return (
      <View style={styles.containerStar}>
        {[...Array(3)].map((_, index) => (
          <View key={`${index} -m`}>
            {index < star ? (
              <Image source={getCachedImage('iconStarActive')} className="h-4 w-4" />
            ) : (
              <Image source={getCachedImage('iconStarDeActive')} className="h-4 w-4" />
            )}
          </View>
        ))}
      </View>
    )
  }

  return (
    <View>
      <ImageBackground
        source={getCachedImage('levelGame')}
        resizeMode="cover"
        style={styles.container}
      >
        <Text style={styles.textLevel}>{level}</Text>
      </ImageBackground>
      {renderStar()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLevel: {
    fontFamily: 'SVN-ToySans',
    fontSize: 34,
    color: 'white',
  },
  containerStar: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
})

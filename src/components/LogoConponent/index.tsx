import { Dimensions, Image, StyleSheet } from 'react-native'
import React from 'react'
import { useImageCache } from '@/context/ImageCacheContext'

export default function LogoComponent() {
  const { getCachedImage } = useImageCache()

  return (
    <Image
      source={getCachedImage('logoApp')}
      className="h-[250px]"
      style={styles.logoApp}
      resizeMode="stretch"
    />
  )
}
const styles = StyleSheet.create({
  logoApp: {
    width: Dimensions.get('window').width - 48,
    height: Dimensions.get('window').width - 48,
    marginTop: -50,
  },
})

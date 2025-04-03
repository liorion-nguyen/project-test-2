import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Asset } from 'expo-asset'
import images, { ImageKeys } from '@/constants/images'

type ImageCacheContextType = {
  loaded: boolean
  getCachedImage: (key: ImageKeys) => { uri?: string } | number
}

const ImageCacheContext = createContext<ImageCacheContextType>({
  loaded: false,
  getCachedImage: () => ({}),
})

export const ImageCacheProvider = ({ children }: { children: ReactNode }) => {
  const [loaded, setLoaded] = useState(false)
  const [cachedImages, setCachedImages] = useState<Record<ImageKeys, string | number>>({} as any)

  useEffect(() => {
    const preloadImages = async () => {
      const assets = await Asset.loadAsync(Object.values(images))
      const cacheMap = Object.keys(images).reduce(
        (acc, key, index) => {
          acc[key as ImageKeys] = assets[index].localUri || images[key as ImageKeys]
          return acc
        },
        {} as Record<ImageKeys, string | number>,
      )

      setCachedImages(cacheMap)
      setLoaded(true)
    }

    preloadImages()
  }, [])

  return (
    <ImageCacheContext.Provider
      value={{
        loaded,
        getCachedImage: (key) => {
          const cached = cachedImages[key]
          return typeof cached === 'string' ? { uri: cached } : cached
        },
      }}
    >
      {children}
    </ImageCacheContext.Provider>
  )
}

// Hook để sử dụng cache ảnh trong toàn bộ ứng dụng
export const useImageCache = () => useContext(ImageCacheContext)

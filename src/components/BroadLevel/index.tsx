import { ImageBackground, StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native'
import IconLeveLock from '~/assets/icons/IconLeveLock'
import React, { useState } from 'react'
import LevelNumber from '@/components/BroadLevel/LevelNumber'
import { useImageCache } from '@/context/ImageCacheContext'
import ModalLevel from '@/modal/ModalLevel'
import { ERouteTable } from '@/constants/route-table'
import { LevelItem } from '@/app/(main)/level-flip-card'

interface IBroadLevelProps {
  data?: LevelItem[]
  pathname: ERouteTable
}

export default function BroadLevel({ data, pathname }: IBroadLevelProps) {
  const [modalLevel, setModalLevel] = useState(false)
  const [pickLevel, setPickLevel] = useState<LevelItem | null>(null)

  const { getCachedImage } = useImageCache()

  const handlePress = (item: LevelItem) => {
    setPickLevel(item)
    setModalLevel(true)
  }

  return (
    <View>
      {pickLevel && (
        <ModalLevel
          onClose={() => {
            setModalLevel(false)
            setPickLevel(null)
          }}
          visible={modalLevel}
          item={pickLevel}
          pathname={pathname}
        />
      )}
      <View style={styles.wrapper}>
        <ImageBackground
          source={getCachedImage('bgBoard')}
          resizeMode="cover"
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {data &&
              data.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={`${index}-${item.level}-${item.star}`}
                    style={styles.containerItem}
                    onPress={() => {
                      handlePress(item)
                    }}
                    disabled={item.locked}
                  >
                    {!item.locked ? (
                      <LevelNumber level={item.level} star={item.star} />
                    ) : (
                      <View className="">
                        <IconLeveLock />
                        <View className="h-5" />
                      </View>
                    )}
                  </TouchableOpacity>
                )
              })}
          </ScrollView>
        </ImageBackground>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    width: 345,
    height: 565,
    paddingHorizontal: 40,
    paddingVertical: 90,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingTop: 10,
  },
  containerItem: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderRadius: 8,
    height: 88,
  },
})

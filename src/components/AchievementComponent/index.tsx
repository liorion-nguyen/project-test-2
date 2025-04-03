import { ImageBackground, StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import CardItem from '@/components/AchievementComponent/CardItem'
import { useImageCache } from '@/context/ImageCacheContext'
import { getAchievements } from '@/storage/archievement'

export const listAchievement = [
  {
    icon: 'cao_thu',
    text: 'Cao Thủ',
  },
  {
    icon: 'cham_chi',
    text: 'Chăm Chỉ',
  },
  {
    icon: 'hoan_hao',
    text: 'Hoàn Hảo',
  },
  {
    icon: 'sieu_nhi',
    text: 'Siêu Nhí',
  },
  {
    icon: 'tan_binh',
    text: 'Tân Binh',
  },
  {
    icon: 'toc_do',
    text: 'Tốc Độ',
  },
  {
    icon: 'khong_the_can_pha',
    text: 'Không Thể Cản Phá',
  },
]

interface IAchievement {
  icon: string
  text: string
}

export default function AchievementComponent() {
  const { getCachedImage } = useImageCache()
  const [listUserAchievementActive, setListUserAchievementActive] = React.useState<IAchievement[]>(
    [],
  )
  const [listUserAchievementUnActive, setListUserAchievementUnActive] = React.useState<
    IAchievement[]
  >([])

  useEffect(() => {
    const renderAchievement = async () => {
      const newAchievements: any = await getAchievements()
      if (newAchievements) {
        const activeAchievements = listAchievement.filter((item) => newAchievements[item.icon])
        const deActiveAchievements = listAchievement.filter((item) => !newAchievements[item.icon])
        setListUserAchievementActive(activeAchievements)
        setListUserAchievementUnActive(deActiveAchievements)
      } else {
        setListUserAchievementUnActive(listAchievement)
      }
    }
    renderAchievement()
  }, [])

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={getCachedImage('bgAchievement')}
        resizeMode="cover"
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.titleLayout}>Huy hiệu của tôi</Text>
          <View style={[styles.scrollContainer, { marginBottom: 10 }]}>
            {listUserAchievementActive && listUserAchievementActive.length > 0 ? (
              listUserAchievementActive.map((item, index) => (
                <View key={index} style={styles.containerItem}>
                  <CardItem icon={item.icon} text={item.text} isActive={true} />
                </View>
              ))
            ) : (
              <View>
                <Text style={styles.textLayout}>Bạn chưa có huy hiệu nào... </Text>
                <Text style={styles.textLayout}>Cùng cố gắng nhé! </Text>
              </View>
            )}
          </View>
          {listUserAchievementUnActive && listUserAchievementUnActive.length > 0 && (
            <View>
              <Text style={styles.titleLayout}>Huy hiệu tiếp theo</Text>
              <View style={styles.scrollContainer}>
                {listUserAchievementUnActive.map((item, index) => (
                  <View key={index} style={styles.containerItem}>
                    <CardItem icon={item.icon} text={item.text} isActive={false} />
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
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
    marginTop: 10,
    gap: 10,
  },
  containerItem: {
    width: '30%',
    alignItems: 'center',
    borderRadius: 8,
  },
  titleLayout: {
    fontFamily: 'SVN-ToySans',
    fontSize: 24,
    color: '#5C4229',
    marginBottom: 10,
    // box shadow text
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
  },
  textLayout: {
    fontFamily: 'SVN-ToySans',
    fontSize: 20,
    color: '#5C4229',
    // box shadow text
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
  },
})

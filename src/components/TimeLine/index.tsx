import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { useState, useRef, useEffect } from 'react'
import { useImageCache } from '@/context/ImageCacheContext'

interface IProgressBarProps {
  duration: number
  keyProp: number
  isPaused: boolean
  progressRef: any
  gameFinished: boolean
  currentLevel: any
  reset: boolean
  mistakes: number
}

interface ITimeLineProps {
  timeLeft: number
  gameFinished: boolean
  isPaused: boolean
  currentLevel: any
  reset: boolean
  mistakes: number
}

const ProgressBar = ({
  duration = 30,
  keyProp,
  isPaused,
  progressRef,
  gameFinished,
  currentLevel,
  reset,
  mistakes,
}: IProgressBarProps) => {
  const { getCachedImage } = useImageCache()
  const [progressWidth, setProgressWidth] = useState(204)

  useEffect(() => {
    if (gameFinished && progressRef.current) {
      progressRef.current.stopAnimation() // Dừng animation khi game kết thúc
    }
  }, [gameFinished])

  useEffect(() => {
    if (reset) {
      setProgressWidth(204) // Đưa thanh về trạng thái ban đầu
      if (progressRef.current) {
        progressRef.current.animate({ from: { width: 204 }, to: { width: 0 } }, duration * 1000)
      }
    }
  }, [reset])

  useEffect(() => {
    if (progressRef.current) {
      if (isPaused) {
        // Dừng animation và lưu giá trị width hiện tại
        progressRef.current.stopAnimation()
      } else {
        // Tạo animation từ giá trị hiện tại
        progressRef.current.animate(
          { from: { width: progressWidth }, to: { width: 0 } },
          (progressWidth / 204) * duration * 1000,
        )
      }
    }
  }, [isPaused])

  // Cập nhật width trong mỗi frame
  useEffect(() => {
    let interval: any
    if (!isPaused) {
      interval = setInterval(() => {
        setProgressWidth((prevWidth) => Math.max(prevWidth - (204 / duration) * 0.1, 0)) // Cập nhật width
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPaused, duration])

  return (
    <View style={styles.marginContainer}>
      <Text style={styles.textTime}>{duration}s</Text>
      <View>
        <View className="flex-row justify-between w-[212px] pl-2 pr-2 mb-0.5">
          <Text style={styles.textTime2}>{mistakes} lượt chơi</Text>
          <Text style={styles.textTime2}>LV.{currentLevel.level}</Text>
        </View>
        <View style={styles.progressContainer}>
          <ImageBackground
            source={getCachedImage('timeProcessBar')}
            style={styles.timeProcessBar}
            resizeMode="contain"
          >
            <Animatable.View
              ref={progressRef}
              key={isPaused ? 'paused' : keyProp} // Khi pause thì animation dừng
              animation={
                isPaused ? undefined : { from: { width: progressWidth }, to: { width: 0 } }
              }
              easing="linear" // Đảm bảo chạy đều
              duration={isPaused ? undefined : duration * 1000}
              style={[styles.progressBar, { backgroundColor: '#e97202', width: progressWidth }]}
            />
          </ImageBackground>
        </View>
      </View>
    </View>
  )
}

export default function TimeLine({
  timeLeft,
  gameFinished,
  isPaused,
  currentLevel,
  reset,
  mistakes,
}: ITimeLineProps) {
  const progressRef = useRef(null)
  const { getCachedImage } = useImageCache()

  return (
    <ImageBackground
      source={getCachedImage('boardTimeLine')}
      resizeMode="contain"
      style={styles.container}
    >
      <ProgressBar
        keyProp={0}
        duration={timeLeft}
        isPaused={isPaused}
        progressRef={progressRef}
        gameFinished={gameFinished}
        currentLevel={currentLevel}
        reset={reset}
        mistakes={mistakes}
      />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 48,
    height: 150,
  },
  progressContainer: {
    height: 20,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: 13,
    borderRadius: 20,
  },
  timeProcessBar: {
    width: 212,
    height: 20,
    justifyContent: 'center',
    paddingLeft: 4,
  },
  marginContainer: {
    marginTop: '24%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
  },
  textTime: {
    fontFamily: 'SVN-ToySans',
    fontSize: 34,
    color: '#5C4229',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
  },
  textTime2: {
    fontFamily: 'SVN-ToySans',
    fontSize: 16,
    color: '#5C4229',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
  },
  pauseButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  pauseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

import {
  ImageBackground,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Dimensions,
  StatusBar,
} from 'react-native'
import Footer from '@/components/Footer'
import IconPause from '~/assets/icons/IconPause'
import IconSetting from '~/assets/icons/IconSetting'
import React, { useEffect, useState } from 'react'
import ModalSetting from '@/modal/ModalSetting'
import { useImageCache } from '@/context/ImageCacheContext'
import TimeLine from '@/components/TimeLine'
import { calculateStarsColor } from '@/utils'
import ModalGameResult from '@/modal/ModalGameResult'
import { EGameMode, saveProgress } from '@/storage/progress'
import { router, useLocalSearchParams } from 'expo-router'
import ModalPause from '@/modal/ModalPause'
import { getLevelColorConfig } from '@/constants/config-mode'
import AnimatedComponent from '@/components/AnimatedComponent'
import CountDownScreen from '@/components/CountDownScreen'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'
import soundManager from '@/utils/soundManager'
import sound from '@/constants/sound'

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r},${g},${b})`
}

const getDifferentColor = (color: string) => {
  const variation = 30
  let [r, g, b] = color.match(/\d+/g)!.map(Number)
  r = Math.min(255, r + variation)
  return `rgb(${r},${g},${b})`
}

const { width } = Dimensions.get('window')
const GRID_PADDING = 48

export default function PlayFindColor() {
  const { level } = useLocalSearchParams()
  const gameSound = useSelector((state: RootState) => state.sound.gameSound)
  const configLevel = getLevelColorConfig(Number(level))
  const { getCachedImage } = useImageCache()

  const cellSize = (width - GRID_PADDING) / configLevel.gridSize

  const [grid, setGrid] = useState<string[]>([])
  const [oddIndex, setOddIndex] = useState(0)
  const [modalSetting, setModalSetting] = useState(false)
  const [modalPause, setModalPause] = useState(false)
  const [modalResult, setModalResult] = useState(false)
  const [mistakes, setMistakes] = useState(configLevel.maxMistakes)
  const [timeLeft, setTimeLeft] = useState<number>(configLevel.timeLimit)
  const [gameFinished, setGameFinished] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [reset, setReset] = useState(false)
  const [currentStage, setCurrentStage] = useState(1) // Theo dõi màn hiện tại
  // 🕒 Countdown State
  const [countdown, setCountdown] = useState(3)
  const [gameStarted, setGameStarted] = useState(false)

  // Countdown Effect (from 3 to 0)
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setTimeout(() => {
        setGameStarted(true)
      }, 800) //
    }
  }, [countdown])

  useEffect(() => {
    generateGrid()
  }, [])

  const generateGrid = () => {
    const baseColor = getRandomColor()
    const oddColor = getDifferentColor(baseColor)
    const newGrid = new Array(configLevel.gridSize * configLevel.gridSize).fill(baseColor)
    const randomIndex = Math.floor(Math.random() * newGrid.length)
    newGrid[randomIndex] = oddColor

    // Cập nhật state một lần duy nhất
    setGrid([...newGrid])
    setOddIndex(randomIndex)
  }

  useEffect(() => {
    if (timeLeft < 1 || gameFinished || isPaused || !gameStarted) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isPaused, gameStarted])

  const handlePress = async (index: number) => {
    if (mistakes > 0) {
      if (index === oddIndex) {
        if (gameSound === 1) {
          await soundManager.playSFX(sound.trueSelect)
        }
        if (currentStage < configLevel.stagesPerLevel) {
          // Nếu chưa hết số màn, tăng màn chơi và tạo lưới mới
          setCurrentStage((prev) => {
            const newStage = prev + 1
            if (newStage <= configLevel.stagesPerLevel) {
              generateGrid()
            }
            return newStage
          })
        } else {
          // Nếu đã hoàn thành hết số màn, kết thúc level
          handleFinishGame()
        }
      } else {
        if (gameSound === 1) {
          await soundManager.playSFX(sound.falseSelect)
        }
        setMistakes(mistakes - 1)
      }
    }
  }

  const handleResetGame = () => {
    setModalResult(false)
    setMistakes(configLevel.maxMistakes)
    setTimeLeft(configLevel.timeLimit)
    setReset(true)
    generateGrid()
    setCountdown(3) // Restart countdown
    setGameStarted(false)
    setIsPaused(false)
    setModalPause(false)
    setCurrentStage(1) // Reset về màn 1
    setMistakes(configLevel.maxMistakes)
    setGameFinished(false)
  }

  const handleNextGame = async () => {
    setModalResult(false)
    router.back()
  }

  const handleFinishGame = async () => {
    setGameFinished(true)
    await saveProgress(
      EGameMode.FIND_COLOR,
      configLevel.level,
      calculateStarsColor(
        timeLeft,
        configLevel.timeLimit,
        mistakes,
        configLevel.maxMistakes,
        currentStage,
        configLevel.stagesPerLevel,
      ),
    )
    setModalResult(true)
    setIsPaused(true)
  }

  useEffect(() => {
    if (timeLeft === 0 || mistakes === 0) {
      handleFinishGame()
    }
  }, [timeLeft, handleFinishGame, mistakes])

  return (
    <ImageBackground
      source={getCachedImage('bgGameColorPlay')}
      resizeMode="cover"
      className="h-full"
    >
      {!gameStarted ? (
        <CountDownScreen countdown={countdown} />
      ) : (
        <View className="h-full">
          <View className="items-center justify-center">
            <TimeLine
              timeLeft={timeLeft}
              gameFinished={gameFinished}
              isPaused={isPaused}
              currentLevel={configLevel}
              reset={reset}
              mistakes={mistakes}
            />
            <Text style={styles.level}>
              {currentStage}/{configLevel.stagesPerLevel}
            </Text>
            <View style={[styles.grid]}>
              {grid.map((color, index) => (
                <AnimatedComponent
                  key={index}
                  animation={currentStage === 1 ? 'fadeIn' : undefined}
                  duration={500}
                >
                  <TouchableOpacity
                    style={[
                      styles.cell,
                      {
                        backgroundColor: color,
                        width: cellSize,
                        height: cellSize,
                      },
                    ]}
                    onPress={() => handlePress(index)}
                  />
                </AnimatedComponent>
              ))}
            </View>
          </View>
          <Footer>
            <TouchableOpacity
              onPress={() => {
                setModalPause(true)
                setIsPaused(true)
              }}
            >
              <IconPause />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalSetting(true)
                setIsPaused(true)
              }}
            >
              <IconSetting />
            </TouchableOpacity>
          </Footer>
          <ModalSetting
            onClose={() => {
              setModalSetting(false)
              setIsPaused(false)
            }}
            visible={modalSetting}
          />
          <ModalPause
            onClose={() => {
              setModalPause(false)
              setIsPaused(false)
            }}
            visible={modalPause}
            handleRetry={handleResetGame}
          />
          <ModalGameResult
            onClose={() => setModalResult(false)}
            visible={modalResult}
            star={calculateStarsColor(
              timeLeft,
              configLevel.timeLimit,
              mistakes,
              configLevel.maxMistakes,
              currentStage,
              configLevel.stagesPerLevel,
            )}
            level={configLevel.level}
            handleResetGame={handleResetGame}
            handleNextGame={handleNextGame}
            gameFinished={gameFinished}
          />
        </View>
      )}
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  score: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  level: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 10,
    color: '#fff',
    fontFamily: 'SVN-ToySans',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
  },
  timer: { fontSize: 18, marginBottom: 20 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: { margin: 2, borderRadius: 5 },
})

import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image } from 'react-native'
import Footer from '@/components/Footer'
import IconSetting from '~/assets/icons/IconSetting'
import React, { useState, useEffect, useCallback } from 'react'
import IconPause from '~/assets/icons/IconPause'
import TimeLine from '@/components/TimeLine'
import * as Animatable from 'react-native-animatable'
import ModalSetting from '@/modal/ModalSetting'
import ModalPause from '@/modal/ModalPause'
import ModalGameResult from '@/modal/ModalGameResult'
import { useImageCache } from '@/context/ImageCacheContext'
import { router, useLocalSearchParams } from 'expo-router'
import { calculateStars, shuffleArray } from '@/utils'
import { EGameMode, saveProgress } from '@/storage/progress'
import { getLevelConfig } from '@/constants/config-mode'
import AnimatedComponent from '@/components/AnimatedComponent'
import CountDownScreen from '@/components/CountDownScreen'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'
import soundManager from '@/utils/soundManager'
import sound from '@/constants/sound'

export default function PlayFlipCard() {
  const { level } = useLocalSearchParams()
  const gameSound = useSelector((state: RootState) => state.sound.gameSound)
  const configLevel = getLevelConfig(Number(level))
  const { getCachedImage } = useImageCache()

  const [cards, setCards] = useState(() =>
    shuffleArray([...configLevel.listCards, ...configLevel.listCards]),
  )
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([])
  const [matchedCards, setMatchedCards] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [modalSetting, setModalSetting] = useState(false)
  const [modalPause, setModalPause] = useState(false)
  const [modalResult, setModalResult] = useState(false)
  const [mistakes, setMistakes] = useState(configLevel.maxMistakes)
  const [timeLeft, setTimeLeft] = useState<number>(configLevel.timeLimit)
  const [gameFinished, setGameFinished] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [reset, setReset] = useState(false)

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
    if (timeLeft <= 0 || gameFinished || isPaused || !gameStarted) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isPaused, gameStarted])

  const handlePress = async (index: number) => {
    if (
      !gameStarted ||
      isAnimating ||
      flippedIndexes.includes(index) ||
      matchedCards.includes(index)
    )
      return
    if (gameSound === 1) {
      await soundManager.playSFX(sound.cardFlip)
    }

    setFlippedIndexes((prevFlipped) => [...prevFlipped, index])

    if (flippedIndexes.length === 1) {
      setIsAnimating(true)
      const [firstIndex] = flippedIndexes
      const secondIndex = index

      if (cards[firstIndex] === cards[secondIndex]) {
        setTimeout(async () => {
          if (gameSound === 1) {
            await soundManager.playSFX(sound.trueSelect)
          }
          setMatchedCards((prev) => [...prev, firstIndex, secondIndex])
          setFlippedIndexes([])
          setIsAnimating(false)
        }, 500)
      } else {
        setTimeout(async () => {
          if (gameSound === 1) {
            await soundManager.playSFX(sound.falseSelect)
          }
          setFlippedIndexes([])
          setIsAnimating(false)
          setMistakes((prev) => prev - 1)
        }, 800)
      }
    }
  }

  const handleResetGame = () => {
    setIsPaused(false)
    setModalPause(false)
    setModalResult(false)
    setFlippedIndexes([])
    setMatchedCards([])
    setCards(shuffleArray([...configLevel.listCards, ...configLevel.listCards]))
    setTimeLeft(configLevel.timeLimit)
    setMistakes(configLevel.maxMistakes)
    setReset(true)
    setCountdown(3) // Restart countdown
    setGameStarted(false)
    setGameFinished(false)
  }

  const handleNextGame = async () => {
    setModalResult(false)
    router.back()
  }

  const handleFinishGame = async () => {
    setGameFinished(true)
    await saveProgress(
      EGameMode.FIND_PAIR,
      configLevel.level,
      calculateStars(timeLeft, configLevel.timeLimit, mistakes, configLevel.maxMistakes),
    )
    setModalResult(true)
    setIsPaused(true)
  }

  useEffect(() => {
    if (matchedCards.length === cards.length || timeLeft === 0 || mistakes === 0) {
      handleFinishGame()
    }
  }, [matchedCards, timeLeft, handleFinishGame, mistakes])

  return (
    <ImageBackground
      source={getCachedImage('bgGameCardPlay')}
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
            <View style={styles.grid}>
              {cards.map((item, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handlePress(index)}
                  disabled={matchedCards.includes(index)}
                  style={styles.card}
                >
                  <AnimatedComponent
                    animation={
                      matchedCards.includes(index)
                        ? 'bounceIn'
                        : flippedIndexes.includes(index)
                          ? 'flipInY'
                          : undefined
                    }
                    duration={300}
                    type="view"
                    style={styles.cardInner}
                  >
                    {flippedIndexes.includes(index) || matchedCards.includes(index) ? (
                      <ImageBackground
                        source={getCachedImage('cardActive')}
                        style={styles.cardActive}
                      >
                        <Text>{item}</Text>
                      </ImageBackground>
                    ) : (
                      <Image style={styles.cardActive} source={getCachedImage('cardDeActive')} />
                    )}
                  </AnimatedComponent>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Footer>
            <TouchableOpacity
              onPress={() => {
                setIsPaused(true)
                setModalPause(true)
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
            star={calculateStars(
              timeLeft,
              configLevel.timeLimit,
              mistakes,
              configLevel.maxMistakes,
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 60 },
  card: {
    width: 77,
    height: 116,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  cardActive: { width: 77, height: 116, justifyContent: 'center', alignItems: 'center' },
  cardInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
  },
})

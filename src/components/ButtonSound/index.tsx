import React from 'react'
import { TouchableOpacity } from 'react-native'
import { TouchableOpacityProps } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'
import soundManager from '@/utils/soundManager'
import sound from '@/constants/sound'

export default function ButtonSound({ onPress, children, ...rest }: TouchableOpacityProps) {
  const gameSound = useSelector((state: RootState) => state.sound.gameSound)

  const handlePress = async () => {
    if (onPress) {
      // @ts-ignore
      onPress()
    }
    if (gameSound) {
      await soundManager.playSFX(sound.buttonTab)
    }
  }

  return (
    <TouchableOpacity {...rest} onPress={handlePress}>
      {children}
    </TouchableOpacity>
  )
}

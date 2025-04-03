import React from 'react'
import { Stack } from 'expo-router'

const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" options={{ title: 'Home' }} />
      <Stack.Screen name="game-mode" options={{ title: 'Game Mode' }} />
      <Stack.Screen name="level-flip-card" options={{ title: 'Game Flip Card' }} />
      <Stack.Screen name="level-find-color" options={{ title: 'Game Find Color' }} />
      <Stack.Screen name="tutorial" options={{ title: 'Tutorial' }} />
      <Stack.Screen name="achievement" options={{ title: 'Achievement' }} />
      <Stack.Screen name="play-flip-card" options={{ title: 'Card Play' }} />
      <Stack.Screen name="play-find-color" options={{ title: 'Color Play' }} />
    </Stack>
  )
}

export default StackLayout

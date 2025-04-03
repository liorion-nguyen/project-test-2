import { StyleSheet, View } from 'react-native'
import React from 'react'
import AnimatedComponent from './AnimatedComponent'

type Props = {
  countdown: number
}

const CountDownScreen = ({ countdown }: Props) => {
  return (
    <View style={styles.countdownContainer}>
      <AnimatedComponent type="text" iterationCount={1} duration={800} style={styles.countdownText}>
        {countdown > 0 ? countdown : 'GO!'}
      </AnimatedComponent>
    </View>
  )
}

export default CountDownScreen

const styles = StyleSheet.create({
  countdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
})

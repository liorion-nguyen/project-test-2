import React from 'react'
import { Modal, View, StyleSheet, Platform, StatusBar } from 'react-native'
import * as Animatable from 'react-native-animatable'

const ModalComponent = ({ visible, onClose, children }) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animatable.View animation="fadeInUp" duration={300} style={styles.modalContainer}>
          <View>{children}</View>
        </Animatable.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute', // Full screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // Màu nền mờ
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 10,
  },
})

export default ModalComponent

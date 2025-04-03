import React from 'react'
import { View, ImageProps, ViewProps, TextProps } from 'react-native'
import * as Animatable from 'react-native-animatable'

// Định nghĩa kiểu dữ liệu cho các props
interface AnimatedComponentProps {
  animation?: Animatable.Animation // Tên animation (vd: "fadeIn", "bounce", "zoomIn")
  duration?: number // Thời gian chạy animation (ms)
  delay?: number // Độ trễ (ms)
  iterationCount?: number | 'infinite' // Số lần lặp animation
  type?: 'view' | 'text' | 'image' | 'custom' // Loại component
  customComponent?: React.ComponentType<any> // Component tùy chỉnh nếu chọn type = "custom"
  children?: React.ReactNode // Nội dung bên trong
}

// Component AnimatedComponent tổng quát
const AnimatedComponent: React.FC<AnimatedComponentProps & ViewProps & TextProps & ImageProps> = ({
  animation = 'fadeIn',
  duration = 1000,
  delay = 0,
  iterationCount = 1,
  type = 'view',
  customComponent = null,
  children,
  ...props
}) => {
  let Component: any

  // Chọn component phù hợp
  switch (type) {
    case 'text':
      Component = Animatable.Text
      break
    case 'image':
      Component = Animatable.Image
      break
    case 'custom':
      Component = customComponent ? Animatable.createAnimatableComponent(customComponent) : View
      break
    case 'view':
    default:
      Component = Animatable.View
  }

  return (
    <Component
      animation={animation}
      duration={duration}
      delay={delay}
      useNativeDriver={animation !== 'pulse' && animation !== 'flash'}
      iterationCount={iterationCount}
      easing="ease-in-out"
      {...props}
    >
      {children}
    </Component>
  )
}

export default AnimatedComponent

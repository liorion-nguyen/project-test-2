import { StyleSheet, View } from 'react-native'

interface IFooterProps {
  children: React.ReactNode
}

export default function Footer({ children }: IFooterProps) {
  return <View style={styles.footer}>{children}</View>
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

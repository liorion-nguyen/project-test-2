import { Stack } from 'expo-router'
import { Provider } from 'react-redux'
import store from '@/redux'
import '~/global.css'
import { useFonts } from 'expo-font'
import { ImageCacheProvider } from '@/context/ImageCacheContext'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SVN-ToySans': require('../../assets/fonts/SVN-ToySans.ttf'),
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <Provider store={store}>
      <ImageCacheProvider>
        <Stack screenOptions={{ headerShown: false }}></Stack>
      </ImageCacheProvider>
    </Provider>
  )
}

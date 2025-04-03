import { createSlice } from '@reduxjs/toolkit'

interface ISoundProps {
  backgroundSound: number
  gameSound: number
}

const initialState: ISoundProps = {
  backgroundSound: 1, // 0: Tắt, 1: Bật
  gameSound: 1, // 0: Tắt, 1: Bật
}

const soundSlice = createSlice({
  name: 'sound',
  initialState,
  reducers: {
    toggleBackgroundSound: (state) => {
      state.backgroundSound = state.backgroundSound === 1 ? 0 : 1
    },
    toggleGameSound: (state) => {
      state.gameSound = state.gameSound === 1 ? 0 : 1
    },
  },
})

export const { toggleBackgroundSound, toggleGameSound } = soundSlice.actions
export default soundSlice.reducer

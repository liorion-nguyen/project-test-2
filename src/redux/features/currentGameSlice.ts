import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: any = {
  currentGame: null,
}

const currentGameSlice = createSlice({
  name: 'currentGame',
  initialState,
  reducers: {
    setCurrentGame: (state, action: PayloadAction<any>) => {
      state.currentGame = action.payload
    },
    removeCurrentGame: (state) => {
      state.currentGame = null
    },
  },
})

export const { removeCurrentGame, setCurrentGame } = currentGameSlice.actions
export default currentGameSlice.reducer

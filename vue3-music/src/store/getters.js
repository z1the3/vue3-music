

// 按需导出
export const currentSong = (state) => {
    return state.playList[state.currentIndex]||[]
}




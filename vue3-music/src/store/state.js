

import {PLAY_MODE,FAVORITE_KEY} from '../assets/js/constant'
import {load} from '../assets/js/array-store'


const state = {
    sequenceList: [],
    // 根据播放模式的实际播放列表
    playList: [],
    playing: false,
    playMode: PLAY_MODE.sequence,
    currentIndex:0,
    fullScreen: false,
    songsUrl: {},
    favoriteList: load(FAVORITE_KEY),
}


export default state
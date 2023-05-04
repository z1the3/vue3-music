import { PLAY_MODE } from '../assets/js/constant'
import { shuffle } from '../assets/js/util.js'

function selectPlay({ list, index }) {
        this.playMode = PLAY_MODE.sequence
        this.list = list
        this.playing = true
        this.fullScreen = true
        this.playList = list
        this.currentIndex = index
}
function togglePause() {
        this.playing = !this.playing
}

function setFullScreen(fullScreen) {
        this.fullScreen = fullScreen
}

function randomPlay({ list, index }) {
        this.playMode = PLAY_MODE.random
        this.list = list
        this.playing = true
        this.fullScreen = true
        this.playList = shuffle(list)
        this.currentIndex = 0
}

function changeMode(mode) {
        const currentId = this.currentSong.id
        if (mode === PLAY_MODE.random) {
                this.playList = shuffle(this.sequenceList)
        } else if (mode === PLAY_MODE.sequence) {
                this.playList = this.sequenceList
        } else {
                this.playList = [this.playList[this.currentIndex]]
        }
        const index = this.playList.findIndex(
                (song) => {
                        return song.id === currentId
                }
        )

        this.currentIndex = index
        this.playMode = mode

}


function addSongLyric({song,lyric}) {
        this.sequenceList.map((item)=>{
                if(item.id===song.id){
                        item.lyric = lyric
                }
                return item
        })
}


function removeSong(song){
        const sequenceIndex = findIndex(this.sequenceList,song)
        const playIndex = findIndex(this.playList,song)
        this.sequenceList.splice(sequenceIndex,1)
        this.playList.splice(playIndex,1)

        let currentIndex = this.currentIndex
        if(playIndex < currentIndex ||currentIndex === this.playList.length){
            currentIndex--
        }
        this.currentIndex = currentIndex
}
function findIndex(list,song){
        return list.findIndex((item)=>{
                return item.id===song.id
        })
}

function addSong(song){
        const playList = this.playList.slice()
        const sequenceList = this.sequenceList.slice()
        let currentIndex = this.currentIndex
        // 如果已经有这首歌，不用添加
        const playIndex = findIndex(playList,song)
        if(playIndex>-1){
                currentIndex = playIndex
        }else {
                playList.push(song)
                currentIndex = playList.length - 1
        }
        const sequenceIndex = findIndex(sequenceList,song)
        if(sequenceIndex===-1){
                sequenceList.push(song)
        }
        this.playList = playList
        this.sequenceList = sequenceList
        this.currentIndex = currentIndex
        this.playing = true
        this.setFullScreen(true)
}
const actions = {
        actions: {
                selectPlay,
                togglePause,
                setFullScreen,
                randomPlay,
                changeMode,
                addSongLyric,
                removeSong,
                addSong
        }
}
export default actions
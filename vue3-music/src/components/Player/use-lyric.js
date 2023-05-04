import useSongListStore from '../../store'
import { computed, watch, ref } from 'vue'
import { getLyric } from '../../service/song'

export default function useLyric({ songReady, currentTime }) {
    const currentLyric = ref(null)
    // 歌词总行数
    const currentLineNum = ref(0)
    // 歌词滚动相关逻辑
    const lyricScrollRef = ref(null)
    const lyricListRef = ref(null)
    const store = useSongListStore()
    const currentSong = computed(() => store.currentSong)
    watch(currentSong, async (newSong) => {
        if (!newSong.id || !store.songsUrl[newSong.id]) return
        if (currentSong.value.lyric) return

        const lyric = await getLyric(newSong)
        const lyricLines = lyric.split('\n')
        const reg = /\[(.*)\](.*)/
        let LastTimeStamp = '00:00.000'
        lyricLines.map((item, index) => {
            const pairs = reg.exec(item)
            const timeStamp = pairs?.[1] || LastTimeStamp

            const line =
            {
                txt: pairs?.[2] || '',
                num: index,
                time: processTime(timeStamp),
                setNum:
                    () => handleLyric({ lineNum: index })
                ,
            }
            lyricLines[index] = line

        })
        const res = { lines: lyricLines }
        currentLyric.value = res
        store.addSongLyric({ song: newSong, res })

        // 如果歌曲可以播放
        if (songReady.value) {
            playLyric()
        }
    })

    function playLyric() {
        const lyric = currentLyric.value
        const lines = lyric?.lines
        if (lyric) {
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].time - currentTime.value * 1000 > -1000 &&
                    lines[i].time - currentTime.value * 1000 < 0) {
                    lines[i].setNum()
                    return
                }
            }
        }
    }


    function handleLyric({ lineNum }) {
        currentLineNum.value = lineNum
        const scrollComp = lyricScrollRef.value
        // 是一个div，所以这里用el命名，
        // 由于v-if,可以判断是否存在
        const listEl = lyricListRef.value
        if (!listEl) return
        if (lineNum > 5) {
            // 滚动到当前行的上五行位置初
            const lineEl = listEl.children[lineNum - 5]
            scrollComp.scroll.scrollToElement(lineEl, 5000)
        } else {
            scrollComp.scroll.scrollTo(0, 0, 1000)
        }
        return lineNum
    }


    // 控制滚动的逻辑

    return {
        currentLyric,
        currentLineNum,
        playLyric,
        lyricScrollRef,
        lyricListRef
    }
}


function processTime(ts) {
    let ms = 0
    const ts_1 = ts.split(':')
    ms = ms + parseInt(ts_1[0]) * 60 * 1000
    const ts_2_1 = ts_1[1].split('.')
    ms = ms + parseInt(ts_2_1[0] * 1000)
    ms = ms + parseInt(ts_2_1[1])
    return ms
}
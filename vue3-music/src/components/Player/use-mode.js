import useSongListStore from '../../store'
import {PLAY_MODE} from '../../assets/js/constant'
import {computed} from 'vue'
// 提供不同mode的样式名,mode更改

export default function useMode(){
    const store = useSongListStore()
    const playMode = computed(()=>store.playMode)
    
    // 生成对应mode的icon
    const modeIcon = computed(()=>{
        const playModeVal = playMode.value
        return playModeVal === PLAY_MODE.sequence?
        'icon-sequence':playModeVal === PLAY_MODE.random?
        'icon-random':'icon-loop'
    })
    // 生成对应 mode的文字
    const modeText = computed(()=>{
        const playModeVal = playMode.value
        return playModeVal === PLAY_MODE.sequence
        ? '顺序播放':playModeVal === PLAY_MODE.random?
        '随机播放':'单曲循环'
    })
    function changeMode(){
        const mode = (playMode.value + 1) % 3
        store.changeMode(mode)
    }
    return {
        modeIcon,
        changeMode,
        modeText
    }
}
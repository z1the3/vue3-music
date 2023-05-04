import { computed,ref,watch } from 'vue'
import useSongListStore from '../../store/index.js'


export default function useCd(){

    const cdRef = ref(null)
    const cdImageRef = ref(null)
    const store =  useSongListStore()
    const isPlaying = computed(()=>store.playing)
    const cdCls = computed(()=>{
        return isPlaying.value? 'playing' : '' 
    })

    watch(isPlaying ,(newIsPlaying)=>{
        // 第二次播放暂停时同步容器和内层图片，由于内层的旋转角度是相对外层的
        // 为外层同步后，外层跳转角度等于外层初始角度+内存旋转角度
        // 'transform‘旋转相对于外层
        if(!newIsPlaying){
            syncTransform(cdRef.value,cdImageRef.value)
        }
    })



    // 将外层容器同步和内层图片旋转
    function syncTransform(wrapper,inner) {
        const wrapperTransform = getComputedStyle(wrapper).transform
        const innerTransform = getComputedStyle(inner).transform
        // getComputedStyle.transform 空值为none
        // 可以通过字符串拼接加空格叠加
        wrapper.style.transform = wrapperTransform === 'none'?
        innerTransform: innerTransform+' '+wrapperTransform
    }

    return {
        cdCls,
        cdRef,
        cdImageRef
    }

}
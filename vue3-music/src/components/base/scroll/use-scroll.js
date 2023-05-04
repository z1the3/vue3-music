import BSroll from '@better-scroll/core'
// 开启滚动，需要监听dom
import ObserveDOM from '@better-scroll/observe-dom'
import {onMounted,onUnmounted,ref} from 'vue'

BSroll.use(ObserveDOM)

export default function useScroll(wrapperRef,options,emit) {
    const scroll = ref(null)
    onMounted(()=>{
        scroll.value = new BSroll(wrapperRef.value,{
            observeDOM: true,
            ...options
        })
        // 派发事件相关
        if(options.probeType>0){
            scroll.value.on('scroll',(pos)=>{
                // 实时派发滚动事件
                emit('scroll',pos)
            })
        }

    })
    onUnmounted(()=>{
        scroll.value.destroy()
    })

    return scroll
}
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'


// 由于 hook 在 setup中执行，获取不了 dom ,应该用 onMounted
import {onMounted,onUnmounted,ref} from 'vue'

BScroll.use(Slide)

export default function useSlider(wrapperRef) {
    const slider = ref(null)
    const currentPageIndex = ref(0)

    onMounted(()=>{
        slider.value = new BScroll(wrapperRef.value,{
            click:true,
            scrollX:true,
            scrollY: false,
            momentum:false,
            bounce:false,
            probeType:2,
            slide:true,
        })
        // 绑定事件
        slider.value.on('slideWillChange',(page)=>{
            currentPageIndex.value = page.pageX
        })
    })
    onUnmounted(() => {
        slider.value.destroy()
    })
    return {
        slider,
        currentPageIndex
    }

}
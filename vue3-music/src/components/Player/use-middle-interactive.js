
import {ref} from 'vue'
export default function useMiddleInteractive(){
    // 现在展示的是cd还是歌词
    const currentShow = ref('cd')
    const middleLStyle = ref(null)
    const middleRStyle = ref(null)

    const touch = {}

    let currentView = 'cd'
    function onMiddleTouchStart(e){
        touch.startX = e.touches[0].pageX
        // 水平进入滑动时，竖直方向应该禁止滑动，否则将导致歌词可以斜向滑动
        // 需要定一个方向锁
        touch.startY = e.touches[0].pageY
        touch.directionLocked = ''



    }
    function onMiddleTouchMove(e){
        const deltaX = e.touches[0].pageX - touch.startX
        const deltaY = e.touches[0].pageY - touch.startY

        const absDeltaX = Math.abs(deltaX)
        const absDeltaY = Math.abs(deltaY)
        if(!touch.directionLocked){
            touch.directionLocked = absDeltaX >= absDeltaY?'h':'v'
        }

        if(touch.directionLocked==='v'){
            return
        }


        // 如果当前是在歌词页面。滑动的起始点在屏幕左侧一个屏幕的位置
        const left = currentView === 'cd'?0 : -window.innerWidth
        // 限制一下移动范围不超过一个屏幕宽
        const offsetWidth = Math.min(0,Math.max(-window.innerWidth,(left + deltaX)))
        touch.percent = Math.abs(offsetWidth/window.innerWidth)
        if(currentView==='cd'){
            if(touch.percent>0.2){
                currentShow.value= 'lyric'
            }else{
                currentShow.value = 'cd'
            }
        }else {
            if(touch.percent<0.8){
                currentShow.value = 'cd'
            }else{
                currentShow.value = 'lyric'
            }
        }


        middleLStyle.value = {
            opacity: 1 - touch.percent,
            transitionDuration: '0ms'
        }

        middleRStyle.value = {
            transform: `translate3d(${offsetWidth}px,0,0)`,
            transitionDuration: '0ms'
        }
    }
    function onMiddleTouchEnd(){
        let offsetWidth
        let opacity
        if(currentShow.value==='cd'){
            currentView = 'cd'
            offsetWidth = 0
            opacity = 1
        } else {
            currentView = 'lyric'
            offsetWidth = -window.innerWidth
            opacity = 0
        }

        const duration = 300
        
        middleLStyle.value = {
            opacity: currentView==='cd'?1:0,
            transitionDuration: `${duration}ms`
        }

        middleRStyle.value = {
            transform: `translate3d(${offsetWidth}px,0,0)`,
            transitionDuration: `${duration}ms`,
            opacity: currentView==='cd'?0:1,
        }
    }

    return {
        currentShow,
        middleLStyle,
        middleRStyle,
        onMiddleTouchEnd,
        onMiddleTouchStart,
        onMiddleTouchMove
    }
}